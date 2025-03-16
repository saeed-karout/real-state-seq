import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiRequest from '../../lib/apiRequest';

function Register() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const formData = new FormData(e.target);

    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');

    console.log('Sending request:', { username, email, password });

    try {
      const res = await apiRequest.post('/auth/register', {
        username,
        email,
        password,
      });
      console.log('Response:', res.status, res.data);
      navigate('/login');
    } catch (err) {
      console.error('Error:', err);
      console.log('Error response:', err.response);
      setError(err.response?.data?.message || 'حدث خطأ غير متوقع!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-500 to-teal-600 p-4">
      <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex-1 p-6 md:p-10 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 text-center">إنشاء حساب</h1>
            <input
              name="username"
              type="text"
              placeholder="اسم المستخدم"
              required
              minLength={3}
              maxLength={20}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
            <input
              name="email"
              type="email"
              placeholder="البريد الإلكتروني"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
            <input
              name="password"
              type="password"
              placeholder="كلمة المرور"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
            <button
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? 'جارٍ التسجيل...' : 'تسجيل'}
            </button>
            {error && (
              <span className="block text-red-500 text-sm text-center">{error}</span>
            )}
            <Link
              to="/login"
              className="block text-center text-green-600 hover:text-green-800 hover:underline transition-colors duration-200"
            >
              لديك حساب بالفعل؟ تسجيل الدخول هنا
            </Link>
          </form>
        </div>
        <div className="hidden md:block w-full md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/bg.png')" }}>
          <div className="h-full flex items-center justify-center bg-black bg-opacity-30">
            <h2 className="text-white text-2xl font-semibold">ابدأ رحلتك اليوم</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;