import bcrypt from 'bcryptjs';
import { User, Post, SavedPost, Image, PostDetail, Op } from '../models/index.js';
import fs from "fs/promises";
import path from "path";

export const getUsers = async (req, res) => {
  if (req.userRole !== 'ADMIN') {
    return res.status(403).json({ message: 'غير مصرح به! للمسؤولين فقط.' });
  }

  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'فشل في الحصول على المستخدمين!' });
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId && req.userRole !== 'ADMIN') {
    return res.status(403).json({ message: 'غير مصرح به!' });
  }

  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Post,
          as: 'posts',
          include: [{ model: Image, as: 'images' }],
        },
        {
          model: Post, // استبدال SavedPost بـ Post
          as: 'savedPosts', // العلاقة الصحيحة من belongsToMany
          include: [
            { 
              model: Image, 
              as: 'images' 
            },
          ],
          through: { attributes: [] }, // لتجنب إرجاع بيانات SavedPost نفسها
        },
        {
          model: Image,
          as: 'avatars',
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'لم يتم العثور على المستخدم!' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'فشل الحصول على المستخدم!' });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id; // سلسلة نصية من المسار
  const tokenUserId = req.userId;
  const tokenUserRole = req.userRole;
  const { password, ...inputs } = req.body;

  // تحويل id إلى عدد صحيح للمقارنة
  const parsedId = parseInt(id, 10);

  console.log("ID from params:", id, "Parsed ID:", parsedId, "Token User ID:", tokenUserId, "Role:", tokenUserRole);

  if (parsedId !== tokenUserId ) {
    console.log("Authorization failed: IDs do not match and user is not ADMIN");
    return res.status(403).json({ message: 'غير مصرح به!' });
  }

  try {
    let updatedPassword = null;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'كلمة المرور يجب أن تكون على الأقل 6 أحرف!' });
      }
      updatedPassword = await bcrypt.hash(password, 10);
    }

    let avatarUrl = inputs.avatar;
    const user = await User.findByPk(parsedId);
    if (req.file) {
      avatarUrl = `/uploads/avatars/${req.file.filename}`;
      console.log("New avatar URL:", avatarUrl);
      await Image.create({
        url: avatarUrl,
        userId: parsedId,
        postId: null,
      });
      if (user.avatar && user.avatar !== '/default-avatar.jpg') {
        const oldAvatarPath = path.join(process.cwd(), "uploads/avatars", path.basename(user.avatar));
        console.log("Attempting to delete old avatar:", oldAvatarPath);
        try {
          await fs.unlink(oldAvatarPath);
          console.log(`Deleted old avatar: ${oldAvatarPath}`);
        } catch (err) {
          console.warn(`Failed to delete old avatar: ${oldAvatarPath}`, err);
        }
      }
    }

    const [updatedRows] = await User.update(
      {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatarUrl && { avatar: avatarUrl }),
      },
      { where: { id: parsedId } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'لم يتم العثور على المستخدم!' });
    }

    const updatedUser = await User.findByPk(parsedId, {
      attributes: { exclude: ['password'] },
    });
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err);
    if (err.message === "يرجى رفع صور بصيغة JPEG أو PNG فقط!") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'فشل تحديث المستخدم!', error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: 'غير مصرح به!' });
  }

  try {
    await SavedPost.destroy({ where: { userId: id } });
    await Image.destroy({ where: { userId: id } });
    const deletedRows = await User.destroy({ where: { id } });

    if (deletedRows === 0) {
      return res.status(404).json({ message: 'لم يتم العثور على المستخدم!' });
    }

    res.status(200).json({ message: 'تم حذف المستخدم بنجاح' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'فشل حذف المستخدم!' });
  }
};

export const savePost = async (req, res) => {
  const { postId } = req.body;
  const tokenUserId = req.userId;

  if (!postId || !tokenUserId) {
    return res.status(400).json({ message: 'postId أو userId مفقود!' });
  }

  try {
    const user = await User.findByPk(tokenUserId);
    if (!user) {
      return res.status(404).json({ message: 'لم يتم العثور على المستخدم!' });
    }

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'لم يتم العثور على المنشور!' });
    }

    const savedPost = await SavedPost.findOne({
      where: { userId: tokenUserId, postId },
    });

    if (savedPost) {
      await SavedPost.destroy({ where: { id: savedPost.id } });
      return res.status(200).json({ message: 'تم إزالة المنشور من القائمة المحفوظة' });
    } else {
      await SavedPost.create({ userId: tokenUserId, postId });
      return res.status(200).json({ message: 'تم حفظ المنشور بنجاح' });
    }
  } catch (err) {
    console.error('خطأ في حفظ المنشور:', err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'المنشور محفوظ بالفعل لهذا المستخدم!' });
    }
    return res.status(500).json({ message: 'فشل في حفظ أو إزالة المنشور!', error: err.message });
  }
};

export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;
  if (!tokenUserId) {
    return res.status(400).json({ message: 'User ID is missing from token!' });
  }

  try {
    const userPosts = await Post.findAll({
      where: { userId: tokenUserId },
      include: [
        { model: Image, as: 'images' },
        { model: PostDetail, as: 'postDetail' },
      ],
    });

    const saved = await SavedPost.findAll({
      where: { userId: tokenUserId },
      include: [
        {
          model: Post,
          as: 'post',
          include: [
            { model: Image, as: 'images' },
            { model: PostDetail, as: 'postDetail' },
          ],
        },
      ],
    });

    const savedPosts = saved.map((item) => item.post);
    res.status(200).json({ userPosts, savedPosts });
  } catch (err) {
    console.error('Detailed error in profilePosts:', {
      message: err.message,
      stack: err.stack,
    });
    res.status(500).json({ message: 'Failed to get profile posts!', error: err.message });
  }
};

export const getCurrentUser = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const user = await User.findByPk(tokenUserId, {
      attributes: { exclude: ['password'] },
    });
    if (!user) return res.status(404).json({ message: "لم يتم العثور على المستخدم!" });
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching current user:", err);
    res.status(500).json({ message: "فشل في جلب بيانات المستخدم!" });
  }
};