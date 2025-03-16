import jwt from 'jsonwebtoken';
import { Post, PostDetail, User, SavedPost, Image, Op } from '../models/index.js'; // إضافة Image

export const getPosts = async (req, res) => {
  const query = req.query;
  console.log("Raw query:", query);

  const filters = {
    ...(query.city && { city: query.city }),
    ...(query.type && { type: query.type }),
    ...(query.property && { property: query.property }),
    ...(query.bedroom && { bedroom: parseInt(query.bedroom) }),
  };

  // إضافة فلتر السعر
  const minPrice = query.minPrice ? parseInt(query.minPrice) : null;
  const maxPrice = query.maxPrice ? parseInt(query.maxPrice) : null;

  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice && minPrice > 0) {
      filters.price[Op.gte] = minPrice;
    }
    if (maxPrice && maxPrice > 0) {
      filters.price[Op.lte] = maxPrice;
    }
    // لا تحذف filters.price إذا كان يحتوي على قيم
    console.log("Price filter applied:", filters.price);
  }

  console.log("Search filters:", filters);

  try {
    const posts = await Post.findAll({
      where: filters,
      include: [
        { model: User, as: "user", attributes: ["username", "avatar"] },
        { model: Image, as: "images" },
      ],
    });

    console.log("Found posts:", posts.length, "items", posts.map(p => ({ id: p.id, price: p.price })));
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "فشل في جلب المنشورات", error: err.message });
  }
};
export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await Post.findByPk(id, {
      include: [
        { model: PostDetail, as: 'postDetail' },
        { model: User, as: 'user', attributes: ['username', 'avatar'] },
        { model: Image, as: 'images' },
      ],
    });

    if (!post) return res.status(404).json({ message: 'المنشور غير موجود!' });

    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (!err) {
          const saved = await SavedPost.findOne({
            where: { userId: payload.id, postId: id },
          });
          return res.status(200).json({ ...post.toJSON(), isSaved: !!saved });
        } else {
          return res.status(401).json({ message: 'غير مصرح' });
        }
      });
    } else {
      res.status(200).json({ ...post.toJSON(), isSaved: false });
    }
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({ message: 'فشل في جلب المنشور' });
  }
};


export const addPost = async (req, res) => {
  const { postData, postDetail, images } = req.body; // استقبال البيانات كـ JSON

  if (!postData || !postDetail) {
    return res.status(400).json({ message: "بيانات المنشور ناقصة!" });
  }

  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "غير مصرح" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // إنشاء المنشور
    const newPost = await Post.create({
      ...postData, // postData هو كائن JavaScript مباشرة
      userId: payload.id,
    });

    // إنشاء تفاصيل المنشور
    await PostDetail.create({
      ...postDetail, // postDetail هو كائن JavaScript مباشرة
      postId: newPost.id,
    });

    // إضافة الصور إذا وُجدت
    if (images && images.length > 0) {
      const imageRecords = images.map((url) => ({
        url,
        postId: newPost.id,
      }));
      await Image.bulkCreate(imageRecords);
    }

    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "فشل في إنشاء المنشور", error: err.message });
  }
};

export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { postData, postDetail, existingImages } = req.body;
  const tokenUserId = req.userId;

  console.log("Received postData:", postData);
  console.log("Received postDetail:", postDetail);
  console.log("Received existingImages:", existingImages);
  console.log("Received files:", req.files);

  try {
    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ message: "المنشور غير موجود!" });

    if (post.userId !== tokenUserId && req.userRole !== "ADMIN") {
      return res.status(403).json({ message: "غير مصرح بالتعديل!" });
    }

    // تحديث بيانات المنشور
    await Post.update(JSON.parse(postData), { where: { id: postId } });

    // تحديث التفاصيل
    if (postDetail) {
      await PostDetail.upsert({
        ...JSON.parse(postDetail),
        postId: postId,
      });
    }

    // التعامل مع الصور
    const existingImageUrls = JSON.parse(existingImages || "[]");
    await Image.destroy({ where: { postId, url: { [Op.notIn]: existingImageUrls } } });

    if (req.files && req.files.length > 0) {
      const newImageRecords = req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
        postId: postId,
      }));
      await Image.bulkCreate(newImageRecords);
    }

    const updatedPost = await Post.findByPk(postId, {
      include: [
        { model: PostDetail, as: "postDetail" },
        { model: Image, as: "images" },
      ],
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "فشل في التحديث", error: err.message });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: 'المنشور غير موجود!' });
    }

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: 'غير مصرح!' });
    }

    await Post.destroy({ where: { id } });
    res.status(200).json({ message: 'تم حذف المنشور' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'فشل في حذف المنشور' });
  }
};