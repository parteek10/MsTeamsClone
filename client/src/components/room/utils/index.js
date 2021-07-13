import { socket } from "../Room";
import Peer from "simple-peer";
import { isAuthenticated } from "../../Authentication/auth";

export const uniquePeers = function (peers) {
  const result = [];
  const map = new Map();
  for (const peer of peers) {
    if (!map.has(peer.peerID)) {
      map.set(peer.peerID, true); // set any value to Map
      result.push(peer);
    }
  }
  return result;
};

export const createPeer = function (userToSignal, callerID, stream) {
  const { user } = isAuthenticated();

  const peer = new Peer(
    {
      initiator: true, // to immediately invoke signal
      trickle: false,
      stream,
    },
    {
      host: "/",
      path: "/peer",
      // port: 8000,
      port: 443,
    }
  );

  peer.on("signal", (signal) => {
    socket.emit("sending signal", { userToSignal, callerID, signal, user });
  });

  return peer;
};

export const addPeer = function (incomingSignal, callerID, stream) {
  const peer = new Peer(
    {
      initiator: false, // wait until any signal is recieved
      trickle: false,
      stream,
    },
    {
      host: "/",
      path: "/peer",
      // port: 8000,
      port: 443,
    }
  );

  peer.on("signal", (signal) => {
    socket.emit("returning signal", { signal, callerID });
  });

  peer.signal(incomingSignal);
  return peer;
};

export const snackBaroptions = {
  position: "bottom-right",
  style: {
    backgroundColor: "midnightblue",
    fontSize: "4vh",
    
    fontWeight: "500",
    textAlign: "center",
  },
  closeStyle: {
    color: "lightcoral",
    fontSize: "16px",
  },
};
