import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { addPost, deletePost, getPost, getPosts, updatePost } from "../controllers/post.controller.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// إعدادات multer لتخزين الصور
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // مجلد التخزين
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// المسارات
router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", verifyToken, upload.array("files"), addPost);
router.put("/:id", verifyToken, upload.array("files"), updatePost); // إضافة multer هنا
router.delete("/:id", verifyToken, deletePost);

export default router;