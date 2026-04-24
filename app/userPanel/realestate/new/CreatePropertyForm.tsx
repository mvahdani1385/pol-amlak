"use client";

import { useEffect, useState, Fragment } from "react";
import { propertyFeatures } from "@/propertyFeatures.config";
import Link from "next/link";
import TextInput from "@/app/components/themes/TextInput";
import NumberInput from "@/app/components/themes/NumberInput";
import SelectInput from "@/app/components/themes/SelectInput";
import CheckboxInput from "@/app/components/themes/CheckboxInput";
import FileInput from "@/app/components/themes/FileInput";
import TextArey from "@/app/components/themes/TextArey";
import DescriptionToptop from "./DescriptionTptop";

import dynamic from "next/dynamic";
import { requestToBodyStream } from "next/dist/server/body-streams";
import { toast } from "react-toastify";

interface data {
  city: string[] | null | undefined;
  Province: string | null | undefined;
}

export default function CreatePropertyForm() {
  const [propertyData, setPropertyData] = useState<any>({
    title: "",
    slug: "",
    description: "",
    ownerName: "",
    ownerMobile: "",
    ownerPhone: "",
    propertyType: "",
    dealType: "",
    status: "فعال",
    price: "",
    rentPrice: "",
    depositPrice: "",
    city: "",
    province: "",
    isConvertible: null,
    isFeatured: null,
    latitude: null,
    longitude: null,
    statusfile: "",
    createYear: null,
    parkingnum: "",
    meterPrice: null,
    utilities: [],
    propertySpecs: [],
    occupancyStatus: "",
    buildingFacade: "ثبت نشده",
    floorCovering: "ثبت نشده",
    commonAreas: [],
    heatingCooling: [],
    kitchenFeatures: [],
    bathroomFeatures: [],
    wallCeiling: [],
    parkingTypes: [],
    otherFeatures: [],
    roomNumber: "",
    propertydirection: "ثبت نشده",
    propertyUnit: "ثبت نشده",
    propertyFloors: "",
    floor: "",
    unitInFloor: "",
    allUnit: "",
    landArea: "",
    buildingArea: "",
    categoryTitle: "",
    // --- seo ---
    seoTitle: "",
    seoMeta: "",
    seoCanonikalOrigin: "",
    seoCanonikalDestination: "",
    seoOrigin: "",
    seoDestination: "",
    seoRedirect: "301",
  });

  const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false });

  const [images, setImages] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null);
  const [fields, setFields] = useState<any[]>([]);
  const [fieldValues, setFieldValues] = useState<{
    [fieldId: number]: string;
  }>({});

  const [citys, setCitys] = useState<data[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [seobox, setSeobox] = useState(false);
  const [slugAvailability, setSlugAvailability] = useState<{
    isChecking: boolean;
    isAvailable: boolean | null;
    message: string;
  }>({
    isChecking: false,
    isAvailable: null,
    message: "",
  });

  const handleSetImages = (newImages: File[]) => {
    setImages(newImages);
    // اگر تصاویر جدیدی اضافه شد و mainImageIndex تنظیم نشده بود، اولین تصویر را به عنوان اصلی انتخاب کنید
    if (newImages.length > 0 && mainImageIndex === null) {
      setMainImageIndex(0);
    } else if (newImages.length === 0) {
      setMainImageIndex(null);
    }
  };

  const handleSetMainImageIndex = (index: number | null) => {
    setMainImageIndex(index);
  };

  const [isMobile, setIsMobile] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [dealType, setDealType] = useState<string>("خرید");

  function getPropertyTypes(dealType?: string) {
    const optionsMap = {
      فروش: [
        "آپارتمان",
        "ویلا",
        "حیاط دار",
        "زمین",
        "دفتر کار",
        "مغازه",
        "مستغلات",
        "کلنگی",
        "انبار",
        "هتل",
        "باغ",
        "دامداری",
        "مرغداری",
        "کارخانه",
        "کارگاه",
        "سوله",
        "زیرزمین",
        "سالن",
        "سوئیت",
      ],

      اجاره: [
        "آپارتمان",
        "ویلا",
        "حیاط دار",
        "دفتر کار",
        "مغازه",
        "مستغلات",
        "انبار",
        "هتل",
        "باغ",
        "دامداری",
        "مرغداری",
        "کارخانه",
        "کارگاه",
        "سوله",
        "زیرزمین",
        "سالن",
        "سوئیت",
      ],

      مشارکت: ["زمین", "کلنگی"],

      پیش‌فروش: ["آپارتمان", "ویلا", "دفتر کار", "مغازه"],

      خرید: [
        "آپارتمان",
        "ویلا",
        "حیاط دار",
        "زمین",
        "دفتر کار",
        "مغازه",
        "مستغلات",
        "کلنگی",
        "انبار",
        "هتل",
        "باغ",
        "دامداری",
        "مرغداری",
        "کارخانه",
        "کارگاه",
        "سوله",
        "زیرزمین",
        "سالن",
        "سوئیت",
      ],
    };

    type DealTypeKey = keyof typeof optionsMap;
    const validDealType =
      dealType && dealType in optionsMap ? (dealType as DealTypeKey) : "خرید";
    const types = optionsMap[validDealType] || optionsMap["خرید"];

    return [...types];
  }

  const propertyTypes = getPropertyTypes(dealType);

  const featureItems = propertyFeatures.filter(
    (item) => item.statusType === "features",
  );
  const optionItems = propertyFeatures.filter(
    (item) => item.statusType === "options",
  );

  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [expandedIds, setExpandedIds] = useState(new Set());

  const handleShowMoreClick = (itemId?: string | number) => {
    setExpandedIds((prevIds) => {
      const newIds = new Set(prevIds);
      newIds.add(itemId); // اضافه کردن شناسه آیتم کلیک شده
      return newIds;
    });
  };

  useEffect(() => {
    fetch("/api/property-fields")
      .then((res) => res.json())
      .then((data) => setFields(data));
  }, []);

  useEffect(() => {
    let editeslug = propertyData.slug.replace(/ /g, "-");
    handlePropertyChange("slug", editeslug);
  }, [propertyData.slug]);

  const handlePropertyChange = (key: string, value: any) => {
    setPropertyData((prev: any) => ({
      ...prev,
      [key]: value,
    }));

    // Check slug availability when slug changes
    if (key === "slug" && value && value.trim() !== "") {
      checkSlugAvailability(value.trim());
    } else if (key === "slug" && (!value || value.trim() === "")) {
      setSlugAvailability({
        isChecking: false,
        isAvailable: null,
        message: "",
      });
    }
  };

  const checkSlugAvailability = async (slug: string) => {
    if (slug.length < 3) {
      setSlugAvailability({
        isChecking: false,
        isAvailable: false,
        message: "نامک باید حداقل ۳ کاراکتر باشد",
      });
      return;
    }

    setSlugAvailability({
      isChecking: true,
      isAvailable: null,
      message: "در حال بررسی نامک...",
    });

    try {
      const response = await fetch(
        `/api/properties/check-slug?slug=${encodeURIComponent(slug)}`,
      );
      const data = await response.json();

      if (response.ok) {
        setSlugAvailability({
          isChecking: false,
          isAvailable: data.available,
          message: data.available ? "نامک آزاد است" : "نامک تکراری است",
        });
      } else {
        setSlugAvailability({
          isChecking: false,
          isAvailable: false,
          message: "خطا در بررسی نامک",
        });
      }
    } catch (error) {
      setSlugAvailability({
        isChecking: false,
        isAvailable: false,
        message: "خطا در اتصال به سرور",
      });
    }
  };

  useEffect(() => {
    const price = parseFloat(propertyData.price);
    const area = parseFloat(propertyData.landArea);
    let meterPrice = parseInt((price / area).toString());
    if (isNaN(meterPrice)) {
      meterPrice = 0;
    }

    handlePropertyChange("meterPrice", meterPrice);
  }, [propertyData.price, propertyData.landArea]);

  const handlePropertyCheckbox = (key: string, value: any) => {
    setPropertyData((prev: any) => {
      const currentValue = prev[key];

      let newValue: boolean;

      if (
        currentValue === false ||
        currentValue === null ||
        currentValue === undefined
      ) {
        newValue = true;
      } else {
        newValue = false;
      }

      return {
        ...prev,
        [key]: newValue,
      };
    });
  };

  // const toFinglish = (input: string) => {
  //   const map: Record<string, string> = {
  //     ا: "a",
  //     آ: "a",
  //     ب: "b",
  //     پ: "p",
  //     ت: "t",
  //     ث: "s",
  //     ج: "j",
  //     چ: "ch",
  //     ح: "h",
  //     خ: "kh",
  //     د: "d",
  //     ذ: "z",
  //     ر: "r",
  //     ز: "z",
  //     ژ: "zh",
  //     س: "s",
  //     ش: "sh",
  //     ص: "s",
  //     ض: "z",
  //     ط: "t",
  //     ظ: "z",
  //     ع: "a",
  //     غ: "gh",
  //     ف: "f",
  //     ق: "gh",
  //     ک: "k",
  //     ك: "k",
  //     گ: "g",
  //     ل: "l",
  //     م: "m",
  //     ن: "n",
  //     و: "v",
  //     ه: "h",
  //     ی: "y",
  //     ي: "y",
  //     ى: "y",
  //   };

  //   const normalized = String(input)
  //     .trim()
  //     .normalize("NFC")
  //     .replace(/[\u200C\u200D]/g, "")
  //     .replace(/ك/g, "ک")
  //     .replace(/ي|ى/g, "ی")
  //     .replace(/\s+/g, " ");

  //   let out = "";
  //   for (const ch of normalized) {
  //     if (map[ch]) {
  //       out += map[ch];
  //       continue;
  //     }
  //     if ((ch >= "0" && ch <= "9") || ch === " ") {
  //       out += ch;
  //       continue;
  //     }
  //     // keep latin letters as-is
  //     if ((ch >= "A" && ch <= "Z") || (ch >= "a" && ch <= "z")) {
  //       out += ch.toUpperCase();
  //       continue;
  //     }
  //   }

  //   return out.replace(/\s+/g, " ").trim();
  // };

  const handleFieldChange = (fieldId: number, value: string) => {
    setFieldValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setSelectedLocation(location);
    handlePropertyChange("latitude", location.lat);
    handlePropertyChange("longitude", location.lng);
  };

  const handleArrayFieldChange = (fieldName: string, value: string) => {
    const currentValues = propertyData[fieldName] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item: string) => item !== value)
      : [...currentValues, value];

    handlePropertyChange(fieldName, newValues);
  };

  const handleOtherFieldChange = (fieldName: string, value: string) => {
    handlePropertyChange(fieldName, value);
  };

  const getFeatureFieldName = (category: string): string => {
    const fieldMapping: { [key: string]: string } = {
      امتیازات: "utilities",
      "مشخصات ملک": "propertySpecs",
      "نمای ساختمان": "buildingFacade",
      "سال ساخت": "createYear",
      "تعداد پارکینگ": "parkingnum",
      مشاعات: "commonAreas",
      "تاسیسات سرمایش و گرمایش": "heatingCooling",
      "پوشش کف": "floorCovering",
      آشپزخانه: "kitchenFeatures",
      "سرویس بهداشتی و حمام": "bathroomFeatures",
      "سقف و دیوار": "wallCeiling",
      "ملک ویژه": "isConvertible",
      "قابل تبدیل": "isFeatured",
      "عرض جغرافیایی": "latitude",
      "طول جغرافیایی": "longitude",
      "نوع پارکینگ": "parkingTypes",
      "وضعیت سکونت ملک": "occupancyStatus",
      "سایر امکانات": "otherFeatures",
      "تعداد اتاق خواب": "roomNumber",
      "موقعیت ملک": "propertydirection",
      "جهت واحد": "propertyUnit",
      "تعداد کل طبقات": "propertyFloors",
      طبقه: "floor",
      "تعداد واحد ها در هر طبقه": "unitInFloor",
      "تعداد کل واحد ها": "allUnit",
      "متراژ زمین": "landArea",
      "متراژ بنا": "buildingArea",
    };
    return fieldMapping[category] || category;
  };

  const handleSubmit = async () => {
    if (propertyData.title === "") {
      toast.warn("وارد کردن عنوان الزامی است");
      return;
    }
    if (propertyData.slug === "") {
      toast.warn("وارد کردن نامک الزامی است");
      return;
    }

    // Check if slug is available before submission
    if (slugAvailability.isAvailable === false) {
      toast.error("نامک تکراری است. لطفاً نامک دیگری انتخاب کنید.");
      return;
    }

    if (slugAvailability.isChecking) {
      toast.warn("لطفاً تا بررسی نامک صبر کنید");
      return;
    }

    if (propertyData.dealType === "") {
      toast.warn("انتخاب مقدار برای نوع و وضعیت اجباری است");
      return;
    }
    if (propertyData.propertyType === "") {
      toast.warn("انتخاب مقدار برای نوع ملک اجباری است");
      return;
    }

    try {
      const uploadedImages: string[] = [];

      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(2, 8);
          const fileName = `${timestamp}-${randomString}-${image.name}`;

          const formData = new FormData();
          formData.append("file", image);
          formData.append("fileName", fileName);

          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!uploadResponse.ok) {
            throw new Error(`خطا در آپلود تصویر ${i + 1}`);
          }

          const uploadResult = await uploadResponse.json();
          uploadedImages.push(uploadResult.fileName);
        }
      }

      if ((propertyData as any).status) {
        if ((propertyData as any).status === "فعال") {
          (propertyData as any).status = "active";
        }
        if ((propertyData as any).status === "غیر فعال") {
          (propertyData as any).status = "deactive";
        }
        if ((propertyData as any).status === "فروشخته شده") {
          (propertyData as any).status = "seled";
        }
      }

      const preparedPropertyData = {
        ...propertyData,
        categoryTitle: propertyData.categoryId,
        price: propertyData.price ? Number(propertyData.price) : null,
        meterPrice: propertyData.meterPrice
          ? Number(propertyData.meterPrice)
          : null,
        createYear: propertyData.createYear
          ? Number(propertyData.createYear)
          : null,
        depositPrice: propertyData.depositPrice
          ? Number(propertyData.depositPrice)
          : null,
        rentPrice: propertyData.rentPrice
          ? Number(propertyData.rentPrice)
          : null,
        pricePerMeter: propertyData.pricePerMeter
          ? Number(propertyData.pricePerMeter)
          : null,
        latitude: propertyData.latitude ? Number(propertyData.latitude) : null,
        longitude: propertyData.longitude
          ? Number(propertyData.longitude)
          : null,
        buildingArea: propertyData.buildingArea
          ? Number(propertyData.buildingArea)
          : null,
        landArea: propertyData.landArea ? Number(propertyData.landArea) : null,
        images: uploadedImages,
        mainImageIndex: mainImageIndex ?? 0,
      };

      console.log(preparedPropertyData);

      const propertyRes = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preparedPropertyData),
      });

      if (!propertyRes.ok) {
        const errorData = await propertyRes.json().catch(() => ({}));

        if (propertyRes.status === 409 && errorData.code === "DUPLICATE_SLUG") {
          toast.error("نامک تکراری است. لطفاً نامک دیگری انتخاب کنید.");
        } else {
          toast.error(errorData.error || "خطا در ثبت ملک");
        }
        return;
      }

      const property = await propertyRes.json();

      if (Object.keys(fieldValues).length > 0) {
        const valuesArray = Object.entries(fieldValues).map(
          ([fieldId, value]) => ({
            propertyId: property.id,
            fieldId: Number(fieldId),
            value,
          }),
        );

        const fieldValuesRes = await fetch("/api/property-field-values", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            propertyId: property.id,
            values: valuesArray,
          }),
        });

        if (!fieldValuesRes.ok) {
          throw new Error("خطا در ثبت ویژگی‌های ملک");
        }
      }

      toast.success("ملک با موفقیت ثبت شد");
      // window.location.href = `/userPanel/realestate/edite?slug=${property.slug}`;
      setTimeout(() => {
        window.location.href = `/userPanel/realestate`;
      }, 500);
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("خطایی در ثبت ملک رخ داد");
    }
  };

  // function useIsMobile() {
  //   useEffect(() => {
  //     const mq = window.matchMedia("(max-width: 768px)");
  //     const handleChange = () => setIsMobile(mq.matches);
  //     handleChange();
  //     mq.addEventListener("change", handleChange);
  //     return () => mq.removeEventListener("change", handleChange);
  //   }, []);

  //   return isMobile;
  // }

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
          handlePropertyChange("province", data[0].province);
        });
    } catch (error) {
      console.error("خطا در دریافت مقادیر داینامیک سایت", error);
    }
  }, []);

  useEffect(() => {
    try {
      fetch("/api/categories")
        .then((res) => res.json())
        .then((data) => {
          setCategories(data);
        });
    } catch (error) {
      console.error("خطا در دریافت دسته بندی‌ها", error);
    }
  }, []);

  useEffect(() => {
    if (citys && citys.length > 0) {
      handlePropertyChange("province", citys[0].Province);
    }
  }, [citys]);

  useEffect(() => {
    document.title = 'ادمین پنل | افزودن ملک';
  }, []);

  // useEffect(()=>{
  //   if
  // }, [propertyData.status])

  return (
    <div className=" md:p-6 p-0 mt-0 rounded-xl">
      <div className="p-6 md:w-[80%] w-[95%] mx-auto space-y-10 rounded-xl">
        <div className="backs flex gap-8 w-full justify-end text-xl cursor-pointer">
          <Link href={`/userPanel/realestate`}><i className="tabBtn ri-arrow-go-back-line"></i></Link>
          <Link href={'/userPanel'}><i className="tabBtn ri-home-line"></i></Link>
        </div>
        {/* ================= تصاویر ================= */}
        <section className="flex flex-wrap gap-20 p-5">
          <h1 className="w-full font-bold text-4xl">اطلاعات پایه</h1>
          <div className="md:w-[40%] w-[90%]">
            <TextInput
              category={"title"}
              handlePropertyChange={handlePropertyChange}
              place={"عنوان ملک"}
              isNumber={false}
              value={propertyData.title}
            />

            <TextInput
              category={"slug"}
              handlePropertyChange={handlePropertyChange}
              place={"نامک"}
              isNumber={false}
              lang={"en"}
              value={propertyData.slug}
            />

            {slugAvailability.message && (
              <div
                className={`text-sm px-2 py-1 rounded w-[300px] ${slugAvailability.isChecking
                    ? "text-gray-600"
                    : slugAvailability.isAvailable
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
              >
                {slugAvailability.isChecking && (
                  <span className="inline-block animate-spin mr-1">⟳</span>
                )}
                {slugAvailability.message}
              </div>
            )}

            <p className="text-left w-[300px] px-1 my-2">
              https://polmelk.ir/
              <span className="text-[var(--title)]">{propertyData.slug}</span>
            </p>

            {/* <TextArey
              category={"description"}
              handlePropertyChange={handlePropertyChange}
              place={"توضیحات ملک"}
              value={propertyData["description"]}
            /> */}
          </div>

          <FileInput
            images={images} // ارسال state تصاویر به فرزند
            mainImageIndex={mainImageIndex} // ارسال state ایندکس تصویر اصلی به فرزند
            setImages={handleSetImages} // ارسال تابع به‌روزرسانی تصاویر به فرزند
            setMainImageIndex={handleSetMainImageIndex}
          />
        </section>

        {/* ================= نوع و وضعیت ================= */}
        <section className="w-full flex flex-wrap gap-5 border-t border-dashed border-[var(--reversbotder)]/40 p-5">
          <h2 className="text-lg w-full font-bold">نوع و وضعیت</h2>

          <SelectInput
            place={"نوع و وضعیت"}
            values={["خرید", "فروش", "اجاره", "مشارکت", "پیش فروش"]}
            category={"dealType"}
            handlePropertyChange={handlePropertyChange}
            setDealType={setDealType}
            value={propertyData["dealType"]}
          />

          {propertyData.dealType !== "" && (
            <SelectInput
              place="نوع ملک"
              values={propertyTypes}
              category="propertyType" // نام فیلد برای handlePropertyChange
              handlePropertyChange={handlePropertyChange}
              value={propertyData["propertyType"]}
            />
          )}

          {propertyData.propertyType !== "" && (
            <SelectInput
              place={"دسته بندی"}
              values={categories.map(cat => cat.title)}
              category={"categoryId"}
              handlePropertyChange={handlePropertyChange}
              value={propertyData["categoryId"]}
            />
          )}

          {propertyData.propertyType !== "" && (
            <SelectInput
              place={"وضعیت ملک"}
              values={[
                "پایان کار",
                "قولنامه ای",
                "سند دار",
                "وام دار",
                "قابل معاوضه",
              ]}
              category={"statusfile"}
              handlePropertyChange={handlePropertyChange}
              setDealType={setDealType}
              value={propertyData["statusfile"]}
            />
          )}

          {[
            "آپارتمان",
            "ویلا",
            "کلنگی",
            "حیاط دار",
            "مغازه",
            "مستغلات",
            "زیرزمین",
          ].includes(propertyData.propertyType) &&
            propertyData.statusfile !== "" && (
              <SelectInput
                place={"وضعیت سکونت ملک"}
                values={["تخلیه", "سکونت مستاجر", "سکونت مالک"]}
                category={"occupancyStatus"}
                handlePropertyChange={handlePropertyChange}
                setDealType={setDealType}
                value={propertyData["occupancyStatus"]}
              />
            )}

          {propertyData.occupancyStatus !== "" && (
            <SelectInput
              place={"وضعیت آگهی"}
              values={["فعال", "غیر فعال"]}
              category={"status"}
              handlePropertyChange={handlePropertyChange}
              setDealType={setDealType}
              value={propertyData["status"]}
            />
          )}

          <div className="mt-9 flex flex-wrap gap-5">
            {["اجاره"].includes(propertyData.dealType) && (
              <CheckboxInput
                idx={0}
                category={"isConvertible"}
                place={"قابل تبدیل"}
                handleArrayFieldChange={handlePropertyCheckbox}
                value={propertyData["isConvertible"]}
              />
            )}

            {propertyData.dealType !== "" && (
              <CheckboxInput
                idx={0}
                category={"isFeatured"}
                place={"ملک ویژه"}
                handleArrayFieldChange={handlePropertyCheckbox}
                value={propertyData["isFeatured"]}
              />
            )}
          </div>
        </section>

        {/* ================= اطلاعات مالک ================= */}
        {propertyData.occupancyStatus !== "" && (
          <section className="w-full flex flex-wrap gap-5 border-t border-dashed border-[var(--reversbotder)]/40 p-5">
            <h2 className="text-lg  w-full font-bold">اطلاعات مالک</h2>

            <TextInput
              category={"ownerName"}
              handlePropertyChange={handlePropertyChange}
              place={"نام مالک"}
              isNumber={false}
              value={propertyData.ownerName}
            />

            <TextInput
              category={"ownerMobile"}
              handlePropertyChange={handlePropertyChange}
              place={"موبایل مالک"}
              isNumber={true}
              value={propertyData.ownerMobile}
            />

            <TextInput
              category={"ownerPhone"}
              handlePropertyChange={handlePropertyChange}
              place={"تلفن مالک"}
              isNumber={true}
              value={propertyData.ownerPhone}
            />

            <TextInput
              category={"guardName"}
              handlePropertyChange={handlePropertyChange}
              place={"نام کامل نگهبان"}
              isNumber={false}
              value={propertyData.guardName}
            />

            <TextInput
              category={"guardPhone"}
              handlePropertyChange={handlePropertyChange}
              place={"شماره تماس نگهبان"}
              isNumber={true}
              value={propertyData.guardPhone}
            />
          </section>
        )}

        {/* ================= موقعیت مکانی ================= */}
        {propertyData.occupancyStatus !== "" && (
          <section className="w-full flex flex-wrap gap-5 border-t border-dashed border-[var(--reversbotder)]/40 p-5">
            <h2 className="text-lg w-full font-bold">موقعیت مکانی</h2>

            {/* <TextInput
            category={"province"}
            handlePropertyChange={handlePropertyChange}
            place={"استان"}
            isNumber={false}
            value={propertyData.province}
          /> */}

            {/* <TextInput
            category={"city"}
            handlePropertyChange={handlePropertyChange}
            place={"شهر"}
            isNumber={false}
            value={propertyData.city}
          /> */}

            <SelectInput
              place={"شهر"}
              values={citys?.[0]?.city || []}
              category={"city"}
              handlePropertyChange={handlePropertyChange}
              value={propertyData["city"]}
            />

            <TextInput
              category={"district"}
              handlePropertyChange={handlePropertyChange}
              place={"منطقه"}
              isNumber={false}
              value={propertyData.district}
            />

            <TextInput
              category={"address"}
              handlePropertyChange={handlePropertyChange}
              place={"آدرس کامل"}
              isNumber={false}
              value={propertyData.address}
            />

            <TextInput
              category={"postalCode"}
              handlePropertyChange={handlePropertyChange}
              place={"کد پستی"}
              isNumber={true}
              value={propertyData.postalCode}
            />

            <section className="w-[95%] m-auto h-[300px]">
              <h2 className="text-lg font-bold">انتخاب موقعیت روی نقشه</h2>
              <MapPicker
                onSelect={handleLocationSelect}
                initialLocation={selectedLocation}
              />
            </section>
          </section>
        )}

        {/* ================= قیمت‌ها ================= */}
        {propertyData.city !== "" && (
          <section className="w-full flex flex-wrap gap-5 border-t border-dashed border-[var(--reversbotder)]/40 p-5">
            <h1 className="w-full font-bold text-4xl">اطلاعات مالی</h1>

            {propertyData.dealType === "اجاره" ? (
              <>
                <TextInput
                  category={"depositPrice"}
                  handlePropertyChange={handlePropertyChange}
                  place={"مبلغ رهن"}
                  isPrice={true}
                  value={propertyData.depositPrice}
                />

                <TextInput
                  category={"rentPrice"}
                  handlePropertyChange={handlePropertyChange}
                  place={"مقدار اجاره ماهانه"}
                  isPrice={true}
                  value={propertyData.rentPrice}
                />
              </>
            ) : (
              <>
                <TextInput
                  category={"price"}
                  handlePropertyChange={handlePropertyChange}
                  place={"قیمت کل"}
                  isPrice={true}
                  value={propertyData.price}
                />
                {propertyData.meterPrice !== "" &&
                  !isNaN(parseInt(propertyData.meterPrice)) && (
                    <p className="mt-11">
                      قیمت هر متر : {parseInt(propertyData.meterPrice)} تومان
                    </p>
                  )}

                {/* <TextInput
                category={"pricePerMeter"}
                handlePropertyChange={handlePropertyChange}
                place={"قیمت برای هر متر"}
                isPrice={true}
                value={propertyData.pricePerMeter}
              /> */}
              </>
            )}
          </section>
        )}

        {(propertyData.price !== "" ||
          (propertyData.rentPrice !== "" &&
            propertyData.depositPrice !== "")) && (
            <section className="flex flex-wrap border-t border-dashed border-[var(--reversbotder)]/40 py-5">
              <h1 className="w-full mb-5 font-bold text-4xl px-5">ویژگی ها</h1>
              {optionItems.map((optionGroup, groupIndex) => {
                const shouldShowGroup =
                  !optionGroup.condition ||
                  !optionGroup.condition.propertyType ||
                  optionGroup.condition.propertyType.includes("all")
                  optionGroup.condition.propertyType.includes(
                    propertyData.propertyType,
                  );

                const shouldShowByDealType =
                  !optionGroup.condition ||
                  !optionGroup.condition.dealType ||
                  optionGroup.condition.dealType === "all" ||
                  optionGroup.condition.dealType.includes(propertyData.dealType);

                if (!shouldShowGroup || !shouldShowByDealType) return null;

                return (
                  <div key={groupIndex} className="w-[335px]">
                    <div className="grid grid-cols-2  md:grid-cols-5 gap-3 px-5">
                      {optionGroup.type === "checkbox" ? (
                        optionGroup.features.map((feature, featureIndex) => (
                          <CheckboxInput
                            idx={featureIndex}
                            category={getFeatureFieldName(optionGroup.category)}
                            place={feature}
                            handleArrayFieldChange={handleArrayFieldChange}
                            value={
                              propertyData[
                              getFeatureFieldName(optionGroup.category)
                              ]
                            }
                          />
                        ))
                      ) : optionGroup.type === "select" ? (
                        <SelectInput
                          place={optionGroup.category}
                          values={optionGroup.features}
                          category={getFeatureFieldName(optionGroup.category)}
                          handlePropertyChange={handlePropertyChange}
                          value={
                            propertyData[
                            getFeatureFieldName(optionGroup.category)
                            ]
                          }
                        />
                      ) : optionGroup.type === "text" ? (
                        <input
                          type="text"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={
                            propertyData[
                            getFeatureFieldName(optionGroup.category)
                            ] || ""
                          }
                          onChange={(e) => {
                            handlePropertyChange(
                              getFeatureFieldName(optionGroup.category),
                              e.target.value,
                            );
                          }}
                        />
                      ) : optionGroup.type === "number" ? (
                        <TextInput
                          category={getFeatureFieldName(optionGroup.category)}
                          handlePropertyChange={handlePropertyChange}
                          place={optionGroup.category}
                          isNumber={true}
                          value={
                            propertyData?.[
                            getFeatureFieldName(optionGroup.category)
                            ] || ""
                          }
                        />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </section>
          )}

        {(propertyData.price !== "" ||
          (propertyData.rentPrice !== "" &&
            propertyData.depositPrice !== "")) && (
            <section className="space-y-6 flex flex-wrap gap-5 border-t border-dashed border-[var(--reversbotder)]/40 py-5">
              <h1 className="w-full font-bold text-4xl px-5">امکانات ملک</h1>
              {featureItems.map((featureGroup, groupIndex) => {
                const shouldShowGroup =
                  !featureGroup.condition ||
                  !featureGroup.condition.propertyType ||
                  featureGroup.condition.propertyType.includes("all")
                  featureGroup.condition.propertyType.includes(
                    propertyData.propertyType,
                  );

                const shouldShowByDealType =
                  !featureGroup.condition ||
                  !featureGroup.condition.dealType ||
                  featureGroup.condition.dealType === "all" ||
                  featureGroup.condition.dealType
                    .split("،")
                    .includes(propertyData.dealType);

                // const isMobile = useIsMobile();
                const isExpanded = expandedIds.has(featureGroup.id);
                const features = featureGroup.features;
                const icons = featureGroup.icons;
                const hasMoreThanSeven = features.length > 7;
                const shouldBeExpanded = isExpanded || !hasMoreThanSeven;

                if (!shouldShowGroup || !shouldShowByDealType) return null;

                return (
                  <div
                    key={groupIndex}
                    className="w-fit flex flex-wrap gap-5 border-t border-dashed border-[var(--reversbotder)]/40 p-5"
                  >
                    {featureGroup.type === "checkbox" && (
                      <h3 className="font-bold w-full text-xl text-white-700">
                        {featureGroup.category}
                      </h3>
                    )}
                    <div
                      key={featureGroup.id}
                      className={`checkboxDIv flex gap-5 relative  ${featureGroup.type === "checkbox" && "overflow-y-hidden"}   flex-wrap`}
                    >
                      {featureGroup.type === "checkbox" ? (
                        <>
                          {features.map((feature, featureIndex) => {
                            const shouldDisplay =
                              featureIndex < 2 || shouldBeExpanded;

                            if (!shouldDisplay) {
                              return null;
                            }

                            return (
                              <Fragment
                                key={`${featureGroup.id}-${featureIndex}`}
                              >
                                <CheckboxInput
                                  idx={featureIndex}
                                  category={getFeatureFieldName(
                                    featureGroup.category,
                                  )}
                                  icon={
                                    icons && icons?.length > 0
                                      ? icons[featureIndex]
                                      : ""
                                  }
                                  place={feature}
                                  handleArrayFieldChange={handleArrayFieldChange}
                                  value={
                                    propertyData[
                                    getFeatureFieldName(featureGroup.category)
                                    ]
                                  }
                                />
                              </Fragment>
                            );
                          })}

                          {hasMoreThanSeven && !isExpanded && (
                            <button
                              className="tabBtn w-[300px] text-right absolute md:relative bottom-[0px] bg-[var(--background)] left-0 mr-10 cursor-pointer"
                              onClick={() => handleShowMoreClick(featureGroup.id)}
                            >
                              + موارد بیشتر
                            </button>
                          )}
                        </>
                      ) : featureGroup.type === "select" ? (
                        <SelectInput
                          place={featureGroup.category}
                          values={featureGroup.features}
                          category={getFeatureFieldName(featureGroup.category)}
                          handlePropertyChange={handlePropertyChange}
                          value={
                            propertyData[
                            getFeatureFieldName(featureGroup.category)
                            ]
                          }
                        />
                      ) : featureGroup.type === "text" ? (
                        <input
                          type="text"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={
                            propertyData[
                            getFeatureFieldName(featureGroup.category)
                            ] || ""
                          }
                          onChange={(e) => {
                            handlePropertyChange(
                              getFeatureFieldName(featureGroup.category),
                              e.target.value,
                            );
                          }}
                        />
                      ) : featureGroup.type === "number" ? (
                        <input
                          type="number"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={
                            propertyData[
                            getFeatureFieldName(featureGroup.category)
                            ] || ""
                          }
                          onChange={(e) => {
                            handlePropertyChange(
                              getFeatureFieldName(featureGroup.category),
                              e.target.value,
                            );
                          }}
                        />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </section>
          )}

        {propertyData.city !== "" && (
          <>
            <div className=" border-t border-dashed border-[var(--reversbotder)]/40 p-5">
              <h2 className="my-5">توضیحات ملک :</h2>
              <DescriptionToptop
                category={"description"}
                onChange={handlePropertyChange}
                initialContent={(propertyData as any).description || ""}
              />
            </div>

            <div
              className={`seoData w-[97%] transition flex flex-wrap justify-between m-auto my-10 border border-[var(--boxback)] rounded-xl overflow-hidden ${seobox ? "h-auto" : "h-[80px]"}`}
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
                  value={propertyData.seoTitle}
                />
                <TextInput
                  place="متا دیسکریپشن"
                  category={"seoMeta"}
                  handlePropertyChange={handlePropertyChange}
                  isNumber={false}
                  value={propertyData.seoMeta}
                />

                <h3 className="w-full mt-5 mb-2 mr-3">تگ کنونیکال :</h3>
                <TextInput
                  place="لینک صفحه مبدا"
                  category={"seoCanonikalOrigin"}
                  handlePropertyChange={handlePropertyChange}
                  isNumber={false}
                  value={propertyData.seoCanonikalOrigin}
                />
                <TextInput
                  place="لینک صفحه مقصد"
                  category={"seoCanonikalDestination"}
                  handlePropertyChange={handlePropertyChange}
                  isNumber={false}
                  value={propertyData.seoCanonikalDestination}
                />

                {/* <h3 className="w-full mt-5 mb-2 mr-3">وضعیت ایندکس :</h3>
                <button
                  className={`subBtn w-[48%] h-[45px] ${propertyData.indexed === "true" ? "active" : ""}`}
                  onClick={() => {
                    handlePropertyChange("indexed", "true");
                  }}
                >
                  ایندکس
                </button>
                <button
                  className={`subBtn w-[48%] h-[45px] ${propertyData.indexed === "false" ? "active" : ""}`}
                  onClick={() => {
                    handlePropertyChange("indexed", "false");
                  }}
                >
                  نو ایندکس
                </button> */}

                <h3 className="w-full mt-5 mb-2 mr-3">ریدایرکت :</h3>
                <TextInput
                  place="لینک مبدا"
                  category={"seoOrigin"}
                  handlePropertyChange={handlePropertyChange}
                  isNumber={false}
                  value={propertyData.seoOrigin}
                />
                <TextInput
                  place="لینک مقصد"
                  category={"seoDestination"}
                  handlePropertyChange={handlePropertyChange}
                  isNumber={false}
                  value={propertyData.seoDestination}
                />

                <h3 className="w-full mt-5 mb-2 mr-3">نوع ریدایرکت :</h3>
                <button
                  className={`subBtn w-[48%] h-[45px] ${propertyData.seoRedirect === "301" ? "active" : ""}`}
                  onClick={() => {
                    handlePropertyChange("seoRedirect", "301");
                  }}
                >
                  301
                </button>
                <button
                  className={`subBtn w-[48%] h-[45px] ${propertyData.seoRedirect === "302" ? "active" : ""}`}
                  onClick={(e) => {
                    handlePropertyChange("seoRedirect", "302");
                  }}
                >
                  302
                </button>
              </div>
            </div>
          </>
        )}

        <button onClick={handleSubmit} className="subBtn w-[300px] h-[45px]">
          ثبت ملک
        </button>
      </div>
    </div>
  );
}
