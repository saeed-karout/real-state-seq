import { Contact } from '../models/index.js'; // استيراد نموذج Contact من Sequelize

// إضافة طلب اتصال جديد
export const addContact = async (req, res) => {
  const { name, email, message } = req.body;

  console.log('تم استلام طلب اتصال:', { name, email, message });

  // التحقق من وجود الحقول المطلوبة
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'الحقول المطلوبة مفقودة!' });
  }

  try {
    // إنشاء سجل اتصال جديد في قاعدة البيانات باستخدام Sequelize
    const newContact = await Contact.create({
      name,
      email,
      message,
    });
    res.status(200).json({
      message: 'تم إرسال طلب الاتصال بنجاح!',
      data: newContact.toJSON(), // تحويل كائن Sequelize إلى JSON
    });
  } catch (err) {
    console.error('خطأ في إضافة الاتصال:', {
      message: err.message,
      stack: err.stack,
    });
    res.status(500).json({
      message: 'فشل في إرسال طلب الاتصال!',
      error: err.message,
    });
  }
};

// الحصول على جميع طلبات الاتصال
export const getContacts = async (req, res) => {
  try {
    // جلب جميع طلبات الاتصال من قاعدة البيانات باستخدام Sequelize
    const contacts = await Contact.findAll();
    res.status(200).json(contacts);
  } catch (err) {
    console.error('خطأ في جلب طلبات الاتصال:', {
      message: err.message,
      stack: err.stack,
    });
    res.status(500).json({
      message: 'فشل في استرجاع طلبات الاتصال!',
      error: err.message,
    });
  }
};