import http from "http";
import { Server } from "socket.io";
import app from "./app";
import connectDB from "./db";
import socketHandler from "./socketHandler";
import feedWatcher from "./watchers/feedWatcher";

const server = http.createServer(app);

// socket.io
// Read here to understand the ping-pong mechanism between client/server
// https://socket.io/docs/v4/how-it-works/#disconnection-detection
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.BUFFS_URL,
  },
});

server.listen(process.env.PORT, async () => {
  console.log(
    `App listening in ${process.env.NODE_ENV} mode on http://localhost:${process.env.PORT} 🚀`
  );
  try {
    await connectDB();
    socketHandler(io);

    // initialize MongoDB ChangeStream watchers
    feedWatcher(io);
  } catch (error) {
    console.error(error);
  }
});

// handle unhandled promise rejections
process.on("unhandledRejection", function (error: Error, promise) {
  console.log(`error: ${error.message}`);
  server.close(() => process.exit(1)); // "1": failure code
});

export default server;
