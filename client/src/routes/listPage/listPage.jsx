import { Await, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import Loading from "../../components/loading/Loading";
import "./listPage.scss";

function ListPage() {
  const data = useLoaderData();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter />
          <Suspense fallback={<Loading />}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>خطأ في تحميل المنشورات!</p>}
            >
              {(postResponse) => (
                postResponse.data.length > 0 ? (
                  postResponse.data.map((post) => (
                    <div key={post.id} className="postItem">
                      <Card item={post} />
                    </div>
                  ))
                ) : (
                  <p>لا توجد منشورات تطابق معايير البحث</p>
                )
              )}
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="mapContainer">
        <Suspense fallback={<Loading />}>
          <Await
            resolve={data.postResponse}
            errorElement={<p>خطأ في تحميل المنشورات!</p>}
          >
            {(postResponse) => <Map items={postResponse.data} />}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

export default ListPage;