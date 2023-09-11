import React, { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";
import { MediaPlayer, MediaOutlet, MediaCommunitySkin } from "@vidstack/react";
import { useParams } from "react-router-dom";

export default function Stream() {
  let [one, setOne] = useState("");

  let [screensharingStatus, setScreensharingStatus] = useState();

  // const socket = io("http://localhost:5000");
  const socket = io();
  // const socket = io("");

  const myVideoRef = useRef();
  let { id } = useParams();
  let roomid = id;
  console.log(roomid);
  const peerRef = useRef();

  const initPeer = () => {
    const peerInstance = new Peer();

    peerRef.current = peerInstance;

    peerInstance.on("open", (peerId) => {
      console.log("Connected to PeerJS with ID:", peerId);
      socket.emit("broadcaster", roomid, peerId);
    });
    if (screensharingStatus) {
      console.log(screensharingStatus);
      navigator.mediaDevices
        .getDisplayMedia({ video: true, audio: true })
        .then((stream) => {
          socket.emit("startScreenSharing", roomid);
          setOne(stream);
          peerInstance.on("call", (call) => {
            console.log("Incoming call:", call);
            call.answer(stream);
            // Answer the incoming call and send our stream

            call.on("stream", (remoteStream) => {
              call.answer(stream);

              console.log("first verse");
              // Handle the remote stream as needed
            });
          });
        })
        .catch((error) =>
          console.error("Error accessing media devices:", error)
        );
    } else {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((stream) => {
          // myVideoRef.current.srcObject = stream;
          console.log("Stream obtained successfully:", stream);
          setOne(stream);
          peerInstance.on("call", (call) => {
            console.log("Incoming call:", call);
            call.answer(stream);
            // Answer the incoming call and send our stream

            call.on("stream", (remoteStream) => {
              console.log("first verse");
              // Handle the remote stream as needed
            });
          });
        })
        .catch((error) =>
          console.error("Error accessing media devices:", error)
        );
    }
  };
  const toggleScreen = () => {
    console.log("");

    setScreensharingStatus(true);
  };
  useEffect(() => {
    initPeer();

    return () => {
      // Cleanup code (e.g., disconnect from the socket, close peer connections)
    };
  }, [screensharingStatus, roomid]);

  return (
    <div>
      <MediaPlayer
        title="Tuturly Classroom"
        poster="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/thumbnail.webp?time=268&width=980"
        thumbnails="https://media-files.vidstack.io/sprite-fight/thumbnails.vtt"
        aspectRatio={16 / 9}
        autoplay={true}
        src={one}
        playsinline={true}
      >
        <MediaOutlet />

        <MediaCommunitySkin />
      </MediaPlayer>
      <button
        onClick={() => {
          toggleScreen();
        }}
      >
        Toggle ScreenSharing
      </button>
    </div>
  );
}
