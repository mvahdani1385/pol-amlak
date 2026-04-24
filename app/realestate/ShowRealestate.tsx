"use client";

import Image from "next/image";
import Link from "next/link";
import FilterBox from "./FilterBox";
import FilesOnMap from "./FilesOnMap";
import { useState, useEffect } from "react";
import { useData } from '@/app/context/DataContext';
// import { Property } from './page';

type PropertyImage = {
  id: number;
  imageUrl: string;
  isMain: boolean;
  sortOrder: number;
};

interface data {
  city: string[] | null | undefined;
  Province: string | null | undefined;
}

type Property = {
  id: number;
  title: string;
  slug: string;
  propertyType: string;
  dealType: string;
  status: string;
  city: string | null;
  district: string | null;
  price: number | null;
  depositPrice: number | null;
  rentPrice: number | null;
  pricePerMeter: number | null;
  images: PropertyImage[];
  createdAt: string;
  roomNumber: string;
  landArea: string;
};

async function getProperties() {
  const origin = "http://localhost:3000";
  const apiPath = "/api/properties";

  let queryString = "";
  const url = new URL(window.location.href);
  if (url.href.split("?").length > 1) {
    const fullUrl = url.href.split("?")[1];
    queryString = "?" + fullUrl;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiPath}${queryString}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("خطا در دریافت املاک");
  }
  return res.json();
}

const ShowRealestate = () => {
  const [Filters, setFilters] = useState("");
  const [filterbox, setFilterbox] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [finalProperties, setFinalProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error

  const [mapStatus, setMapStatus] = useState(false);
  
  const { dynamicdata, dynamicloading, dynamicerror, refetch } = useData();

  const [page, setPage] = useState(9);
  const [count, setCount] = useState(1);

  const [citys, setCitys] = useState<data[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        let data = await getProperties();
        setProperties(data);
        setFinalProperties(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

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

  const handlepage = (goTO: any) => {
    setPage(goTO * 9);
    setCount(goTO);
    goToTop();
  };

  const handleFilterChange = (newFilters: string) => {
    setFilters(newFilters);
    const url = new URL(window.location.href);
    url.search = `?${newFilters}`;
    window.location.href = `/realestate${url.search}`;
  };

  const handleOpenedlightbox = () => {
    const body = document.querySelector("body");
    if (filterbox) {
      setFilterbox(false);
      if (body) {
        body.style.overflow = "auto";
      }
    } else {
      setFilterbox(true);
      if (body) {
        body.style.overflow = "hidden";
      }
    }
  };

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

  useEffect(() => {
    document.title = 'املاک';
  }, []);

  useEffect(() => {
    try {
      fetch("/api/dynamicOptions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setCitys(data);
        });
    } catch (error) {
      console.error("خطا در دریافت مقادیر داینامیک سایت", error);
    }
  }, []);

  useEffect(() => {
    if (citys && citys.length > 0) {
      const filteredProp = properties.filter((fil: any) => {
        if (citys[0].city?.includes(fil.city) && fil.status === "active") {
          return fil;
        }
      });
      setFinalProperties(filteredProp);
    }
  }, [citys, properties]);

  if(dynamicloading){
    return(
      <div className="ccdiv w-full h-[60vh]">
        <p>در حال بارگذار ...</p>
      </div>
    )
  }

  return (
    <>
      <div className={`${filterbox ? "flex" : "hidden"}`}>
        <FilterBox
          filters={Filters}
          onFilterChange={handleFilterChange}
          closedlightBox={handleOpenedlightbox}
        />
      </div>
      <FilesOnMap
        allProperty={finalProperties}
        onMap={mapStatus}
        setOnMap={setMapStatus}
      />
      <div className="amlakfilterpage flex justify-end items-center flex-col w-full h-[65vh] mt-0 pb-[5vh]">
        <div className="info text-center z-1">
          <h1 className="text-7xl font-bold text-[var(--title)]">{(dynamicdata as any).siteName}</h1>
          <p className="mt-5 text-2xl font-light text-[var(--headertext)] bg[var(--title)] px3">
            {(dynamicdata as any).siteTarget}
          </p>
        </div>
        <div className="searchBox w-full flex flex-col justify-center md:flex-row relative z-1 mt-10">
          <input
            type="text"
            placeholder="نوع ملک، متراژ، قیمت، ..."
            className="w-[95%] md:w-[33%] h-[60px] mr-[2.5%] border border-[var(--headertext)]/20 bg-[var(--background)] cursor-pointer outline-none rounded-xl px-6"
            onClick={() => {
              handleOpenedlightbox();
            }}
          />
          <button
            onClick={() => {
              handleOpenedlightbox();
            }}
            className="absolute w-[35%] md:w-[10%] h-[45px] pb-1 top-[7.5px] rounded-xl right-[60%] md:right-[51%] cursor-pointer border border-[var(--headertext)]/20"
          >
            جست و جو
          </button>
          <button
            onClick={() => {
              setMapStatus(true);
            }}
            className="w-[95%] flex items-center justify-center gap-2 mt-5 md:mt-0 md:w-[12%] h-[58px] pb-1 top-[7.5px] rounded-xl mr-[10px] cursor-pointer bg-[var(--background)] border border-[var(--headertext)]/20"
          >
            <i className="ri-map-2-line"></i>جست و جو با نقشه
          </button>
        </div>
      </div>
      <div className="container melka comments w-[90%] md:w-[80%] mr-[5%] md:mr-[10%] py-10 mt-0 md:mt-[-3vh]">
        <div className="mx-auto max-w-6xl space-y-6">
          {finalProperties.length === 0 ? (
            <div className="rounded-xl border border-dashed border p-8 text-center">
              هیچ ملکی برای نمایش وجود نداره
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
              {[...finalProperties].slice(page - 9, page).map((p) => {
                const mainImage =
                  p.images?.find((img) => img.isMain) ?? p.images?.[0];

                return (
                  <Link
                    key={p.id}
                    href={`/realestate/${encodeURIComponent(p.slug)}`}
                    className="relative overflow-hidden rounded-xl border p-3 pb-5 border-[var(--title)]/20 shadow-[var(--blackshadow)] transition flex flex-col justify-start"
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
                    <div className="info p-5 pb-2 mb-[40px]">
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
                      <p className="absolute subBtn bottom-[20px] w-[85%] mr-[-2%] h-[25px] mt-3 font-light text-sm text-center text-[var(--title)] transition hover:text-[var(--foreground)]">
                        مشاهده جزئیات
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        {[...finalProperties].length > 9 && (
          <div className="pageCouner w-full flex justify-center my-10 gap-2">
            {[...finalProperties].length > page ? (
              <button
                onClick={(event) => {
                  event.preventDefault();
                  if ([...finalProperties].length) setPage(page + 9);
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
            {[...finalProperties].length > page + 18 && (
              <p
                className="text-[var(--textdisable)]/10 border w-[25px] h-[25px] ccdiv rounded cursor-pointer"
                onClick={() => {
                  handlepage(count + 3);
                }}
              >
                {count + 3}
              </p>
            )}
            {[...finalProperties].length > page + 9 && (
              <p
                className="text-[var(--textdisable)]/30 border w-[25px] h-[25px] ccdiv rounded cursor-pointer"
                onClick={() => {
                  handlepage(count + 2);
                }}
              >
                {count + 2}
              </p>
            )}
            {[...finalProperties].length > page && (
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
    </>
  );
};

export default ShowRealestate;
