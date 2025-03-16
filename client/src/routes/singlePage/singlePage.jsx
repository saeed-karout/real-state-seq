import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest, { IMAGES_BASE_URL } from "../../lib/apiRequest";

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  // استخراج روابط الصور من post.images
  const imageUrls = post.images && post.images.length > 0 
  ? post.images.map((image) => `${IMAGES_BASE_URL}${image.url}`) 
  : ["https://via.placeholder.com/150"];

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={imageUrls} /> {/* تمرير مصفوفة الروابط */}
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">$ {post.price}</div>
              </div>
              <div className="user">
                <img src={IMAGES_BASE_URL+post.user.avatar} alt="" />
                <span>{post.user.username}</span>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">عام</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>المرافق</span>
                {post.postDetail.utilities === "owner" ? (
                  <p>المالك مسؤول</p>
                ) : (
                  <p>المستأجر مسؤول</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>سياسة الحيوانات الأليفة</span>
                {post.postDetail.pet === "allowed" ? (
                  <p>مسموح بالحيوانات الأليفة</p>
                ) : (
                  <p>غير مسموح بالحيوانات الأليفة</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>سياسة الدخل</span>
                <p>{post.postDetail.income}</p>
              </div>
            </div>
          </div>
          <p className="title">الأحجام</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetail.size} قدم مربع</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom} أسرّة</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom} حمام</span>
            </div>
          </div>
          <p className="title">الأماكن القريبة</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>مدرسة</span>
                <p>
                  {post.postDetail.school > 999
                    ? post.postDetail.school / 1000 + " كم"
                    : "بعيدًا م" + post.postDetail.school  }{" "}
                  
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>محطة حافلات</span>
                <p>{post.postDetail.bus}  بعيدًا م</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>مطعم</span>
                <p>{post.postDetail.restaurant} بعيدًا م</p>
              </div>
            </div>
          </div>
          <p className="title">الموقع</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            <button
              onClick={handleSave}
              style={{
                backgroundColor: saved ? "#fece51" : "white",
                alignSelf: "flex-end",
              }}
            >
              <img src="/save.png" alt="" />
              {saved ? "تم حفظ المكان" : "حفظ المكان"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;