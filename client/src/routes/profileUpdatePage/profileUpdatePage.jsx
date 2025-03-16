import { useContext, useState } from "react";
import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest, { IMAGES_BASE_URL } from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  console.log("Current User in ProfileUpdatePage:", currentUser);
  const [error, setError] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.target);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      console.log("Sending request to:", `/users/${currentUser.id}`);
      const res = await apiRequest.put(`/users/${currentUser.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser(res.data);
      navigate("/profile");
    } catch (err) {
      console.log("Update error:", err.response?.data);
      setError(err.response?.data?.message || "حدث خطأ أثناء التحديث");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>تحديث الملف الشخصي</h1>
          <div className="item">
            <label htmlFor="username">اسم المستخدم</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.username}
              className="border rounded p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="item">
            <label htmlFor="email">البريد الإلكتروني</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
              className="border rounded p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="item">
            <label htmlFor="password">كلمة المرور</label>
            <input
              id="password"
              name="password"
              type="password"
              className="border rounded p-2 focus:ring-2 focus:ring-blue-400"
              placeholder="أدخل كلمة مرور جديدة (اختياري)"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200"
          >
            {isSubmitting ? "جارٍ التحديث..." : "تحديث"}
          </button>
          {error && <span className="text-red-500 mt-2 block">{error}</span>}
        </form>
      </div>
      <div className="sideContainer">
        <img
        src={currentUser.avatar ? IMAGES_BASE_URL+currentUser.avatar : "/noavatar.jpg" }
          alt="صورة الملف الشخصي"
          className="avatar w-32 h-32 object-cover rounded-full"
        />
        <UploadWidget setState={setAvatarFile} multiple={false} />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;