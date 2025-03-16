import { useState, useRef } from "react";

function UploadWidget({ setState, multiple = false, maxFiles = 5 }) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    const invalidFiles = files.filter((file) => !allowedTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      setError("يرجى رفع صور بصيغة JPEG أو PNG فقط!");
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    const oversizedFiles = files.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError("حجم كل صورة يجب ألا يتجاوز 2 ميجابايت!");
      return;
    }

    if (multiple && files.length > maxFiles) {
      setError(`يمكنك رفع ${maxFiles} صور كحد أقصى!`);
      return;
    }

    setIsUploading(true);
    setError("");

    if (multiple) {
      setState((prev) => [...prev, ...files.slice(0, maxFiles)]);
    } else {
      setState(files[0]);
    }

    setIsUploading(false);
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        multiple={multiple}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept="image/jpeg,image/png"
      />
      <button
        onClick={() => fileInputRef.current.click()}
        disabled={isUploading}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
      >
        {isUploading ? "جارٍ التحميل..." : multiple ? "تحميل صور المنشور" : "تحميل صورة الملف الشخصي"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default UploadWidget;