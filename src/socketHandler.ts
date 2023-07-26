// source: https://github.com/mongodb-developer/location-tracking

import { Server } from "socket.io";
import { SocketEvent } from "./interfaces/socket/SocketEvent";
import { SocketRoom } from "./interfaces/socket/SocketRoom";

export default function socketHandler(io: Server) {
  io.on("connection", (socket) => {
    console.log(`A user connected ⚡`);

    socket.on("disconnect", () => {
      console.log("A user disconnected 🔌");
    });

    // subscribe to feed room
    socket.on(SocketEvent.SUBSCRIBED_TO_FEED, () => {
      socket.join(SocketRoom.FEED);
    });
  });
}
