import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest, { IMAGES_BASE_URL } from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../../components/loading/Loading";

function ProfilePage() {
  const data = useLoaderData();
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log("دور المستخدم الحالي:", currentUser.role); // تحقق من الدور
  console.log("بيانات التحميل:", data); // تحقق من البيانات المُرجعة

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>معلومات المستخدم</h1>
            <Link to="/profile/update">
              <button>تحديث الملف الشخصي</button>
            </Link>
          </div>
          <div className="info">
            <span>
              الصورة الرمزية:
              <img src={currentUser.avatar ? IMAGES_BASE_URL+currentUser.avatar : "/noavatar.jpg" } alt="" />
            </span>
            <span>
              اسم المستخدم: <b>{currentUser.username}</b>
            </span>
            <span>
              البريد الإلكتروني: <b>{currentUser.email}</b>
            </span>
            <button onClick={handleLogout}>تسجيل الخروج</button>
          </div>
          {currentUser.role === "ADMIN" && (
            <>
              <div className="title">
                <h1>قائمتي</h1>
                <Link to="/add">
                  <button>إنشاء منشور جديد</button>
                </Link>
              </div>
              <Suspense fallback={<Loading />}>
                <Await
                  resolve={data.postResponse}
                  errorElement={<p>خطأ في تحميل المنشورات!</p>}
                >
                  {(postResponse) => {
                    console.log("تم حل postResponse:", postResponse);
                    return <List posts={postResponse.data.userPosts} />;
                  }}
                </Await>
              </Suspense>
            </>
          )}
          <div className="title">
            <h1>القائمة المحفوظة</h1>
          </div>
          <Suspense fallback={<Loading />}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>خطأ في تحميل المنشورات!</p>}
            >
              {(postResponse) => <List posts={postResponse.data.savedPosts} />}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;