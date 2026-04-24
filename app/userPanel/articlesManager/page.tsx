"use client";

import React, { useState, useEffect } from "react";
import SelectInput from "@/app/components/themes/SelectInput";
import Link from "next/link";
import { toJalaali } from "jalaali-js";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import "@/app/css/themes.css";
import { useSearchParams } from "next/navigation";

interface ArticleProps {
  id: string | number;
  title: string;
  coverImage: string;
  excerpt: string;
  slug: string;
  updatedAt: string;
  categories: any;
  active: boolean;
  seoDestination: String;
  createdAt: bigint;
}

function ArticlesManager() {
  const [articles, setArticles] = useState<ArticleProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [categories, setCategories] = useState<any>();
  const [filterCategories, setFilterCategories] = useState<string[]>(["همه"]);

  const [getAgain, setGetAgain] = useState(0);

  function toJalali(dateString: string): string {
    const [gYear, gMonth, gDay] = dateString.slice(0, 10).split("/");

    const gy = parseInt(gYear, 10);
    const gm = parseInt(gMonth, 10);
    const gd = parseInt(gDay, 10);

    const gregorianDate = new Date(gy, gm - 1, gd);

    const jalaliResult = toJalaali(gregorianDate);
    if (
      !jalaliResult ||
      !jalaliResult.jy ||
      !jalaliResult.jm ||
      !jalaliResult.jd
    ) {
      return "تاریخ نامعتبر";
    }

    const jalaliDate = `${jalaliResult.jy}/${String(jalaliResult.jm).padStart(2, "0")}/${String(jalaliResult.jd).padStart(2, "0")}`;
    return jalaliDate;
  }

  const [filters, setFilters] = useState({
    category: "همه",
    status: "همه",
    date: "جدیدترین ها",
  });

  let filteredArticles = articles.filter((articl) => {
    const matchTitle = articl.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchCategory =
      filters.category === "همه"
        ? true
        : articl.categories.includes(filters.category);

    let matchStatus = true;

    if (filters.status === "منتشر شده") {
      matchStatus = articl.active === true;
    } else if (filters.status === "پیش نویس") {
      matchStatus = articl.active === false;
    }

    return matchTitle && matchCategory && matchStatus;
  });

  // مرتب‌سازی بر اساس تاریخ
  if (filters.date === "جدیدترین ها") {
    filteredArticles = filteredArticles.sort(
      (a, b) =>
        new Date(Number(b.createdAt)).getTime() - new Date(Number(a.createdAt)).getTime()
    );
  } else if (filters.date === "قدیمی ترین ها") {
    filteredArticles = filteredArticles.sort(
      (a, b) =>
        new Date(Number(b.createdAt)).getTime() - new Date(Number(a.createdAt)).getTime()
    );
  }

  const handlePropertyChange = async (key: string, value: any) => {
    await setFilters((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    console.log(filters);
  }, [filters]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/articles");
        if (!response.ok) {
          throw new Error(`خطای HTTP: ${response.status}`);
        }
        const data: ArticleProps[] = await response.json();
        setArticles(data);
      } catch (err) {
        console.error("خطا در دریافت مقالات:", err);
        setError("خطا در بارگیری مقالات. لطفاً بعداً دوباره امتحان کنید.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [getAgain]);

  const handleDelete = async (slug: any, idx: any, seoDestination: any) => {
    // Check if article has redirect
    if (seoDestination && seoDestination.trim() !== "") {
      // Article has redirect - ask for edit first
      const editResult = await Swal.fire({
        title: 'ویرایش ریدایکت',
        text: 'آیا مایلید ریدایرکت را ویرایش کنید!!!؟',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'بله, ویرایش',
        cancelButtonText: 'خیر'
      });

      if (editResult.isConfirmed) {
        const { value: redLink } = await Swal.fire({
          title: 'ویرایش ریدایرکت',
          input: 'text',
          inputLabel: 'لطفا لینک مورد نظر را ویرایش کنید:',
          inputPlaceholder: 'https://example.com',
          inputValue: seoDestination,
          showCancelButton: true,
          confirmButtonText: 'ویرایش',
          cancelButtonText: 'انصراف',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          inputValidator: (value) => {
            if (!value) {
              return 'لطفا لینک را وارد کنید';
            }
          }
        });

        if (redLink && redLink.trim() !== "") {
          try {
            const response = await fetch(`/api/articles/${slug}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                seoDestination: redLink,
              }),
            });

            if (response.ok) {
              setGetAgain(prev => prev === 0 ? 1 : 0);
              toast.success("Redirect edited successfully");
            } else {
              toast.error("Error editing redirect");
            }
            return;
          } catch (error) {
            console.error("Error editing redirect:", error);
            toast.error("Error editing redirect");
            return;
          }
        }
      }

      // User said no to edit, ask for delete redirect
      const deleteResult = await Swal.fire({
        title: 'حذف ریدایرکت',
        text: 'آیا مایلید ریدایرکت این مقاله را حذف کنید!!!؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'بله, حذف',
        cancelButtonText: 'خیر'
      });

      if (deleteResult.isConfirmed) {
        try {
          const response = await fetch(`/api/articles/${slug}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              seoDestination: "",
            }),
          });

          if (response.ok) {
            setGetAgain(prev => prev === 0 ? 1 : 0);
            toast.success("Redirect deleted successfully");
          } else {
            toast.error("Error deleting redirect");
          }
          return;
        } catch (error) {
          console.error("Error deleting redirect:", error);
          toast.error("Error deleting redirect");
          return;
        }
      }

      // User said no to delete redirect, ask for delete article
      const deleteArticleResult = await Swal.fire({
        title: 'حذف مقاله',
        text: 'آیا مایلید این مقاله را حذف کنید!!!؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'بله, حذف',
        cancelButtonText: 'خیر'
      });

      if (deleteArticleResult.isConfirmed) {
        try {
          const response = await fetch(`/api/articles/${slug}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            toast.success("Article deleted successfully!");
            // Refresh articles list
            const fetchArticles = async () => {
              try {
                const response = await fetch("/api/articles");
                if (!response.ok) {
                  throw new Error(`HTTP error: ${response.status}`);
                }
                const data: ArticleProps[] = await response.json();
                setArticles(data);
              } catch (err) {
                console.error("Error fetching articles:", err);
                setError("Error loading articles. Please try again later.");
              } finally {
                setLoading(false);
              }
            };
            fetchArticles();
          } else {
            toast.error("Error deleting article");
          }
        } catch (error) {
          console.error("Error deleting article:", error);
          toast.error("Error deleting article");
        }
        return;
      }

      // User said no to everything - do nothing
      return;

    } else {
      // Article has no redirect - ask for create redirect first
      const createResult = await Swal.fire({
        title: 'ایجاد ریدایرکت',
        text: 'آیا مایلید این مقاله  را ریدایرکت کنید!!!؟',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'بله, ایجاد',
        cancelButtonText: 'خیر'
      });

      if (createResult.isConfirmed) {
        const { value: redLink } = await Swal.fire({
          title: 'ایجاد ریدایرکت',
          input: 'text',
          inputLabel: 'لطفا لینک مورد نظر را وارد کنید:',
          inputPlaceholder: 'https://example.com',
          showCancelButton: true,
          confirmButtonText: 'ایجاد',
          cancelButtonText: 'انصراف',
          inputValidator: (value) => {
            if (!value) {
              return 'لطفا لینک را وارد کنید';
            }
          }
        });

        if (redLink && redLink.trim() !== "") {
          try {
            const response = await fetch(`/api/articles/${slug}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                seoDestination: redLink,
              }),
            });

            if (response.ok) {
              setGetAgain(prev => prev === 0 ? 1 : 0);
              toast.success("Redirect created successfully");
            } else {
              toast.error("Error creating redirect");
            }
          } catch (error) {
            console.error("Error creating redirect:", error);
            toast.error("Error creating redirect");
          }
        }
        return;
      }

      // User said no to create redirect, ask for delete article
      const deleteArticleResult = await Swal.fire({
        title: 'حذف مقاله',
        text: 'آیا مایلید این مقاله رو حذف کنید!!!؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'بله, حذف',
        cancelButtonText: 'خیر'
      });

      if (deleteArticleResult.isConfirmed) {
        try {
          const response = await fetch(`/api/articles/${slug}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            toast.success("Article deleted successfully!");
            // Refresh articles list
            const fetchArticles = async () => {
              try {
                const response = await fetch("/api/articles");
                if (!response.ok) {
                  throw new Error(`HTTP error: ${response.status}`);
                }
                const data: ArticleProps[] = await response.json();
                setArticles(data);
              } catch (err) {
                console.error("Error fetching articles:", err);
                setError("Error loading articles. Please try again later.");
              } finally {
                setLoading(false);
              }
            };
            fetchArticles();
          } else {
            toast.error("Error deleting article");
          }
        } catch (error) {
          console.error("Error deleting article:", error);
          toast.error("Error deleting article");
        }
        return;
      }

      // User said no to everything - do nothing
      return;
    }
  };

  const handleActive = async (slug: any, status: any) => {
    try {
      await fetch(`/api/articles/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          active: status,
        }),
      });
      toast.success("عملیات با موفقیت انجام شد!");
      setGetAgain((prev) => (prev === 0 ? 1 : 0));
    } catch (error) {
      console.error("مشکل در تغییر وضعیت انتشار مقاله", error);
    }
  };

  useEffect(() => {
    try {
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
    } catch (error) {
      console.error("خطا در دریافت دستهبندی ها در ص ادمین وبلاگ", error);
    }
  }, []);

  useEffect(() => {
    document.title = 'ادمین پنل | وبلاگ';
  }, []);

  useEffect(() => {
    if (Array.isArray(categories)) {
      categories.forEach((cate) => {
        setFilterCategories((prev) => [...prev, cate.name]);
      });
    }
    console.log(filterCategories);
  }, [categories]);

  return (
    <div className="container comments w-[90%] md:w-[80%] m-auto">
      <div className="backs flex gap-8 w-full justify-end text-xl cursor-pointer mt-5">
        <Link href={`/userPanel`}><i className="tabBtn ri-arrow-go-back-line"></i></Link>
        <Link href={'/userPanel'}><i className="tabBtn ri-home-line"></i></Link>
      </div>
      <h2 className="text-3xl font-bold mt-0 md:mt-0 text-center">مقالات منتشر شده</h2>
      <p className="text-center text-lg mt-2">
        تعداد مقالاتی که تا کنون منتشر کرده اید{" "}
        <span className="text-[var(--title)]">{filteredArticles.length}</span>{" "}
        عدد است.
      </p>
      <div className="head">
        <div className="btns flex gap-5 my-2">
          <Link
            href={"/userPanel/articlesManager/new"}
            className="subBtn w-[200px] h-[45px]"
          >ایجاد مقاله جدید</Link>
          <Link
            href={"/userPanel/articlesManager/categories"}
            className="subBtn w-[200px] h-[45px]"
          >دسته بندی ها
          </Link>
        </div>
        <div className="flex flex-wrap gap-2 items-center w-[80%] md:w-full mt-5">
          <div className="textInput">
            <label>جست و جو کنید :</label>
            <input
              type="text"
              placeholder="جستجو بر اساس عنوان مقاله..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-[45px]"
            />
          </div>
          {filterCategories.length > 0 && (
            <SelectInput
              place="فیلتر  بر اساس دسته بندی"
              values={filterCategories}
              category="category"
              handlePropertyChange={handlePropertyChange}
              value={filters.category}
            />
          )}

          <SelectInput
            place="فیلتر  بر اساس وضعیت انتشار"
            values={["همه", "منتشر شده", "پیش نویس"]}
            category="status"
            handlePropertyChange={handlePropertyChange}
            value={filters.status}
          />

          <SelectInput
            place="فیلتر  بر اساس تاریخ "
            values={["جدیدترین ها", "قدیمی ترین ها"]}
            category="date"
            handlePropertyChange={handlePropertyChange}
            value={filters.date}
          />
        </div>
      </div>
      {filteredArticles.length > 0 ? (
        <div
          className={`allArticles flex flex-wrap justify-start gap-[3%] my-10`}
        >
          {[...filteredArticles].map((articl: any, idx: any) => {
            return (
              <div
                key={idx}
                className="article md:w-[30%] w-[85%] mx-auto md:mx-0 my-2 rounded-xl overflow-hidden"
              >
                <span>
                  {articl.active ? (
                    <div>
                      {/* <p
                                                className='absolute rounded-full bg-[var(--headertext)] text-[var(--title)] m-2 py-1 px-4 z-1 text-green-500'
                                            >منتشر شده</p> */}
                      <button
                        className="absolute rounded-full bg-[var(--title)] bg-green-300 text-[var(--foreground)]  hover:text-[var(--inputback)] m-2 mt-2 py-1 px-4 z-1 cursor-pointer"
                        onClick={() => {
                          handleActive(articl.slug, false);
                        }}
                        title="با زدن  این دکمه کاربر های عادی این مقاله رو نمیبینن"
                      >
                        پیش نویس کردن
                      </button>
                    </div>
                  ) : (
                    <div>
                      {/* <p
                                                className='absolute rounded-full bg-[var(--headertext)] text-[var(--title)] m-2 py-1 px-4 z-1 text-red-500'
                                            >پیش نویس</p> */}
                      <button
                        className="absolute rounded-full bg-[var(--title)] text-[var(--foreground)]  hover:text-[var(--inputback)] m-2 mt-2 py-1 px-4 z-1 cursor-pointer"
                        onClick={() => {
                          handleActive(articl.slug, true);
                        }}
                        title="با زدن این دکمه همه کاربر ها میتونن این مقاله روببینن"
                      >
                        منتشر کردن
                      </button>
                    </div>
                  )}
                </span>
                <div className="imagebox w-full h-[200px] overflow-hidden ccdiv">
                  {(articl.coverImage && articl.coverImage !== null) || "" ? (
                    <img
                      src={articl.coverImage}
                      className="w-full h-full object-cover transition-all duration-500 hover:scale-120"
                    />
                  ) : (
                    <p>بدون تصویر</p>
                  )}
                </div>
                <div className="info p-5 bg-[var(--inputback)]">
                  <h2 className="font-light text-xl">{articl.title}</h2>
                  <div className="flex justify-between my-4 px-2 pb-2 border-b border-[var(--placeholder)]">
                    <p className="flex gap-2 items-center">
                      <img src="/media/404.jpg" className="w-[30px] h-[30px] rounded-full" />
                      ممد وحدانی
                    </p>
                    <p>
                      {toJalali(
                        articl.updatedAt.slice(0, 10).replace(/-/g, "/"),
                      )}
                    </p>
                    {/* <p>{formattedJalaaliDate}</p> */}
                  </div>
                  <div className="btns">
                    <Link
                      href={`/userPanel/articlesManager/edite?slug=${articl.slug}`}
                      className="subBtn w-full h-[45px]"
                    >
                      ویرایش مقاله
                    </Link>
                    <div className="flex justify-between items-center h-[45px] mt-3">
                      <Link
                        className="normBtn w-[70%] h-[45px]"
                        href={`/articles/${articl.slug}`}
                      >
                        مشاهده مقاله
                      </Link>
                      <button
                        className="delBtn w-[25%] h-[45px]"
                        onClick={() => {
                          handleDelete(
                            articl.slug,
                            articl.id,
                            articl.seoDestination,
                          );
                        }}
                      >
                        {articl.seoDestination === "" ? "حذف" : "ریدایرکت"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center my-10">هیچ مقاله برای نمایش پیدا نشد</p>
      )}
    </div>
  );
}

export default ArticlesManager;
