import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  savePost,
  profilePosts,
} from "../controllers/user.controller.js";
import { verifyToken, verifyAdmin } from "../middleware/verifyToken.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // التحقق من أن الطلب هو PUT لتحديث المستخدم
    const uploadPath = req.method === "PUT" ? "uploads/avatars" : "uploads";
    console.log("Upload path:", uploadPath); // تسجيل للتحقق
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("يرجى رفع صور بصيغة JPEG أو PNG فقط!"));
    }
  },
});

router.get("/", verifyToken, verifyAdmin, getUsers);
router.get("/profile/posts", verifyToken, profilePosts);
router.post("/save", verifyToken, savePost);
router.get("/:id", verifyToken, getUser);
router.put("/:id", verifyToken, upload.single("avatar"), updateUser);
router.delete("/:id", verifyToken, deleteUser);

export default router;