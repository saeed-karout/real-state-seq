import { Sequelize, DataTypes, Op } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: false,
  define: {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  avatar: { type: DataTypes.STRING, allowNull: true, defaultValue: '/default-avatar.jpg' }, // صورة افتراضية
  role: { type: DataTypes.ENUM('USER', 'ADMIN'), defaultValue: 'USER' },
}, { tableName: 'users' });

const Post = sequelize.define('Post', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  bedroom: { type: DataTypes.INTEGER, allowNull: false },
  bathroom: { type: DataTypes.INTEGER, allowNull: false },
  latitude: { type: DataTypes.STRING, allowNull: false },
  longitude: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM('buy', 'rent'), allowNull: false },
  property: { type: DataTypes.ENUM('apartment', 'house', 'condo', 'land'), allowNull: false },
}, { tableName: 'posts' });

const PostDetail = sequelize.define('PostDetail', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  desc: { type: DataTypes.TEXT, allowNull: false },
  utilities: { type: DataTypes.STRING, allowNull: true },
  pet: { type: DataTypes.STRING, allowNull: true },
  income: { type: DataTypes.STRING, allowNull: true },
  size: { type: DataTypes.INTEGER, allowNull: true },
  school: { type: DataTypes.INTEGER, allowNull: true },
  bus: { type: DataTypes.INTEGER, allowNull: true },
  restaurant: { type: DataTypes.INTEGER, allowNull: true },
}, { tableName: 'post_details' });

const SavedPost = sequelize.define('SavedPost', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
}, { tableName: 'saved_posts', timestamps: false });

const Image = sequelize.define('Image', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  url: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'images' });

const Contact = sequelize.define('Contact', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
}, { tableName: 'contacts' });

const Chat = sequelize.define('Chat', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userIDs: { type: DataTypes.JSON, allowNull: false },
  seenBy: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
}, { tableName: 'chats' });

// تعريف العلاقات
User.hasMany(Post, { foreignKey: 'userId', as: 'posts', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Post.hasMany(Image, { foreignKey: 'postId', as: 'images', onDelete: 'CASCADE' });
Image.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

User.hasMany(Image, { foreignKey: 'userId', as: 'avatars', onDelete: 'CASCADE' });
Image.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Post.hasOne(PostDetail, { foreignKey: 'postId', as: 'postDetail', onDelete: 'CASCADE' });
PostDetail.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

User.belongsToMany(Post, {
  through: SavedPost,
  foreignKey: 'userId',
  otherKey: 'postId',
  as: 'savedPosts',
  onDelete: 'CASCADE',
});
Post.belongsToMany(User, {
  through: SavedPost,
  foreignKey: 'postId',
  otherKey: 'userId',
  as: 'savedByUsers',
  onDelete: 'CASCADE',
});
SavedPost.belongsTo(User, { foreignKey: 'userId', as: 'user' });
SavedPost.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

// مزامنة قاعدة البيانات
(async () => {
  try {
    await sequelize.authenticate();
    console.log('تم الاتصال بقاعدة البيانات');
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development', force: false });

    let hasUniqueIndex = false;
    try {
      const indexes = await sequelize.queryInterface.showIndex('saved_posts');
      hasUniqueIndex = indexes.some(index => index.name === 'saved_posts_unique_combo');
    } catch (error) {
      if (error.parent?.code !== 'ER_NO_SUCH_TABLE') throw error;
    }

    if (!hasUniqueIndex) {
      await sequelize.queryInterface.addIndex('saved_posts', ['userId', 'postId'], {
        unique: true,
        name: 'saved_posts_unique_combo',
      });
      console.log('تم إضافة الفهرس saved_posts_unique_combo');
    }

    console.log('تم مزامنة النماذج بنجاح');
  } catch (error) {
    console.error('خطأ في المزامنة:', error);
    process.exit(1);
  }
})();

export { sequelize, User, Post, PostDetail, SavedPost, Image, Contact, Chat, Op };