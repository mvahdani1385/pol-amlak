"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Linkk from "next/link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { VideoExtension } from "@/app/components/editor/VideoExtension";
import { AudioExtension } from "@/app/components/editor/AudioExtension";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Header from "@/app/components/themes/Header";
import TextInput from "../../../components/themes/TextInput";
import { Content } from "next/font/google";
import { Args } from "@prisma/client/runtime/client";
import "@/app/css/articls.css";
import { toast } from "react-toastify";

interface UploadInfo {
  name: string;
  type: string;
  function: string;
}

interface AudioItem {
  filename: string;
  cover: string;
}



export default function CreateArticlePage() {
  const [uploading, setUploading] = useState(false);
  const [coverImageName, setCoverImageName] = useState("");
  const [alaki, setAlaki] = useState<string[]>([]);

  const [seobox, setSeobox] = useState(false);

  const [getReloading, setGetreloading] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(false);
  const mediaType = [
    { name: "بارگذاری تصویر", type: "img", function: "articleImg" },
    { name: "بارگذاری ویدو", type: "vid", function: "articleVid" },
    { name: "بارگذاری صدا", type: "auo", function: "articleAuo" },
  ];
  const [uploadInfo, setUploadInfo] = useState<Partial<UploadInfo>>(
    mediaType[0],
  );
  const [allImages, setAllImages] = useState<string[]>([]);
  const [allVideos, setAllVideos] = useState<string[]>([]);
  const [allAudio, setAllAudio] = useState<AudioItem[]>([]);
  const [oneVid, setOneVid] = useState("");
  const [oneAuo, setOneAuo] = useState<string | null>(null);

  useEffect(() => {
    try {
      fetch("/api/upload/list", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          setAllImages(data.files);
        });
    } catch (error) {
      console.error(editor);
    }
  }, []);

  useEffect(() => {
    try {
      fetch("/api/upload/vidlist", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          setAllVideos(data.files);
        });
    } catch (error) {
      console.error(editor);
    }
  }, [getReloading]);

  useEffect(() => {
    try {
      fetch("/api/upload/auolist", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          setAllAudio(data.files);
        });
    } catch (error) {
      console.error(editor);
    }
  }, [getReloading]);

  useEffect(() => {
    if (uploadStatus) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [uploadStatus]);

  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const [thisData, setThisData] = useState<any>({});
  const [thisContent, setThisContent] = useState("");

  const [categories, setCategories] = useState<any>();

  const [articleMainData, setArticleMainData] = useState<any>({
    title: "",
    slug: "",
    coverImageName: "",
    oneCategory: "",
    active: null,
    redirect: "",
    categories: [],
    // --- seo ---
    seoTitle: "",
    seoMeta: "",
    seoCanonikalOrigin: "",
    seoCanonikalDestination: "",
    // indexed: "false",
    seoOrigin: "",
    seoDestination: "",
    seoRedirect: "301",
  });

  useEffect(() => {
    handleSubmit();
  }, [articleMainData.active]);

  useEffect(() => {
    if (slug) {
      getThisArticle(slug);
    }
  }, [slug]);

  const getThisArticle = async (slug: string | string[]) => {
    try {
      const response = await fetch(`/api/articles/${slug}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setThisData(data);
    } catch (error) {
      console.error("Error fetching article:", error);
    }
  };

  useEffect(() => {
    handlePropertyChange("title", thisData.title);
    handlePropertyChange("slug", thisData.slug);
    handlePropertyChange("coverImageName", thisData.coverImage);
    setCoverImageName(thisData.coverImage);
    articleMainData.categories = thisData.categories;
    setThisContent(thisData.content);
    // --- seo ---
    handlePropertyChange("seoTitle", thisData.seoTitle);
    handlePropertyChange("seoMeta", thisData.seoMeta);
    handlePropertyChange("seoCanonikalOrigin", thisData.seoCanonikalOrigin);
    handlePropertyChange("seoCanonikalDestination", thisData.seoCanonikalDestination);
    handlePropertyChange("seoOrigin", thisData.seoOrigin);
    handlePropertyChange("seoDestination", thisData.seoDestination);
    handlePropertyChange("seoRedirect", thisData.seoRedirect);
  }, [thisData]);

  useEffect(() => {
    // اطمینان حاصل کنید که editor و thisContent مقدار معتبر دارند
    if (editor && thisContent !== undefined && thisContent !== null) {
      const currentContentHtml = editor.getHTML();

      // مقایسه محتوای فعلی HTML ویرایشگر با HTML جدید
      // برای مقایسه دقیق‌تر، ممکن است نیاز به پاک کردن فضاهای اضافی یا نرمال‌سازی HTML باشد
      // اما در ابتدا، مقایسه مستقیم باید کار کند.
      if (currentContentHtml !== thisContent) {
        editor.commands.setContent(thisContent);
      }
    } else if (
      editor &&
      (thisContent === undefined || thisContent === null || thisContent === "")
    ) {
      // اگر thisContent خالی یا نامعتبر شد، محتوای ویرایشگر را پاک کنید
      editor.commands.setContent("");
    }
  }, [thisContent]);

  const handlePropertyChange = async (key: string, value: any) => {
    await setArticleMainData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleArrayFieldChange = (fieldName: string, value: string) => {
    const currentValues = articleMainData[fieldName] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item: string) => item !== value)
      : [...currentValues, value];

    handlePropertyChange(fieldName, newValues);
  };

  // تابع آپلود تصویر (مستقل از editor)
  const uploadImage = async (file?: File, fileName?: string) => {
    const formData = new FormData();
    if (file !== undefined && fileName !== undefined) {
      formData.append("file", file);
      formData.append("fileName", fileName);
    } else console.error("file or fileName is :  undefined");

    try {
      const response = await fetch("/api/upload", {
        // آدرس API آپلود شما
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      return result.path; // فرض می‌کنیم API مسیر تصویر آپلود شده را برمی‌گرداند
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("خطا در آپلود تصویر");
      return null;
    }
  };

  // ابتدا editor را تعریف می‌کنیم
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      TextStyle,
      Color.configure({
        types: ["textStyle"],
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-black underline",
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class:
            "mx-auto rounded-lg shadow-lg max-w-full h-auto cursor-pointer",
        },
      }),
      VideoExtension.configure({
        HTMLAttributes: {
          class: "mx-auto rounded-lg shadow-lg max-w-full h-auto",
        },
      }),
      AudioExtension.configure({
        HTMLAttributes: {
          class: "w-full my-4",
        },
      }),
    ],
    content: `
            ${thisContent}
        `,
  });

  const handleImageUpload = useCallback(
    async (event?: any) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.info("لطفاً فقط تصویر انتخاب کنید");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        toast.info("حجم تصویر نباید بیشتر از 5 مگابایت باشد");
        return;
      }

      const timestamp = Date.now();
      const fileExtension = file.name.split(".").pop();
      const newFileName = `${timestamp}.${fileExtension}`;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", newFileName);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Upload failed");
        }

        const result = await response.json();

        const updatedImages = [...allImages];
        updatedImages.push(newFileName);
        setAllImages(updatedImages);
      } catch (error) {
        console.error("Error uploading image:", error);
        const errorMessage =
          (error as Error).message || "Unknown error occurred";
        toast.error(`خطا در آپلود تصویر: ${errorMessage}`);
      }
    },
    [editor, uploadImage],
  );

  async function handleDeleteImage(fileNameToDelete: string) {
    if (!confirm("آیا میخواهیید این تصویر را حذف کنید !؟")) {
      return;
    }
    try {
      fetch("/api/upload/list", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: fileNameToDelete,
        }),
      });
      try {
        fetch("/api/upload/list", {
          method: "GET",
        })
          .then((res) => res.json())
          .then((data) => {
            setAllImages(data.files);
          });
      } catch (error) {
        console.error(editor);
      }
    } catch (error) {
      console.error(editor);
    }
  }

  const handleVideoUpload = useCallback(
    async (event?: any) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("video/")) {
        toast.info("لطفاً فقط فایل ویدیویی انتخاب کنید");
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        toast.info("حداکثر حجم ویدیو 20MB است");
        return;
      }

      const timestamp = Date.now();
      const fileExtension = file.name.split(".").pop();
      const newFileName = `${timestamp}.${fileExtension}`;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", newFileName);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (editor && result.path) {
          editor
            .chain()
            .focus()
            .setVideo({
              src: `/uploads/${newFileName}`,
              controls: true,
            })
            .run();
        }

        if (getReloading === 0) {
          setGetreloading(1);
        } else {
          setGetreloading(0);
        }
      } catch (error) {
        console.error("Video upload error:", error);
        toast.error("خطا در آپلود ویدیو");
      }
    },
    [editor],
  );

  async function handleDeleteVideo(fileNameToDelete: string) {
    if (!confirm("آیا میخواهیید این ویدو را حذف کنید !؟")) {
      return;
    }
    try {
      fetch("/api/upload/vidlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: fileNameToDelete,
        }),
      });
      try {
        fetch("/api/upload/vidlist", {
          method: "GET",
        })
          .then((res) => res.json())
          .then((data) => {
            setAllVideos(data.files);
          });
      } catch (error) {
        console.error(editor);
      }
    } catch (error) {
      console.error(editor);
    }
  }

  const handleAudioUpload = useCallback(
    async (event?: any) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("audio/")) {
        toast.info("لطفاً فقط فایل صوتی انتخاب کنید");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.info("حداکثر حجم فایل صوتی 10MB است");
        return;
      }

      const timestamp = Date.now();
      const fileExtension = file.name.split(".").pop();
      const newFileName = `${timestamp}.${fileExtension}`;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", newFileName);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (editor && result.path) {
          editor
            .chain()
            .focus()
            .setAudio({
              src: `/uploads/${newFileName}`,
              controls: true,
            })
            .run();
        }

        if (getReloading === 0) {
          setGetreloading(1);
        } else {
          setGetreloading(0);
        }
      } catch (error) {
        console.error("Audio upload error:", error);
        toast.error("خطا در آپلود فایل صوتی");
      }
    },
    [editor],
  );

  async function handleDeleteAudio(fileNameToDelete: string) {
    if (!confirm("آیا میخواهیید این صدا را حذف کنید !؟")) {
      return;
    }
    try {
      fetch("/api/upload/auolist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: fileNameToDelete,
        }),
      });
      try {
        fetch("/api/upload/auolist", {
          method: "GET",
        })
          .then((res) => res.json())
          .then((data) => {
            setAllAudio(data.files);
          });
      } catch (error) {
        console.error(editor);
      }
    } catch (error) {
      console.error(editor);
    }
  }

  const handleCoverImageUpload = useCallback(async (event?: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.warn("لطفاً فقط تصویر انتخاب کنید");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      toast.warn("حجم تصویر نباید بیشتر از 5 مگابایت باشد");
      return;
    }

    setUploading(true);

    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const newFileName = `${timestamp}.${fileExtension}`;

    setCoverImageName(newFileName);

    const imageUrl = await uploadImage(file, newFileName);

    if (imageUrl) {
      setCoverImageName(imageUrl);
    }

    setUploading(false);
  }, []); // وابستگی‌های useCallback

  const handelCategory = (event?: any) => {
    event.preventDefault();
    if (articleMainData.oneCategory === "") {
      toast.warn("هیچ مقداری وارد نشده است ... !");
      return;
    }
    articleMainData.categories.push(articleMainData.oneCategory);
    handlePropertyChange("oneCategory", "");
  };

  const handlecategorydel = (idx?: number) => {
    articleMainData.categories.splice(idx, 1);
    const badbakhti: string[] = [];
    articleMainData.categories.map((bakht?: any) => {
      badbakhti.push(bakht);
    });
    setAlaki(badbakhti);
  };

  const handleSubmit = async () => {
    if (!editor) return;

    if (articleMainData.slug === "" || undefined || null) {
      toast.warn("وارد کردن نامک اجباری می باشد.");
      return;
    }

    const content = editor.getHTML();
    const excerpt = editor.getText().substring(0, 150) + "...";

    const articlesData = {
      title: articleMainData.title,
      slug: articleMainData.slug,
      coverImageName: coverImageName,
      content,
      active: articleMainData.active,
      categories: articleMainData.categories,
      // --- seo ---
      seoTitle: articleMainData.seoTitle,
      seoMeta: articleMainData.seoMeta,
      seoCanonikalOrigin: articleMainData.seoCanonikalOrigin,
      seoCanonikalDestination: articleMainData.seoCanonikalDestination,
      // indexed: articleMainData.indexed,
      seoOrigin: articleMainData.seoOrigin,
      seoDestination: articleMainData.seoDestination,
      seoRedirect: articleMainData.seoRedirect,
    };

    console.log(articlesData)

    if (!articleMainData.title) {
      toast.warn("لطفا عنوان را وارد کنید.");
      return;
    }

    if (!content) {
      toast.warn("لطفا محتوا را وارد کنید.");
      return;
    }

    try {
      const response = await fetch(`/api/articles/${thisData.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articlesData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          "Failed to create article:",
          errorData.message || response.statusText,
        );
        console.error(`خطا در ویرایش مقاله: ${errorData.message || response.statusText}`);
      } else {
        const createdArticle = await response.json();
        toast.success("مقاله با موفقیت ویرایش شد!");
        setTimeout(() => {
          window.location.href = `/userPanel/articlesManager`;
        }, 300);
        // window.location.href = `/userPanel/articlesManager/edite?slug=${articlesData.slug}`;
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  useEffect(() => {
    fetch("/api/articlesCategories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setCategories(data.data);
      })
      .catch((error) => {
        console.error("خطا در دریافت دسته‌بندی‌ها:", error);
      });
  }, []);

  useEffect(() => {
        document.title = 'ادمین پنل | ویرایش مقاله';
    }, []);

  useEffect(() => {
    const dontSpace = articleMainData.slug.replace(/ /g, "-");
    handlePropertyChange("slug", dontSpace);
    articleMainData.slug.replace(" ", "-");
  }, [articleMainData.slug]);

  if (!editor) return null;

  interface ToolbarButtonProps {
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
    title: string;
  }

  const ToolbarButton = ({
    onClick,
    isActive,
    children,
    title,
  }: ToolbarButtonProps) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-[var(--foreground)] hover:text-[var(--background)] cursor-pointer transition min-w-[40px] ${
        isActive ? "bg-[var(--foreground)] text-[var(--background)]" : ""
      }`}
    >
      {children}
    </button>
  );

  return (
    <>
      {/* <Header /> */}
      <div className="container articlsStyle  mx-auto p-6 flex flex-wrap justify-between w-full">
        <div className="backs flex gap-8 w-full justify-end text-xl cursor-pointer px-3">
          <Linkk href={`/userPanel/articlesManager`}><i className="tabBtn ri-arrow-go-back-line"></i></Linkk>
          <Linkk href={'/userPanel'}><i className="tabBtn ri-home-line"></i></Linkk>
        </div>
        <h1 className="text-3xl font-bold mb-6 w-full">ویرایش مقاله</h1>

        <div
          className={`lightbox fixed w-full h-[100vh] left-0 top-0 z-100 ${uploadStatus ? "ccdiv" : "hidden"}`}
        >
          <div className="centerbox w-[70%] h-[95%] xl:h-[80%] rounded-xl overflow-hidden bg-[var(--background)] shadow-[var(--blackshadow)] border border-[var(--title)]">
            <div className="head w-full h-[60px] bg-[var(--lightboxback)] flex items-center px-10">
              <button
                onClick={() => {
                  setUploadStatus(false);
                  setOneVid("");
                  setOneAuo("");
                }}
                className="cursor-pointer normBtn w-[100px] h-[45px]"
              >
                بستن
              </button>
            </div>
            <div className="content flex justify-between h-[100%]">
              <div className="sidbar w-[25%] h-[100%] py-5">
                {mediaType.length > 0 ? (
                  mediaType.map((media: any, idx: any) => {
                    return (
                      <button
                        key={idx}
                        onClick={(e) => {
                          setUploadInfo(media);

                          document
                            .querySelectorAll(
                              ".lightbox .centerbox .content .sidbar .typeBtn",
                            )
                            .forEach((btn) => {
                              btn.classList.remove("bg-[var(--title)]");
                            });

                          (e.target as HTMLElement).classList.add(
                            "bg-[var(--title)]",
                          );
                        }}
                        className={`typeBtn w-[90%] h-[45px] mr-[5%] my-2 rounded-lg shadow hover:shadow-none cursor-pointer bg-[var(--lightboxback)] ${idx === 0 && "bg-[var(--title)]"}`}
                      >
                        {media.name}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-center w-[80%] mr-[10%]">
                    در حال حاظر قادر به بارگذاری رسانه ای نیستید
                  </p>
                )}
                {oneVid !== "" && (
                  <div
                    className={`oneVid relative w-[85%] m-auto mt-5 overflow-hidden border border-[var(--foreground)]/40 rounded-lg p-2`}
                  >
                    <button
                      onClick={() => {
                        setOneVid("");
                      }}
                      className="absolute top-4 right-4 bg-red-500 w-[30px] h-[30px] rounded cursor-pointer hover:bg-red-300 transition z-2"
                    >
                      x
                    </button>
                    <video
                      src={`/uploads/${oneVid}`}
                      className="w-full h-full rounded"
                      controls
                    />
                  </div>
                )}

                {oneAuo !== "" && (
                  <div
                    className={`oneVid relative w-[85%] m-auto mt-5 overflow-hidden border border-[var(--foreground)]/40 rounded-lg p-2`}
                  >
                    <button
                      onClick={() => {
                        setOneAuo("");
                      }}
                      className="absolute top-0 right-0 bg-red w-[25px] h-[25px] rounded cursor-pointer hover:bg-red-300 transition z-2"
                    >
                      x
                    </button>
                    <audio
                      src={`/uploads/${oneAuo}`}
                      className="w-full"
                      controls
                    />
                  </div>
                )}
              </div>
              <div className="ubloadbox w-[80%] h-[100%] p-5 border-r border-[var(--lightboxback)]">
                <div
                  className={`articleImg h-[100%] flex-wrap ${uploadInfo.function === "articleImg" ? "flex" : "hidden"}`}
                >
                  <div
                    className={`images h-[100%] pb-13 flex-wrap gap-3 overflow-y-scroll ${uploadInfo.type === "img" ? "flex" : "hidden"}`}
                  >
                    <span className="w-full text-xl font-bold">
                      گالری تصاویر
                    </span>
                    {allImages.length > 0 && (
                      <div className="relative w-[150px]">
                        <input
                          type="file"
                          accept="image/png image/jpg"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                          disabled={uploading}
                        />
                        <button
                          onClick={() =>
                            document.getElementById("image-upload")?.click()
                          }
                          title="آپلود تصویر"
                        >
                          {uploading ? (
                            "⏳"
                          ) : (
                            <div className="w-[150px] h-[150px] ccdiv flex-col border rounded-lg cursor-pointer">
                              +
                              <br />
                              <p>بارگذاری تصویر</p>
                            </div>
                          )}
                        </button>
                      </div>
                    )}
                    {allImages.length > 0 ? (
                      [...allImages].reverse().map((img, idx) => {
                        return (
                          <div
                            key={idx}
                            className="relative w-[150px] h-[150px] p-0 rounded-lg border hover:border-none overflow-hidden object-cover"
                          >
                            <img
                              src={`/uploads/${img}`}
                              loading="lazy"
                              className="absolute top-0 left-0 max-w-full max-h-full cursor-pointer"
                            />
                            <button
                              onClick={() => {
                                if (editor && img) {
                                  editor.commands.setImage({
                                    src: `/uploads/${img}`,
                                  });
                                  setUploadStatus(false);
                                }
                              }}
                              className="absolute subBtnRe bottom-2 right-2 w-[50%] cursor-pointer"
                            >
                              گزینش
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteImage(img);
                              }}
                              className="absolute delBtnRe bottom-2 left-2 w-[35%]"
                            >
                              حذف
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <>
                        <div className="relative h-[25%] w-full">
                          <input
                            type="file"
                            accept="image/png image/jpg"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                            disabled={uploading}
                          />
                          <button
                            onClick={() =>
                              document.getElementById("image-upload")?.click()
                            }
                            title="آپلود تصویر"
                          >
                            {uploading ? (
                              "⏳"
                            ) : (
                              <div className="w-[150px] h-[150px] ccdiv flex-col border rounded-lg cursor-pointer">
                                +
                                <br />
                                <p>بارگذاری تصویر</p>
                              </div>
                            )}
                          </button>
                        </div>
                        <p>هیچ تصویری تا کنون بازگذاری نشده است</p>
                      </>
                    )}
                  </div>
                </div>

                <div
                  className={`articleVid h-[100%] flex-wrap ${uploadInfo.function === "articleVid" ? "flex" : "hidden"}`}
                >
                  <div
                    className={`videos h-[75%] pb-13 flex-wrap gap-3 overflow-y-scroll ${uploadInfo.type === "vid" ? "flex" : "hidden"}`}
                  >
                    {allVideos.length > 0 && (
                      <div className="relative">
                        <input
                          type="file"
                          accept="video/mp4, video/x-m4v"
                          onChange={handleVideoUpload}
                          className="hidden"
                          id="video-upload"
                        />
                        <button
                          onClick={() =>
                            document.getElementById("video-upload")?.click()
                          }
                          title="آپلود ویدیو (فرمت های : mp4 - m4v)"
                        >
                          <div className="w-[150px] h-[150px] ccdiv flex-col border rounded-lg cursor-pointer">
                            +
                            <br />
                            <p>بارگذاری ویدو</p>
                          </div>
                        </button>
                      </div>
                    )}
                    {allVideos.length > 0 ? (
                      [...allVideos].reverse().map((vid, idx) => {
                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              setOneVid(vid);
                            }}
                            className="relative w-[150px] h-[150px] p-0 rounded-lg border cursor-pointer hover:border-none overflow-hidden object-cover"
                          >
                            <video
                              src={`/uploads/${vid}`}
                              className="absolute top-0 left-0 max-w-full max-h-full"
                            />
                            <button
                              onClick={() => {
                                if (editor && vid) {
                                  editor
                                    .chain()
                                    .focus()
                                    .setVideo({
                                      src: `/uploads/${vid}`,
                                      controls: true,
                                    })
                                    .run();
                                  setUploadStatus(false);
                                }
                              }}
                              className="absolute subBtnRe bottom-2 right-2 w-[50%]"
                            >
                              گزینش
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteVideo(vid);
                              }}
                              className="absolute delBtnRe bottom-2 left-2 w-[35%]"
                            >
                              حذف
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <>
                        <div className="relative h-[25%] w-full">
                          <input
                            type="file"
                            accept="video/mp4, video/x-m4v"
                            onChange={handleVideoUpload}
                            className="hidden"
                            id="video-upload"
                          />
                          <button
                            onClick={() =>
                              document.getElementById("video-upload")?.click()
                            }
                            title="آپلود ویدیو (فرمت های : mp4 - m4v)"
                          >
                            <div className="w-[150px] h-[150px] ccdiv flex-col border rounded-lg cursor-pointer">
                              +
                              <br />
                              <p>بارگذاری ویدو</p>
                            </div>
                          </button>
                        </div>
                        <p>هیچ ویدویی تا کنون بازگذاری نشده است</p>
                      </>
                    )}
                  </div>
                </div>

                <div
                  className={`articleAuo h-[100%] flex-wrap ${uploadInfo.function === "articleAuo" ? "flex" : "hidden"}`}
                >
                  <div
                    className={`videos h-[75%] pb-13 flex-wrap gap-3 overflow-y-scroll ${uploadInfo.type === "auo" ? "flex" : "hidden"}`}
                  >
                    {allAudio.length > 0 && (
                      <div className="relative">
                        <input
                          type="file"
                          accept="audio/mp3, audio/wav, audio/aac"
                          onChange={handleAudioUpload}
                          className="hidden"
                          id="audio-upload"
                        />
                        <button
                          onClick={() =>
                            document.getElementById("audio-upload")?.click()
                          }
                          title="آپلود صدا ( فرمت های : mp3 - wav - aac )"
                        >
                          <div className="w-[150px] h-[150px] ccdiv flex-col border rounded-lg cursor-pointer">
                            +
                            <br />
                            <p>بارگذاری صدا</p>
                          </div>
                        </button>
                      </div>
                    )}
                    {allAudio.length > 0 ? (
                      [...allAudio].reverse().map((auo, idx) => {
                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              setOneAuo(auo.filename);
                            }}
                            className="relative w-[150px] h-[150px] p-0 rounded-lg border cursor-pointer hover:border-none overflow-hidden object-cover"
                          >
                            <audio
                              src={`/uploads/${auo.filename}`}
                              className="absolute top-0 left-0 max-w-full max-h-full"
                            />
                            <p className="absolute top-0 left-0 ccdiv w-full h-full">
                              <img
                                src={auo.cover}
                                className="!w-full !h-full"
                              />
                            </p>
                            <button
                              onClick={() => {
                                if (editor && auo) {
                                  editor
                                    .chain()
                                    .focus()
                                    .setAudio({
                                      src: `/uploads/${auo.filename}`,
                                      controls: true,
                                    })
                                    .run();
                                  setUploadStatus(false);
                                }
                              }}
                              className="absolute subBtnRe bottom-2 right-2 w-[50%]"
                            >
                              گزینش
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteAudio(auo.filename);
                              }}
                              className="absolute delBtnRe bottom-2 left-2 w-[35%]"
                            >
                              حذف
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <>
                        <div className="relative h-[25%] w-full">
                          <input
                            type="file"
                            accept="audio/mp3, audio/wav, audio/aac"
                            onChange={handleAudioUpload}
                            className="hidden"
                            id="audio-upload"
                          />
                          <button
                            onClick={() =>
                              document.getElementById("audio-upload")?.click()
                            }
                            title="آپلود صدا ( فرمت های : mp3 - wav - aac )"
                          >
                            <div className="w-[150px] h-[150px] ccdiv flex-col border rounded-lg cursor-pointer">
                              +
                              <br />
                              <p>بارگذاری ویدو</p>
                            </div>
                          </button>
                          <p className="mt-5">
                            هیچ صدایی تا کنون بازگذاری نشده است
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="editment  w-[90%] xl:w-[70%]">
          <div className="flex flex-wrap gap-5">
            <TextInput
              place="عنوان مقاله"
              category={"title"}
              handlePropertyChange={handlePropertyChange}
              isNumber={false}
              value={articleMainData.title}
            />

            <div className="">
              <TextInput
                place="نامک مقاله ( فقط حروف انگلیسی )"
                category={"slug"}
                handlePropertyChange={handlePropertyChange}
                isNumber={false}
                lang={"en"}
                value={articleMainData.slug}
              />
              <p className="urlp">
                <span className="ajax">https://amlakpol.ir/article/<span>{articleMainData.slug}</span></span>
              </p>
              <b className="space"></b>
              <p className="urlp">
                <span>لینک فعلی : </span>
                <Linkk href={`/articles/${thisData.slug}`}>https://amlakpol.ir/article/{thisData.slug}</Linkk>
              </p>
            </div>

            {articleMainData.categories.length > 0 ? (
              <>
                <div className="w-full my-5 flex flex-wrap">
                  <h3 className="w-full mb-5">دسته بندی ها :</h3>
                  {articleMainData.categories.map(
                    (cat?: string, idx?: number) => {
                      return (
                        <span
                          key={idx}
                          className="w-fit flex py-1 px-5 mx-2 mt-2 text-sm border rounded-[999px]"
                        >
                          <button
                            className="transition cursor-pointer hover:text-red-500"
                            onClick={() => {
                              handlecategorydel(idx);
                            }}
                          >
                            X
                          </button>
                          <p className="text-sm mr-3">{cat}</p>
                        </span>
                      );
                    },
                  )}
                </div>
              </>
            ) : (
              <div className="w-full my-5">
                <h3 className="w-full mb-5">دسته بندی ها :</h3>
                <p className="text-right py-2 mr-[2]">
                  هیچ دسته بندی انتخاب نشده است.
                </p>
              </div>
            )}
          </div>

          {/* نوار ابزار اصلی */}
          <div className="bg-[var(--inputback)] rounded-t-lg p-2 flex flex-wrap gap-1 sticky top-0 z-10">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              title="پررنگ"
            >
              <strong>B</strong>
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              title="ایتالیک"
            >
              <em>I</em>
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive("underline")}
              title="زیرخط"
            >
              <u>U</u>
            </ToolbarButton>

            <span className="w-px h-8 bg-gray-300 mx-1" />

            {/* <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                        title="عنوان اصلی"
                    >
                        H1
                    </ToolbarButton> */}

            <ToolbarButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              isActive={editor.isActive("heading", { level: 2 })}
              title="زیر عنوان"
            >
              H2
            </ToolbarButton>

            <ToolbarButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              isActive={editor.isActive("heading", { level: 3 })}
              title="زیر عنوان کوچک"
            >
              H3
            </ToolbarButton>

            <ToolbarButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 4 }).run()
              }
              isActive={editor.isActive("heading", { level: 4 })}
              title="زیر عنوان کوچک"
            >
              H4
            </ToolbarButton>

            <ToolbarButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 5 }).run()
              }
              isActive={editor.isActive("heading", { level: 5 })}
              title="زیر عنوان کوچک"
            >
              H5
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().setParagraph().run()}
              isActive={editor.isActive("paragraph")}
              title="پاراگراف"
            >
              p
            </ToolbarButton>

            <ToolbarButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 6 }).run()
              }
              isActive={editor.isActive("heading", { level: 6 })}
              title="زیر عنوان کوچک"
            >
              کوچک
            </ToolbarButton>

            <span className="w-px h-8 bg-gray-300 mx-1" />

            <button
              onClick={() => editor.chain().focus().unsetColor().run()}
              // isActive={!editor.isActive("textStyle", { color: "#ff0000" }) && !editor.isActive("textStyle", { color: "#00ff00" }) && !editor.isActive("textStyle", { color: "#0000ff" })}
              title="حذف رنگ"
            >
              <div className="w-[25px] h-[25px] ccdiv bg-[var(--foreground)] text-[var(--background)] mx-2 cursor-pointer rounded">
                ب
              </div>
            </button>

            <button
              onClick={() => editor.chain().focus().setColor("#ff0000").run()}
              // isActive={editor.isActive("textStyle", { color: "#ff0000" })}
              title="قرمز"
            >
              <div className="w-[25px] h-[25px] ccdiv bg-red-500 mx-2 cursor-pointer rounded">
                ب
              </div>
            </button>

            <button
              onClick={() => editor.chain().focus().setColor("#dfa70a").run()}
              // isActive={editor.isActive("textStyle", { color: "#dfa70a" })}
              title="طلایی"
            >
              <div className="w-[25px] h-[25px] ccdiv bg-[var(--title)] mx-2 cursor-pointer rounded">
                ب
              </div>
            </button>

            <span className="w-px h-8 bg-gray-300 mx-1" />

            <button
              onClick={() => {
                setUploadStatus(true);
              }}
              className="cursor-pointer transition px-3 rounded-lg text-[var(--foreground)] hover:text-[var(--inputback)] hover:bg-[var(--foreground)]"
            >
              🌐 بارگذاری رسانه
            </button>

            <span className="w-px h-8 bg-gray-300 mx-1" />

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              title="لیست نقطه‌ای"
            >
              •
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
              title="لیست شماره‌دار"
            >
              1.
            </ToolbarButton>

            <span className="w-px h-8 bg-gray-300 mx-1" />

            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              isActive={editor.isActive({ textAlign: "left" })}
              title="چپ‌چین"
            >
              ←
            </ToolbarButton>

            <ToolbarButton
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              isActive={editor.isActive({ textAlign: "center" })}
              title="وسط‌چین"
            >
              ↔
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              isActive={editor.isActive({ textAlign: "right" })}
              title="راست‌چین"
            >
              →
            </ToolbarButton>

            <span className="w-px h-8 bg-gray-300 mx-1" />

            <ToolbarButton
              onClick={() => {
                const url = prompt("آدرس لینک:");
                if (url) editor.chain().focus().setLink({ href: url }).run();
              }}
              isActive={editor.isActive("link")}
              title="افزودن لینک"
            >
              🔗
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive("blockquote")}
              title="نقل قول"
            >
              ❝
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive("codeBlock")}
              title="بلوک کد"
            >
              &lt;/&gt;
            </ToolbarButton>

            <span className="w-px h-8 bg-gray-300 mx-1" />

            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              isActive={false}
              title="بازگشت"
            >
              ↩
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              isActive={false}
              title="جلو"
            >
              ↪
            </ToolbarButton>
          </div>

          {/* نوار وضعیت */}
          <div className="px-3 py-2 border-t border-white/50 text-xs flex gap-4 bg-[var(--inputback)]">
            <span>
              کلمات:{" "}
              {
                editor
                  .getText()
                  .split(/\s+/)
                  .filter((word) => word.length > 0).length
              }
            </span>
            <span>کاراکترها: {editor.getText().length}</span>
          </div>

          {/* ویرایشگر اصلی */}
          <div className="editor bg-[var(--inputback)] border-t border-white/50 rounded-b-lg p-4 min-h-[400px] prose prose-lg max-w-none">
            <EditorContent editor={editor} />
          </div>

          <div
            className={`seoData w-[98%] transition flex flex-wrap justify-between m-auto mt-10 border border-[var(--boxback)] rounded-xl overflow-hidden ${seobox ? "h-auto" : "h-[80px]"}`}
          >
            <div
              className={`flex justify-between items-center px-10 w-[100%] bg-[var(--boxback)] cursor-pointer h-[80px]`}
              onClick={() => {
                if (seobox) {
                  setSeobox(false);
                } else {
                  setSeobox(true);
                }
              }}
            >
              <h2 className="seoboxtitle">باکس سئو</h2>
              <i className="">▼</i>
            </div>
            <div className="w-[100%] transition flex flex-wrap gap-5 px-10 m-auto p-1 py-7">
              <TextInput
                place="تایتل سئو"
                category={"seoTitle"}
                handlePropertyChange={handlePropertyChange}
                isNumber={false}
                value={articleMainData.seoTitle}
              />
              <TextInput
                place="متا دیسکریپشن"
                category={"seoMeta"}
                handlePropertyChange={handlePropertyChange}
                isNumber={false}
                value={articleMainData.seoMeta}
              />

              <h3 className="w-full mt-5 mb-2 mr-3">تگ کنونیکال :</h3>
              <TextInput
                place="لینک صفحه مبدا"
                category={"seoCanonikalOrigin"}
                handlePropertyChange={handlePropertyChange}
                isNumber={false}
                value={articleMainData.seoCanonikalOrigin}
              />
              <TextInput
                place="لینک صفحه مقصد"
                category={"seoCanonikalDestination"}
                handlePropertyChange={handlePropertyChange}
                isNumber={false}
                value={articleMainData.seoCanonikalDestination}
              />

              {/* <h3 className='w-full mt-5 mb-2 mr-3'>وضعیت ایندکس :</h3>
                                          <button
                                              className={`subBtn w-[48%] h-[45px] ${articleMainData.indexed === 'true' ? 'active' : ''}`}
                                              onClick={() => {
                                                  handlePropertyChange('indexed', 'true')
                                              }}
                                          >ایندکس</button>
                                          <button
                                              className={`subBtn w-[48%] h-[45px] ${articleMainData.indexed === 'false' ? 'active' : ''}`}
                                              onClick={() => {
                                                  handlePropertyChange('indexed', 'false')
                                              }}
                                          >نو ایندکس</button> */}

              <h3 className="w-full mt-5 mb-2 mr-3">ریدایرکت :</h3>
              <TextInput
                place="لینک مبدا"
                category={"seoOrigin"}
                handlePropertyChange={handlePropertyChange}
                isNumber={false}
                value={articleMainData.seoOrigin}
              />
              <TextInput
                place="لینک مقصد"
                category={"seoDestination"}
                handlePropertyChange={handlePropertyChange}
                isNumber={false}
                value={articleMainData.seoDestination}
              />

              <h3 className="w-full mt-5 mb-2 mr-3">نوع ریدایرکت :</h3>
              <button
                className={`subBtn w-[48%] h-[45px] ${articleMainData.seoRedirect === "301" ? "active" : ""}`}
                onClick={() => {
                  handlePropertyChange("seoRedirect", "301");
                }}
              >
                301
              </button>
              <button
                className={`subBtn w-[48%] h-[45px] ${articleMainData.seoRedirect === "302" ? "active" : ""}`}
                onClick={(e) => {
                  handlePropertyChange("seoRedirect", "302");
                }}
              >
                302
              </button>
            </div>
          </div>
        </div>

        <div className="sidebar sticky top-5 w-[100%] xl:w-[25%] mt-10 xl:mt-0 h-[100%] flex flex-col items-center py-4 shadow-[var(--blackshadow)] rounded-xl">
          {/* تصویر کاور  */}
          <div className="w-[90%] rounded-xl">
            <div className="flex flex-wrap h6 gap-4 items-start">
              {!coverImageName && (
                <div className="h-[150px] w-full m-auto">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    className="hidden"
                    id="cover-upload"
                  />
                  <label
                    htmlFor="cover-upload"
                    className="inline-flex flex-col justify-center w-full h-full items-center gap-2 border rounded-lg p-3 cursor-pointer"
                  >
                    <span className="text-3xl">+</span>
                    <span>انتخاب تصویر کاور</span>
                  </label>
                  {uploading && <span className="mr-3">در حال آپلود...</span>}
                </div>
              )}
              {coverImageName && (
                <>
                  <div className="relative w-[95%] h-[150px] m-auto p-0">
                    <img
                      src={coverImageName}
                      alt="cover preview"
                      className="absolute max-w-[100%] w-[100%] max-h-full object-cover border rounded-lg top-0 left-0  pointer-events-none"
                    />
                    <button
                      onClick={() => {
                        setCoverImageName("");
                      }}
                      className="absolute cursor-pointer top-1 right-1 bg-red-500 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          <span className="w-[90%] h-[1px] my-5 bg-gray-500"></span>
          <form className="w-[90%] flex flex-wrap items-center">
            <div className="w-full bg-re m-auto border p-2 rounded-xl">
              <h3 className="text-lg text-center mb-3 font-medium">
                انتخاب دسته بندی
              </h3>
              {categories && categories.length > 0 ? (
                <div className="flex flex-wrap max-h-[250px] overflow-y-scroll gap-2">
                  {categories.map((cate: any, idx: any) => (
                    <div key={idx} className="CheckboxInput">
                      <label
                        className={`w-full h-[45px] ${articleMainData.categories.includes(cate.name) && "active"}`}
                      >
                        <span>{cate.name}</span>
                        <input
                          type="checkbox"
                          className="custom-checkbox"
                          onChange={(e) => {
                            handleArrayFieldChange("categories", cate.name);
                          }}
                          checked={articleMainData.categories.includes(
                            cate.name,
                          )}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center font-light border border-dashed rounded-lg py-3 p-5 border-[var(--title)] mt-5">
                  <p>هیچ دسته بندی ایجاد نشده</p>
                  <Linkk
                    className="font-light"
                    href={"/userPanel/articlesManager/categories"}
                  >
                    ایجاد دسته بندی
                  </Linkk>
                </div>
              )}
            </div>
          </form>
          <span className="w-[90%] h-[1px] my-5 bg-gray-500"></span>
          <div className="w-[90%] flex flex-wrap gap-3">
            <button
              onClick={async () => {
                handlePropertyChange("active", true);
              }}
              className="subBtnRe w-full h-[50px]"
            >
              بروزرسانی و انتشار مقاله
            </button>

            <button
              onClick={async () => {
                handlePropertyChange("active", false);
              }}
              className="normBtn w-full h-[50px]"
            >
              به‌روزرسانی و پیش نویس
            </button>
          </div>
        </div>

        {/* دکمه‌های پایانی */}
        <div className="w-full mt-6 mx-2 mb-30 flex flex-wrap gap-3">
          {/* <button
                        onClick={() => {
                            if (confirm('مطمئن هستید؟ همه تغییرات پاک می‌شود.')) {
                                editor.commands.clearContent()
                                handlePropertyChange('title', '');
                                handlePropertyChange('coverImageName', '')
                            }
                        }}
                        className="transition-all duration-500 border border-red-600 text cursor-pointer hover:bg-red-600 hover:text-[var(--background)] px-6 py-3 rounded-lg font-medium"
                    >
                        پاک کردن همه
                    </button> */}
        </div>
      </div>
    </>
  );
}
