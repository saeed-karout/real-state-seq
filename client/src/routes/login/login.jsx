import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/login", { username, password });
      console.log("Login response:", res.data);
      updateUser(res.data);
      navigate("/");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("حدث خطأ غير متوقع!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
      <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex-1 p-6 md:p-10 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 text-center">مرحبًا بعودتك</h1>
            <input
              name="username"
              required
              minLength={3}
              maxLength={20}
              type="text"
              placeholder="اسم المستخدم"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <input
              name="password"
              type="password"
              required
              placeholder="كلمة المرور"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <button
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
            {error && (
              <span className="block text-red-500 text-sm text-center">{error}</span>
            )}
            <Link
              to="/register"
              className="block text-center text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
            >
              ليس لديك حساب؟ سجل هنا
            </Link>
          </form>
        </div>
        <div className="hidden md:block w-full md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/bg.png')" }}>
          <div className="h-full flex items-center justify-center bg-black bg-opacity-30">
            <h2 className="text-white text-2xl font-semibold">استكشف عقار أحلامك</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;