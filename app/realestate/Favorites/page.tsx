"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import Header from "@/app/components/themes/Header";
import Footer from "@/app/components/themes/Footer";
import Breadcrumbs from "@/app/components/themes/Breadcrumbs";

function Requester() {
  const [userFavorites, setUserFavorites] = useState<string[]>([]);
  const [property, setProperty] = useState<any[]>([]);
  const [prop, setProp] = useState<any[]>([]);

  const [page, setPage] = useState(9);
  const [count, setCount] = useState(1);

  useEffect(() => {
    const favorites = localStorage.getItem("userFavorites");
    if (favorites) {
      setUserFavorites(JSON.parse(favorites));
    }
    fetch("/api/properties", {
      method: "GET",
      headers: {},
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok " + res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        setProperty(data);
      });
  }, []);

  useEffect(() => {
    if (!userFavorites) {
      return;
    }
    if (!property || !Array.isArray(property)) {
      return;
    }
    const foundFavorite = property.filter((f: any) => {
      return userFavorites.includes(f.slug);
    });
    setProp(foundFavorite);
  }, [property, userFavorites]);

  function slice33(number: number) {
    let numStr = String(number);
    let result = "";
    let count = 0;
    for (let i = numStr.length - 1; i >= 0; i--) {
      result = numStr[i] + result;
      count++;
      if (count === 3 && i > 0) {
        result = "," + result;
        count = 0;
      }
    }
    return result;
  }

  const goToTop = () => {
    const targetElement = document.querySelector(".melka");
    if (targetElement) {
      setTimeout(() => {
        const offset = 200;
        const elementPosition =
          targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }, 50);
    }
  };

  useEffect(() => {
    document.title = 'علاقه مندی ها';
  }, []);

  const handlepage = (goTO: any) => {
    setPage(goTO * 9);
    setCount(goTO);
    goToTop();
  };

  const handleDelete = (slugToDelete: string) => {
    const storedFavoritesString = localStorage.getItem("userFavorites");

    let currentFavorites: string[] = [];

    if (storedFavoritesString) {
      try {
        currentFavorites = JSON.parse(storedFavoritesString);
        if (!Array.isArray(currentFavorites)) {
          currentFavorites = [];
        }
      } catch (error) {
        console.error("Error parsing favorites from localStorage:", error);
        currentFavorites = [];
      }
    }

    const updatedFavorites = currentFavorites.filter(
      (favSlug) => favSlug !== slugToDelete,
    );

    localStorage.setItem("userFavorites", JSON.stringify(updatedFavorites));

    setUserFavorites(updatedFavorites);
    toast.success("فایل از مورد علاقه ها حذف شد");
    console.log(`Slug "${slugToDelete}" deleted from localStorage.`);
  };

  if (userFavorites === null) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Header />
      <div className="container melka comments w-[90%] md:w-[80%] mr-[5%] md:mr-[10%] py-10 mt-20 md:mt-40">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-wrap items-end gap-x-10 gap-y-3 pb-5 border-b border-dashed">
            <Breadcrumbs
              sitMap={[
                { name: "املاک", url: "/realestate" },
                { name: 'علاقه مندی ها', url: `/articles/Favorites` },
              ]}
            />
            <div>
              <h1 className="text-2xl font-bold">فایل های مورد علاقه</h1>
              <p className="mt-3">
                <span className="text-[var(--title)] text-lg ml-2">
                  {prop.length}
                </span>{" "}
                فایل پسندیده شده است
              </p>
            </div>
            <Link
              href={`/realestate`}
              className="subBtn w-full sm:w-[300px] h-[45px]"
            >مشاهده همه فایل های املاک</Link>
          </div>
          {prop.length === 0 ? (
            <div className="rounded-xl border border-dashed border p-8 text-center">
              هیچ ملکی برای نمایش وجود نداره
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
              {[...prop].slice(page - 9, page).map((p) => {
                const mainImage =
                  p.images?.find((img: any) => img.isMain) ?? p.images?.[0];

                return (
                  <div
                    key={p.id}
                    className="relative overflow-hidden rounded-xl border p-3 border-[var(--title)]/20 shadow-[var(--blackshadow)] transition flex flex-col justify-between"
                  >
                    {mainImage ? (
                      <div className="imagebox w-full h-[200px] overflow-hidden  rounded-lg shadow-[var(--blackshadow)]">
                        <img
                          src={mainImage.imageUrl}
                          alt={p.title}
                          className="w-full h-full object-cover transition-all duration-500 hover:scale-120"
                        />
                      </div>
                    ) : (
                      <div className="imagebox w-full h-[200px] overflow-hidden  rounded-[10_10_0_0] ccdiv">
                        <p>بدون تصویر</p>
                      </div>
                    )}
                    <div className="info p-5 pb-2">
                      <h2 className="text-xl font-light">{p.title}</h2>
                      {p.price ? (
                        <h2 className="text-xl font-light mt-2">
                          <span className="text-[var(--title)]"></span>
                          {slice33(p.price)}{" "}
                          <span className="text-[13px] text-[var(--title)]">
                            تومن
                          </span>{" "}
                        </h2>
                      ) : (
                        p.depositPrice &&
                        p.rentPrice && (
                          <>
                            <h2 className="text-xl font-light mt-2">
                              <span className="text-[var(--title)]">
                                ودیعه :{" "}
                              </span>
                              {slice33(p.depositPrice)}{" "}
                              <span className="text-[13px] text-[var(--title)]">
                                تومن
                              </span>{" "}
                            </h2>
                            <h2 className="text-xl font-light mt-2">
                              <span className="text-[var(--title)]">
                                اجاره :{" "}
                              </span>
                              {slice33(p.rentPrice)}{" "}
                              <span className="text-[13px] text-[var(--title)]">
                                تومن
                              </span>{" "}
                            </h2>
                          </>
                        )
                      )}
                      <div className="options flex flex-wrap items-center gap-2 mt-3">
                        {p.roomNumber && (
                          <div className="flex items-center gap-2">
                            <i className="">
                              <img src="/media/room.png" className="w-[20px]" />
                            </i>
                            <p>{p.roomNumber} خواب</p>
                          </div>
                        )}
                        {p.city && (
                          <div className="flex items-center gap-2">
                            <i className="">
                              <img src="/media/loca.png" className="w-[20px]" />
                            </i>
                            {p.district ? (
                              <p>
                                {p.city} - {p.district}
                              </p>
                            ) : (
                              <p>{p.city}</p>
                            )}
                          </div>
                        )}
                        {p.landArea && (
                          <div className="flex items-center gap-2">
                            <i className="">
                              <img src="/media/ruls.png" className="w-[20px]" />
                            </i>
                            <p>{p.landArea} متر</p>
                          </div>
                        )}
                      </div>
                      <div className="btns">
                        <button
                          onClick={() => {
                            handleDelete(p.slug);
                          }}
                          className="delBtn mt-5 h-[45px] w-full z-1"
                        >
                          حدف از علاقه مندی
                        </button>
                        <Link
                          className="subBtn w-full h-[45px] mt-3"
                          href={`/realestate/${encodeURIComponent(p.slug)}`}
                        >
                          مشاهده فایل
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {[...prop].length > 9 && (
          <div className="pageCouner w-full flex justify-center my-10 gap-2">
            {[...prop].length > page ? (
              <button
                onClick={(event) => {
                  event.preventDefault();
                  if ([...prop].length) setPage(page + 9);
                  setCount(count + 1);
                  goToTop();
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
            {[...prop].length > page + 18 && (
              <p
                className="text-[var(--textdisable)]/10 border w-[25px] h-[25px] ccdiv rounded cursor-pointer"
                onClick={() => {
                  handlepage(count + 3);
                }}
              >
                {count + 3}
              </p>
            )}
            {[...prop].length > page + 9 && (
              <p
                className="text-[var(--textdisable)]/30 border w-[25px] h-[25px] ccdiv rounded cursor-pointer"
                onClick={() => {
                  handlepage(count + 2);
                }}
              >
                {count + 2}
              </p>
            )}
            {[...prop].length > page && (
              <p
                className="text-[var(--textdisable)]/50 border w-[25px] h-[25px] ccdiv rounded cursor-pointer"
                onClick={() => {
                  handlepage(count + 1);
                }}
              >
                {count + 1}
              </p>
            )}
            <p className="text-[var(--title)] border w-[25px] h-[25px] ccdiv rounded cursor-none">
              {count}
            </p>
            {page - 9 > 0 && (
              <p
                className="text-[var(--textdisable)]/50 border w-[25px] h-[25px] ccdiv rounded cursor-pointer"
                onClick={() => {
                  handlepage(count - 1);
                }}
              >
                {count - 1}
              </p>
            )}
            {page - 18 > 0 && (
              <p
                className="text-[var(--textdisable)]/30 border w-[25px] h-[25px] ccdiv rounded cursor-pointer"
                onClick={() => {
                  handlepage(count - 2);
                }}
              >
                {count - 2}
              </p>
            )}
            {page - 27 > 0 && (
              <p
                className="text-[var(--textdisable)]/10 border w-[25px] h-[25px] ccdiv rounded cursor-pointer"
                onClick={() => {
                  handlepage(count - 3);
                }}
              >
                {count - 3}
              </p>
            )}
            {page - 9 !== 0 ? (
              <button
                onClick={(event) => {
                  event.preventDefault();
                  setPage(page - 9);
                  setCount(count - 1);
                  goToTop();
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
}

export default Requester;
