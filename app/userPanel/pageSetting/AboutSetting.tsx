"use client";

import { useEffect, useState, useRef } from "react";
import TextInput from "@/app/components/themes/TextInput";
import TextArey from "@/app/components/themes/TextArey";
import Services from "./Services"
import Ourteem from "./Ourteem"
import { toast } from "react-toastify";

function aboutSetting() {
  const [aboutData, setAboutData] = useState({
    title: "املاک پل",
    description: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.",
    video: "1775011631088.mp4",
    poster: "1773254181022.jpg",
    services: [
      {name: 'خدمت شماره یک', img: '1.png', desc: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است'},
      {name: 'خدمت شماره دو', img: '2.png', desc: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است'},
      {name: 'خدمت شماره سه', img: '3.png', desc: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ '},
    ],
    ourteem: [
      {name: 'محمد وحدانی', position: 'برنامه نوبس', img: ''},
      {name: 'زیبا حسینی', position: 'مدیر فروش', img: ''},
      {name: 'کامران سلطانی', position: 'مدیر عامل', img: ''},
      {name: 'ایلیا سعادت', position: 'مدیر بازرگانی', img: ''},
    ],
  });

  useEffect(()=>{
    console.log(aboutData.services)
  }, [aboutData])

  const fileInputRef = useRef<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const posterInputRef = useRef<any>(null);
  const [selectedPosterFile, setSelectedPosterFile] = useState<File | null>(
    null,
  );
  const [tempPosterUrl, setTempPosterUrl] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");

  const [servteem, setServteem] = useState('teem')

  const handlePropertyChange = (key: string, value: any) => {
    setAboutData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch("/api/dynamicOptions");
        if (response.ok) {
          const data = await response.json();
          // Find the record with aboutPage data
          const aboutRecord = data.find((item: any) => item.aboutPage);
          if (aboutRecord && aboutRecord.aboutPage) {
            const parsedAboutData = JSON.parse(aboutRecord.aboutPage);
            setAboutData(parsedAboutData);
          }
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      }
    };

    fetchAboutData();
  }, []);

  const handleSubmit = async () => {
    const aboutPageString = JSON.stringify({
      title: aboutData.title,
      description: aboutData.description,
      video: aboutData.video,
      poster: aboutData.poster,
      services: aboutData.services,
      ourteem: aboutData.ourteem,
    });

    const finalData = {
      id: 2,
      aboutPage: aboutPageString, // دقیقا شبیه postman
    };

    console.log(finalData);

    try {
      await fetch("/api/dynamicOptions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      toast.success("صفحه درباره ما به روز رسانی شد.");
    } catch (error) {
      console.error("خطا در به روز رسانی اطلاعات ص درباره ما : ", error);
    }
  };

  const uploadFileToAPI = async (file: File, type: "video" | "poster") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);

    setIsUploading(true);
    setUploadStatus("uploading");
    setUploadProgress(0);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // tracking progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100,
          );
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          try {
            const result = JSON.parse(xhr.responseText);
            console.log(`${type} uploaded successfully:`, result);
            toast.success(
              `${type === "video" ? "ویدیو" : "کاور"} با نام ${file.name} با موفقیت آپلود شد!`,
            );
            setUploadStatus("success");

            // بعد از 2 ثانیه وضعیت رو ریست کن
            setTimeout(() => {
              setUploadStatus("idle");
              setUploadProgress(0);
            }, 2000);

            resolve(result);
          } catch (error) {
            reject(error);
          }
        } else {
          setUploadStatus("error");
          toast.error(`خطا در آپلود ${type === "video" ? "ویدیو" : "کاور"}`);
          reject(new Error("Upload failed"));

          setTimeout(() => {
            setUploadStatus("idle");
            setUploadProgress(0);
          }, 3000);
        }
        setIsUploading(false);
      });

      xhr.addEventListener("error", () => {
        setUploadStatus("error");
        setIsUploading(false);
        toast.error(
          `خطای اتصال در آپلود ${type === "video" ? "ویدیو" : "کاور"}.`,
        );
        reject(new Error("Network error"));

        setTimeout(() => {
          setUploadStatus("idle");
          setUploadProgress(0);
        }, 3000);
      });

      xhr.open("POST", "/api/upload");
      xhr.send(formData);
    });
  };

  // به روز رسانی handleFileSelection
  const handleFileSelection = async (
    file: File | null,
    type: "video" | "poster",
  ) => {
    if (!file) return;

    if (type === "video") {
      setSelectedFile(file);
      setAboutData((prev) => ({ ...prev, video: file.name }));
      await uploadFileToAPI(file, type);
    } else {
      setSelectedPosterFile(file);
      const tempUrl = URL.createObjectURL(file);
      setTempPosterUrl(tempUrl);
      setAboutData((prev) => ({ ...prev, poster: file.name }));
      await uploadFileToAPI(file, type);
    }
  };

  // cleanup برای جلوگیری از memory leak
  useEffect(() => {
    return () => {
      if (tempPosterUrl && tempPosterUrl.startsWith("blob:")) {
        URL.revokeObjectURL(tempPosterUrl);
      }
    };
  }, [tempPosterUrl]);

  // هندلرهای کلیک
  const handleButtonClick = () => fileInputRef.current?.click();
  const handlePosterButtonClick = () => posterInputRef.current?.click();

  // هندلرهای تغییر فایل
  const handleFileChange = (e: any) =>
    handleFileSelection(e.target.files[0], "video");
  const handlePosterFileChange = (e: any) =>
    handleFileSelection(e.target.files[0], "poster");

  const uploadPosterToAPI = async (fileToUpload: File) => {
    const fileName = fileToUpload.name; // یا هر نامی که دوست داری اینجا تعیین کنی
    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("fileName", fileName); // ارسال نام فایل به API

    try {
      // آدرس API که مخصوص آپلود کاور هست
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Poster uploaded successfully:", result);
        toast.success(`کاور با نام ${fileName} با موفقیت آپلود شد!`);
        // اگر API مسیر فایل رو برگردوند، می‌تونی در aboutData ذخیره کنی
        // setAboutData(prev => ({ ...prev, posterPath: result.path }));
      } else {
        console.error("Poster upload failed:", result.error);
        toast.error(`خطا در آپلود کاور: ${result.error || "خطای ناشناخته"}`);
      }
    } catch (error) {
      console.error("Error uploading poster:", error);
      toast.error("خطای اتصال در آپلود کاور.");
    }
  };

  return (
    <div className="w-full flex flex-wrap gap-5">
      <h2 className="w-full">اطلاعات کلی صفحه : </h2>

      <TextInput
        place="عنوان صفحه"
        category="title"
        handlePropertyChange={handlePropertyChange}
        value={aboutData.title}
      />

      <input
        type="file"
        accept="video/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={posterInputRef}
        onChange={handlePosterFileChange}
      />

      <div className="w-full flex flex-wrap justify-between">
        <div className="videoinput w-[48%]">
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={isUploading}
            className={`subBtn w-full h-[30px] mb-3 ${
              isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isUploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                در حال آپلود... ({uploadProgress}%)
              </span>
            ) : (
              "انتخاب ویدیو"
            )}
          </button>

          {/* نمایش لودر و وضعیت آپلود */}
          {isUploading && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  در حال آپلود ویدیو...
                </span>
                <span className="text-sm text-gray-600">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                لطفاً منتظر بمانید...
              </p>
            </div>
          )}

          {/* نمایش پیام موفقیت */}
          {uploadStatus === "success" && !isUploading && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-700">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm font-medium">
                  ویدیو با موفقیت آپلود شد!
                </span>
              </div>
            </div>
          )}

          {/* نمایش پیام خطا */}
          {uploadStatus === "error" && !isUploading && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 text-red-700">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="text-sm font-medium">
                  خطا در آپلود ویدیو. دوباره تلاش کنید.
                </span>
              </div>
            </div>
          )}

          {/* نمایش ویدیو بعد از آپلود موفق */}
          {aboutData.video && uploadStatus === "success" && (
            <div className="mt-4">
              <video
                src={`/uploads/${aboutData.video}?t=${Date.now()}`}
                className="min-w-full h-[250px] rounded-xl object-cover"
                controls
                autoPlay={false}
              />
            </div>
          )}

          {/* نمایش ویدیوی قبلی اگر در حال آپلود نباشیم */}
          {aboutData.video && uploadStatus !== "success" && !isUploading && (
            <div className="mt-4">
              <video
                src={`/uploads/${aboutData.video}`}
                className="min-w-full h-[250px] rounded-xl object-cover"
                controls
              />
            </div>
          )}
        </div>

        <div className="posterinput w-[48%]">
          <button
            type="button"
            onClick={handlePosterButtonClick}
            className="subBtn w-full h-[30px] mb-3"
          >
            انتخاب کاور ویدو
          </button>

          {aboutData.video && (
            <img
              src={`/uploads/${aboutData.poster}`}
              className="min-w-full h-[250px] rounded-xl object-cover bg-red-500"
              onError={(e) => {
                // اگر عکس لود نشد، از default استفاده کن
                if (tempPosterUrl && !tempPosterUrl.startsWith("blob:")) {
                  // اگه آپلود شده ولی هنوز پیدا نمی‌کنه، دوباره تلاش کن با timestamp
                  e.currentTarget.src = `/uploads/${aboutData.poster}?t=${Date.now()}`;
                }
              }}
            />
          )}
        </div>
      </div>

      <div className="w-full mt-5">
        <TextArey
          place="توضیحات صفحه"
          category="description"
          handlePropertyChange={handlePropertyChange}
          value={aboutData.description}
        />
      </div>

      <div className="teemservis w-full">
        <div className="btns flex gap-5 border-b border-dashed w-full pb-5 mb-5">
          <button
            onClick={()=> setServteem('teem')}
            className={`tabBtn w-[150px] h-[40px] rounded ${servteem === 'teem' && 'active'}`}
          >مدیریت تیم</button>
          <button
            onClick={()=> setServteem('serv')}
            className={`tabBtn w-[150px] h-[40px] rounded ${servteem === 'serv' && 'active'}`}
          >مدیریت خدمات</button>
        </div>
        {servteem === 'teem' ? (
          <Ourteem allteem={aboutData.ourteem} setAllteem={setAboutData} />
        ) : servteem === 'serv' && (
          <Services allServ={aboutData.services} setAllserv={setAboutData}/>
        )}
      </div>

      <button
        onClick={() => {
          handleSubmit();
        }}
        className="subBtn w-full h-[45px]"
      >
        به روز رسانی اطلاعات
      </button>
    </div>
  );
}

export default aboutSetting;
