import { SocketEvent } from "@/interfaces/socket/SocketEvent";
import ReviewModel from "@/schemas/ReviewSchema";
import { Server } from "socket.io";

export default async function feedWatcher(io: Server) {
  const changeStream = ReviewModel.watch([], { fullDocument: "updateLookup" });

  changeStream.on("change", (event) => {
    switch (event.operationType) {
      case "insert":
        io
          // .to(SocketEvent.SUBSCRIBED_TO_FEED)
          .emit(SocketEvent.REVIEW_CREATED, event.fullDocument);
        break;

      case "update":
        io
          // .to(SocketEvent.SUBSCRIBED_TO_FEED)
          .emit(SocketEvent.REVIEW_UPDATED, event.fullDocument);
        break;
    }
  });
}
