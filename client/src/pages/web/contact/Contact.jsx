// client/src/routes/contactPage/ContactPage.jsx
import { useState } from "react";
import apiRequest from "../../../lib/apiRequest";
import "./Contact.scss";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await apiRequest.post("/contact", formData);
      setSuccess(response.data.message);
      setFormData({ name: "", email: "", message: "" }); // إعادة تعيين النموذج
    } catch (err) {
      console.log("خطأ في إرسال الرسالة:", err.response?.data || err.message);
      setError(err.response?.data?.message || "فشل في إرسال طلب التواصل.");
    }
  };

  return (
    <div className="contactPage">
      <h1>تواصل معنا</h1>
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <div className="formItem">
            <label htmlFor="name">الاسم</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="formItem">
            <label htmlFor="email">البريد الإلكتروني</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="formItem">
            <label htmlFor="message">الرسالة</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">إرسال</button>
          {error && <span className="error">{error}</span>}
          {success && <span className="success">{success}</span>}
        </form>
      </div>
    </div>
  );
}

export default Contact;