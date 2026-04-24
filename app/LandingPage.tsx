"use client";

import Image from "next/image";
import Link from "next/link";
import FilterBox from "@/app/realestate/FilterBox";
import FilesOnMap from "@/app/realestate/FilesOnMap";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
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
  isFeatured: boolean;
  isConvertible: boolean;
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
        if (fil.isFeatured === true && fil.status === "active") {
          return fil;
        }
      });
      setFinalProperties(filteredProp);
    }
  }, [citys, properties]);

  return (
    <>
      <div className="container melka comments w-[90%] md:w-[80%] mr-[5%] md:mr-[10%] py-10 mt-20 md:mt-10">
        <div className="mx max-w-6xl space-y-6">
          <div className="title flex flex-wrap gap-3 text-4xl text-[var(--title)]">
            <i className="ri-home-line"></i>
            <h2 className="font-bold">ملک های ویژه</h2>
            <p className="w-full text-lg text-[var(--foreground)] md:mr-[50px]">توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به</p>
          </div>
          {finalProperties.length === 0 ? (
            <div className="rounded-xl border border-dashed border p-8 mt-5 text-center">
              هیچ ملکی برای نمایش وجود نداره
            </div>
          ) : (
            <div className="mt-8">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                // pagination={{ clickable: true }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                autoHeight={false}
                watchSlidesProgress={true}
                slidesPerGroup={1}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 40,
                  },
                }}
                className="property-slider h-full px-50"
              >
                {[...finalProperties].slice(0, 9).map((p) => {
                  const mainImage =
                    p.images?.find((img) => img.isMain) ?? p.images?.[0];

                  return (
                    <SwiperSlide key={p.id} className="h-fit">
                      <Link
                        href={`/realestate/${encodeURIComponent(p.slug)}`}
                        className="relative h-full overflow-hidden rounded-xl border p-3 pb-5 border-[var(--title)]/20 transition flex flex-col justify-start"
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
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShowRealestate;
