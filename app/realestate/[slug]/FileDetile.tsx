"use client";

import { toast } from "react-toastify";
import "@/app/css/fileDetile.css";
import { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

// Direct Leaflet implementation to avoid React-Leaflet issues
const PropertyMap: React.FC<{ property: any }> = ({ property }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!property.latitude || !property.longitude || !mapContainerRef.current) {
      return;
    }

    // Import Leaflet dynamically
    import("leaflet").then((L) => {
      // Fix icon issue
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Clean up existing map if any
      if (mapRef.current) {
        mapRef.current.remove();
      }

      // Create new map
      const map = L.map(mapContainerRef.current!).setView(
        [property.latitude, property.longitude],
        13,
      );

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add marker
      const marker = L.marker([property.latitude, property.longitude]).addTo(
        map,
      );
      marker
        .bindPopup(
          `<b>${property.name || "موقعیت"}</b><br>${property.address || ""}`,
        )
        .openPopup();

      // Store map reference
      mapRef.current = map;

      // Cleanup function
      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    });
  }, [property.latitude, property.longitude, property.name, property.address]);

  if (!property.latitude || !property.longitude) {
    return null;
  }

  return (
    <div className="mt-5 rounded-xl overflow-hidden">
      <div ref={mapContainerRef} style={{ height: "400px", width: "100%" }} />
    </div>
  );
};

interface ImageData {
  propertyId: number;
  imageUrl: string;
  isMain: boolean;
  sortOrder: string;
}

interface FileDetileProps {
  property: any; // نوع دقیق‌تر property را اینجا بگذارید
  mainImage: ImageData;
  maindata: any;
  allFeatures: any;
  featuresData: any;
}

