import crypto from "crypto";

const buffer = crypto.randomBytes(5);

console.log("buffer: ", buffer);

const string = buffer.toString("hex");

console.log("string: ", string);
