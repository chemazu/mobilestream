import { Server } from "socket.io";
import http from "http";

const setupSocketIO = (app) => {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  const timers = {};
  const timerControl = {};
  const roomStatus = {};
  const newBroadcasterHolder = {};
  const freeTimers = {};
  let pollQuizHolder = {};
  let broadcasterScreen = {};
  io.on("connection", (socket) => {
    socket.on("broadcaster", async (roomId, peerId) => {
      console.log("broadcaster in");
      newBroadcasterHolder[roomId] = { peerId, socketId: socket.id };
      socket.join(roomId);
      socket.broadcast
        .to(roomId)
        .emit("broadcaster", newBroadcasterHolder[roomId].peerId);
    });
    socket.on("watcher", async (roomId, userId) => {
      socket.join(roomId);
      const room = io.sockets.adapter.rooms.get(roomId);
      let roomSize = room ? room.size : 1;
      console.log("watcher in");
      // check screensharing
      if (newBroadcasterHolder[roomId]) {
        io.to(socket.id).emit(
          "join stream",
          roomSize,
          newBroadcasterHolder[roomId].peerId,
          roomStatus.roomId
        );
        io.in(roomId).emit("watcher", socket.id, roomSize);
        io.to(socket.id).emit(
          "currentStatus",
          roomSize,
          pollQuizHolder[roomId],
          broadcasterScreen[roomId]
        );
      } else {
        // io.to(socket.id).emit("no stream");
        io.to(roomId).emit("no stream");
      }
    });
    socket.on("startScreenSharing", (roomId) => {
      io.in(roomId).emit(
        "startScreenSharing",
        newBroadcasterHolder[roomId].peerId
      );
    });
    socket.on("disconnect", async () => {
      // Check if the socket is a broadcaster
      const socketId = socket.id;

      Object.entries(newBroadcasterHolder).forEach(
        async ([roomId, broadcaster]) => {
          if (broadcaster.socketId === socketId) {
            // The disconnected socket was a broadcaster

            socket.broadcast.to(roomId).emit("broadcaster-disconnected");

            delete newBroadcasterHolder[roomId];
          }
        }
      );
    });
  });
  return server;
};

export default setupSocketIO;
