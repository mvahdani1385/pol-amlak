"use client";

import { toast } from "react-toastify";
import "@/app/css/fileDetile.css";
import { useState, useEffect, useRef, Fragment } from "react";
import dynamic from "next/dynamic";
import { NextRequest, NextResponse } from "next/server";
import { propertyFeatures } from "@/propertyFeatures.config";
import { useSearchParams } from "next/navigation";
import TextInput from "@/app/components/themes/TextInput";
import NumberInput from "@/app/components/themes/NumberInput";
import SelectInput from "@/app/components/themes/SelectInput";
import CheckboxInput from "@/app/components/themes/CheckboxInput";
import FileInput from "@/app/components/themes/FileInput";
import TextArey from "@/app/components/themes/TextArey";
import DescriptionToptop from "../new/DescriptionTptop";
import Link from "next/link";

interface ImageType {
  id: number;
  propertyId: number;
  imageUrl: string;
  isMain: boolean;
  sortOrder: number;
}

interface data {
  city: string[] | null | undefined;
  Province: string | null | undefined;
}

interface PropertyProps {
  id: string | number;
  title: string;
  coverImage: string;
  excerpt: string;
  slug: string;
  updatedAt: string;
  images: ImageType[]; // <-- اضافه شد!
  // ... سایر فیلدهایی که در کامنت دیدم
  description?: string;
  ownerName?: string;
  ownerMobile?: string;
  ownerPhone?: string;
  propertyType?: string;
  dealType?: string;
  status?: string;
  price?: string;
  city?: string;
  isConvertible?: boolean | null;
  isFeatured?: boolean | null;
  latitude?: number | null;
  longitude?: number | null;
  utilities?: string[];
  propertySpecs?: any[];
  buildingFacade?: string;
  floorCovering?: string;
  commonAreas?: string[];
  heatingCooling?: string[];
  kitchenFeatures?: string[];
  bathroomFeatures?: string[];
  wallCeiling?: string[];
  parkingTypes?: string[];
  otherFeatures?: string[];
  roomNumber?: string;
  propertydirection?: string;
  propertyUnit?: string;
  propertyFloors?: string;
  floor?: string;
  unitInFloor?: string;
  allUnit?: string;
  landArea?: string;
  buildingArea?: string;
  categoryTitle?: string;
  // --- seo ---
  seoTitle: string;
  seoMeta: string;
  seoCanonikalOrigin: string;
  seoCanonikalDestination: string;
  seoOrigin: string;
  seoDestination: string;
  seoRedirect: string;
}

