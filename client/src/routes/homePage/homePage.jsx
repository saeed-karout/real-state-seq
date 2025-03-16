import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";

function HomePage() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">ابحث عن عقارات واحصل على مكان أحلامك</h1>
          <p>
            لوريم إيبسوم دولور سيت أميت كونسيكتيتور أديبيسكينغ إليت. إيوس
            إكسبليكابو سوسكيبيت كوم إيوس، إيور إيست نولا أنيمي كونفيكاتور
            فاسيليس إيد بارياتور فوغيت كووس لودانتيوم تيمبوريبوس دولور إيا
            ريبيلات بروفيدينت إمبيديت!
          </p>
          <SearchBar />
          <div className="boxes">
            <div className="box">
              <h1>16+</h1>
              <h2>سنوات من الخبرة</h2>
            </div>
            <div className="box">
              <h1>200</h1>
              <h2>جوائز حصلنا عليها</h2>
            </div>
            <div className="box">
              <h1>2000+</h1>
              <h2>عقار جاهز</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default HomePage;