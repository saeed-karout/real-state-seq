import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./card.scss";
import { useContext, useState } from "react";
import apiRequest, { IMAGES_BASE_URL } from "../../lib/apiRequest";

function Card({ item }) {
  const { currentUser } = useContext(AuthContext);
  const [saved, setSaved] = useState(item.isSaved);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const postId = item.id;
    if (!postId) {
      console.error("معرف المنشور غير معرف");
      return;
    }

    setSaved((prev) => !prev);

    try {
      await apiRequest.post("/users/save", { postId });
      console.log(`تم حفظ المنشور ${postId} بنجاح`);
    } catch (err) {
      console.error("خطأ في حفظ المنشور:", err.response?.data || err.message);
      setSaved((prev) => !prev);
    }
  };

  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imageContainer">
        {/* التحقق من وجود صورة واستخدام url */}
        <img
          src={item.images && item.images.length > 0 ? `${IMAGES_BASE_URL}${item.images[0].url}` : "/default-image.jpg"}
          alt={item.title || "صورة المنشور"}
        />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address}</span>
        </p>
        <p className="price">$ {item.price}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item.bedroom} غرفة نوم</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.bathroom} حمام</span>
            </div>
          </div>
          <div className="icons">
            <div
              className="icon"
              onClick={handleSave}
              style={{
                backgroundColor: saved ? "#fece51" : "white",
                alignSelf: "flex-end",
              }}
            >
              <img src="/save.png" alt="حفظ" />
            </div>
            {currentUser?.role === "ADMIN" && (
              <div className="icon">
                <Link to={`/edit/${item.id}`} className="edit-button">
                  تعديل
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;