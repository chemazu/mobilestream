import React, { useRef, useEffect, useState } from "react";
import Peer from "peerjs";
import { io } from "socket.io-client";
import { MediaPlayer, MediaOutlet, MediaCommunitySkin } from "@vidstack/react";
import { useParams } from "react-router-dom";

export default function Stream() {
  // const socket = io("http://localhost:5000");
  const socket = io();

  const myVideoRef = useRef();
  const { id } = useParams();
  const roomid = id;

  const [stream, setStream] = useState(null);
  const [screensharing, setScreensharing] = useState(false);
  const [peerId, setPeerId] = useState(null);

  const initPeer = () => {
    const peerInstance = new Peer();

    peerInstance.on("open", (peerId) => {
      setPeerId(peerId);
      socket.emit("broadcaster", roomid, peerId);
    });

    peerInstance.on("call", (call) => {
      if (screensharing) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then((stream) => {
            socket.emit("startScreenSharing", roomid);
            setStream(stream);
            call.answer(stream);

            call.on("stream", (remoteStream) => {
              // Handle the remote stream as needed
            });
          })
          .catch((error) => console.error("Error accessing media devices:", error));
      } else {
        navigator.mediaDevices
          .getUserMedia({ audio: true, video: true })
          .then((stream) => {
            setStream(stream);
            call.answer(stream);

            call.on("stream", (remoteStream) => {
              // Handle the remote stream as needed
            });
          })
          .catch((error) => console.error("Error accessing media devices:", error));
      }
    });
  };

  const toggleScreenSharing = () => {
    setScreensharing(!screensharing);
  };

  useEffect(() => {
    initPeer();

    return () => {
      // Cleanup code (e.g., disconnect from the socket, close peer connections)
    };
  }, [screensharing, roomid]);

  return (
    <div>
      <MediaPlayer
        title="Tuturly Classroom"
        poster="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/thumbnail.webp?time=268&width=980"
        thumbnails="https://media-files.vidstack.io/sprite-fight/thumbnails.vtt"
        aspectRatio={16 / 9}
        autoplay={true}
        src={stream}
        playsinline={true}
      >
        <MediaOutlet />
        <MediaCommunitySkin />
      </MediaPlayer>
      <button onClick={toggleScreenSharing}>
        {screensharing ? "Stop Screen Sharing" : "Start Screen Sharing"}
      </button>
    </div>
  );
}
