import axios from 'axios';

// عنوان الـ API الأساسي للطلبات
const BASE_URL = 'http://localhost:3000/api';

// عنوان الـ API الخاص بالصور (يمكن تغييره من هنا)
const IMAGES_BASE_URL = 'http://localhost:3000'; // الخادم الذي يخدم الصور

const apiRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// تصدير عنوان الصور كمتغير منفصل
export { IMAGES_BASE_URL };

export default apiRequest;