import "./realtor.css";

const Realtor = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center transform transition-all duration-500 hover:scale-105">
        {/* عنوان الصفحة */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-fade-in">
          قريبًا
        </h1>
        
        {/* وصف قصير */}
        <p className="text-lg md:text-xl text-gray-600 mb-6 animate-fade-in delay-200">
          نحن نعمل على شيء رائع! تابعنا للحصول على آخر التحديثات حول عالم العقارات.
        </p>

        {/* أيقونة أو رسم متحرك بسيط */}
        <div className="flex justify-center mb-6">
          <svg
            className="w-16 h-16 text-blue-600 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7m-9 2v10a1 1 0 001 1h4a1 1 0 001-1V14h2v8a1 1 0 001 1h4a1 1 0 001-1V12m-4-2l2 2"
            ></path>
          </svg>
        </div>

        {/* زر أو رابط اختياري */}
        <a
          href="/"
          className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-110"
        >
          العودة إلى الصفحة الرئيسية
        </a>
      </div>
    </div>
  );
};

export default Realtor;