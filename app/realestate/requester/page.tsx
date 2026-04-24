"use client";

import { useEffect, useState, Fragment } from "react";
import { propertyFeatures } from "@/propertyFeatures.config";
import Link from "next/link";
import TextInput from "@/app/components/themes/TextInput";
import NumberInput from "@/app/components/themes/NumberInput";
import SelectInput from "@/app/components/themes/SelectInput";
import CheckboxInput from "@/app/components/themes/CheckboxInput";
import TextArey from "@/app/components/themes/TextArey";
import Header from "@/app/components/themes/Header";
import Footer from "@/app/components/themes/Footer";

import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import Breadcrumbs from "@/app/components/themes/Breadcrumbs";

interface data {
  city: string[] | null | undefined;
  Province: string | null | undefined;
}

export default function Requester() {
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

  const MapPicker = dynamic(() => import("../../userPanel/realestate/new/MapPicker"), { ssr: false });

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
      "ویلایی",
      "خانه باغ",
      "زمین",
      "اداری",
      "مغازه",
      "تجاری",
      "ساختمان قدیمی",
      "انبار",
      "هتل",
      "باغ",
      "دامداری",
      "مرغداری",
      "کارخانه",
      "کارگاه",
      "تالار",
      "پارکینگ",
      "سوئیت",
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
      "تاسیسات": "utilities",
      "مشخصات ملک": "propertySpecs",
      "نما": "buildingFacade",
      "امکانات": "commonAreas",
      "سیستم گرمایش و سرمایش": "heatingCooling",
      "پوشش کف": "floorCovering",
      "آشپزخانه": "kitchenFeatures",
      "ویژگی های دیگر": "otherFeatures",
      "دیوار و سقف": "wallCeiling",
      "انواع پارکینگ": "parkingTypes",
      "جهت ملک": "propertydirection",
      "واحد ملک": "propertyUnit",
      "تعداد کل طبقات": "propertyFloors",
      "طبقه": "floor",
      "تعداد واحد در هر طبقه": "unitInFloor",
      "تعداد کل واحد": "allUnit",
      "حداقل متراژ زمین": "minLandArea",
      "حداکثر متراژ زمین": "maxLandArea",
      "حداقل متراژ بنا": "minBuildingArea",
      "حداکثر متراژ بنا": "maxBuildingArea",
      "حداقل تعداد اتاق": "minRoomNumber",
      "حداکثر تعداد اتاق": "maxRoomNumber",
      "عنوان دسته بندی": "categoryTitle",
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
        window.location.href = `/`;
      }, 500);
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("خطایی در ثبت متقاضی رخ داد");
    }
  };

  useEffect(() => {
    document.title = 'فرم متقاضی';
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
    <>
      <Header />
      <div className="md:p-6 p-0 mt-0 rounded-xl">
        <div className="p-6 md:w-[80%] w-[95%] mx-auto space-y-10 rounded-xl mt-20 md:mt-40">
          <Breadcrumbs
            sitMap={[
              { name: "املاک", url: "/realestate" },
              { name: 'فرم متقاضی', url: `/articles/requester` },
            ]}
          />
          {/* ================= Basic Information ================= */}
          <section className="flex flex-wrap gap-5 p-5">
            <h1 className="w-full font-bold text-4xl">فرم متقاضی</h1>
            <p className="w-full text-[var(--title)]">اطلاعات فرم را مرحله به مرحله وارد نمایید</p>
            <div className="md:w-[40%] w-[90%]">
              <TextInput
                category={"title"}
                handlePropertyChange={handleApplicantChange}
                place={"عنوان تقاضا"}
                isNumber={false}
                value={applicantData.title}
              />
            </div>
          </section>

          {/* ================= Type and Status ================= */}
          <section className="w-full flex flex-wrap gap-5 border-t border-dashed border-[var(--reversbotder)]/40 p-5">
            <h2 className="text-lg w-full font-bold">نوع و وضعیت</h2>

            <SelectInput
              place={"نوع معامله"}
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

            {/* {applicantData.propertyType && (
            <SelectInput
              place={"دسته بندی"}
              values={categories.map(cat => cat.title)}
              category={"categoryId"}
              handlePropertyChange={handleApplicantChange}
              value={applicantData["categoryId"]}
            />
          )} */}

            {/* {applicantData.propertyType && (
            <SelectInput
              place={"وضعیت"}
              values={["فعال", "غیر فعال"]}
              category={"status"}
              handlePropertyChange={handleApplicantChange}
              value={applicantData["status"]}
            />
          )} */}
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

              {/* <TextInput
              category={"address"}
              handlePropertyChange={handleApplicantChange}
              place={"آدرس کامل"}
              isNumber={false}
              value={applicantData.address}
            /> */}
            </section>
          )}

          {/* ================= Budget ================= */}
          {applicantData.city && (
            <section className="w-full flex flex-wrap gap-5 border-t border-dashed border-[var(--reversbotder)]/40 p-5">
              <h1 className="w-full font-bold text-lg">اطلاعات مالی</h1>
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

              <TextArey
                category={"description"}
                handlePropertyChange={handleApplicantChange}
                place={"توضیحات متقاضی"}
                value={applicantData["description"]}
              />
            </section>
          )}

          {/* ================= Submit Button ================= */}
          {applicantData.minRoomNumber && (
            <section className="w-full flex flex-wrap gap-5 border-t border-dashed border-[var(--reversbotder)]/40 p-5">
              <button
                onClick={handleSubmit}
                className="subBtn w-full h-[45px]"
              >
                ثبت متقاضی
              </button>
            </section>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}