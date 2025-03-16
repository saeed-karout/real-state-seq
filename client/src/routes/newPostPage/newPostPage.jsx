import { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaEye } from "react-icons/fa";

function NewPostPage() {
  const [value, setValue] = useState("");
  const [files, setFiles] = useState([]); // الملفات المؤكدة
  const [tempFiles, setTempFiles] = useState([]); // الملفات المؤقتة
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      // رفع الصور إلى /upload أولاً
      let imageUrls = [];
      if (files.length > 0) {
        const uploadFormData = new FormData();
        files.forEach((file) => uploadFormData.append("file", file));
        const uploadRes = await apiRequest.post("/upload", uploadFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrls = uploadRes.data.urls;
      }

      // إعداد بيانات المنشور
      const postData = {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size) || null,
          school: parseInt(inputs.school) || null,
          bus: parseInt(inputs.bus) || null,
          restaurant: parseInt(inputs.restaurant) || null,
        },
        images: imageUrls, // إضافة روابط الصور
      };

      const res = await apiRequest.post("/posts", postData);
      navigate("/" + res.data.id);
    } catch (err) {
      console.error("Error submitting post:", err);
      setError(err.response?.data?.message || "حدث خطأ أثناء إضافة المنشور");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFile = (indexToDelete) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToDelete));
  };

  const handleConfirmFiles = () => {
    setFiles((prev) => [...prev, ...tempFiles]);
    setTempFiles([]);
  };

  const handleDeleteTempFile = (indexToDelete) => {
    setTempFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToDelete));
  };

  const handlePreviewImage = (file) => {
    setPreviewImage(URL.createObjectURL(file));
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="flex-1 p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">إضافة منشور جديد</h1>
        <div className="w-full">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label htmlFor="title" className="mb-1 text-gray-700">العنوان</label>
              <input id="title" name="title" type="text" className="border rounded p-2 focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="price" className="mb-1 text-gray-700">السعر</label>
              <input id="price" name="price" type="number" className="border rounded p-2 focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="address" className="mb-1 text-gray-700">العنوان</label>
              <input id="address" name="address" type="text" className="border rounded p-2 focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="flex flex-col col-span-full">
              <label htmlFor="desc" className="mb-1 text-gray-700">الوصف</label>
              <div className="border rounded min-h-[200px] sm:min-h-[250px] md:min-h-[300px] mb-16">
                <ReactQuill theme="snow" onChange={setValue} value={value} className="h-full" />
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="city" className="mb-1 text-gray-700">المدينة</label>
              <input id="city" name="city" type="text" className="border rounded p-2 focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="bedroom" className="mb-1 text-gray-700">عدد غرف النوم</label>
              <input min={1} id="bedroom" name="bedroom" type="number" className="border rounded p-2 focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="bathroom" className="mb-1 text-gray-700">عدد الحمامات</label>
              <input min={1} id="bathroom" name="bathroom" type="number" className="border rounded p-2 focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="latitude" className="mb-1 text-gray-700">خط العرض</label>
              <input id="latitude" name="latitude" type="text" className="border rounded p-2 focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="longitude" className="mb-1 text-gray-700">خط الطول</label>
              <input id="longitude" name="longitude" type="text" className="border rounded p-2 focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="type" className="mb-1 text-gray-700">النوع</label>
              <select name="type" className="border rounded p-2 focus:ring-2 focus:ring-blue-400">
                <option value="rent">إيجار</option>
                <option value="buy">شراء</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="property" className="mb-1 text-gray-700">نوع العقار</label>
              <select name="property" className="border rounded p-2 focus:ring-2 focus:ring-blue-400">
                <option value="apartment">شقة</option>
                <option value="house">منزل</option>
                <option value="condo">شقة مشتركة</option>
                <option value="land">أرض</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="utilities" className="mb-1 text-gray-700">سياسة المرافق</label>
              <select name="utilities" className="border rounded p-2 focus:ring-2 focus:ring-blue-400">
                <option value="owner">مسؤولية المالك</option>
                <option value="tenant">مسؤولية المستأجر</option>
                <option value="shared">مشتركة</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="pet" className="mb-1 text-gray-700">سياسة الحيوانات الأليفة</label>
              <select name="pet" className="border rounded p-2 focus:ring-2 focus:ring-blue-400">
                <option value="allowed">مسموح</option>
                <option value="not-allowed">غير مسموح</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="income" className="mb-1 text-gray-700">سياسة الدخل</label>
              <input id="income" name="income" type="text" placeholder="سياسة الدخل" className="border rounded p-2 focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="size" className="mb-1 text-gray-700">الحجم (قدم مربع)</label>
              <input min={0} id="size" name="size" type="number" className="border rounded p-2 focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="school" className="mb-1 text-gray-700">مسافة المدرسة</label>
              <input min={0} id="school" name="school" type="number" className="border rounded p-2 focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="bus" className="mb-1 text-gray-700">مسافة الحافلة</label>
              <input min={0} id="bus" name="bus" type="number" className="border rounded p-2 focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="restaurant" className="mb-1 text-gray-700">مسافة المطعم</label>
              <input min={0} id="restaurant" name="restaurant" type="number" className="border rounded p-2 focus:ring-2 focus:ring-blue-400" />
            </div>
            <button
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 col-span-full transition-colors duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? "جارٍ الإرسال..." : "إرسال"}
            </button>
            {error && <span className="text-red-500 mt-2 text-center col-span-full">{error}</span>}
          </form>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 md:p-6 w-full md:w-1/3 bg-white shadow-lg rounded-lg">
        {tempFiles.length > 0 && (
          <>
            <h3 className="text-lg font-semibold text-gray-800">الصور المحملة (في انتظار التأكيد)</h3>
            <div className="flex flex-wrap gap-4">
              {tempFiles.map((file, index) => (
                <div
                  className="relative inline-block transform transition-all duration-300 hover:scale-105 hover:shadow-md rounded overflow-hidden"
                  key={index}
                >
                  <img src={URL.createObjectURL(file)} alt={`محملة ${index}`} className="w-36 h-36 object-cover rounded" />
                  <button
                    onClick={() => handleDeleteTempFile(index)}
                    className="absolute top-2 left-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-200"
                  >
                    <FaTimes />
                  </button>
                  <button
                    onClick={() => handlePreviewImage(file)}
                    className="absolute bottom-2 right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
                  >
                    <FaEye />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleConfirmFiles}
              className="mt-2 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
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
            <h3 className="text-lg font-semibold text-gray-800">الصور المؤكدة</h3>
            <div className="flex flex-wrap gap-4">
              {files.map((file, index) => (
                <div
                  className="relative inline-block transform transition-all duration-300 hover:scale-105 hover:shadow-md rounded overflow-hidden"
                  key={index}
                >
                  <img src={URL.createObjectURL(file)} alt={`مؤكدة ${index}`} className="w-36 h-36 object-cover rounded" />
                  <button
                    onClick={() => handleDeleteFile(index)}
                    className="absolute top-2 left-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-200"
                  >
                    <FaTimes />
                  </button>
                  <button
                    onClick={() => handlePreviewImage(file)}
                    className="absolute bottom-2 right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
                  >
                    <FaEye />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        <UploadWidget setState={setTempFiles} multiple={true} maxFiles={5} />
      </div>

      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={closePreview}>
          <div className="relative max-w-3xl w-full bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 scale-100 animate-fade-in">
            <img src={previewImage} alt="معاينة" className="w-full h-auto max-h-[80vh] object-contain" />
            <button
              onClick={closePreview}
              className="absolute top-4 right-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-200"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewPostPage;