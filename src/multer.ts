import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.FILE_UPLOAD_PATH || "");
  },
  filename: function (req, file, cb) {
    console.log("file: ", file);
    cb(null, `${file.fieldname}${path.parse(file.originalname).ext}`);
  },
});

const upload = multer({ storage });

export default upload;
