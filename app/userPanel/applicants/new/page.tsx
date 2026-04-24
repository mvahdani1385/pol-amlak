"use client";

import { useEffect, useState, Fragment } from "react";
import { propertyFeatures } from "@/propertyFeatures.config";
import Link from "next/link";
import TextInput from "@/app/components/themes/TextInput";
import NumberInput from "@/app/components/themes/NumberInput";
import SelectInput from "@/app/components/themes/SelectInput";
import CheckboxInput from "@/app/components/themes/CheckboxInput";
import TextArey from "@/app/components/themes/TextArey";

import dynamic from "next/dynamic";
import { toast } from "react-toastify";

interface data {
  city: string[] | null | undefined;
  Province: string | null | undefined;
}

export default function CreateApplicantForm() {
  const [applicantData, setApplicantData] = useState<any>({
    title: "",
    description: "",
    fullName: "",
    mobile: "",
    phone: "",
    email: "",
    propertyType: "",
    dealType: "",
    status: "active",
    budgetMin: "",
    budgetMax: "",
    city: "",
    province: "",
    latitude: null,
    longitude: null,
    buildingFacade: [],
    floorCovering: [],
    commonAreas: [],
    heatingCooling: [],
    kitchenFeatures: [],
    otherFeatures: [],
    wallCeiling: [],
    parkingTypes: [],
    propertySpecs: [],
    utilities: [],
    minRoomNumber: "",
    maxRoomNumber: "",
    propertydirection: "ثبت نشده",
    propertyUnit: "ثبت نشده",
    propertyFloors: "",
    floor: "",
    unitInFloor: "",
    allUnit: "",
    minLandArea: "",
    maxLandArea: "",
    minBuildingArea: "",
    maxBuildingArea: "",
    categoryTitle: "",
  });

  const MapPicker = dynamic(() => import("../../realestate/new/MapPicker"), { ssr: false });

  const [citys, setCitys] = useState<data[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [seobox, setSeobox] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [dealType, setDealType] = useState<string>("");

  function getPropertyTypes(dealType?: string) {
    const allTypes = [
      "آپارتمان",
      "ویلا",
      "خانه باغ",
      "زمین",
      "دفتر",
      // مغازه تجاری و اداری و دفتر کار و آپارتمان و ویلا و خانه و باغ و زمین و مستغلات و کلنگی و انبار و هتل و دامداری و مرغداری و کارخانه و کارگاه و سوله و زیرزمین و سوئیت و پنت هاوس و رستوران و فروشگاه و نمایشگاه و سالن ورزشی و آموزشی و درمانی و خدماتی و فرهنگی و مذهبی و گردشگری و تفریحی و صنعتی و کشاورزی و دامپروری و شیلات و پرورش طیور و گلخانه و باغچه و مرتع و جنگل و کوهستان و بیابان و ساحل و رودخانه و دریاچه و آبشار و چشمه و معدن و کارخانه و کارگاه و انبار و سوله و پارکینگ و پارک و فضای سبز و زمین ورزشی و زمین بازی و زمین چمن و زمین خاکی و زمین آسفالت و زمین سنگفرش و زمین موزاییکی و زمین بتنی و زمین فلزی و زمین چوبی و زمین پلاستیکی و زمین شیشه‌ای و زمین سرامیکی و زمین کاشی و زمین موزاییک و زمین سنگ و زمین سیمان و زمین گچ و زمین آهک و زمین خاک و زمین شن و زمین ماسه و زمین سیمان و زمین بتن و زمین آجر و زمین بلوک و زمین لوله و زمین تیرآهن و زمین میلگرد و زمین سیمان و زمین گچ و زمین آهک و زمین خاک و زمین شن و زمین ماسه و زمین سیمان و زمین بتن و زمین آجر و زمین بلوک و زمین لوله و زمین تیرآهن و زمین میلگرد و زمین سیمان و زمین گچ و زمین آهک و زمین خاک و زمین شن و زمین ماسه و زمین سیمان و زمین بتن و زمین آجر و زمین بلوک و زمین لوله و زمین تیرآهن و زمین میلگرد
    ];

    // For now, return all types regardless of deal type
    // Later we can customize based on deal type if needed
    return allTypes;
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
      newIds.add(itemId);
      return newIds;
    });
  };


  const handleApplicantChange = (key: string, value: any) => {
    setApplicantData((prev: any) => ({
      ...prev,
      [key]: value,
    }));

  };


  const handleApplicantCheckbox = (key: string, value: any) => {
    setApplicantData((prev: any) => {
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

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setSelectedLocation(location);
    handleApplicantChange("latitude", location.lat);
    handleApplicantChange("longitude", location.lng);
  };

  const handleArrayFieldChange = (fieldName: string, value: string) => {
    const currentValues = applicantData[fieldName] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item: string) => item !== value)
      : [...currentValues, value];

    handleApplicantChange(fieldName, newValues);
  };

  const getFeatureFieldName = (category: string): string => {
    const fieldMapping: { [key: string]: string } = {
      "Utilities": "utilities",
      "Property Specifications": "propertySpecs",
      "Building Facade": "buildingFacade",
      "Common Areas": "commonAreas",
      "Heating & Cooling": "heatingCooling",
      "Floor Covering": "floorCovering",
      "Kitchen": "kitchenFeatures",
      "Other Features": "otherFeatures",
      "Wall & Ceiling": "wallCeiling",
      "Parking Types": "parkingTypes",
      "Property Direction": "propertydirection",
      "Property Unit": "propertyUnit",
      "Total Floors": "propertyFloors",
      "Floor": "floor",
      "Units Per Floor": "unitInFloor",
      "Total Units": "allUnit",
      "Min Land Area": "minLandArea",
      "Max Land Area": "maxLandArea",
      "Min Building Area": "minBuildingArea",
      "Max Building Area": "maxBuildingArea",
      "Min Room Number": "minRoomNumber",
      "Max Room Number": "maxRoomNumber",
      "Category Title": "categoryTitle",
    };
    return fieldMapping[category] || category;
  };

  const handleSubmit = async () => {
    if (applicantData.title === "") {
      toast.warn("وارد کردن عنوان الزامی است");
      return;
    }

    if (applicantData.dealType === "") {
      toast.warn("انتخاب مقدار برای نوع معامله اجباری است");
      return;
    }
    if (applicantData.propertyType === "") {
      toast.warn("انتخاب مقدار برای نوع ملک اجباری است");
      return;
    }

    try {
      const preparedApplicantData = {
        ...applicantData,
        categoryTitle: applicantData.categoryId,
        budgetMin: applicantData.budgetMin ? Number(applicantData.budgetMin) : null,
        budgetMax: applicantData.budgetMax ? Number(applicantData.budgetMax) : null,
        minLandArea: applicantData.minLandArea ? Number(applicantData.minLandArea) : null,
        maxLandArea: applicantData.maxLandArea ? Number(applicantData.maxLandArea) : null,
        minBuildingArea: applicantData.minBuildingArea ? Number(applicantData.minBuildingArea) : null,
        maxBuildingArea: applicantData.maxBuildingArea ? Number(applicantData.maxBuildingArea) : null,
        minRoomNumber: applicantData.minRoomNumber ? Number(applicantData.minRoomNumber) : null,
        maxRoomNumber: applicantData.maxRoomNumber ? Number(applicantData.maxRoomNumber) : null,
        latitude: applicantData.latitude ? Number(applicantData.latitude) : null,
        longitude: applicantData.longitude ? Number(applicantData.longitude) : null,
      };

      console.log(preparedApplicantData);

      const applicantRes = await fetch("/api/applicants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preparedApplicantData),
      });

      if (!applicantRes.ok) {
        const errorData = await applicantRes.json().catch(() => ({}));
        toast.error(errorData.error || "خطا در ثبت متقاضی");
        return;
      }

      const applicant = await applicantRes.json();

      toast.success("متقاضی با موفقیت ثبت شد");
      setTimeout(() => {
        window.location.href = `/userPanel/applicants`;
      }, 500);
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("خطایی در ثبت متقاضی رخ داد");
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
          setCitys(data);
          handleApplicantChange("province", data[0]?.Province || "");
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
      handleApplicantChange("province", citys[0].Province);
    }
  }, [citys]);

  return (
    <div className=" md:p-6 p-0 mt-0 rounded-xl">
      <div className="p-6 md:w-[80%] w-[95%] mx-auto space-y-10 rounded-xl">
        {/* ================= Basic Information ================= */}
        <section className="flex flex-wrap gap-20 p-5">
          <h1 className="w-full font-bold text-4xl">اطلاعات پایه</h1>
          <div className="md:w-[40%] w-[90%]">
            <TextInput
              category={"title"}
              handlePropertyChange={handleApplicantChange}
              place={"عنوان متقاضی"}
              isNumber={false}
              value={applicantData.title}
            />


            <TextArey
              category={"description"}
              handlePropertyChange={handleApplicantChange}
              place={"توضیحات متقاضی"}
              value={applicantData["description"]}
            />
          </div>
        </section>

        {/* ================= Type and Status ================= */}
        <section className="w-full flex flex-wrap gap-5 border-t border-dashed border-[var(--reversbotder)]/40 p-5">
          <h2 className="text-lg w-full font-bold">نوع و وضعیت</h2>

          <SelectInput
            place={"نوع و وضعیت"}
            values={["خرید", "فروش", "اجاره", "مشارکت", "پیش فروش"]}
            category={"dealType"}
            handlePropertyChange={handleApplicantChange}
            setDealType={setDealType}
            value={applicantData["dealType"]}
          />

          {applicantData.dealType && (
            <SelectInput
              place="نوع ملک"
              values={propertyTypes}
              category="propertyType"
              handlePropertyChange={handleApplicantChange}
              value={applicantData["propertyType"]}
            />
          )}

          {applicantData.propertyType && (
            <SelectInput
              place={"دسته بندی"}
              values={categories.map(cat => cat.title)}
              category={"categoryId"}
              handlePropertyChange={handleApplicantChange}
              value={applicantData["categoryId"]}
            />
          )}

          {applicantData.propertyType && (
            <SelectInput
              place={"وضعیت"}
              values={["فعال", "غیر فعال"]}
              category={"status"}
              handlePropertyChange={handleApplicantChange}
              value={applicantData["status"]}
            />
          )}
        </section>

        {/* ================= Applicant Information ================= */}
        {applicantData.dealType && (
          <section className="w-full flex flex-wrap gap-5 border-t border-dashed border-[var(--reversbotder)]/40 p-5">
            <h2 className="text-lg  w-full font-bold">اطلاعات متقاضی</h2>

            <TextInput
              category={"fullName"}
              handlePropertyChange={handleApplicantChange}
              place={"نام کامل"}
              isNumber={false}
              value={applicantData.fullName}
            />

            <TextInput
              category={"mobile"}
              handlePropertyChange={handleApplicantChange}
              place={"شماره موبایل"}
              isNumber={true}
              value={applicantData.mobile}
            />

            <TextInput
              category={"email"}
              handlePropertyChange={handleApplicantChange}
              place={"ایمیل"}
              isNumber={false}
              value={applicantData.email}
            />
          </section>
        )}

        {/* ================= Location ================= */}
        {applicantData.fullName && (
          <section className="w-full flex flex-wrap gap-5 border-t border-dashed border-[var(--reversbotder)]/40 p-5">
            <h2 className="text-lg w-full font-bold">موقعیت مکانی</h2>

            <SelectInput
              place={"شهر"}
              values={citys?.[0]?.city || []}
              category={"city"}
              handlePropertyChange={handleApplicantChange}
              value={applicantData["city"]}
            />

            <TextInput
              category={"address"}
              handlePropertyChange={handleApplicantChange}
              place={"آدرس کامل"}
              isNumber={false}
              value={applicantData.address}
            />
          </section>
        )}

        {/* ================= Budget ================= */}
        {applicantData.city && (
          <section className="w-full flex flex-wrap gap-5 border-t border-dashed border-[var(--reversbotder)]/40 p-5">
            <h1 className="w-full font-bold text-4xl">اطلاعات مالی</h1>

            <TextInput
              category={"budgetMin"}
              handlePropertyChange={handleApplicantChange}
              place={"حداقل بودجه"}
              isPrice={true}
              value={applicantData.budgetMin}
            />

            <TextInput
              category={"budgetMax"}
              handlePropertyChange={handleApplicantChange}
              place={"حداکثر بودجه"}
              isPrice={true}
              value={applicantData.budgetMax}
            />
          </section>
        )}

        {/* ================= Property Specifications ================= */}
        {applicantData.budgetMin && (
          <section className="w-full flex flex-wrap gap-5 border-t border-dashed border-[var(--reversbotder)]/40 p-5">
            <h1 className="w-full font-bold text-4xl">مشخصات ملک مورد نظر</h1>

            <TextInput
              category={"minRoomNumber"}
              handlePropertyChange={handleApplicantChange}
              place={"حداقل تعداد اتاق"}
              isNumber={true}
              value={applicantData.minRoomNumber}
            />

            <TextInput
              category={"maxRoomNumber"}
              handlePropertyChange={handleApplicantChange}
              place={"حداکثر تعداد اتاق"}
              isNumber={true}
              value={applicantData.maxRoomNumber}
            />

            <TextInput
              category={"minBuildingArea"}
              handlePropertyChange={handleApplicantChange}
              place={"حداقل متراژ بنا (متر مربع)"}
              isNumber={true}
              value={applicantData.minBuildingArea}
            />

            <TextInput
              category={"maxBuildingArea"}
              handlePropertyChange={handleApplicantChange}
              place={"حداکثر متراژ بنا (متر مربع)"}
              isNumber={true}
              value={applicantData.maxBuildingArea}
            />
          </section>
        )}

        {/* ================= Submit Button ================= */}
        {applicantData.minRoomNumber && (
          <section className="w-full flex flex-wrap gap-5 border-t border-dashed border-[var(--reversbotder)]/40 p-5">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              ثبت متقاضی
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
