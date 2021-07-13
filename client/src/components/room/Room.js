import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useHistory, useParams } from "react-router-dom";
import notification from "../../assets/notification1.mp3";
import styled from "styled-components";
import Base from "../Base/Base";
import { isAuthenticated } from "../Authentication/auth/index";
import Button from "@material-ui/core/Button";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import CallEndIcon from "@material-ui/icons/CallEnd";
import KeyboardVoiceIcon from "@material-ui/icons/KeyboardVoice";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import Grid from "@material-ui/core/Grid";
import ChatIcon from "@material-ui/icons/Chat";
import IconButton from "@material-ui/core/IconButton";
import MicOffIcon from "@material-ui/icons/MicOff";
import Drawer from "@material-ui/core/Drawer";
import clsx from "clsx";
import { useSnackbar } from "react-simple-snackbar";
import "./Room.css";
import Messages from "./chat/Messages/Messages";
import InfoBar from "./chat/InfoBar/InfoBar";
import Input from "./chat/Input/Input";
import Video, { StyledDiv, Styledpara, StyledVideo } from "./Video";
import { addPeer, createPeer, snackBaroptions, uniquePeers } from "./utils";
import UIFx from "uifx";
import onlineIcon from "./icons/onlineIcon.png";
import CancelIcon from "@material-ui/icons/Cancel";
import { Divider } from "@material-ui/core";
import { Typography } from "@material-ui/core";

export const socket = io("https://vc-app93.herokuapp.com");
// export const socket = io("http://localhost:8000");

