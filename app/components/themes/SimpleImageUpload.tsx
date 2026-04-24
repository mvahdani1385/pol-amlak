"use client";

import "@/app/css/themes.css";
import { useState, useRef } from "react";

interface SimpleImageUploadProps {
  imageUrl?: string;
  onImageChange: (imageUrl: string) => void;
}

function SimpleImageUpload({
  imageUrl,
  onImageChange,
}: SimpleImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("لطفاً فقط تصویر انتخاب کنید");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("حجم فایل نباید بیشتر از 5 مگابایت باشد");
      return;
    }

    setIsUploading(true);

    try {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const fileName = `${timestamp}-${randomString}-${file.name}`;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", fileName);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("خطا در آپلود تصویر");
      }

      const uploadResult = await uploadResponse.json();
      onImageChange(uploadResult.fileName);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("خطا در آپلود تصویر");
    } finally {
      setIsUploading(false);
      if (e.target.value) {
        e.target.value = "";
      }
    }
  };

  return (
    <div className="simpleImageUpload">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <div
        className="uploadArea"
        onClick={handleUploadClick}
        style={{ cursor: "pointer" }}
      >
        {imageUrl ? (
          <div className="flex">
            <div className="imagePreview ccdiv flex-col w-[150px] h-[150px] bg-[var(--inputback)] mt-5 overflow-hidden rounded-xl rounded-tl-none rounded-bl-none">
              <img
                src={`/uploads/${imageUrl}`}
                alt="Preview"
                className="previewImage min-w-full min-h-full object-cover"
              />
            </div>
            <div className="imageOverlay ccdiv flex-col gap-3 w-[150px] h-[150px] bg-[var(--inputback)] mt-5 rounded-xl rounded-tr-none rounded-br-none">
              <button
                type="button"
                className="changeButton normBtn w-[90%] h-[30px]"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUploadClick();
                }}
              >
                تغییر تصویر
              </button>
              <button
                type="button"
                className="removeButton delBtn w-[90%] h-[30px]"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageChange("");
                }}
              >
                حذف تصویر
              </button>
            </div>
          </div>
        ) : (
          <div className="uploadPlaceholder ccdiv flex-col w-[150px] h-[150px] bg-[var(--inputback)] mt-5 rounded-xl">
            <div className="uploadIcon">+</div>
            <p>انتخاب تصویر</p>
            {isUploading && (
              <div className="uploading">
                <div className="spinner"></div>
                <p>در حال آپلود...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SimpleImageUpload;
