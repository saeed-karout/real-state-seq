import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import apiRequest, { IMAGES_BASE_URL } from "../../lib/apiRequest";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
      setOpen(false); // إغلاق القائمة عند تسجيل الخروج
    } catch (err) {
      console.log(err);
    }
  };

  // دالة لإغلاق القائمة عند النقر على أي رابط
  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <nav className="flex justify-between items-center px-4 py-5 bg-gray-100 shadow-md sticky top-0 z-50">
      {/* الجزء الأيسر: اللوجو والروابط */}
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 text-gray-800 no-underline" onClick={closeMenu}>
          <img src="/logo.png" alt="Logo" className="w-10 h-10" />
          <span className="text-xl font-bold">RealEstate</span>
        </Link>
        {/* الروابط تظهر على الشاشات الكبيرة فقط */}
        <div className="hidden md:flex gap-4">
          <Link to="/" className="text-gray-600 hover:text-black no-underline">الرئيسية</Link>
          <Link to="/about" className="text-gray-600 hover:text-black no-underline">عنا</Link>
          <Link to="/contact" className="text-gray-600 hover:text-black no-underline">تواصل معنا</Link>
          <Link to="/realtor" className="text-gray-600 hover:text-black no-underline">سيارات</Link>
        </div>
      </div>

      {/* الجزء الأيمن: معلومات المستخدم أو روابط تسجيل الدخول */}
      <div className="flex items-center gap-4">
        {currentUser ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <img
                src={currentUser.avatar ? IMAGES_BASE_URL+currentUser.avatar : "/noavatar.jpg" }
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="hidden md:block text-gray-800 font-medium">{currentUser.username}</span>
            </div>
            <div className="relative group">
              <span className="text-gray-600 font-medium cursor-pointer px-2 py-1 hover:text-black">Settings</span>
              <div className="hidden group-hover:block absolute top-full right-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-md w-40 z-10 transition-opacity duration-200 ease-in-out opacity-0 group-hover:opacity-100">
                <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 no-underline" onClick={closeMenu}>
                    ملف الشخصي
                </Link>
                {currentUser.role === "ADMIN" && (
                  <Link to="/dash-contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 no-underline" onClick={closeMenu}>
                    رسائل الصفحة
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 no-underline"
                >
                  تسجيل الخروج 
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-gray-600 hover:text-black no-underline">تسجيل الدخول</Link>
            <Link to="/register" className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 no-underline">
              إنشاء حساب
            </Link>
          </div>
        )}

        {/* أيقونة القائمة لشاشات الموبايل */}
        <div className="md:hidden">
          <img
            src="/menu.png"
            alt="Menu"
            className="w-6 h-6 cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-110"
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>

        {/* القائمة المنبثقة لشاشات الموبايل */}
        <div
          className={`${
            open ? "block" : "hidden"
          } md:hidden fixed top-16 right-0 w-64 bg-white border border-gray-200 shadow-lg p-4 flex flex-col gap-4 z-50 transition-all duration-300 ease-in-out transform ${
            open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          <Link to="/" className="text-gray-600 hover:text-black no-underline transition-colors duration-200" onClick={closeMenu}>
            الرئيسية
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-black no-underline transition-colors duration-200" onClick={closeMenu}>
            عنا
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-black no-underline transition-colors duration-200" onClick={closeMenu}>
            تواصل معنا
          </Link>
          <Link to="/realtor" className="text-gray-600 hover:text-black no-underline transition-colors duration-200" onClick={closeMenu}>
            سيارات
          </Link>
          {currentUser ? (
            <>
              <Link to="/profile" className="text-gray-600 hover:text-black no-underline transition-colors duration-200" onClick={closeMenu}>
                ملف شخصي
              </Link>
              {currentUser.role === "ADMIN" && (
                <Link to="/dash-contact" className="text-gray-600 hover:text-black no-underline transition-colors duration-200" onClick={closeMenu}>
                  رسائل الصفحة 
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-black text-left w-full no-underline transition-colors duration-200"
              >
                تسجيل خروج
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-black no-underline transition-colors duration-200" onClick={closeMenu}>
                تسجيل دخول
              </Link>
              <Link to="/register" className="text-gray-600 hover:text-black no-underline transition-colors duration-200" onClick={closeMenu}>
                إنشاء حساب
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;