export default function CreatePropertyForm() {
  // const [propertyData, setPropertyData] = useState<any>({
  //     title: "",
  //     slug: "",
  //     description: "",
  //     ownerName: "",
  //     ownerMobile: "",
  //     ownerPhone: "",
  //     propertyType: "آپارتمان",
  //     dealType: "فروش",
  //     status: "active",
  //     price: "",
  //     city: "",
  //     isConvertible: null,
  //     isFeatured: null,
  //     latitude: null,
  //     longitude: null,
  //     utilities: [],
  //     propertySpecs: [],
  //     buildingFacade: 'ثبت نشده',
  //     floorCovering: 'ثبت نشده',
  //     commonAreas: [],
  //     heatingCooling: [],
  //     kitchenFeatures: [],
  //     bathroomFeatures: [],
  //     wallCeiling: [],
  //     parkingTypes: [],
  //     otherFeatures: [],
  //     roomNumber: "",
  //     propertydirection: "ثبت نشده",
  //     propertyUnit: "ثبت نشده",
  //     propertyFloors: "",
  //     floor: "",
  //     unitInFloor: "",
  //     allUnit: "",
  //     landArea: "",
  //     buildingArea: ""
  // });

  const [propertyData, setPropertyData] = useState<PropertyProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

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

  useEffect(() => {
    const fetchProperties = async (slug: any) => {
      try {
        // console.log(slug)
        const response = await fetch(`/api/properties/${slug}`);
        if (!response.ok) {
          throw new Error(`خطای HTTP: ${response.status}`);
        }
        const data: PropertyProps[] = await response.json();
        setPropertyData(data);
        setImages((data as any).images);
      } catch (err) {
        console.error("خطا در دریافت فایل ها:", err);
        setError("خطا در بارگیری فایل ها. لطفاً بعداً دوباره امتحان کنید.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties(slug);
  }, [slug]);

  // useEffect(() => {
  //     const jfg = 'bathroomFeatures'
  //     console.log(propertyData[jfg])
  // }, [propertyData])

  const MapPicker = dynamic(() => import("../new/MapPicker"), { ssr: false });

  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const allowMultipleSelection = true;
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null);
  const [fields, setFields] = useState<any[]>([]);
  const [fieldValues, setFieldValues] = useState<{
    [fieldId: number]: string;
  }>({});

  const [citys, setCitys] = useState<data[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const handleSetImages = (newImages: File[]) => {
    setImages(newImages);
    if (newImages.length > 0 && mainImageIndex === null) {
      setMainImageIndex(0);
    } else if (newImages.length === 0) {
      setMainImageIndex(null);
    }
  };

  // useEffect(() => {
  //   console.log((propertyData as any).seoRedirect);
  // }, [(propertyData as any).seoRedirect]);

  const handleSetMainImageIndex = (index: number | null) => {
    setMainImageIndex(index);
  };

  const [isMobile, setIsMobile] = useState(false);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    fileInputRef.current?.click();
  };

  // useEffect(() => {
  //   console.log(images);
  // }, [images]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    let newFiles: File[] = [];
    if (allowMultipleSelection) {
      newFiles = Array.from(e.target.files);
    } else {
      newFiles.push(e.target.files[0]);
    }

    const updatedImages = [...images, ...newFiles];
    setImages(updatedImages);

    if (images.length === 0 && updatedImages.length > 0) {
      setMainImageIndex(0);
    }
    if (e.target.value) {
      e.target.value = "";
    }
  };

  function handleDeleteImage(imgIndexToDelete: number) {
    const updatedImages = images.filter(
      (_, index) => index !== imgIndexToDelete,
    );

    setImages(updatedImages);

    if (mainImageIndex === imgIndexToDelete) {
      setMainImageIndex(null);
    } else if (mainImageIndex !== null && imgIndexToDelete < mainImageIndex) {
      setMainImageIndex(mainImageIndex - 1);
    }
  }

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [dealType, setDealType] = useState<string>("");

  // Set initial location from propertyData when it loads
  useEffect(() => {
    if (
      propertyData &&
      (propertyData as any).latitude &&
      (propertyData as any).longitude
    ) {
      setSelectedLocation({
        lat: parseFloat((propertyData as any).latitude),
        lng: parseFloat((propertyData as any).longitude),
      });
    }
  }, [propertyData]);

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
    if (!(propertyData as any)?.slug) return;
    let editeslug = (propertyData as any).slug.replace(/ /g, "-");
    handlePropertyChange("slug", editeslug);
  }, [(propertyData as any).slug]);

  const handlePropertyChange = (key: string, value: any) => {
    setPropertyData((prev: any) => ({
      ...prev,
      [key]: value,
    }));

    // Check slug availability when slug changes (but only if it's different from original)
    if (
      key === "slug" &&
      value &&
      value.trim() !== "" &&
      value.trim() !== slug
    ) {
      checkSlugAvailability(value.trim());
    } else if (
      key === "slug" &&
      (!value || value.trim() === "" || value.trim() === slug)
    ) {
      setSlugAvailability({
        isChecking: false,
        isAvailable: null,
        message: "",
      });
    }
  };

  const checkSlugAvailability = async (newSlug: string) => {
    if (newSlug.length < 3) {
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
        `/api/properties/check-slug?slug=${encodeURIComponent(newSlug)}`,
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
    const price = parseInt((propertyData as any).price || 0);
    const area = parseInt((propertyData as any).landArea || 0);
    let meterPrice = "";

    if (price && area && area > 0) {
      const calculatedMeterPrice = Math.floor(price / area);
      meterPrice = calculatedMeterPrice.toString();
    }

    if (isNaN(parseInt(meterPrice))) {
      meterPrice = "";
    }

    handlePropertyChange("meterPrice", meterPrice);
  }, [(propertyData as any).price, (propertyData as any).landArea]);

  useEffect(() => {
    document.title = 'ادمین پنل | ویرایش ملک';
  }, []);

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
    const currentValues = (propertyData as any)[fieldName] || [];
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
      مشاعات: "commonAreas",
      "تاسیسات سرمایش و گرمایش": "heatingCooling",
      "پوشش کف": "floorCovering",
      آشپزخانه: "kitchenFeatures",
      "سرویس بهداشتی و حمام": "bathroomFeatures",
      "سقف و دیوار": "wallCeiling",
      "قابل تبدیل": "isConvertible",
      "ملک ویژه": "isFeatured",
      "عرض جغرافیایی": "latitude",
      "طول جغرافیایی": "longitude",
      "نوع پارکینگ": "parkingTypes",
      "سایر امکانات": "otherFeatures",
      "وضعیت سکونت ملک": "occupancyStatus",
      "تعداد اتاق خواب": "roomNumber",
      "موقعیت ملک": "propertydirection",
      "جهت واحد": "propertyUnit",
      "سال ساخت": "createYear",
      "تعداد پارکینگ": "parkingnum",
      "تعداد کل طبقات": "propertyFloors",
      طبقه: "floor",
      "تعداد واحد ها در هر طبقه": "unitInFloor",
      "تعداد کل واحد ها": "allUnit",
      "متراژ زمین": "landArea",
      "متراژ بنا": "buildingArea",
    };
    return fieldMapping[category] || category;
  };

  const handleSubmit = async (currentSlug?: string) => {
    // console.log(slug);
    try {
      let newImageFileNames: string[] = [];
      let allImagesForDB: any[] = [];
      let deletedImageIds: number[] = [];
      const currentImageIds = new Set();

      // 1. پردازش تصاویر (اگر وجود دارند)
      if (images && images.length > 0) {
        const uniqueImageNames = new Set();
        const newFilesToUpload: any[] = [];
        const existingImageObjects: any[] = [];

        // تفکیک تصاویر جدید (File) از تصاویر موجود (اشیاء با imageUrl)
        images.forEach((image) => {
          if (image instanceof File) {
            // بررسی تکراری بودن نام فایل‌های جدید
            if (!uniqueImageNames.has(image.name)) {
              uniqueImageNames.add(image.name);
              newFilesToUpload.push(image);
            } else {
              console.log(`Skipping duplicate file name: ${image.name}`);
            }
          } else if (image && typeof (image as any).imageUrl === "string") {
            // این یک تصویر موجود است
            existingImageObjects.push(image);
            if ((image as any).id) {
              currentImageIds.add((image as any).id);
            }
          } else {
            console.warn(
              "Encountered an unexpected item in images array:",
              image,
            );
          }
        });

        // --- مرحله ۱: آپلود فایل‌های جدید ---
        const uploadNewImages = async () => {
          if (newFilesToUpload.length === 0) {
            return []; // اگر فایلی برای آپلود نباشد، آرایه خالی برمی‌گردد
          }

          const uploadedResults = [];
          for (const imageFile of newFilesToUpload) {
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 8);
            // حذف کاراکترهای اضافی و جایگزینی فاصله‌ها با خط تیره
            const safeFileName = imageFile.name
              .replace(/[^a-zA-Z0-9.]/g, "_")
              .replace(/\s+/g, "-");
            const fileName = `${timestamp}-${randomString}-${safeFileName}`;

            const uploadFormData = new FormData();
            uploadFormData.append("file", imageFile); // 'file' نام فیلدی است که API شما انتظار دارد
            uploadFormData.append("fileName", fileName); // ارسال نام فایل سفارشی

            try {
              const response = await fetch("/api/upload", {
                // آدرس API آپلود شما
                method: "POST",
                body: uploadFormData,
                // هدر Content-Type به طور خودکار توسط FormData تنظیم می‌شود
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                  errorData.error || `خطا در آپلود تصویر: ${imageFile.name}`,
                );
              }

              const uploadResult = await response.json(); // فرض می‌کنیم API نام فایل یا URL را برمی‌گرداند
              const imageUrl =
                uploadResult.path ||
                uploadResult.imageUrl ||
                `/uploads/${fileName}`;
              (uploadedResults as any[]).push(imageUrl);
              newImageFileNames.push(fileName); // اضافه کردن نام فایل به آرایه
            } catch (error) {
              console.error(`Failed to upload ${imageFile.name}:`, error);
              throw error;
            }
          }
          return uploadedResults;
        };

        // --- مرحله ۲: پردازش تصاویر ---
        const newlyUploadedImages = await uploadNewImages();
        const processedNewImages = newlyUploadedImages.map(
          (imageUrl, index) => {
            return {
              propertyId: (propertyData as any).id,
              imageUrl: imageUrl,
              isMain: false, // یا هر منطقی که برای تعیین تصویر اصلی دارید
              sortOrder: existingImageObjects.length + index,
            };
          },
        );

        // حالا allImagesForDB شامل تصاویر موجود و تصاویر جدید پردازش شده خواهد بود
        allImagesForDB = [...existingImageObjects, ...processedNewImages];
      }

      // پیدا کردن تصاویری که حذف شده‌اند (این بخش باید خارج از if بالا باشد)
      if (
        (propertyData as any).images &&
        Array.isArray((propertyData as any).images)
      ) {
        (propertyData as any).images.forEach((originalImage: any) => {
          if (originalImage.id && !currentImageIds.has(originalImage.id)) {
            deletedImageIds.push(originalImage.id);
          }
        });
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

      // 2. Prepare property data for API
      const preparedPropertyData: any = {
        categoryTitle: (propertyData as any).categoryTitle,
        // اطمینان از اینکه مقادیر عددی بزرگ (BigInt) به صورت رشته ارسال شوند
        slug: (propertyData as any).slug,
        title: (propertyData as any).title,
        description: (propertyData as any).description,
        propertyType: (propertyData as any).propertyType,
        dealType: (propertyData as any).dealType,
        ownerName: (propertyData as any).ownerName,
        ownerMobile: (propertyData as any).ownerMobile,
        ownerPhone: (propertyData as any).ownerPhone,
        guardName: (propertyData as any).guardName,
        guardPhone: (propertyData as any).guardPhone,
        status: (propertyData as any).status,
        occupancyStatus: (propertyData as any).occupancyStatus,
        isConvertible: (propertyData as any).isConvertible,
        isFeatured: (propertyData as any).isFeatured,
        price:
          (propertyData as any).price !== null &&
            (propertyData as any).price !== ""
            ? String((propertyData as any).price)
            : null,
        depositPrice:
          (propertyData as any).depositPrice !== null &&
            (propertyData as any).depositPrice !== ""
            ? String((propertyData as any).depositPrice)
            : null,
        rentPrice:
          (propertyData as any).rentPrice !== null &&
            (propertyData as any).rentPrice !== ""
            ? String((propertyData as any).rentPrice)
            : null,
        pricePerMeter:
          (propertyData as any).pricePerMeter !== null &&
            (propertyData as any).pricePerMeter !== ""
            ? String((propertyData as any).pricePerMeter)
            : null,
        province: (propertyData as any).province,
        city: (propertyData as any).city,
        district: (propertyData as any).district,
        address: (propertyData as any).address,
        postalCode: (propertyData as any).postalCode,
        latitude:
          (propertyData as any).latitude !== null &&
            (propertyData as any).latitude !== ""
            ? String((propertyData as any).latitude)
            : null,
        longitude:
          (propertyData as any).longitude !== null &&
            (propertyData as any).longitude !== ""
            ? String((propertyData as any).longitude)
            : null,
        roomNumber: (propertyData as any).roomNumber,
        propertydirection: (propertyData as any).propertydirection,
        propertyUnit: (propertyData as any).propertyUnit,
        propertyFloors: (propertyData as any).propertyFloors,
        statusfile: (propertyData as any).statusfile,
        parkingnum: (propertyData as any).parkingnum,
        meterPrice: (propertyData as any).meterPrice
          ? Number((propertyData as any).meterPrice)
          : null,
        createYear: (propertyData as any).createYear
          ? Number((propertyData as any).createYear)
          : null,
        floor: (propertyData as any).floor,
        unitInFloor: (propertyData as any).unitInFloor,
        allUnit: (propertyData as any).allUnit,
        landArea:
          (propertyData as any).landArea !== null &&
            (propertyData as any).landArea !== ""
            ? String((propertyData as any).landArea)
            : null,
        buildingArea:
          (propertyData as any).buildingArea !== null &&
            (propertyData as any).buildingArea !== ""
            ? String((propertyData as any).buildingArea)
            : null,
        buildingFacade: (propertyData as any).buildingFacade,
        floorCovering: (propertyData as any).floorCovering,
        utilities: (propertyData as any).utilities,
        propertySpecs: (propertyData as any).propertySpecs,
        commonAreas: (propertyData as any).commonAreas,
        heatingCooling: (propertyData as any).heatingCooling,
        kitchenFeatures: (propertyData as any).kitchenFeatures,
        bathroomFeatures: (propertyData as any).bathroomFeatures,
        wallCeiling: (propertyData as any).wallCeiling,
        parkingTypes: (propertyData as any).parkingTypes,
        otherFeatures: (propertyData as any).otherFeatures,
        // --- seo ---
        seoTitle: (propertyData as any).seoTitle,
        seoMeta: (propertyData as any).seoMeta,
        seoCanonikalOrigin: (propertyData as any).seoCanonikalOrigin,
        seoCanonikalDestination: (propertyData as any).seoCanonikalDestination,
        seoOrigin: (propertyData as any).seoOrigin,
        seoDestination: (propertyData as any).seoDestination,
        seoRedirect: (propertyData as any).seoRedirect,

        // ارسال نام فایل‌های تصاویر جدید برای API
        newImageFileNames: newImageFileNames,
        // ارسال شناسه‌های تصاویر حذف شده
        deletedImageIds: deletedImageIds,
        // mainImageIndex را فقط در صورتی بفرستید که واقعاً نیاز است یا تغییر کرده
        mainImageIndex: mainImageIndex ?? 0,
      };

      console.log(preparedPropertyData);

      // تعیین متد HTTP و URL بر اساس وجود slug
      let method: "POST" | "PUT";
      let url = `/api/properties/${currentSlug}`;

      if (currentSlug) {
        // حالت به‌روزرسانی (PUT)
        method = "PUT";
        url = `/api/properties/${currentSlug}`;
      } else {
        // حالت ثبت جدید (POST)
        method = "POST";
        url = "/api/properties";
        (propertyData as any).slug = (propertyData as any).slug;
      }

      // console.log("Data being sent to API:", preparedPropertyData);

      // فراخوانی API اصلی ملک (POST یا PUT)
      const propertyRes = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preparedPropertyData),
      });

      if (!propertyRes.ok) {
        const contentType = propertyRes.headers.get("content-type");
        let errorData;
        let errorMessage = `خطا در ${method === "POST" ? "ثبت" : "به‌روزرسانی"} ملک.`;

        if (contentType && contentType.indexOf("application/json") !== -1) {
          try {
            errorData = await propertyRes.json();

            // Handle duplicate slug error specifically
            if (
              propertyRes.status === 409 &&
              errorData.code === "DUPLICATE_SLUG"
            ) {
              toast.error("نامک تکراری است. لطفاً نامک دیگری انتخاب کنید.");
              return;
            }

            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            console.error("JSON parsing error for non-ok response:", e);
            const textResponse = await propertyRes.text();
            console.error(
              "Response text in case of JSON parsing error:",
              textResponse,
            );
            errorMessage += ` پاسخ نامعتبر از سرور دریافت شد.`;
          }
        } else {
          const textResponse = await propertyRes.text();
          console.error("Non-JSON error response:", textResponse);
          if (textResponse) {
            errorMessage += ` پاسخ سرور: ${textResponse.substring(0, 200)}...`;
          } else {
            errorMessage += ` پاسخ خالی از سرور دریافت شد.`;
          }
        }
        throw new Error(errorMessage);
      }

      const property = await propertyRes.json(); // ملک ثبت/به‌روز شده

      // 3. ثبت مقادیر فیلدهای اضافی (fieldValues)
      // این بخش فقط در صورتی اجرا شود که property.id یا property.slug وجود داشته باشد
      // و fieldValues وجود داشته باشند.
      if (property && Object.keys(fieldValues).length > 0) {
        const valuesArray = Object.entries(fieldValues).map(
          ([fieldId, value]) => ({
            // propertyId یا propertySlug باید به API ارسال شود
            propertyId: property.id, // فرض می‌کنیم API انتظار propertyId را دارد
            fieldId: Number(fieldId),
            value: value, // مقدار فیلد
          }),
        );

        // URL API برای fieldValues را چک کنید. اگر POST است، درست است.
        const fieldValuesRes = await fetch("/api/property-field-values", {
          method: "POST", // یا PUT اگر برای به‌روزرسانی است
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            propertyId: property.id, // یا property.slug اگر API آن را می‌خواهد
            values: valuesArray,
          }),
        });

        if (!fieldValuesRes.ok) {
          const errorData = await fieldValuesRes.json();
          // در صورت خطا در ثبت fieldValues، ممکن است بخواهید عملیات قبلی را Undo کنید
          // یا حداقل پیام خطای دقیق‌تری نمایش دهید.
          console.error("Error saving field values:", errorData);
          // در اینجا تصمیم می‌گیرید که آیا این خطا جلوی موفقیت کلی را می‌گیرد یا خیر.
          // اگر property با موفقیت ثبت/به‌روز شده، شاید بخواهید فقط خطا را لاگ کنید.
          // اما اگر ثبت fieldValues حیاتی است، باید خطا را throw کنید.
          throw new Error(errorData.error || "خطا در ثبت ویژگی‌های ملک");
        }
      }

      // نمایش پیام موفقیت
      // alert(`ملک با موفقیت ${method === "POST" ? "ثبت" : "به‌روزرسانی"} شد!`);
      toast.success(
        `ملک با موفقیت ${method === "POST" ? "ثبت" : "به‌روزرسانی"} شد!`,
      );
      setTimeout(() => {
        window.location.href = `/userPanel/realestate`;
      }, 1000);

      // در صورت نیاز، کاربر را به صفحه دیگری مسیریابی کنید
      // router.push('/properties'); // مثال
    } catch (error: any) {
      // تعریف type برای error
      console.error("❌ Error in form submission:", error);
      // نمایش پیام خطای دقیق‌تر به کاربر
      toast.error(`خطایی رخ داد: ${error.message || "خطای ناشناخته"}`);
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
      console.error("خطا در دریافت دسته بندی ها", error);
    }
  }, []);

  useEffect(() => {
    if (citys && citys.length > 0) {
      handlePropertyChange("province", citys[0].Province);
    }
  }, [citys]);

  // Set categoryTitle from loaded property data
  // useEffect(() => {
  //   if (propertyData && (propertyData as any).categoryTitle) {
  //     handlePropertyChange("categoryId", (propertyData as any).categoryTitle);
  //   }
  // }, [propertyData]);

  return (
    <div className=" md:p-6 p-0 mt-0 rounded-xl">
      <div className="p-6 md:w-[80%] w-[95%] mx-auto space-y-10 rounded-xl">
        <div className="backs flex gap-8 w-full justify-end text-xl cursor-pointer">
          <Link href={`/userPanel/realestate`}><i className="tabBtn ri-arrow-go-back-line"></i></Link>
          <Link href={'/userPanel'}><i className="tabBtn ri-home-line"></i></Link>
        </div>
        <h1 className="font-bold text-4xl text-[var(--title)]">ویرایش فایل</h1>

        {/* ================= تصاویر ================= */}
        <section className="flex flex-wrap gap-20">
          <div className="md:w-[40%] w-[90%]">
            <TextInput
              category={"title"}
              handlePropertyChange={handlePropertyChange}
              place={"عنوان ملک"}
              isNumber={false}
              value={(propertyData as any).title}
            />

            <TextInput
              category={"slug"}
              handlePropertyChange={handlePropertyChange}
              place={"نامک"}
              isNumber={false}
              lang={"en"}
              value={(propertyData as any).slug}
            />

            {slugAvailability.message && (
              <div
                className={`text-sm px-2 py-1 w-[300px]${slugAvailability.isChecking
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
              <span className="text-[var(--title)]">
                {(propertyData as any).slug}
              </span>
            </p>

            {/* <TextArey
              category={"description"}
              handlePropertyChange={handlePropertyChange}
              place={"توضیحات ملک"}
              value={(propertyData as any)["description"]}
            /> */}
          </div>

          {/* <FileInput
                        images={images} // ارسال state تصاویر به فرزند
                        mainImageIndex={mainImageIndex} // ارسال state ایندکس تصویر اصلی به فرزند
                        setImages={handleSetImages} // ارسال تابع به‌روزرسانی تصاویر به فرزند
                        setMainImageIndex={handleSetMainImageIndex}
                        values={(propertyData as any).images}
                    /> */}

          <div className="FileInput">
            <h2 className="text-lg w-full mb-5 font-bold">تصاویر ملک</h2>
            <input
              ref={fileInputRef}
              type="file"
              multiple={allowMultipleSelection}
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            {images.length === 0 && (
              <div
                className="upload"
                onClick={handleUploadClick}
                style={{ cursor: "pointer" }}
              >
                <p id="plus">+</p>
                <p>اضافه کردن تصویر</p>
              </div>
            )}

            {images.length > 0 && (
              <>
                <div className="flex w-full">
                  <div className="uploadedFiles">
                    <div
                      className="upload"
                      onClick={handleUploadClick}
                      style={{ cursor: "pointer" }}
                    >
                      <p id="plus">+</p>
                      <p>اضافه کردن تصویر</p>
                    </div>
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className={`imageBox ${mainImageIndex === index ? "select" : ""}`}
                        onClick={() => setMainImageIndex(index)}
                      >
                        {(image as any).imageUrl ? (
                          <img src={(image as any).imageUrl} alt="preview" />
                        ) : (
                          <img src={URL.createObjectURL(image)} alt="preview" />
                        )}
                        <div className="setMain">
                          <p>
                            {mainImageIndex === index
                              ? "تصویر اصلی "
                              : "انتخاب"}
                          </p>
                        </div>
                        {/* {images.length > 1 && ( */}
                        <button
                          onClick={() => handleDeleteImage(index)}
                          className="deleteButton"
                          title="حذف تصویر"
                        >
                          حذف تصویر
                        </button>
                        {/* )} */}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
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
            value={(propertyData as any)["dealType"]}
          />

          {(propertyData as any).dealType !== "" && (
            <SelectInput
              place="نوع ملک"
              values={propertyTypes}
              category="propertyType" // نام فیلد برای handlePropertyChange
              handlePropertyChange={handlePropertyChange}
              value={(propertyData as any)["propertyType"]}
            />
          )}

          {(propertyData as any).propertyType !== "" && (
            <SelectInput
              place={"دسته بندی"}
              values={categories.map((cat) => cat.title)}
              category={"categoryTitle"}
              handlePropertyChange={handlePropertyChange}
              value={(propertyData as any)["categoryTitle"]}
            />
          )}

          {(propertyData as any).propertyType !== "" && (
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
              value={(propertyData as any)["statusfile"]}
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
          ].includes((propertyData as any).propertyType) &&
            (propertyData as any).statusfile !== "" && (
              <SelectInput
                place={"وضعیت سکونت ملک"}
                values={["تخلیه", "سکونت مستاجر", "سکونت مالک"]}
                category={"occupancyStatus"}
                handlePropertyChange={handlePropertyChange}
                setDealType={setDealType}
                value={(propertyData as any)["occupancyStatus"]}
              />
            )}

          {(propertyData as any).occupancyStatus !== "" && (
            <SelectInput
              place={"وضعیت آگهی"}
              values={["فعال", "غیر فعال"]}
              category={"status"}
              handlePropertyChange={handlePropertyChange}
              setDealType={setDealType}
              value={(propertyData as any)["status"]}
            />
          )}

          <div className="mt-9 flex flex-wrap gap-5">
            {["اجاره"].includes((propertyData as any).dealType) && (
              <CheckboxInput
                idx={0}
                category={"isConvertible"}
                place={"قابل تبدیل"}
                handleArrayFieldChange={handlePropertyCheckbox}
                value={(propertyData as any)["isConvertible"]}
              />
            )}

            {(propertyData as any).dealType !== "" && (
              <CheckboxInput
                idx={0}
                category={"isFeatured"}
                place={"ملک ویژه"}
                handleArrayFieldChange={handlePropertyCheckbox}
                value={(propertyData as any)["isFeatured"]}
              />
            )}
          </div>
        </section>

        {/* ================= اطلاعات مالک ================= */}
        {(propertyData as any).occupancyStatus !== "" && (
          <section className="w-full flex flex-wrap gap-5 border-t border-dashed border-[var(--reversbotder)]/40 p-5">
            <h2 className="text-lg  w-full font-bold">اطلاعات مالک</h2>

            <TextInput
              category={"ownerName"}
              handlePropertyChange={handlePropertyChange}
              place={"نام مالک"}
              isNumber={false}
              value={(propertyData as any).ownerName}
            />

            <TextInput
              category={"ownerMobile"}
              handlePropertyChange={handlePropertyChange}
              place={"موبایل مالک"}
              isNumber={true}
              value={(propertyData as any).ownerMobile}
            />

            <TextInput
              category={"ownerPhone"}
              handlePropertyChange={handlePropertyChange}
              place={"تلفن مالک"}
              isNumber={true}
              value={(propertyData as any).ownerPhone}
            />

            <TextInput
              category={"guardName"}
              handlePropertyChange={handlePropertyChange}
              place={"نام کامل نگهبان"}
              isNumber={false}
              value={(propertyData as any).guardName}
            />

            <TextInput
              category={"guardPhone"}
              handlePropertyChange={handlePropertyChange}
              place={"شماره تماس نگهبان"}
              isNumber={true}
              value={(propertyData as any).guardPhone}
            />
          </section>
        )}

        {/* ================= موقعیت مکانی ================= */}
        {(propertyData as any).occupancyStatus !== "" && (
          <section className="w-full flex flex-wrap gap-5 border-t border-dashed border-[var(--reversbotder)]/40 p-5">
            <h2 className="text-lg w-full font-bold">موقعیت مکانی</h2>

            {/* <TextInput
            category={"province"}
            handlePropertyChange={handlePropertyChange}
            place={"استان"}
            isNumber={false}
            value={(propertyData as any).province}
          />

          <TextInput
            category={"city"}
            handlePropertyChange={handlePropertyChange}
            place={"شهر"}
            isNumber={false}
            value={(propertyData as any).city}
          /> */}

            <SelectInput
              place={"شهر"}
              values={citys?.[0]?.city || []}
              category={"city"}
              handlePropertyChange={handlePropertyChange}
              value={(propertyData as any)["city"]}
            />

            <TextInput
              category={"district"}
              handlePropertyChange={handlePropertyChange}
              place={"منطقه"}
              isNumber={false}
              value={(propertyData as any).district}
            />

            <TextInput
              category={"address"}
              handlePropertyChange={handlePropertyChange}
              place={"آدرس کامل"}
              isNumber={false}
              value={(propertyData as any).address}
            />

            <TextInput
              category={"postalCode"}
              handlePropertyChange={handlePropertyChange}
              place={"کد پستی"}
              isNumber={true}
              value={(propertyData as any).postalCode}
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
        {(propertyData as any).city !== "" && (
          <section className="w-full flex flex-wrap gap-5 border-t border-dashed border-[var(--reversbotder)]/40 p-5">
            <h1 className="w-full font-bold text-4xl mb-5">اطلاعات مالی</h1>

            {(propertyData as any).dealType === "اجاره" ? (
              <>
                <TextInput
                  category={"depositPrice"}
                  handlePropertyChange={handlePropertyChange}
                  place={"مبلغ رهن"}
                  isPrice={true}
                  value={(propertyData as any).depositPrice}
                />

                <TextInput
                  category={"rentPrice"}
                  handlePropertyChange={handlePropertyChange}
                  place={"مقدار اجاره ماهانه"}
                  isPrice={true}
                  value={(propertyData as any).rentPrice}
                />
              </>
            ) : (
              <>
                <TextInput
                  category={"price"}
                  handlePropertyChange={handlePropertyChange}
                  place={"قیمت کل"}
                  isPrice={true}
                  value={(propertyData as any).price}
                />

                {(propertyData as any).meterPrice !== "" &&
                  !isNaN(parseInt((propertyData as any).meterPrice)) && (
                    <p>
                      قیمت هر متر : {parseInt((propertyData as any).meterPrice)}{" "}
                      تومان
                    </p>
                  )}

                {/* <TextInput
                category={"pricePerMeter"}
                handlePropertyChange={handlePropertyChange}
                place={"قیمت برای هر متر"}
                isPrice={true}
                value={(propertyData as any).pricePerMeter}
              /> */}
              </>
            )}
          </section>
        )}
        {((propertyData as any).price !== null ||
          "" ||
          (((propertyData as any).rentPrice !== null || "") &&
            ((propertyData as any).depositPrice !== null || ""))) && (
            <section className="flex flex-wrap border-t border-dashed border-[var(--reversbotder)]/40 py-5">
              <h1 className="w-full mb-5 font-bold text-4xl px-5">ویژگی ها</h1>
              {optionItems.map((optionGroup, groupIndex) => {
                const shouldShowGroup =
                  // !optionGroup.condition
                  // !optionGroup.condition.propertyType
                  // optionGroup.condition.propertyType === "all" ||
                  optionGroup.condition.propertyType.includes(
                    (propertyData as any).propertyType,
                  );

                const shouldShowByDealType =
                  !optionGroup.condition ||
                  !optionGroup.condition.dealType ||
                  optionGroup.condition.dealType === "all" ||
                  optionGroup.condition.dealType.includes(
                    (propertyData as any).dealType,
                  );

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
                              (propertyData as any)[
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
                            (propertyData as any)[
                            getFeatureFieldName(optionGroup.category)
                            ]
                          }
                        />
                      ) : optionGroup.type === "text" ? (
                        <input
                          type="text"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={
                            (propertyData as any)[
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
                            (propertyData as any)?.[
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
        {((propertyData as any).price !== null ||
          "" ||
          (((propertyData as any).rentPrice !== null || "") &&
            ((propertyData as any).depositPrice !== null || ""))) && (
            <section className="flex flex-wrap border-t border-dashed border-[var(--reversbotder)]/40 py-5">
              <h1 className="w-full mb-5 font-bold text-4xl px-5">امکانات ملک</h1>
              {featureItems.map((featureGroup, groupIndex) => {
                const shouldShowGroup =
                  !featureGroup.condition ||
                  !featureGroup.condition.propertyType ||
                  featureGroup.condition.propertyType.includes("all") ||
                  featureGroup.condition.propertyType.includes(
                    (propertyData as any).propertyType,
                  );

                const shouldShowByDealType =
                  !featureGroup.condition ||
                  !featureGroup.condition.dealType ||
                  featureGroup.condition.dealType === "all" ||
                  featureGroup.condition.dealType.includes(
                    (propertyData as any).dealType,
                  );

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
                                    (propertyData as any)[
                                    getFeatureFieldName(featureGroup.category)
                                    ]
                                  }
                                />
                              </Fragment>
                            );
                          })}

                          {hasMoreThanSeven && !isExpanded && (
                            <button
                              className="tabBtn w-[300px] text-right md:relative bottom-[0px] bg-[var(--background)] left-0 mr-10 cursor-pointer"
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
                            (propertyData as any)[
                            getFeatureFieldName(featureGroup.category)
                            ]
                          }
                        />
                      ) : featureGroup.type === "text" ? (
                        <input
                          type="text"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={
                            (propertyData as any)[
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
                            (propertyData as any)[
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

        {(propertyData as any).city !== "" && (
          <>
            <div className=" border-t border-dashed border-[var(--reversbotder)]/40 p-5">
              <h2 className="my-5">توضیحات ملک :</h2>

              <DescriptionToptop
                initialContent={
                  (propertyData as any).description !== ""
                    ? (propertyData as any).description
                    : "بدون محتوا"
                }
                category={"description"}
                onChange={handlePropertyChange}
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
                  value={(propertyData as any).seoTitle}
                />
                <TextInput
                  place="متا دیسکریپشن"
                  category={"seoMeta"}
                  handlePropertyChange={handlePropertyChange}
                  isNumber={false}
                  value={(propertyData as any).seoMeta}
                />

                <h3 className="w-full mt-5 mb-2 mr-3">تگ کنونیکال :</h3>
                <TextInput
                  place="لینک صفحه مبدا"
                  category={"seoCanonikalOrigin"}
                  handlePropertyChange={handlePropertyChange}
                  isNumber={false}
                  value={(propertyData as any).seoCanonikalOrigin}
                />
                <TextInput
                  place="لینک صفحه مقصد"
                  category={"seoCanonikalDestination"}
                  handlePropertyChange={handlePropertyChange}
                  isNumber={false}
                  value={(propertyData as any).seoCanonikalDestination}
                />

                <h3 className="w-full mt-5 mb-2 mr-3">ریدایرکت :</h3>
                <TextInput
                  place="لینک مبدا"
                  category={"seoOrigin"}
                  handlePropertyChange={handlePropertyChange}
                  isNumber={false}
                  value={(propertyData as any).seoOrigin}
                />
                <TextInput
                  place="لینک مقصد"
                  category={"seoDestination"}
                  handlePropertyChange={handlePropertyChange}
                  isNumber={false}
                  value={(propertyData as any).seoDestination}
                />

                <h3 className="w-full mt-5 mb-2 mr-3">نوع ریدایرکت :</h3>
                <button
                  className={`subBtn w-[48%] h-[45px] ${(propertyData as any).seoRedirect === "301" ? "active" : ""}`}
                  onClick={() => {
                    handlePropertyChange("seoRedirect", "301");
                  }}
                >
                  301
                </button>
                <button
                  className={`subBtn w-[48%] h-[45px] ${(propertyData as any).seoRedirect === "302" ? "active" : ""}`}
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

        <button
          onClick={() => {
            if (slug) {
              handleSubmit(slug);
            }
          }}
          className="border border-[var(--title)] text-[var(--foreground)] hover:bg-[var(--title)] cursor-pointer w-full px-6 py-2 rounded-lg"
        >
          به روز رسانی فایل
        </button>
      </div>
    </div>
  );
}
