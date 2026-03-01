import multer from "multer";

// ---------- Multer config ----------
export const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.originalname.endsWith(".xlsx")) {
      return cb(new Error("Only .xlsx files allowed"));
    }
    cb(null, true);
  },
});