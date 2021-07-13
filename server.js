require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();
const socket = require("socket.io");
const userRoutes = require("./routes/users");
// creating a http server for peer and express
const server = http.Server(app);
const { ExpressPeerServer } = require("peer");
const cookieParser = require("cookie-parser");
const {
	newMeeting,
	joinMeetbyId,
	leaveMeeting,
	sendMessage,
} = require("./controllers/socketio");

const port = process.env.PORT || 8000;

//db conection
require("./db/conn");

// socket io config
const io = socket(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

//express server
const expServer = server.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

// peer server
const peerServer = ExpressPeerServer(expServer, {
	path: "/peer",
});

//middle wares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(peerServer);

//routes
app.use(userRoutes);

// socket io events.
io.on("connection", (socket) => {
	socket.on("newMeeting", () => {
		return newMeeting(socket);
	});

	socket.on("join room", ({ roomID, user }) => {
		console.log(roomID, user);

		joinMeetbyId(socket, roomID, user);

		socket.on("disconnect", () => {
			console.log("disconnect");
			leaveMeeting(socket, roomID, user);
		});

		// chat event
		socket.on("sendMessage", (data) => {

			sendMessage(socket, data.message, data.user, roomID);
		});
	});

	socket.on("sending signal", (payload) => {
		console.log("sending");

		io.to(payload.userToSignal).emit("user joined", {
			signal: payload.signal,
			callerID: payload.callerID,
			user: payload.user
		});
	});

	socket.on("returning signal", (payload) => {
		console.log("receiving");

		io.to(payload.callerID).emit("receiving returned signal", {
			signal: payload.signal,
			id: socket.id,
		});
	});
});

if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));
	const path = require("path");
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}
