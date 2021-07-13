const users = {};
const chats = {};
const socketToRoom = new Set();
const shortid = require("shortid");

//newt meeting
exports.newMeeting = (socket) => {

  const meetId = shortid.generate();
  console.log("new meeting : ");
  console.log(meetId);
  users[meetId] = [];
  chats[meetId] = [];
  socketToRoom.add(meetId);
  socket.emit("newMeeting", meetId);

}

exports.joinMeetbyId = (socket, roomID, user) => {

  console.log("join meet by id", roomID);

  if (!socketToRoom.has(roomID)) {
    return socket.emit("all users", { error: "This room does not exist" });
  }
  if (!user) {
    return socket.emit("all users", { error: "user not found" });
  }

  user["socketId"] = socket.id;
  console.log(`${user.fname} joined room ${roomID}`);
  users[roomID].push(user);
  socket.join(roomID);

  const usersInThisRoom = users[roomID].filter(
    (people) => people.socketId !== user.socketId
  );

  const chatInThisRoom = chats[roomID];
  socket.emit("all users", { usersInThisRoom, chatInThisRoom });

  socket.broadcast.to(roomID).emit("user-connected", {
    user,
    usersInThisRoom,
    chatInThisRoom
  });

  // console.log("chats",chats[roomID]);
  // console.log("user",users[roomID]);
}

exports.leaveMeeting = (socket, roomID, user) => {

  console.log("leavemeeting", roomID, user);

  // console.log(socket.id);
  let room = users[roomID];
  if (room) {
    room = room.filter((people) => people.socketId !== user.socketId);
    users[roomID] = room;
  }
  socket.broadcast.to(roomID).emit("user left", user);

}

exports.sendMessage = (socket, text, user, roomID) => {

  if (roomID && socketToRoom.has(roomID)) {
    chats[roomID].push({
      data: text,
      name: user.fname
    });

    const message={data:text,user}
    socket.emit("receiveMessage", { message, chat: chats[roomID] });
    socket.broadcast
      .to(roomID)
      .emit("receiveMessage", { message, chat: chats[roomID] });
  }

}