function FileDetile({
  property,
  mainImage,
  maindata,
  allFeatures,
  featuresData,
}: FileDetileProps) {
  const [countMainData, setCountMainData] = useState(7);
  const [feaCount, setFeaCount] = useState(17);
  const [desCount, setDescount] = useState("");
  const [isfav, setIsfav] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if property is in favorites on client-side
  useEffect(() => {
    const favorites = localStorage.getItem("userFavorites");
    setIsfav(favorites?.includes(property.slug) || false);
  }, [property.slug]);

  const handleShare = async () => {
    const textToShare = "این فایل رو ببین و برسی کن من که خیلی ازش خوشم اومد";
    const urlToShare = `/realestate/${property.slug}`; // لینکی که می‌خواهید کاربر به اشتراک بگذارد

    if (navigator.share) {
      try {
        await navigator.share({
          text: textToShare,
          url: urlToShare,
        });
        toast.success("با موفقیت پنجره باز شد!");
      } catch (error) {
        console.error("خطا در اشتراک‌گذاری:", error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      // You can implement a custom sharing mechanism here, e.g., opening social media share links
      alert(
        "مرورگر شما از قابلیت اشتراک‌گذاری مستقیم پشتیبانی نمی‌کند. لطفاً به صورت دستی اشتراک‌گذاری کنید.",
      );
      // Example fallback (you might want to customize this):
      window.open(
        `sms:?body=${encodeURIComponent(textToShare + " " + urlToShare)}`,
      );
    }
  };

  useEffect(() => {
    // Import Leaflet dynamically and fix icon issue
    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    });
  }, []);
  const defaultPosition: [number, number] = [35.6892, 51.389];
  const mapPosition: [number, number] =
    property && property.latitude && property.longitude
      ? [property.latitude, property.longitude]
      : defaultPosition;
  const zoomLevel =
    property && property.latitude && property.longitude ? 13 : 10;

  const addFavorites = () => {
    const item = localStorage.getItem("userFavorites");
    let existingFavorites = [];
    if (item) {
      existingFavorites = JSON.parse(item);
    }
    const newItemSlug = property.slug;
    if (!(existingFavorites as any[]).includes(newItemSlug)) {
      (existingFavorites as any[]).push(newItemSlug);

      localStorage.setItem("userFavorites", JSON.stringify(existingFavorites));
      setIsfav(true);
      toast.success("این فایل با موفقیت به علاقه مندی هات اضافه شد");
    } else {
      toast.error("خطا در ثبت علاقه مندی");
    }
  };

  const removeFavorites = () => {
    const favoritesKey = "userFavorites";
    const existingFavorites =
      JSON.parse(localStorage.getItem(favoritesKey) || '[]') || [];
    const itemToRemoveSlug = property.slug;
    const indexToRemove = existingFavorites.indexOf(itemToRemoveSlug);
    if (indexToRemove !== -1) {
      existingFavorites.splice(indexToRemove, 1);
      localStorage.setItem(favoritesKey, JSON.stringify(existingFavorites));
      setIsfav(false);
      toast.success("این فایل با موفقیت از علاقه مندی هات حذف شد");
    } else {
      toast.error("خطا در حذف علاقه مندی");
    }
  };

  const formatNumber = (num: any) => {
    if (num == null || num === "") return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
      <div className="relative galery mt-5 flex flex-wrap justify-between">


        <div className="absolute ccdiv w-[120px] h-[55px] text-lg rounded-bl-xl bg-[var(--background)] gap-3 z-10">
          {isfav ? (
            <i
              onClick={removeFavorites}
              className="tabBtn ccdiv ri-heart-fill text-red-500 cursor-pointer border w-[35px] h-[35px] rounded-lg pt-0.5"
            ></i>
          ) : (
            <i
              onClick={addFavorites}
              className="tabBtn ccdiv ri-heart-line text-[var(--title)] cursor-pointer border w-[40px] h-[40px] rounded-lg pt-0.5"
            ></i>
          )}
          <i
            onClick={handleShare}
            className="tabBtn ccdiv ri-share-line text-[var(--title)] cursor-pointer border w-[40px] h-[40px] rounded-lg pt-0.5 pr-0.5"
          ></i>
        </div>
        <div className="w-full md:w-[60%]">
          {property.images && property.images.length > 0 && (
            <>
            <div
              className="w-full h-[350px] md:h-[450px] overflow-hidden rounded-xl cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <img
                src={
                  property.images[selectedImageIndex]?.imageUrl ||
                  mainImage.imageUrl
                }
                alt={`${property.title} - تصویر اصلی`}
                className="w-full h-full object-cover"
              />
            </div>
            </>
          )}
        </div>

        {/* Right Side - Thumbnail Grid */}
        <div className="w-full mt-5 md:mt-0 md:w-[38%] flex flex-wrap justify-start gap-[2%] md:justify-between gap-y-[20px]">
          {property.images && property.images.length > 0 && (
            <>
              {property.images
                .sort(
                  (a: ImageData, b: ImageData) =>
                    parseInt(a.sortOrder) - parseInt(b.sortOrder),
                )
                .slice(0, 3)
                .map((img: ImageData, index: number) => (
                  <div
                    key={img.sortOrder}
                    className="w-[23%] md:w-[48%] h-[85px] md:h-[215px] overflow-hidden rounded-xl cursor-pointer transition-transform hover:scale-105"
                    onClick={() => {
                      setSelectedImageIndex(index);
                      setIsModalOpen(true);
                    }}
                  >
                    <img
                      src={img.imageUrl}
                      alt={`${property.title} - ${img.sortOrder}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}

              {/* Show More Button if more than 4 images */}
              {property.images.length > 4 && (
                <div
                  className="w-[23%] md:w-[48%] h-[85px] md:h-[215px] overflow-hidden rounded-xl cursor-pointer transition-transform hover:scale-105 bg-[var(--inputback)] flex items-center justify-center"
                  onClick={() => {
                    setSelectedImageIndex(4);
                    setIsModalOpen(true);
                  }}
                >
                  <div className="text-center p-4">
                    <i className="ri-image-line text-sm md:text-3xl text-[var(--title)] mb-2"></i>
                    <p className="text-sm font-medium text-[var(--title)]">
                      +{property.images.length - 4} <br />
                      <span className="text-xs hidden md:block">
                        مشاهده تصاویر بیشتر
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Image Modal with Zoom */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-[9999] flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative max-w-6xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-70 transition z-10"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>

            {/* Navigation Buttons */}
            {property.images && property.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev === 0 ? property.images.length - 1 : prev - 1,
                    )
                  }
                  className="fixed right-8 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full w-14 h-14 flex items-center justify-center hover:bg-opacity-70 hover:scale-110 transition-all duration-300 cursor-pointer z-[10000]"
                >
                  <i className="ri-arrow-right-line text-2xl"></i>
                </button>
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev === property.images.length - 1 ? 0 : prev + 1,
                    )
                  }
                  className="fixed left-8 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full w-14 h-14 flex items-center justify-center hover:bg-opacity-70 hover:scale-110 transition-all duration-300 cursor-pointer z-[10000]"
                >
                  <i className="ri-arrow-left-line text-2xl"></i>
                </button>
              </>
            )}

            {/* Main Image in Modal */}
            <div
              className="flex flex-col items-center justify-center"
              style={{ maxHeight: "90vh" }}
            >
              <img
                src={property.images[selectedImageIndex]?.imageUrl}
                alt={`${property.title} - ${selectedImageIndex + 1}`}
                className="max-w-full max-h-[70vh] object-contain"
                style={{ cursor: "zoom-in" }}
                onClick={(e) => {
                  e.stopPropagation();
                  const img = e.target as HTMLImageElement;
                  if (img.style.cursor === "zoom-in") {
                    img.style.cursor = "zoom-out";
                    img.style.transform = "scale(2)";
                    img.style.transition = "transform 0.3s ease";
                  } else {
                    img.style.cursor = "zoom-in";
                    img.style.transform = "scale(1)";
                  }
                }}
              />

              {/* Thumbnail Strip */}
              {property.images && property.images.length > 1 && (
                <div className="flex gap-2 mt-4 px-4 overflow-x-auto max-w-full justify-center">
                  {property.images
                    .sort(
                      (a: ImageData, b: ImageData) =>
                        parseInt(a.sortOrder) - parseInt(b.sortOrder),
                    )
                    .map((img: ImageData, index: number) => (
                      <div
                        key={img.sortOrder}
                        className={`flex-shrink-0 w-16 h-16 overflow-hidden rounded cursor-pointer transition-all border-2 ${
                          selectedImageIndex === index
                            ? "border-white scale-110"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <img
                          src={img.imageUrl}
                          alt={`${property.title} - ${img.sortOrder}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Image Counter */}
            {property.images && property.images.length > 1 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full">
                {selectedImageIndex + 1} / {property.images.length}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="container h-fit flex flex-wrap mt-10 pb-50 flex-row-reverse">
        <div className="sidebar md:sticky top-50 w-[100%] h-fit md:w-[40%]">
          <div className="box w-[100%] md:w-[90%] m-auto md:mr-[10%] p-5 px-6 border border-[var(--title)] rounded-xl">
            <h1 className="font-bold text-lg">{property.title}</h1>
            {property.price ? (
              <h2 className="font-medium text-lg mt-3">
                قیمت کل :
                <span className="text-[var(--title)]">
                  {formatNumber(property.price)}
                </span>
              </h2>
            ) : (
              property.depositPrice &&
              property.rentPrice && (
                <>
                  <h2 className="font-medium text-lg mt-3">
                    قیمت رهن :
                    <span className="text-[var(--title)]">
                      {formatNumber(property.depositPrice)}
                    </span>
                  </h2>
                  <h2 className="font-medium text-lg mt-1">
                    قیمت اجاره :
                    <span className="text-[var(--title)]">
                      {formatNumber(property.rentPrice)}
                    </span>
                  </h2>
                </>
              )
            )}
            <div className="btns flex flex-wrap mt-5 justify-between px-0 gap-y-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(property.id);
                  toast.success("کد با موفقیت کپی شد");
                }}
                className="w-[145px] md:w-[190px] ccdiv h-[50px] shadow-[var(--blackshadow)] bg-[var(--inputback)] flex gap-3 rounded-lg border border-[var(--reversbotder)]/10 transition cursor-pointer hover:shadow-none hover:border-[var(--reversbotder)]/50"
              >
                <i className="ri-file-copy-line"></i>{" "}
                <p>کپی کد : {property.id}</p>
              </button>
              <button
                onClick={() => {
                  handleShare();
                }}
                className="w-[145px] md:w-[190px] ccdiv h-[50px] shadow-[var(--blackshadow)] bg-[var(--inputback)] flex gap-3 rounded-lg border border-[var(--reversbotder)]/10 transition cursor-pointer hover:shadow-none hover:border-[var(--reversbotder)]/50"
              >
                <i className="ri-share-fill"></i> <p>اشتراک گذاری</p>
              </button>
            </div>
            <div className="info mt-8 flex flex-col gap-3">
              {property.ownerName !== "" && (
                <div className="flex items-center gap-3">
                  <i className="ri-user-3-line border-2 text-lg text-[var(--title)] border-[var(--title)] rounded-full shadow-[var(--yellowshadow)] h-[50px] w-[50px] ccdiv"></i>
                  <p className="font-medium text-lg">{property.ownerName}</p>
                </div>
              )}
              {property.ownerMobile !== "" && (
                <div className="flex items-center gap-3">
                  <i className="ri-phone-line border-2 text-lg text-[var(--title)] border-[var(--title)] rounded-full shadow-[var(--yellowshadow)] h-[50px] w-[50px] ccdiv"></i>
                  <a
                    href={`tel:${property.ownerMobile}`}
                    className="font-medium text-lg"
                  >
                    {property.ownerMobile}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="content w-[90%] m-auto md:w-[60%] mt-5">
          <section className="mainData">
            <h3 className="sectitle">اطلاعات پایه</h3>
            {maindata && maindata.length > 0 && (
              <div className="datainfo mt-5">
                {maindata.slice(0, countMainData).map((data: any) => {
                  const dataname = data.name;
                  return (
                    <div
                      key={data.trans}
                      className="databox border border-[var(--reversbotder)]/10"
                    >
                      <p className="text-sm">{data.trans} : </p>
                      <p className="data">{property[dataname]}</p>
                    </div>
                  );
                })}
                {countMainData <= 7 && (
                  <button
                    onClick={() => {
                      let currentIndex = 7;
                      const interval = setInterval(() => {
                        if (currentIndex <= maindata.length) {
                          setCountMainData(currentIndex);
                          currentIndex++;
                        } else {
                          clearInterval(interval);
                        }
                      }, 100);
                    }}
                    className="tabBtn"
                  >
                    + نمایش بیشتر
                  </button>
                )}
                {countMainData >= maindata.length && (
                  <button
                    onClick={() => {
                      setCountMainData(7);
                    }}
                    className="tabBtn"
                  >
                    - نمایش کمتر
                  </button>
                )}
              </div>
            )}
          </section>

          {featuresData.length > 0 && (
            <section>
              <h3 className="sectitle">امکانات ملک</h3>
              <div className="allFeatures">
                {allFeatures.slice(0, feaCount).map((fea: any) => {
                  let hasOrNot = false;
                  if (featuresData.includes(fea.name)) {
                    hasOrNot = true;
                  }
                  // else{
                  //     return
                  // }
                  return (
                    <div
                      key={fea.name}
                      className={`featurebox ccdiv ${hasOrNot ? "has" : ""}`}
                    >
                      <i
                        className={
                          fea.icon !== ""
                            ? fea.icon
                            : "ri-info-i border rounded-full w-[23px] h-[23px] text-sm ccdiv"
                        }
                      ></i>
                      <p>{fea.name}</p>
                    </div>
                  );
                })}
                <div className="btn">
                  {allFeatures.length > feaCount && (
                    <button
                      onClick={() => {
                        setFeaCount(feaCount + 17);
                      }}
                      className="tabBtn"
                    >
                      + مشاهده بیشتر
                    </button>
                  )}

                  {feaCount > 17 && (
                    <button
                      onClick={() => {
                        setFeaCount(feaCount - 17);
                      }}
                      className="tabBtn text-red-400"
                    >
                      - مشاهده کمتر
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}
          {property.description !== "<p></p>" && "" && (
            <section>
              <h3 className="sectitle">درباره ملک</h3>
              <div
                className={`description transition overflow-hidden ${desCount}`}
                dangerouslySetInnerHTML={{ __html: property.description }}
              />
              {desCount === "" ? (
                <button
                  onClick={() => {
                    setDescount("seeMore");
                  }}
                  className="tabBtn see"
                >
                  {" "}
                  +مشاهده بیشتر
                </button>
              ) : (
                <button
                  onClick={() => {
                    setDescount("");
                  }}
                  className="tabBtn see text-red-400"
                >
                  - مشاهده کمتر
                </button>
              )}
            </section>
          )}
          {property.latitude != null && property.longitude != null && (
            <section>
              <h3 className="sectitle">نمایش روی نقشه</h3>
              {property.latitude && property.longitude ? (
                <PropertyMap property={property} />
              ) : (
                <p>مقداری برای نمایش یافت نشد</p>
              )}
            </section>
          )}
        </div>
      </div>
    </>
  );
}

export default FileDetile;
