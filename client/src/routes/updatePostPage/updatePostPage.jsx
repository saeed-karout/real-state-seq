import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest ,{IMAGES_BASE_URL} from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { FaTimes, FaEye } from "react-icons/fa";

function UpdatePostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [value, setValue] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [tempFiles, setTempFiles] = useState([]);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await apiRequest.get(`/posts/${id}`);
        const post = res.data;

        if (currentUser.role !== "ADMIN" && post.userId !== currentUser.id) {
          navigate("/not-authorized");
          return;
        }

        setFormData({
          title: post.title,
          price: post.price,
          address: post.address,
          city: post.city,
          bedroom: post.bedroom,
          bathroom: post.bathroom,
          type: post.type,
          property: post.property,
          latitude: post.latitude,
          longitude: post.longitude,
          utilities: post.postDetail.utilities,
          pet: post.postDetail.pet,
          income: post.postDetail.income,
          size: post.postDetail.size,
          school: post.postDetail.school,
          bus: post.postDetail.bus,
          restaurant: post.postDetail.restaurant,
        });
        setValue(post.postDetail.desc || "");
        setExistingImages(post.images || []);
      } catch (err) {
        console.log(err);
        setError("فشل في جلب بيانات المنشور.");
      }
    };
    fetchPost();
  }, [id, currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
  
    const newFormData = new FormData(e.target);
    const inputs = Object.fromEntries(newFormData);
  
    newFormData.append("postData", JSON.stringify({
      title: inputs.title,
      price: parseInt(inputs.price) || undefined,
      address: inputs.address,
      city: inputs.city,
      bedroom: parseInt(inputs.bedroom) || undefined,
      bathroom: parseInt(inputs.bathroom) || undefined,
      type: inputs.type,
      property: inputs.property,
      latitude: inputs.latitude,
      longitude: inputs.longitude,
    }));
  
    newFormData.append("postDetail", JSON.stringify({
      desc: value,
      utilities: inputs.utilities || undefined,
      pet: inputs.pet || undefined,
      income: inputs.income || undefined,
      size: parseInt(inputs.size) || undefined,
      school: parseInt(inputs.school) || undefined,
      bus: parseInt(inputs.bus) || undefined,
      restaurant: parseInt(inputs.restaurant) || undefined,
    }));
  
    newFormData.append("existingImages", JSON.stringify(existingImages.map(img => img.url)));
  
    files.forEach((file) => {
      newFormData.append("files", file);
    });
  
    console.log("Sending postData:", newFormData.get("postData"));
    console.log("Sending postDetail:", newFormData.get("postDetail"));
    console.log("Sending existingImages:", newFormData.get("existingImages"));
    console.log("Sending files:", files);
  
    try {
      const response = await apiRequest.put(`/posts/${id}`, newFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/" + id);
    } catch (err) {
      console.log("خطأ في تحديث المنشور:", err.response?.data || err.message);
      setError("فشل في تحديث المنشور.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDeleteImage = (indexToDelete) => {
    console.log("Deleting existing image at index:", indexToDelete);
    setExistingImages((prevImages) => prevImages.filter((_, index) => index !== indexToDelete));
  };

  const handleDeleteTempFile = (indexToDelete) => {
    console.log("Deleting temp file at index:", indexToDelete);
    setTempFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToDelete));
  };

  const handleConfirmFiles = () => {
    console.log("Confirming files:", tempFiles);
    setFiles((prev) => [...prev, ...tempFiles]);
    setTempFiles([]);
  };

  const handleDeleteFile = (indexToDelete) => {
    console.log("Deleting confirmed file at index:", indexToDelete);
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToDelete));
  };

  const handlePreviewImage = (src) => {
    setPreviewImage(src);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="flex-1 p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">تحديث المنشور</h1>
        <div className="w-full">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label htmlFor="title" className="mb-1 text-gray-700">العنوان</label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title || ""}
                onChange={handleChange}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="price" className="mb-1 text-gray-700">السعر</label>
              <input
                id="price"
                name="price"
                type="number"
                value={formData.price || ""}
                onChange={handleChange}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="address" className="mb-1 text-gray-700">العنوان</label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address || ""}
                onChange={handleChange}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col col-span-full">
              <label htmlFor="desc" className="mb-1 text-gray-700">الوصف</label>
              <div className="border rounded min-h-[200px] sm:min-h-[250px] md:min-h-[300px] mb-16">
                <ReactQuill theme="snow" onChange={setValue} value={value} className="h-full" />
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="city" className="mb-1 text-gray-700">المدينة</label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city || ""}
                onChange={handleChange}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="bedroom" className="mb-1 text-gray-700">عدد غرف النوم</label>
              <input
                min={1}
                id="bedroom"
                name="bedroom"
                type="number"
                value={formData.bedroom || ""}
                onChange={handleChange}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="bathroom" className="mb-1 text-gray-700">عدد الحمامات</label>
              <input
                min={1}
                id="bathroom"
                name="bathroom"
                type="number"
                value={formData.bathroom || ""}
                onChange={handleChange}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="latitude" className="mb-1 text-gray-700">خط العرض</label>
              <input
                id="latitude"
                name="latitude"
                type="text"
                value={formData.latitude || ""}
                onChange={handleChange}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="longitude" className="mb-1 text-gray-700">خط الطول</label>
              <input
                id="longitude"
                name="longitude"
                type="text"
                value={formData.longitude || ""}
                onChange={handleChange}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="type" className="mb-1 text-gray-700">النوع</label>
              <select
                name="type"
                value={formData.type || ""}
                onChange={handleChange}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-400"
              >
                <option value="rent">إيجار</option>
                <option value="buy">شراء</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="property" className="mb-1 text-gray-700">نوع العقار</label>
              <select
                name="property"
                value={formData.property || ""}
                onChange={handleChange}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-400"
              >
                <option value="apartment">شقة</option>
                <option value="house">منزل</option>
                <option value="condo">شقة مشتركة</option>
                <option value="land">أرض</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="utilities" className="mb-1 text-gray-700">سياسة المرافق</label>
              <select
                name="utilities"
                value={formData.utilities || ""}
                onChange={handleChange}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-400"
              >
                <option value="owner">مسؤولية المالك</option>
                <option value="tenant">مسؤولية المستأجر</option>
                <option value="shared">مشتركة</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="pet" className="mb-1 text-gray-700">سياسة الحيوانات الأليفة</label>
              <select
                name="pet"
                value={formData.pet || ""}
                onChange={handleChange}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-400"
              >
                <option value="allowed">مسموح</option>
                <option value="not-allowed">غير مسموح</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="income" className="mb-1 text-gray-700">سياسة الدخل</label>
              <input
                id="income"
                name="income"
                type="text"
                value={formData.income || ""}
                onChange={handleChange}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="size" className="mb-1 text-gray-700">الحجم (قدم مربع)</label>
              <input
                id="size"
                name="size"
                type="number"
                value={formData.size || ""}
                onChange={handleChange}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="school" className="mb-1 text-gray-700">مسافة المدرسة</label>
              <input
                id="school"
                name="school"
                type="number"
                value={formData.school || ""}
                onChange={handleChange}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="bus" className="mb-1 text-gray-700">مسافة الحافلة</label>
              <input
                id="bus"
                name="bus"
                type="number"
                value={formData.bus || ""}
                onChange={handleChange}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="restaurant" className="mb-1 text-gray-700">مسافة المطعم</label>
              <input
                id="restaurant"
                name="restaurant"
                type="number"
                value={formData.restaurant || ""}
                onChange={handleChange}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 col-span-full transition-colors duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? "جارٍ التحديث..." : "تحديث"}
            </button>
            {error && <span className="text-red-500 mt-2 text-center col-span-full">{error}</span>}
          </form>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 md:p-6 w-full md:w-1/3 bg-white shadow-lg rounded-lg">
        {existingImages.length > 0 && (
          <>
            <h3 className="text-lg font-semibold text-gray-800">الصور الحالية</h3>
            <div className="flex flex-wrap gap-4">
              {existingImages.map((image, index) => (
                <div
                  className="relative inline-block transform transition-all duration-300 hover:scale-105 hover:shadow-md rounded overflow-hidden"
                  key={index}
                >
                  <img
                    src={`${IMAGES_BASE_URL}${image.url}`}
                    alt={`صورة ${index}`}
                    className="w-36 h-36 object-cover rounded"
                  />
                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-2 left-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-700"
                  >
                    <FaTimes />
                  </button>
                  <button
                    onClick={() => handlePreviewImage(image.url)}
                    className="absolute bottom-2 right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
                  >
                    <FaEye />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {tempFiles.length > 0 && (
          <>
            <h3 className="text-lg font-semibold text-gray-800">الصور الجديدة (في انتظار التأكيد)</h3>
            <div className="flex flex-wrap gap-4">
              {tempFiles.map((file, index) => (
                <div
                  className="relative inline-block transform transition-all duration-300 hover:scale-105 hover:shadow-md rounded overflow-hidden"
                  key={index}
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`محملة ${index}`}
                    className="w-36 h-36 object-cover rounded"
                  />
                  <button
                    onClick={() => handleDeleteTempFile(index)}
                    className="absolute top-2 left-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-700"
                  >
                    <FaTimes />
                  </button>
                  <button
                    onClick={() => handlePreviewImage(URL.createObjectURL(file))}
                    className="absolute bottom-2 right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
                  >
                    <FaEye />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleConfirmFiles}
              className="mt-2 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <span>تأكيد الصور</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </button>
          </>
        )}

        {files.length > 0 && (
          <>
            <h3 className="text-lg font-semibold text-gray-800">الصور الجديدة المؤكدة</h3>
            <div className="flex flex-wrap gap-4">
              {files.map((file, index) => (
                <div
                  className="relative inline-block transform transition-all duration-300 hover:scale-105 hover:shadow-md rounded overflow-hidden"
                  key={index}
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`مؤكدة ${index}`}
                    className="w-36 h-36 object-cover rounded"
                  />
                  <button
                    onClick={() => handleDeleteFile(index)}
                    className="absolute top-2 left-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-700"
                  >
                    <FaTimes />
                  </button>
                  <button
                    onClick={() => handlePreviewImage(URL.createObjectURL(file))}
                    className="absolute bottom-2 right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
                  >
                    <FaEye />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        <UploadWidget setState={setTempFiles} />
      </div>

      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={closePreview}>
          <div className="relative max-w-3xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={previewImage.startsWith("blob:") ? previewImage : `${IMAGES_BASE_URL}${previewImage}`}
              alt="معاينة"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <button
              onClick={closePreview}
              className="absolute top-4 right-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-700"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdatePostPage;