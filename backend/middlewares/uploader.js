import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const uploader = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimeType = fileTypes.test(file.mimetype);
    file.size;
    if (extName && mimeType) {
      if (file.size <= 1024) {
        return cb(null, true);
      }
      return cb(new Error("Please upload image of max 1 MB size or less"));
    } else {
      cb(new Error("Only image with jpeg, jpg and png mimetype are allowed"));
    }
  },
});

export default uploader;
