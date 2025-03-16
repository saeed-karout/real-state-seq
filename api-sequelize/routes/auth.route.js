import express from "express";
import { login, logout, register } from "../controllers/auth.controller.js";

const router = express.Router();

// تسجيل مستخدم جديد (متاح للجميع)
router.post("/register", register);

// تسجيل الدخول (متاح للجميع)
router.post("/login", login);

// تسجيل الخروج (متاح للمستخدمين المسجلين، لكن لا حاجة للتحقق هنا)
router.post("/logout", logout);

export default router;