const sound = new UIFx(notification);
const drawerWidth = 450;
const useStyles = makeStyles((theme) => ({
  button: {
    borderRadius: "50%",
    padding: "10px",
    color: "white",
  },
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  title: {
    flexGrow: 1,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
  buttonSpace: {
    position: "fixed",
    bottom: "20px",
    zIndex: "11",
  },
  footer: {
    position: "fixed",
    left: 0,
    bottom: 0,
    width: "100%",
  },
}));

const Container = styled.div`
  padding: 20px;
  display: flex;
  height: 100vh;
  width: 90%;
  margin: auto;
  justify-content: space-evenly;
  flex-wrap: wrap;
`;

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

const Room = (props) => {
  const classes = useStyles();
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [peers, setPeers] = useState([]);
  const [userStream, setUserStream] = useState(null);
  const videoStatus = useRef("enabled");
  const [vc, setVc] = useState("1"); // for video check
  const audioStatus = useRef("enabled");
  const [ac, setAc] = useState("1"); // for audio check
  const userVideo = useRef();
  const history = useHistory();
  const peersRef = useRef([]);
  const roomID = props.match.params.roomID;
  const { user } = isAuthenticated();

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [openSnackbar, closeSnackbar] = useSnackbar(snackBaroptions);

  useEffect(() => {
    return () => {
      history.go(0);
    };
  }, []);

  const toggleAudio = function () {
    if (audioStatus.current === "enabled") {
      userVideo.current.srcObject.getAudioTracks()[0].enabled = false;
      audioStatus.current = "disabled";
      setAc("0");
    } else {
      userVideo.current.srcObject.getAudioTracks()[0].enabled = true;
      audioStatus.current = "enabled";
      setAc("1");
    }
    setUserStream(userVideo.current.srcObject);
  };

  const toggleVideo = function () {
    if (videoStatus.current === "enabled") {
      userVideo.current.srcObject.getVideoTracks()[0].enabled = false;
      videoStatus.current = "disabled";
      setVc("0");
    } else {
      userVideo.current.srcObject.getVideoTracks()[0].enabled = true;
      videoStatus.current = "enabled";
      setVc("1");
    }
    setUserStream(userVideo.current.srcObject);
  };

  const endCall = function () {
    history.replace("/");
  };

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  // peer connections and video streams
  useEffect(() => {
    openSnackbar(`your meet id is : ${roomID}`);

    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        setUserStream(stream);

        socket.emit("join room", { roomID, user });

        socket.on(
          "user-connected",
          ({ user, usersInThisRoom, chatInThisRoom }) => {
            console.log(`${user.fname} joined room ${roomID}`);
            openSnackbar(`${user.fname} joined room`);
          }
        );

        //users contains list of all other users present in the room
        socket.on("all users", (data) => {
          if (data.error) {
            console.log(data.error);
            window.alert(data.error);
            history.replace("/");
          }
          const users = data.usersInThisRoom;
          const chats = data.chatInThisRoom;
          setMessages(chats);
          sound.play();
          console.log(users);
          const peers = [];
          users.forEach((user) => {
            const peer = createPeer(user.socketId, socket.id, stream);
            peersRef.current.push({
              peerID: user.socketId,
              peer,
              fname: user.fname,
              lname: user.lname,
            });

            peers.push({
              peerID: user.socketId,
              peer,
              fname: user.fname,
              lname: user.lname,
            });
          });

          setPeers(uniquePeers(peers));
        });

        socket.on("user joined", (payload) => {
          sound.play();
          console.log("user joined", payload);
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
            fname: payload.user.fname,
            lname: payload.user.lname,
          });

          const peerObj = {
            peer,
            peerID: payload.callerID,
            fname: payload.user.fname,
            lname: payload.user.lname,
          };

          setPeers((peers) => uniquePeers([...peers, peerObj]));
        });

        socket.on("receiveMessage", (data) => {
          if (!(state.left || state.right || state.bottom || state.top)) {
            sound.play();
            console.log(data);
            const msguser = data.message.user;
            const username = msguser.fname + " " + msguser.lname;
            // if(msguser._id!=user._id)
            {
              openSnackbar(`${username}: ${data?.message?.data}`);
            }
          }

          if (data.chat) setMessages(data.chat);
        });

        socket.on("user left", (user) => {
          sound.play();
          console.log(user);
          const peerObj = peersRef.current.find(
            (p) => p.peerID === user.socketId
          );
          console.log(peerObj);
          if (peerObj) {
            peerObj.peer.destroy();
          }
          const peers = peersRef.current.filter(
            (p) => p.peerID !== user.socketId
          );

          peersRef.current = peers;
          setPeers(peers);
        });

        socket.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
      })
      .catch((err) => {
        console.log(err);
        window.alert(
          "unable to get your media , try checking your camera connections "
        );
      });
  }, []);

  const toggleDrawer = (anchor, open) => (event) => {
    setState({ ...state, [anchor]: open });
  };

  const sendMessage = (event) => {
    event.preventDefault();
    if (message.trim() !== "") socket.emit("sendMessage", { message, user });
    setMessage("");
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
    >
      <div className="outerContainer">
        <div className="container">
          <div className="infoBar">
            <div className="leftInnerContainer">
              <img className="onlineIcon" src={onlineIcon} alt="online icon" />
              <h3 style={{ fontFamily: "serif" }}>CHAT</h3>
            </div>
            <div className="rightInnerContainer">
              <IconButton
                onClick={handleDrawerClose}
                className={classes.button}
                disableRibble
              >
                <CancelIcon />
              </IconButton>
            </div>
          </div>
          <Messages messages={messages} name={user.fname} />
          <Input
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Base>
      <div className={classes.root}>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          <Container>
            <StyledDiv>
              <StyledVideo muted ref={userVideo} autoPlay playsInline />
              <Styledpara>{"you"}</Styledpara>
            </StyledDiv>
            {peers.map((peer, index) => {
              return (
                <Video
                  key={peer.peerID}
                  peer={peer.peer}
                  name={`${peer.fname} ${peer.lname}`}
                />
              );
            })}
          </Container>
          <div></div>
        </main>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="right"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          {list("right")}
        </Drawer>
      </div>

      <Grid container alignItems="center" justify="center">
        <div className={classes.buttonSpace}>
          <div
            style={{
              height: "10vh",
              width: "10vw",
              marginRight: "10px",
              display: "inline",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={toggleAudio}
            >
              {audioStatus.current === "enabled" ? (
                <IconButton className={classes.button} disableRibble>
                  <KeyboardVoiceIcon />
                </IconButton>
              ) : (
                <IconButton className={classes.button} disableRibble>
                  <MicOffIcon />
                </IconButton>
              )}
            </Button>
          </div>
          <div
            style={{
              height: "10vh",
              width: "10vw",
              marginRight: "10px",
              display: "inline",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={toggleVideo}
            >
              {videoStatus.current === "enabled" ? (
                <IconButton className={classes.button} disableRibble>
                  <VideocamIcon />
                </IconButton>
              ) : (
                <IconButton className={classes.button} disableRibble>
                  <VideocamOffIcon />
                </IconButton>
              )}
            </Button>
          </div>
          <div
            style={{
              height: "10vh",
              width: "10vw",
              marginRight: "10px",
              display: "inline",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={endCall}
              className={classes.button}
            >
              <IconButton className={classes.button} disableRibble>
                <CallEndIcon />
              </IconButton>
            </Button>
          </div>
          <div
            style={{
              height: "10vh",
              width: "10vw",
              marginRight: "10px",
              display: "inline",
            }}
          >
            <React.Fragment key="right">
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={toggleDrawer("right", true)}
              >
                {open === false ? (
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    className={clsx(open && classes.hide)}
                    className={classes.button}
                  >
                    <ChatIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerClose}
                    className={clsx(open && classes.hide)}
                    className={classes.button}
                  >
                    <ChatIcon />
                  </IconButton>
                )}
              </Button>
            </React.Fragment>
          </div>
        </div>
      </Grid>
    </Base>
  );
};

export default Room;
