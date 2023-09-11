import React, { useRef, useEffect, useState } from "react";
import Peer from "peerjs";

import "vidstack/styles/defaults.css";
import "vidstack/styles/community-skin/video.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

import {
  MediaCommunitySkin,
  MediaOutlet,
  MediaPlayer,
  MediaPoster,
} from "@vidstack/react";
export default function Watch() {
  const socket = io("http://localhost:5000");

  const myVideoRef = useRef();
  let [one, setOne] = useState("");

  let { id } = useParams();
  let roomid = id;
  console.log(roomid);
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
    socket.on("startScreenSharing", (status, peerId) => {
      startClass(peerId, "share");
    });
    socket.on("broadcaster", (peerId) => {
      startClass(peerId, "broadcaster");
      console.log("broadcaster");
    });
    socket.on("broadcaster-disconnected",()=>{
          })

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
        poster="https://media-files.vidstack.io/poster.png"
        controls
        src={one}
        autoplay={true}
        playsinline={true}
      >
        <MediaOutlet />
        <MediaCommunitySkin />
      </MediaPlayer>
    </div>
  );
}
