import express from "express";
import { addContact, getContacts } from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/", addContact); // إضافة جهة اتصال
router.get("/", getContacts); // عرض جميع جهات الاتصال

export default router;