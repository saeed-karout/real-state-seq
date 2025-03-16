import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import "./contact.scss"; // لتنسيق الجدول
import NotAuthorized from "../../../routes/NotAuthorized";
import apiRequest from "../../../lib/apiRequest";
import Loading from "../../../components/loading/Loading";

const Contact = () => {
  const { currentUser } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // جلب البيانات من الـ API عند تحميل المكون
  useEffect(() => {
    if (currentUser?.role === "ADMIN") {
      const fetchContacts = async () => {
        setLoading(true);
        try {
          const response = await apiRequest.get("/contact"); // استخدام apiRequest.get
          setContacts(response.data); // البيانات تكون في response.data مع axios
        } catch (err) {
          setError(err.response?.data?.message || err.message); // معالجة الأخطاء مع axios
        } finally {
          setLoading(false);
        }
      };
      fetchContacts();
    }
  }, [currentUser]);

  // إذا لم يكن المستخدم ADMIN
  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NotAuthorized />;
  }

  return (
    <div className="contact-dashboard">
      <h2>جميع طلبات التواصل</h2>
      {loading ? (
        <p><Loading /></p>
      ) : error ? (
        <p>خطأ: {error}</p>
      ) : contacts.length === 0 ? (
        <p>لا توجد طلبات تواصل حاليًا</p>
      ) : (
        <table className="contact-table">
          <thead>
            <tr>
              <th>الرقم</th>
              <th>الاسم</th>
              <th>البريد الإلكتروني</th>
              <th>الرسالة</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <tr key={contact.id}>
                <td>{index + 1}</td>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.message}</td>
                <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Contact;