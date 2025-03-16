import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-700 to-gray-900 p-4">
      <div className="text-center text-white">
        <h1 className="text-6xl md:text-8xl font-bold mb-4 animate-bounce">404</h1>
        <h2 className="text-2xl md:text-4xl font-semibold mb-6">الصفحة غير موجودة</h2>
        <p className="text-lg md:text-xl mb-8 text-gray-300">
          عذرًا! يبدو أننا لا نستطيع العثور على الصفحة التي تبحث عنها.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;