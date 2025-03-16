import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ message: 'بيانات الاعتماد غير صالحة!' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'بيانات الاعتماد غير صالحة!' });

    const age = 1000 * 60 * 60 * 24 * 7;
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const userInfo = user.toJSON();
    delete userInfo.password;

    console.log("Setting cookie with token (login):", token);
    res
      .cookie('token', token, { 
        httpOnly: true, 
        maxAge: age, 
        secure: process.env.NODE_ENV === 'production', // true في الإنتاج فقط
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // None للعمل عبر النطاقات
        path: '/' 
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.error('خطأ في تسجيل الدخول:', err);
    res.status(500).json({ message: 'فشل في تسجيل الدخول!' });
  }
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  console.log('Register request received:', { username, email });

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'جميع الحقول مطلوبة!' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'كلمة المرور يجب أن تكون على الأقل 6 أحرف!' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'البريد الإلكتروني موجود بالفعل!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar: null,
      role: 'USER',
    });

    const age = 1000 * 60 * 60 * 24 * 7;
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const userInfo = newUser.toJSON();
    delete userInfo.password;

    console.log("Setting cookie with token (register):", token);
    res
      .cookie('token', token, { 
        httpOnly: true, 
        maxAge: age, 
        secure: process.env.NODE_ENV === 'production', // true في الإنتاج
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // None للعمل عبر النطاقات
        path: '/' 
      })
      .status(201)
      .json({ message: 'تم إنشاء المستخدم بنجاح', user: userInfo });
  } catch (err) {
    console.error('خطأ في إنشاء المستخدم:', err);
    res.status(500).json({ message: 'فشل في إنشاء المستخدم!', error: err.message });
  }
};
export const logout = (req, res) => {
  res.clearCookie('token').status(200).json({ message: 'تم تسجيل الخروج بنجاح' });
};