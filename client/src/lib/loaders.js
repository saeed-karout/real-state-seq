import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ request, params }) => {
  try {
    const res = await apiRequest.get("/posts/" + params.id); // استخدام .get للتأكد من الطريقة
    if (!res.data) {
      throw new Response("لم يتم العثور على المنشور", { status: 404 });
    }
    return res.data;
  } catch (error) {
    if (error.response) {
      // التحقق من حالة الرد من السيرفر
      if (error.response.status === 404) {
        throw new Response("لم يتم العثور على المنشور", { status: 404 });
      } else if (error.response.status === 500) {
        throw new Response("خطأ في الخادم الداخلي", { status: 500 });
      }
    }
    // خطأ غير متوقع (مثل مشكلة شبكة)
    throw new Response("فشل تحميل المنشور", { status: error.response?.status || 500 });
  }
};
export const listPageLoader = async ({ request, params }) => {
  const url = new URL(request.url);
  const query = url.searchParams.toString();
  console.log("Loader query:", query); // تسجيل المعايير المُرسلة

  try {
    const postPromise = apiRequest.get("/posts?" + query);
    postPromise.then((res) => console.log("Post response:", res.data)).catch((err) => console.error("Post error:", err));
    return defer({
      postResponse: postPromise,
    });
  } catch (err) {
    console.error("Error in listPageLoader:", err);
    throw new Response("فشل في جلب المنشورات", { status: err.response?.status || 500 });
  }
};

export const profilePageLoader = async () => {
  const postPromise = apiRequest("/users/profile/posts");
  return defer({
    postResponse: postPromise,
  });
};