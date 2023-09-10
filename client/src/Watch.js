import React, { useRef, useEffect, useState } from "react";
import Peer from "peerjs";

import "vidstack/styles/defaults.css";
import "vidstack/styles/community-skin/video.css";
import { io } from "socket.io-client";

import {
  MediaCommunitySkin,
  MediaOutlet,
  MediaPlayer,
  MediaPoster,
} from "@vidstack/react";
export default function Watch() {
  // const socket = io("http://localhost:5000");
  const socket = io("");

  const myVideoRef = useRef();
  let [one, setOne] = useState("https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/low.mp4");

  let roomid = 1;
  const peerRef = useRef();
 

  useEffect(() => {
    const peerInstance = new Peer();
    peerRef.current = peerInstance;

    peerInstance.on("open", (user) => {
      socket.emit("watcher", roomid, user);
    });

    const startClass = (peerId, stat) => {
      console.log(stat);
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((newStream) => {
          const call = peerInstance?.call(peerId, newStream);
          call?.on("stream", function (remoteStream) {
            console.log(remoteStream);
            setOne(remoteStream);
          });
        });
    };
    socket.on("join stream", (roomSize, peerId, roomStatus) => {
      startClass(peerId, "join");
    });

    socket.on("no stream", () => {
      console.log("no stream");
    });
    socket.on("startScreenSharing",(status,peerId)=>{
      startClass(peerId, "share");
    })
    socket.on("broadcaster", ({ peerId, socketId }) => {
      startClass(peerId, "broadcaster");
      console.log("broadcaster");
    });

    return () => {
      peerInstance.destroy();
      socket.off("join stream");
      socket.off("broadcaster");
    };
  }, [roomid]);
  return (
    <div>
      {" "}
      <MediaPlayer
        title="Tuturly Classroom"
        poster="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/thumbnail.webp?time=268&width=980"
        thumbnails="https://media-files.vidstack.io/sprite-fight/thumbnails.vtt"
        aspectRatio={16 / 9}
        autoplay={true}
        crossorigin=""
        src={one}
        playsinline={true}
      >
        <MediaOutlet>
          {/* Add any additional tracks or configurations here */}
        </MediaOutlet>
        <MediaCommunitySkin />
      </MediaPlayer>
    </div>
  );
}
