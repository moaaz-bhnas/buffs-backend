import { SocketEvent } from "@/interfaces/socket/SocketEvent";
import { SocketRoom } from "@/interfaces/socket/SocketRoom";
import ReviewModel from "@/schemas/ReviewSchema";
import { Server } from "socket.io";

export default async function feedWatcher(io: Server) {
  const changeStream = ReviewModel.watch([], { fullDocument: "updateLookup" });

  changeStream.on("change", (event) => {
    switch (event.operationType) {
      case "insert":
        io.to(SocketRoom.FEED).emit(
          SocketEvent.REVIEW_CREATED,
          event.fullDocument
        );
        break;

      case "update":
        io.to(SocketRoom.FEED).emit(
          SocketEvent.REVIEW_UPDATED,
          event.fullDocument
        );
        break;
    }
  });
}
