import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url'; // استيراد fileURLToPath
import path from 'path'; // استيراد path
import uploadRouter from "./routes/upload.js"; // استيراد uploadRouter

import { sequelize } from './models/index.js'; // استيراد sequelize من models/index.js

// الحصول على __dirname في ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// حل مشكلة CORS
app.use(cors({
  origin: process.env.CLIENT_URL, // تأكد من تطابق هذا مع منفذ الواجهة الأمامية
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// معالجة طلبات OPTIONS
app.options('*', (req, res) => {
  res.sendStatus(204);
});

app.use(express.json());
app.use(cookieParser());

// خدمة الملفات الثابتة من مجلد uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// المسارات
import authRoute from './routes/auth.route.js';
import postRoute from './routes/post.route.js';
import testRoute from './routes/test.route.js';
import userRoute from './routes/user.route.js';
import contactRouter from './routes/contact.route.js';

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);
app.use('/api/test', testRoute);
app.use('/api/contact', contactRouter);

// إضافة uploadRouter
app.use('/api/upload', uploadRouter); // يمكنك إضافة verifyToken هنا إذا لزم الأمر


// الاتصال بقاعدة البيانات باستخدام Sequelize
async function connectToDb() {
  try {
    await sequelize.authenticate();
    console.log('Connected Successfully to DB');
    await sequelize.sync({ alter: true }); // غير force: true إلى alter: true
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error connecting to Database:', error);
    process.exit(1);
  }
}
connectToDb();

// تشغيل السيرفر
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});