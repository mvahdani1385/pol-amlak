"use client"; // این خط را به ابتدای فایل اضافه کنید

import { useState, useEffect } from "react";
import { toJalaali } from "jalaali-js";
import Image from "next/image"; // اگر از next/image استفاده می‌کنید، نیازی به تغییر نیست
import Link from "next/link";
// import { headers } from "next/headers"; // این خط را حذف کنید چون در client component قابل استفاده نیست
import Header from "@/app/components/themes/Header";
import FilterBox from "@/app/realestate/FilterBox";
import FilesOnMap from "@/app/realestate/FilesOnMap";
import CityManager from "./CityManager";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

type PropertyImage = {
  id: number;
  imageUrl: string;
  isMain: boolean;
  sortOrder: number;
};

interface CitisDtat {
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
  landArea: String;
  updatedAt: String;
  seoDestination: String;
};

export default function SHOWaMLAKPage() {
  // async را حذف کنید
  const [properties, setProperties] = useState<Property[]>([]); // state برای نگهداری املاک
  const [filteredProp, setFilteredProp] = useState<Property[]>([]); // state برای نگهداری املاک
  const [loading, setLoading] = useState(true); // state برای نمایش وضعیت بارگذاری
  const [error, setError] = useState<string | null>(null); // state برای نمایش خطا
  const [moduleStatus, setModuleStatus] = useState(false);
  const [changestatus, setChangestatus] = useState(3);

  const [mapStatus, setMapStatus] = useState(false);

  const [citis, setCitis] = useState<CitisDtat[]>([]);

  const [pageCount, setPageCount] = useState(9);

  const [Filters, setFilters] = useState("");
  const [filterbox, setFilterbox] = useState(false);
  const [onFilter, setOnFilter] = useState("");

  // تابع fetch Properties را در useEffect فراخوانی کنید
  useEffect(() => {
    const fetchProperties = async () => {
      const origin = window.location.origin;
      const url = new URL(window.location.href);
      if (Filters !== "") {
        url.search = `?${Filters}`;
      }
      window.history.pushState({}, "", url);
      try {
        const res = await fetch(`${origin}/api/properties?${Filters}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("خطا در دریافت املاک");
        }

        const data: Property[] = await res.json();
        setProperties(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("خطایی ناشناخته رخ داد");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [Filters, changestatus]);

  useEffect(() => {
    let filteredPropertis = properties.filter((prop: any) => {
      if (onFilter === "") {
        setOnFilter("all");
      }
      if (onFilter === "all") {
        return properties;
      } else if (onFilter === "true") {
        return prop.status === "active";
      } else {
        return prop.status === "deactive";
      }
    });
    setFilteredProp(filteredPropertis);
  }, [onFilter, properties]);

  // const handleonfiltered = () => {
  //   let filteredPropertis = properties.filter((prop: any) => {
  //     if (onFilter === "all") {
  //       return properties;
  //     } else if (onFilter === "true") {
  //       return prop.status === "active";
  //     } else {
  //       return prop.status === "deactive";
  //     }
  //   });
  //   setFilteredProp(filteredPropertis);
  // };

  function slice33(number: number | null | undefined): string {
    if (number === null || number === undefined) return "";
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

  const handleFilterChange = (newFilters: string) => {
    setFilters(newFilters);
    if (newFilters === "") {
      const url = new URL(window.location.href);
      url.search = ``;
      window.history.pushState({}, "", `/userPanel/realestate${url.search}`);
    }
  };

  useEffect(() => {
    const url = new URL(window.location.href).href.split("?")[1];
    if (url !== undefined) {
      setFilters(url);
    }
  }, []);

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

  async function handlechangestatus(slug: any, change: any) {
    try {
      let newStatus = "";
      if (change === "active") {
        newStatus = "deactive";
      } else if (change === "deactive") {
        newStatus = "active";
      }

      // Show loading state
      toast.info("در حال انجام ...");

      // API call with proper headers
      const response = await fetch(`/api/properties/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: slug,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.statusText}`);
      }

      // Update local state immediately after successful API call
      setProperties((prevProperties) =>
        prevProperties.map((prop) =>
          prop.slug === slug ? { ...prop, status: newStatus } : prop,
        ),
      );

      // Trigger data refresh with a unique timestamp
      const timestamp = Date.now();
      setChangestatus(timestamp);

      toast.success("وضعیت با موفقیت تغییر کرد");
    } catch (error) {
      console.error("error in property status change", error);
      toast.error("خطا در تغییر وضعیت");
    }
  }

  // useEffect(() => {
  //   console.log(changestatus);
  // }, [changestatus]);

  function deleteDelte(slug: any) {
    try {
      fetch(`/api/properties/${slug}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ slug: slug }),
      })
        .then((response) => {
          if (!response.ok) {
            console.error("Failed to delete property:", response.statusText);
            toast.error("حذف ملک با خطا مواجه شد.");
            return;
          }
          toast.success("ملک با موفقیت حذف شد.");
          setProperties((prevProperties) =>
            prevProperties.filter((p) => p.slug !== slug),
          );
          setFilteredProp(properties);
        })
        .catch((error) => {
          console.error("Error during delete:", error);
          alert("خطایی در حین حذف رخ داد.");
        });
    } catch (error) {
      console.error("Unexpected error in handleDelete:", error);
      throw error;
    }
  }

  async function createRedirect(slug: any) {
    try {
      const { value: redLink } = await Swal.fire({
        title: "ایجاد ریدایرکت",
        input: "text",
        inputLabel: "لطفا لینک مورد نظر را وارد کنید:",
        inputPlaceholder: "https://example.com",
        showCancelButton: true,
        confirmButtonText: "ایجاد",
        cancelButtonText: "انصراف",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        inputValidator: (value) => {
          if (!value) {
            return "لطفا لینک را وارد کنید";
          }
        },
      });

      if (!redLink) {
        return;
      }

      if (redLink.trim() === "") {
        toast.warn("مقدار ریدایرکت خالی بود مجددا اقدام نمایید");
        return;
      }

      const response = await fetch(`/api/properties/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: slug,
          seoDestination: redLink,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create redirect: ${response.statusText}`);
      }

      // Trigger data refresh
      const timestamp = Date.now();
      setChangestatus(timestamp);

      return toast.success("ریدایرکت با موفقیت انجام شد");
    } catch (error) {
      console.error("خطا در ایجاد ریدایرکت", error);
      return toast.error("در انجام ریدایرکت مشکلی پیش آمده است");
    }
  }

  async function editeRedirect(slug: any, redirect: any) {
    try {
      const { value: redLink } = await Swal.fire({
        title: "ویرایش ریدایرکت",
        input: "text",
        inputLabel: "لطفا لینک مورد نظر را وارد کنید:",
        inputPlaceholder: "https://example.com",
        inputValue: redirect,
        showCancelButton: true,
        confirmButtonText: "ویرایش",
        cancelButtonText: "انصراف",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        inputValidator: (value) => {
          if (!value) {
            return "لطفا لینک را وارد کنید";
          }
        },
      });

      if (!redLink) {
        return;
      }

      const response = await fetch(`/api/properties/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: slug,
          seoDestination: redLink,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to edit redirect: ${response.statusText}`);
      }

      // Trigger data refresh
      const timestamp = Date.now();
      setChangestatus(timestamp);

      return toast.success("ریدایرکت با موفقیت ویرایش شد");
    } catch (error) {
      console.error("خطا در ایجاد ریدایرکت", error);
      return toast.error("در انجام ریدایرکت مشکلی پیش آمده است");
    }
  }

  async function delteRedirect(slug: any) {
    try {
      let redLink = "";

      const response = await fetch(`/api/properties/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: slug,
          seoDestination: redLink,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete redirect: ${response.statusText}`);
      }

      // Trigger data refresh
      const timestamp = Date.now();
      setChangestatus(timestamp);

      return toast.success("ریدایرکت با موفقیت حذف شد");
    } catch (error) {
      console.error("خطا در ایجاد ریدایرکت", error);
      return toast.error("در انجام ریدایرکت مشکلی پیش آمده است");
    }
  }

  const handleDelete = async (slug: any, redirect: any) => {
    // Check if property has redirect
    if (redirect && redirect.trim() !== "") {
      // Property has redirect - ask for edit first
      const editResult = await Swal.fire({
        title: "ویرایش ریدایرکت",
        text: "آیا مایلید ریدایرکت این ملک را ویرایش کنید!؟",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "var(--title)",
        cancelButtonColor: "red",
        confirmButtonText: "بله, ویرایش",
        cancelButtonText: "خیر",
      });

      if (editResult.isConfirmed) {
        await editeRedirect(slug, redirect);
        return;
      }

      // User said no to edit, ask for delete redirect
      const deleteResult = await Swal.fire({
        title: "حذف ریدایرکت",
        text: "آیا مایلید ریدایرکت این ملک را حذف کنید!؟",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "var(--title)",
        cancelButtonColor: "red",
        confirmButtonText: "بله, حذف",
        cancelButtonText: "خیر",
      });

      if (deleteResult.isConfirmed) {
        await delteRedirect(slug);
        return;
      }

      // User said no to delete redirect, ask for delete property
      const deletePropertyResult = await Swal.fire({
        title: "حذف خود ملک",
        text: "آیا مایلید خود ملک را حذف کنید!!؟",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "var(--title)",
        cancelButtonColor: "red",
        confirmButtonText: "بله, حذف",
        cancelButtonText: "خیر",
      });

      if (deletePropertyResult.isConfirmed) {
        deleteDelte(slug);
        return;
      }

      // User said no to everything - do nothing
      return;
    } else {
      // Property has no redirect - ask for create redirect first
      const createResult = await Swal.fire({
        title: "ایجاد ریدایرکت",
        text: "آیا مایلید  این ملک را ریدایرکت کنید!!!؟",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "var(--title)",
        cancelButtonColor: "red",
        confirmButtonText: "بله, ایجاد",
        cancelButtonText: "خیر",
      });

      if (createResult.isConfirmed) {
        await createRedirect(slug);
        return;
      }

      // User said no to create redirect, ask for delete property
      const deletePropertyResult = await Swal.fire({
        title: "حذف ملک",
        text: "آیا مایلید این ملک را حذف کنید!!!؟",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "var(--title)",
        cancelButtonColor: "red",
        confirmButtonText: "بله, حذف",
        cancelButtonText: "خیر",
      });

      if (deletePropertyResult.isConfirmed) {
        deleteDelte(slug);
        return;
      }

      // User said no to everything - do nothing
      return;
    }
  };

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
          setCitis(data);
        });
    } catch (error) {
      console.error("خطا در دریافت مقادیر داینامیک سایت", error);
    }
  }, [moduleStatus]);

  useEffect(() => {
    const body = document.querySelector("body");
    if (moduleStatus) {
      if (body) {
        body.style.overflow = "hidden";
      }
    } else {
      if (body) {
        body.style.overflow = "auto";
      }
    }
  }, [moduleStatus]);

  useEffect(() => {
    document.title = 'ادمین پنل | میدیریت املاک';
  }, []);

  // نمایش وضعیت بارگذاری یا خطا
  if (loading) {
    return (
      <div className="container comments w-[90%] md:w-[80%] mr-[5%] md:mr-[10%] py-10 mt-20 md:mt-50">
        <div className="mx-auto max-w-6xl space-y-6 text-center">
          در حال بارگذاری املاک...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container comments w-[90%] md:w-[80%] mr-[5%] md:mr-[10%] py-10 mt-20 md:mt-50">
        <div className="mx-auto max-w-6xl space-y-6 text-center text-red-500">
          خطا: {error}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* <Header /> */}
      <CityManager status={moduleStatus} setStatus={setModuleStatus} />
      <div className={`${filterbox ? "flex" : "hidden"}`}>
        <FilterBox
          filters={Filters}
          onFilterChange={handleFilterChange}
          closedlightBox={handleOpenedlightbox}
        />
      </div>
      <FilesOnMap
        allProperty={filteredProp}
        onMap={mapStatus}
        setOnMap={setMapStatus}
      />
      <div className="container comments w-[90%] md:w-[80%] mr-[5%] md:mr-[10%] py-10 mt-0 md:mt-0">
        <div className="backs flex gap-8 w-full justify-end text-xl cursor-pointer">
          <Link href={`/userPanel`}><i className="tabBtn ri-arrow-go-back-line"></i></Link>
          <Link href={'/userPanel'}><i className="tabBtn ri-home-line"></i></Link>
        </div>
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="w-full flex flex-wrap">
            <h2 className="text-2xl font-bold w-full">فایل های ایجاد شده</h2>
            <p className="my-3 font-bold w-full">
              تعداد{" "}
              <span className="text-[var(--title)] mx-1">
                {[...filteredProp].length}
              </span>{" "}
              فایل ایجاد شده
            </p>

            <div className="btns w-full flex flex-wrap gap-[4%] md:gap-5 gap-y-5 border-dashed border-t mt-5 pt-7">
              <button
                onClick={() => {
                  if (
                    citis &&
                    citis[0] &&
                    citis[0].city &&
                    citis[0].city.length > 0
                  ) {
                    window.location.href = "/userPanel/realestate/new";
                  } else {
                    toast.warn(
                      "برای ایجاد ملک ابتدا شهر حوضه فعالیت خود را مشخص کنید.",
                    );
                  }
                }}
                className="subBtn w-[48%] md:w-[180px] h-[50px]"
              >
                افزودن فایل
              </button>

              <button
                onClick={handleOpenedlightbox}
                className="subBtn w-[48%] md:w-[180px] h-[50px]"
              >
                فیلتر باکس
              </button>

              {/* <button
                onClick={()=> setMapStatus(true)}
                className="subBtn w-[180px] h-[50px]"
              >
                 انتخاب با نقشه
              </button> */}

              <button
                onClick={() => {
                  setModuleStatus(true);
                }}
                className="normBtn w-[48%] md:w-[180px] h-[50px]"
              >
                مدیریت شهر و استان
              </button>

              <Link
                className="subBtn w-[48%] md:w-[180px] h-[50px]"
                href={`/userPanel/realestate/categoris`}
              > دسته بندی ها</Link>

              <span className="w-[1px] h-[50px] bg-[var(--foreground)]/50"></span>

              {properties.length > 0 && (
                <>
                  <button
                    onClick={(e) => {
                      setOnFilter("all");
                      // handleonfiltered()
                    }}
                    className={`tabBtn px-5 ${onFilter === "all" && "active"}`}
                  >
                    همه
                  </button>

                  <span className="w-[1px] h-[50px] bg-[var(--foreground)]/50"></span>

                  <button
                    onClick={(e) => {
                      setOnFilter("true");
                      // handleonfiltered()
                    }}
                    className={`tabBtn px-5 ${onFilter === "true" && "active"}`}
                  >
                    فعال
                  </button>

                  <span className="w-[1px] h-[50px] bg-[var(--foreground)]/50"></span>

                  <button
                    onClick={(e) => {
                      setOnFilter("false");
                      // handleonfiltered()
                    }}
                    className={`tabBtn px-5 ${onFilter === "false" && "active"}`}
                  >
                    غیر فعال
                  </button>
                </>
              )}
            </div>
          </div>
          {filteredProp.length === 0 ? (
            <>
              <div className="rounded-xl border border-dashed p-8 text-center">
                فایلی برای نمایش پیدا نشد
                <br />
                <button
                  onClick={() => {
                    if (
                      citis &&
                      citis[0] &&
                      citis[0].city &&
                      citis[0].city.length > 0
                    ) {
                      window.location.href = "/userPanel/realestate/new";
                    } else {
                      toast.warn(
                        "برای ایجاد ملک ابتدا شهر حوضه فعالیت خود را مشخص کنید.",
                      );
                    }
                  }}
                  className="subBtn w-[250px] h-[45px] mx-auto mt-3"
                >
                  فایل مورد نظر جدید ثبت کنید
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-wrap justify-start gap-x-[2%] gap-y-5 md:grid-cols-2 lg:grid-cols-3">
              {[...filteredProp].slice(0, pageCount).map((p) => {
                const mainImage =
                  p.images?.find((img) => img.isMain) ?? p.images?.[0];

                return (
                  <div
                    key={p.id}
                    className="relative block w-[100%] md:w-[32%] overflow-hidden rounded-xl border p-3 pb-5 border-[var(--title)] shadow-[var(--blackshadow)] transition "
                  >
                    {p.status === "active" ? (
                      <p className="absolute top-4 right-5 bg-green-300 w-fit p-1 px-4 rounded-full text-[var(--background)] z-1">
                        ملک فعال است
                      </p>
                    ) : (
                      <p className="absolute top-4 right-5 bg-red-300 w-fit p-1 px-4 rounded-full text-[var(--background)] z-1">
                        ملک غیر فعال است
                      </p>
                    )}
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
                      <div className="flex justify-between mt-3 pb-5 px-2  border-b border-dashed">
                        <p>محمد وحدانی</p>
                        <p>
                          {toJalali(
                            p.updatedAt.slice(0, 10).replace(/-/g, "/"),
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="btns mt-2">
                      <Link
                        className="subBtn w-[90%] h-[45px] mx-auto"
                        href={`/userPanel/realestate/edite?slug=${p.slug}`}
                      >
                        ویرایش
                      </Link>
                      <div className="w-[90%] mx-auto mt-3 pt-3 flex justify-between border-t border-dashed">
                        <Link
                          className="normBtn w-[35%] h-[45px]"
                          href={`/realestate/${p.slug}`}
                        >
                          مشاهده
                        </Link>

                        <button
                          className="subBtn w-[35%] h-[45px]"
                          onClick={() => {
                            handlechangestatus(p.slug, p.status);
                          }}
                        >
                          {p.status === "active"
                            ? "غیر فعال کن"
                            : p.status === "deactive" && "فعال کن"}
                        </button>

                        <button
                          className="delBtn w-[25%] h-[45px]"
                          onClick={() => {
                            handleDelete(p.slug, p.seoDestination);
                          }}
                        >
                          {p.seoDestination !== "" ? "ریدایرکت" : "حذف"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="BtnsDown flex flex-wrap mt-5 w-full justify-center gap-10">
                {[...filteredProp].length > 9 &&
                  [...filteredProp].length >= pageCount + 1 && (
                    <button
                      onClick={() => {
                        if ([...filteredProp].length >= pageCount + 1) {
                          setPageCount(pageCount + 9);
                        }
                      }}
                      className="subBtn w-[200px] h-[45px]"
                    >
                      مشاهده بیشتر
                    </button>
                  )}
                {pageCount > 9 && (
                  <button
                    onClick={() => {
                      if (pageCount > 9) {
                        setPageCount(pageCount - 9);
                      }
                    }}
                    className="normBtn w-[200px] h-[45px]"
                  >
                    مشاهده کمتر
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
