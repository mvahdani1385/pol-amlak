"use client";

import React, { useEffect, useState } from "react";
import { toJalaali } from "jalaali-js";
import { ArticleJsonLd } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import NewCommet from "@/app/components/NewCommet";
import Breadcrumbs from "@/app/components/themes/Breadcrumbs";
import { commands } from "@tiptap/react";

interface Props {
  content: any;
  articlsMoshabe: any;
  articlesComments: any;
}

export default function ArticleDisplay({
  content,
  articlsMoshabe,
  articlesComments,
}: Props) {
  const [titrs, setTitrs] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof document !== "undefined") {
        const h2Tags = document.querySelectorAll(".articlsStyle h2");
        const extractedTitrs: string[] = [];
        for (let i = 0; i < h2Tags.length; i++) {
          h2Tags[i].id = "section" + i;
          h2Tags[i].classList.add("section" + i);
          extractedTitrs.push(h2Tags[i].textContent);
        }
        setTimeout(() => {
          const h2Tags = document.querySelectorAll(".articlsStyle h2");
          for (let i = 0; i < h2Tags.length; i++) {
            h2Tags[i].id = "section" + i;
            h2Tags[i].classList.add("section" + i);
          }
        }, 500);
        setTitrs(extractedTitrs);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const verifiedComments = articlesComments.filter(
    (comment: any) => comment.articleId === content.id && comment.verify,
  );

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

  function goToTitle(id?: number) {
    if (id !== undefined) {
      const section = document.getElementById(`section${id}`);
      const ulLi = document.querySelectorAll(".titrs ul li");
      if (section) {
        window.scrollTo({
          top: section.offsetTop,
          behavior: "smooth",
        });
        ulLi.forEach((li) => {
          li.classList.remove("text-[var(--title)]");
        });
        ulLi[id].classList.add("text-[var(--title)]");
      } else {
        console.error(`Element with id "${id}" not found.`);
      }
    }
  }

  return (
    <>
      <div className="container px-0 md:px-10 relative m-auto flex flex-col flex-col-reverse lg:flex-row gap-10 md:mt-50 mt-25 ">
        <div className="sidbar w-[90%] lg:hidden lg:w-1/4 mr-[5%] lg:mr-0">
          <div className="category flex flex-wrap gap-3 items-start content-start w-full h-[400px]  overflow-y-scroll shadow-[var(--blackshadow)] border border-white my-3 p-5 rounded-lg  bg-[var(--inputback)]">
            <h3 className="w-full font-bold">دسته بندی ها :</h3>
            {content.categories.length > 0 && (
              <>
                {content.categories.map((category?: any, idx?: any) => {
                  return (
                    <span
                      key={idx}
                      className="px-4 border border-[var(--title)] rounded-[9999px] mx-0"
                    >
                      {category}
                    </span>
                  );
                })}
              </>
            )}
            {articlsMoshabe.length > 0 && (
              <>
                <h3 className="w-full font-bold">مقالات مشابه : </h3>
                <div className="moshabe w-full flex flex-col gap-2">
                  {articlsMoshabe.map((moshabe?: any, idx?: any) => {
                    if (moshabe.id === content.id) {
                      return;
                    }
                    let count = 0;
                    return (
                      <Link
                        href={`/articles/${moshabe.slug}`}
                        key={idx}
                        className="w-full flex border p-1 rounded-lg transition hover:border-[var(--title)]"
                      >
                        {moshabe.coverImage !== "" || undefined ? (
                          <img
                            src={moshabe.coverImage}
                            className="w-[80px] h-[80px] rounded-lg object-cover"
                          />
                        ) : (
                          <img
                            src="/media/404.jpg"
                            className="w-[80px] h-[80px] rounded-lg object-cover"
                          />
                        )}
                        <div className="info mr-3 mt-1 flex flex-col">
                          <h3 className="w-full">{moshabe.title}</h3>
                          <ul className="w-full mt-2 flex flex-wrap gap-2 justify-start">
                            {moshabe.categories
                              .filter((cat: any) =>
                                content.categories.includes(cat),
                              )
                              .map((cat: any, index: any) => (
                                <li
                                  key={index}
                                  className="text-[13px] h-[15px] ccdiv pr-2 border-r border-[var(--title)]"
                                >
                                  {cat}
                                </li>
                              ))}
                          </ul>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="content articlsStyle w-[90%] mr-[5%] lg:mr-0 md:w-3/4">
          <Breadcrumbs
            sitMap={[
              { name: "وبلاگ", url: "/articles" },
              { name: content.title, url: `/articles/${content.slug}` },
            ]}
          />

          
          {content.coverImage && (
            <div className="mt-5 w-full">
              <Image
                src={`${content.coverImage}`}
                alt={content.title}
                width={800}
                height={400}
                className="rounded-lg shadow-lg object-cover w-full h-[500px]"
              />
            </div>
          )}
          <div className="titrs w-[100%] h-fit py-5 px-5 mt-10 shadow-[var(--blackshadow)] border border-white rounded-lg bg-[var(--inputback)]">
            <h1 className="text-2xl mb-5 font-bold text-[var(--title)]">
              {content.title}
            </h1>
            <span className="text-lg font-light mb-5 mr-6">فهرست محتوا :</span>
            {titrs.length > 0 ? (
              <>
                <ul>
                  {titrs.map((title, index) => (
                    <li
                      key={index}
                      onClick={(e) => {
                        goToTitle(index);
                      }}
                      className={`cursor-pointer my-1 transition hover:text-[var(--title)]`}
                    >
                      {title}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p>هیچ عنوانی در این مقاله پیدا نشد</p>
            )}
          </div>
          <div
            className="prose lg:prose-xl max-w-none mb-8 mt-30 text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
          <div className="text-sm text-gray-500">
            {content.updatedAt &&
              (() => {
                const d = new Date(content.updatedAt);
                const j = toJalaali(d);
                return <span>{`${j.jy}/${j.jm}/${j.jd}`}</span>;
              })()}
          </div>
        </div>
        {/* sidbar */}
        <div className="sidbar sticky hidden md:block top-40 w-[90%] h-[70vh] lg:w-1/4 mr-[5%] lg:mr-0">
          <div className="category hidden lg:flex flex-wrap gap-3 items-start content-start w-full h-[100%] overflow-y-scroll  shadow-[var(--blackshadow)] border border-white my-3 p-5 rounded-lg bg-[var(--inputback)]">
            <h3 className="w-full font-bold">دسته بندی ها :</h3>
            {content.categories.length > 0 && (
              <>
                {content.categories.map((category?: any, idx?: any) => {
                  return (
                    <span
                      key={idx}
                      className="px-4 border border-[var(--title)] rounded-[9999px] mx-0"
                    >
                      {category}
                    </span>
                  );
                })}
              </>
            )}
            {articlsMoshabe.length > 0 && (
              <>
                <h3 className="w-full font-bold">مقالات مشابه : </h3>
                <div className="moshabe w-full flex flex-col gap-2">
                  {articlsMoshabe.map((moshabe?: any, idx?: any) => {
                    if (moshabe.id === content.id) {
                      return;
                    }
                    let count = 0;
                    return (
                      <Link
                        href={`/articles/${moshabe.slug}`}
                        key={idx}
                        className="w-full flex border p-1 rounded-lg transition hover:border-[var(--title)]"
                      >
                        {moshabe.coverImage !== "" || undefined ? (
                          <img
                            src={moshabe.coverImage}
                            className="w-[80px] h-[80px] rounded-lg object-cover"
                          />
                        ) : (
                          <img
                            src="/media/404.jpg"
                            className="w-[80px] h-[80px] rounded-lg object-cover"
                          />
                        )}
                        <div className="info mr-3 mt-1 flex flex-col">
                          <h3 className="w-full">{moshabe.title}</h3>
                          <ul className="w-full mt-2 flex flex-wrap gap-2 justify-start">
                            {moshabe.categories
                              .filter((cat: any) =>
                                content.categories.includes(cat),
                              )
                              .map((cat: any, index: any) => (
                                <li
                                  key={index}
                                  className="text-[13px] h-[15px] ccdiv pr-2 border-r border-[var(--title)]"
                                >
                                  {cat}
                                </li>
                              ))}
                          </ul>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="container comments w-[90%] md:w-[80%] mr-[5%] md:mr-[10%] my-30">
        <NewCommet articleId={content.id} articleSlug={content.slug} />
        {verifiedComments.length > 0 && (
          <h2 className="font-bold text-xl mr-1">
            {verifiedComments.length} دیدگاه
          </h2>
        )}
        {verifiedComments.map((comment?: any, idx?: any) => {
          if (content.id !== comment.articleId || !comment.verify) {
            return;
          }
          return (
            <div
              key={idx}
              className="comment mt-5 p-5 rounded-lg shadow-[var(--headershadow)] border border-[var(--reversbotder)]/30"
            >
              <div
                className={`usercomment  ${comment.replay && "border-b pb-3"} border-[var(--title)]`}
              >
                <div className="profile flex items-center gap-5">
                  <img
                    src="/media/user.png"
                    className="w-[40px] h-[40px] rounded-full"
                  />
                  <p className="text-[15px] font-light text-[var(--title)]">
                    {comment.user[0]}
                  </p>
                  <p>
                    {toJalali(
                      comment.createdAt.slice(0, 10).replace(/-/g, "/"),
                    )}
                  </p>
                </div>
                <p className="mr-15 mt-3 text-lg">{comment.comment}</p>
              </div>
              {comment.replay && (
                <div className="adminComment mr-14 p-5 border-r border-[var(--title)]">
                  <p className="text-[15px]">
                    <span className="text-[var(--title)] text-lg">
                      پاسخ ادمین :{" "}
                    </span>{" "}
                    {comment.replay}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
