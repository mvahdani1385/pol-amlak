"use client";

import React, { useState, useEffect } from "react";
import Breadcrumbs from "@/app/components/themes/Breadcrumbs";
import { toJalaali } from "jalaali-js";
import Link from "next/link";
import Header from "@/app/components/themes/Header";
import Footer from "@/app/components/themes/Footer";
import { url } from "inspector";

// --- نوع داده برای مقالات ---
interface ArticleProps {
  id: string | number; // یا هر نوع دیگری که API برمی‌گرداند
  title: string;
  coverImage: string;
  excerpt: string;
  slug: string;
  active: boolean;
  updatedAt: string;
}

const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<ArticleProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(9);
  const [count, setCount] = useState(1);

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

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/articles");
        if (!response.ok) {
          throw new Error(`خطای HTTP: ${response.status}`);
        }
        const data: ArticleProps[] = await response.json();
        let finaldata = data.filter((da: any) => {
          return da.active === true; // <-- باید return اضافه شود
        });
        setArticles(finaldata);
      } catch (err) {
        console.error("خطا در دریافت مقالات:", err);
        setError("خطا در بارگیری مقالات. لطفاً بعداً دوباره امتحان کنید.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    document.title = 'وبلاگ';
  }, []);

  if (loading) {
    return (
      <div className="max-w-screen-lg mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-[var(--title)] mb-3 mt-40">
          وبلاگ
        </h1>
        <p className="mb-5">در حال بارگذاری</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-screen-lg mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-800 mb-8">
          مقالات
        </h1>
        <p className="text-center text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container w-[100%] md:w-[75%] mx-auto p-4 sm:p-6 lg:p-8 mt-20 md:mt-40">
        <Breadcrumbs sitMap={[{ name: "وبلاگ", url: "/articles" }]} />
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-right text-[var(--title)] mb-3 mt-5">
          وبلاگ
        </h1>
        <p className="mb-5">به روز ترین اخبار و اطلاعات املاک و قطعات شهری</p>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {articles.length === 0 && (
            <p className="w-full h-[15vh] left-0 text-center border border-dashed rounded-xl ccdiv">
              هیچ مقاله ای برای نمایش پیدا نشد
            </p>
          )}
          {[...articles]
            .reverse()
            .slice(page - 9, page)
            .map((article) => {
              if (article.active === false) {
                return;
              }
              return (
                <Link
                  href={`/articles/${article.slug}`}
                  key={article.id}
                  className="bg-[var(--boxback)] hover:shadow-none shadow-[var(--headershadow)] transition rounded-lg  overflow-hidden flex flex-col"
                >
                  {article.coverImage ? (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-60 object-cover shadow-[inset_0px_0px_10px_black]"
                    />
                  ) : (
                    <div className="w-full h-60 bg- flex items-center justify-center shadow-[inset_0px_0px_10px_black] text-[var(--foreground)] border-b border-white/20">
                      بدون تصویر
                    </div>
                  )}
                  <div className="px-7 p-5 flex flex-col flex-grow">
                    <h2 className="text-lg font text-[var(--foreground)] mb-2">
                      {article.title}
                    </h2>
                    <div className="flex justify-between px-2 pt-2 mt-1">
                      <p className="font-light flex items-center gap-2">
                        <img
                          src="/media/user.png"
                          className="w-[30px] rounded-full"
                        />
                        محمد وحدانی
                      </p>
                      <p className="font-light text-[var(--title)]">
                        {toJalali(
                          article.updatedAt.slice(0, 10).replace(/-/g, "/"),
                        )}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
        {articles.length > 9 && (
          <div className="pageCouner w-full flex justify-center my-10 gap-2">
            {articles.length > page ? (
              <button
                onClick={(event) => {
                  event.preventDefault();
                  if (articles.length) setPage(page + 9);
                  setCount(count + 1);
                }}
                className="cursor-pointer mx-3 transition hover:text-[var(--title)]"
              >
                بعدی
              </button>
            ) : (
              <button className="cursor-pointer mx-3 transition text-[var(--textdisable)]">
                بعدی
              </button>
            )}
            {articles.length > page + 18 && (
              <p className="text-[var(--textdisable)]/10 border w-[25px] h-[25px] ccdiv rounded">
                {count + 3}
              </p>
            )}
            {articles.length > page + 9 && (
              <p className="text-[var(--textdisable)]/30 border w-[25px] h-[25px] ccdiv rounded">
                {count + 2}
              </p>
            )}
            {articles.length > page && (
              <p className="text-[var(--textdisable)]/50 border w-[25px] h-[25px] ccdiv rounded">
                {count + 1}
              </p>
            )}
            <p className="text-[var(--title)] border w-[25px] h-[25px] ccdiv rounded">
              {count}
            </p>
            {page - 9 > 0 && (
              <p className="text-[var(--textdisable)]/50 border w-[25px] h-[25px] ccdiv rounded">
                {count - 1}
              </p>
            )}
            {page - 18 > 0 && (
              <p className="text-[var(--textdisable)]/30 border w-[25px] h-[25px] ccdiv rounded">
                {count - 2}
              </p>
            )}
            {page - 27 > 0 && (
              <p className="text-[var(--textdisable)]/10 border w-[25px] h-[25px] ccdiv rounded">
                {count - 3}
              </p>
            )}
            {page - 9 !== 0 ? (
              <button
                onClick={(event) => {
                  event.preventDefault();
                  setPage(page - 9);
                  setCount(count - 1);
                }}
                className="cursor-pointer mx-3 transition hover:text-[var(--title)]"
              >
                قبلی
              </button>
            ) : (
              <button className="cursor-pointer mx-3 transition text-[var(--textdisable)]">
                قبلی
              </button>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ArticlesPage;
