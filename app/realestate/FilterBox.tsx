"use client";

import { useEffect, useState, useRef } from "react";
import SelectInput from "./SelectInput";
import TextInput from "@/app/components/themes/TextInput";
import { propertyFeatures } from "@/propertyFeatures.config";

interface FilterBox {
  filters: string;
  onFilterChange?: (value: string) => void;
  closedlightBox?: any;
}

interface CitisDtat {
  city: string[] | null | undefined;
  Province: string | null | undefined;
}

interface FilterDataType {
  minPrice: String;
  maxPrice: String;
  minDeposit: String;
  maxDeposit: String;
  minRent: String;
  maxRent: String;
  minMeterPrice: String;
  maxMeterPrice: String;
  isConvertible: String;
  city: String;
  dealType: String;
  propertyType: String;
  occupancyStatus: String;
  roomNumber: String;
  propertydirection: String;
  propertyUnit: String;
  propertyFloors: String;
  statusfile: String;
  minCreateYear: String;
  maxCreateYear: String;
  parkingnum: String;
  meterPrice: String;
  floor: String;
  unitInFloor: String;
  allUnit: String;
  minBuildingArea: String;
  maxBuildingArea: String;
  minLandArea: String;
  maxLandArea: String;
  utilities: String[];
  propertySpecs: String;
  buildingFacade: String;
  commonAreas: String;
  heatingCooling: String;
  floorCovering: String;
  kitchenFeatures: String;
  bathroomFeatures: String;
  wallCeiling: String;
  parkingTypes: String;
  otherFeatures: String;
}

interface FilterItem {
  filter: string;
  persian: string;
  value: string;
}

function FilterBox({ filters, onFilterChange, closedlightBox }: FilterBox) {
  const enToFa = {
    minPrice: "کف قیمت",
    maxPrice: "سقف قیمت",
    minDeposit: "کف قیمت رهن",
    maxDeposit: "سقف قیمت رهن",
    minRent: "کف قیمت اجاره",
    maxRent: "سقف قیمت اجاره",
    isConvertible: "قابل تبدیل",
    minMeterPrice: "کف قیمت هر متر",
    maxMeterPrice: "سقف قیمت هر متر",
    minCreateYear: "حداقل سال ساخت",
    maxCreateYear: "حداکثر سال ساخت",
    city: "شهر",
    statusfile: "وضعیت ملک",
    parkingnum: "تعداد پارکینگ",
    constructionYear: "سال ساخت",
    propertyStatus: "وضعیت ملک",
    dealType: "نوع معامله",
    propertyType: "نوع ملک",
    occupancyStatus: "وضعیت سکونت",
    roomNumber: "تعداد اتاق",
    propertydirection: "جهت قطعه",
    propertyUnit: "جهت واحد",
    propertyFloors: "تعداد کل طبقات",
    floor: "طبقه",
    unitInFloor: "تعداد واحد در طبقه",
    allUnit: "تعداد کل واحد ها",
    minBuildingArea: "کمترین متراژ بنا",
    maxBuildingArea: "بیشترین متراژ بنا",
    minLandArea: "کمترین متراژ زمین",
    maxLandArea: "بیشترین متراژ زمین",
    utilities: "امتیازات",
    propertySpecs: "مشخصات ملک",
    buildingFacade: "نمای ساختمان",
    commonAreas: "مشاعات",
    heatingCooling: "سرمایش و گرمایش",
    floorCovering: "پوشش کف",
    kitchenFeatures: "آشپزخانه",
    bathroomFeatures: "سرویس بهداشتی و حمام",
    wallCeiling: "سقف و دیوار",
    parkingTypes: "نوع پارکینگ",
    parkingCount: "تعداد پارکینگ",
    otherFeatures: "سایر امکانات",
  };

  const faToEn = {
    امتیازات: "utilities",
    "مشخصات ملک": "propertySpecs",
    "نمای ساختمان": "buildingFacade",
    مشاعات: "commonAreas",
    "تاسیسات سرمایش و گرمایش": "heatingCooling",
    "پوشش کف": "floorCovering",
    آشپزخانه: "kitchenFeatures",
    "سرویس بهداشتی و حمام": "bathroomFeatures",
    "سقف و دیوار": "wallCeiling",
    "نوع پارکینگ": "parkingTypes",
    "تعداد پارکینگ": "parkingCount",
    "سایر امکانات": "otherFeatures",
  };

  const [filterData, setFilterData] = useState<FilterDataType>({
    minPrice: "",
    maxPrice: "",
    minDeposit: "",
    maxDeposit: "",
    minRent: "",
    maxRent: "",
    minMeterPrice: "",
    maxMeterPrice: "",
    minCreateYear: "",
    maxCreateYear: "",
    isConvertible: "",
    city: "",
    dealType: "",
    propertyType: "",
    occupancyStatus: "",
    roomNumber: "",
    propertydirection: "",
    propertyUnit: "",
    propertyFloors: "",
    statusfile: "",
    parkingnum: "",
    meterPrice: "",
    floor: "",
    unitInFloor: "",
    allUnit: "",
    minBuildingArea: "",
    maxBuildingArea: "",
    minLandArea: "",
    maxLandArea: "",
    utilities: [],
    propertySpecs: "",
    buildingFacade: "",
    commonAreas: "",
    heatingCooling: "",
    floorCovering: "",
    kitchenFeatures: "",
    bathroomFeatures: "",
    wallCeiling: "",
    parkingTypes: "",
    otherFeatures: "",
  });

  function getPropertyTypes(dealType?: any) {
    const optionsMap = {
      فروش: [
        "آپارتمان",
        "ویلا",
        "حیاط‌دار",
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
        "حیاط‌دار",
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
        "حیاط‌دار",
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

  const propertyTypes = getPropertyTypes(filterData.dealType);

  const [citis, setCitis] = useState<CitisDtat[]>([]);

  const [filterList, setFilterList] = useState<FilterItem[]>([]);

  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const handleFilterChange = (key: string, value: any) => {
    setFilterData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };


  const handleArrayFieldChange = (fieldName: string, value: string) => {
    const currentValues = (filterData as any)[fieldName] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item: string) => item !== value)
      : [...currentValues, value];

    handleFilterChange(fieldName, newValues);
  };

  useEffect(() => {
    if (!filterList) {
      return;
    }
    const currentFilterList = [...filterList];
    let listHasChanged = false;

    const dataToProcess = filterData as FilterDataType;

    Object.keys(dataToProcess).forEach((fil) => {
      const value = (dataToProcess as any)[fil];
      const persianLabel = (enToFa as Record<string, string>)[fil];

      // if (persianLabel === undefined) {
      //     const persianLabel = fil;
      //     console.log(faToEn[persianLabel])
      // }

      const existingFilterIndex = currentFilterList.findIndex(
        (item) => item.filter === fil,
      );
      if (value !== "" && value !== undefined && value.length > 0) {
        const newItem = { filter: fil, persian: persianLabel, value: value };

        if (existingFilterIndex > -1) {
          if (
            JSON.stringify(currentFilterList[existingFilterIndex]) !==
            JSON.stringify(newItem)
          ) {
            currentFilterList.splice(existingFilterIndex, 1, newItem);
            listHasChanged = true;
          }
        } else {
          currentFilterList.push(newItem);
          listHasChanged = true;
        }
      } else {
        if (existingFilterIndex > -1) {
          currentFilterList.splice(existingFilterIndex, 1);
          listHasChanged = true;
        }
      }
    });

    if (listHasChanged) {
      setFilterList(currentFilterList);
    }
  }, [filterData, enToFa, faToEn, filterList, setFilterList]);

  useEffect(() => {
    // دریافت رشته کوئری URL به صورت دستی
    const queryString = window.location.search;

    // اگر رشته کوئری خالی بود، کاری انجام نده
    if (!queryString) {
      return;
    }

    // حذف کاراکتر '?' در ابتدای رشته
    const paramsString = queryString.substring(1);

    // تقسیم رشته به جفت‌های کلید=مقدار
    const paramPairs = paramsString.split("&");

    const newFilterData = { ...filterData }; // کپی از وضعیت فعلی

    paramPairs.forEach((pair) => {
      // تقسیم هر جفت به کلید و مقدار
      const [key, value] = pair.split("=");

      // اگر کلید یا مقدار خالی بود، از آن صرف نظر کن
      if (!key || !value) {
        return;
      }

      // decodeURIComponent برای مقادیر فارسی یا خاص
      const decodedKey = decodeURIComponent(key);
      const decodedValue = decodeURIComponent(value);

      // اینجا باید منطق تبدیل مقدار از URL به فرمت مورد نیاز filterData را پیاده کنید
      // به خصوص برای مواردی که مقادیر آرایه‌ای هستند یا نیاز به تجزیه دارند.

      // مثال برای برخی از فیلدها:
      if (newFilterData.hasOwnProperty(decodedKey)) {
        if (
          decodedKey === "utilities" ||
          decodedKey === "commonAreas" ||
          decodedKey === "heatingCooling" ||
          decodedKey === "kitchenFeatures" ||
          decodedKey === "bathroomFeatures" ||
          decodedKey === "wallCeiling" ||
          decodedKey === "parkingTypes" ||
          decodedKey === "parkingCount" ||
          decodedKey === "otherFeatures"
        ) {
          // پردازش مقادیر آرایه‌ای که ممکن است به صورت '[آب,گاز]' آمده باشند
          if (decodedValue.startsWith("[") && decodedValue.endsWith("]")) {
            try {
              const items = decodedValue
                .substring(1, decodedValue.length - 1)
                .split(",");
              (newFilterData as any)[decodedKey] = items.map((item) =>
                item.trim(),
              );
            } catch (e) {
              console.error(`Failed to parse array for key ${decodedKey}:`, e);
            }
          } else {
            // اگر مقدار آرایه نبود، شاید یک مقدار تکی باشد (بسته به نحوه ارسال)
            // newFilterData[decodedKey] = [decodedValue]; // یا مدیریت خطا
            console.warn(
              `Value for key ${decodedKey} is not in expected array format '[item1,item2]'.`,
            );
          }
        } else if (decodedKey === "propertySpecs") {
          // مشابه بالا برای propertySpecs
          if (decodedValue.startsWith("[") && decodedValue.endsWith("]")) {
            try {
              const items = decodedValue
                .substring(1, decodedValue.length - 1)
                .split(",");
              (newFilterData as any)[decodedKey] = items.map((item) =>
                item.trim(),
              );
            } catch (e) {
              console.error(`Failed to parse array for key ${decodedKey}:`, e);
            }
          } else {
            console.warn(
              `Value for key ${decodedKey} is not in expected array format '[item1,item2]'.`,
            );
          }
        } else {
          // برای فیلدهای عادی (string, number)
          (newFilterData as any)[decodedKey] = decodedValue;
        }
      }
    });

    // به‌روزرسانی وضعیت filterData
    setFilterData(newFilterData);

    // اگر تابع دیگری دارید که باید با این فیلترهای جدید فراخوانی شود، اینجا انجام دهید
    // مثال: applyFilters(newFilterData);
  }, []);

  const handleFilters = () => {
    const finalList: string[] = [];



    // if (filterList.length > 0) {
    filterList.map((fil: any) => {
      if (typeof fil.value === "object") {
        finalList.push(`${fil.filter}=[${fil.value}]`);
      } else {
        finalList.push(`${fil.filter}=${fil.value}`);
      }
    });

    if (onFilterChange && closedlightBox) {
      const queryString = finalList.join("&");
      onFilterChange(queryString);
      closedlightBox();
    }
    // }
  };

  useEffect(() => {
    if (!["زمین"].includes((filterData as any).propertyType)) {
      handleFilterChange("occupancyStatus", "");
    }
  }, [filterData.propertyType]);

  const formatPrice = (price: any) => {
    if (!price) return "";
    const numericValue = String(price).replace(/\D/g, "");
    if (!numericValue) return "";

    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, "٬");
  };
  let count = 0;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const listRef = useRef<HTMLDivElement>(null);
  const [highlightedElement, setHighlightedElement] =
    useState<HTMLElement | null>(null);

  // تابعی برای دریافت مقدار اینپوت و به‌روزرسانی state
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // تابعی برای یافتن عنصر مطابقت‌دارنده در div
  const findMatchingElement = (term: string): HTMLElement | null => {
    if (!listRef.current || !term) {
      return null;
    }

    const children = listRef.current.children;
    for (let i = 0; i < children.length; i++) {
      const element = children[i] as HTMLElement;
      // فرض می‌کنیم هر عنصر فرزند دارای textContent است
      // می‌توانید این منطق را بسته به ساختار HTML خود تغییر دهید
      if (element.textContent?.includes(term)) {
        return element;
      }
    }
    return null;
  };

  // استفاده از useEffect برای اسکرول کردن هنگامی که searchTerm تغییر می‌کند
  useEffect(() => {
    const matchingElement = findMatchingElement(searchTerm);

    // پاک کردن برجستگی از عنصر قبلی (اگر وجود داشت)
    if (highlightedElement) {
      highlightedElement.classList.remove("textfind");
    }

    if (matchingElement) {
      // افزودن کلاس برجستگی به عنصر جدید
      matchingElement.classList.add("textfind");
      // ذخیره عنصر پیدا شده در state برای مدیریت در آینده
      setHighlightedElement(matchingElement);
      // اسکرول کردن به عنصر پیدا شده
      matchingElement.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      // اگر عنصری پیدا نشد، state را پاک می‌کنیم
      setHighlightedElement(null);
    }
  }, [searchTerm, highlightedElement]);

  // const handleEnToFa = ((filterName: string) => {
  //     enToFa[filterName]
  // })

  // useEffect(() => {
  //     console.log(citis)
  // }, [citis])

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
  }, []);

  return (
    <div className="lightbox">
      <div className="filterForm relative w-[97%] md:w-[60%] h-[85%] m-auto mt-[2.5%] rounded-xl bg-[var(--inputback)]/70 border border-[var(--headertext)]/8 overflow-hidden">
        <div className="hed w-full h-[100px] flex justify-center gap-2 md:gap-5 items-center">
          <button
            className="w-[100px] h-[60px] rounded-xl cursor-pointer transition hover:shadow-[var(--blackshadow)] border border-[var(--headertext)]/10 shadow-none bg-[var(--inputback)]"
            onClick={() => {
              closedlightBox();
            }}
          >
            بستن
          </button>
          <input
            type="text"
            placeholder=" بین فیلتر ها جست و جو کن ..."
            value={searchTerm}
            onChange={handleInputChange}
            className="w-[250px] md:w-[600px] h-[60px] rounded-xl transition focus:shadow-[var(--blackshadow)] border border-[var(--headertext)]/10 shadow-none bg-[var(--inputback)] outline-none px-6"
          />
          <button className="w-[150px] hidden md:block h-[60px] rounded-xl cursor-pointer transition hover:shadow-[var(--blackshadow)] border border-[var(--headertext)]/10 shadow-none bg-[var(--inputback)]">
            جست و جو
          </button>
        </div>

        <div
          ref={listRef}
          className="inputs w-full mx-1 md:mx-13 h-[75%] md:pb-[100px] overflow-y-scroll"
        >
          <div className="inputsCategory">
            <h2>فیلتر های فعال</h2>
            {filterList.length <= 0 && <p>هیچ فیلتری اعمال نشده است.</p>}
            {filterList.map((filter, idx) => {
              return (
                <p
                  key={idx}
                  className="ccdiv border px-4 py-1 rounded-full mx-2 flex gap-3 border-[var(--title)]"
                >
                  <span
                    className="cursor-pointer transition hover:text-red-300"
                    onClick={() => {
                      handleFilterChange(filter.filter, "");
                    }}
                  >
                    x
                  </span>
                  {filter.persian}
                </p>
              );
            })}
          </div>

          <div className="inputsCategory pt-10">
            <h2>اطلاعات پایه</h2>
            {/* <div className="w-full mt-15">
                            <h4>سال ساخت : </h4>
                                <input
                                    type="text"
                                    id=""
                                    className="w-[300px] h-[45px]"
                                    placeholder="سال ساخت را وارد کنید"
                                    value={filterData.}
                                    onChange={(e) => {
                                        handleFilterChange('', e.target.value)
                                    }}
                                />
                        </div> */}

            <div className="flex flex-wrap gap-5">
              {/* <SelectInput
                                place="وضعیت ملک"
                                category=""
                                values={['', '', '', '', '']}
                                value={filterData.}
                                handlePropertyChange={handleFilterChange}
                            /> */}

              <SelectInput
                place="شهر"
                category="city"
                values={
                  citis && citis[0] && citis[0].city
                    ? citis[0].city
                    : ["انتخاب شهر"]
                }
                value={filterData.city}
                handlePropertyChange={handleFilterChange}
              />

              <SelectInput
                place="نوع معامله"
                category="dealType"
                values={["خرید", "فروش", "اجاره", "مشارکت", "پیش فروش"]}
                value={filterData.dealType}
                handlePropertyChange={handleFilterChange}
              />

              <SelectInput
                place="نوع ملک"
                category="propertyType"
                // values={["آپارتمان", "ویلا", "زمین", "مستغلات"]}
                values={propertyTypes}
                value={filterData.propertyType}
                handlePropertyChange={handleFilterChange}
              />

              <SelectInput
                place="وضعیت ملک"
                category="statusfile"
                values={[
                  "پایان کار",
                  "قولنامه ای",
                  "سند دار",
                  "وام دار",
                  "قابل معاوضه",
                ]}
                value={filterData.statusfile}
                handlePropertyChange={handleFilterChange}
              />

              {["آپارتمان", "ویلا", "مستغلات"].includes(
                (filterData as any).propertyType,
              ) && (
                  <SelectInput
                    place="وضعیت سکونت"
                    category="occupancyStatus"
                    values={["تخلیه", "سکونت مستاجر", "سکونت مالک"]}
                    value={filterData.occupancyStatus}
                    handlePropertyChange={handleFilterChange}
                  />
                )}

              {/* <SelectInput
                                place="وضعیت ملک"
                                category=""
                                values={['', '', '', '', '']}
                                value={filterData.}
                                handlePropertyChange={handleFilterChange}
                            /> */}
            </div>
          </div>

          <div className="inputsCategory pt-10">
            {filterData.dealType !== "" && <h2>اطلاعات مالی</h2>}
            {(filterData as any).dealType === "اجاره" ? (
              <>
                <div className="w-full mt-0">
                  <h4>مقدار رهن : </h4>
                  <div className="reang w-full flex flex-wrap items-start md:flex-row">
                    <div className="flex items-center gap-3">
                      از
                      <input
                        type="text"
                        id="minDeposit"
                        className="w-[200px] h-[40px]"
                        value={formatPrice(filterData.minDeposit)}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(/\D/g, "");
                          handleFilterChange("minDeposit", numericValue);
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      تا
                      <input
                        type="text"
                        id="maxDeposit"
                        className="w-[200px] h-[40px]"
                        value={formatPrice(filterData.maxDeposit)}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(/\D/g, "");
                          handleFilterChange("maxDeposit", numericValue);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full mt-10">
                  <h4>مقدار اجاره : </h4>
                  <div className="reang w-full flex flex-wrap items-start md:flex-row">
                    <div className="flex items-center gap-3">
                      از
                      <input
                        type="text"
                        id="minRent"
                        className="w-[200px] h-[40px]"
                        value={formatPrice(filterData.minRent)}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(/\D/g, "");
                          handleFilterChange("minRent", numericValue);
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      تا
                      <input
                        type="text"
                        id="maxRent"
                        className="w-[200px] h-[40px]"
                        value={formatPrice(filterData.maxRent)}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(/\D/g, "");
                          handleFilterChange("maxRent", numericValue);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full mt-10">
                  <label
                    htmlFor="isConvertible"
                    className={`checkboxlabel w-[300px] h-[50px] ${filterData.isConvertible ? "active" : ""}`}
                  >
                    قابل تبدیل
                    <input
                      type="checkbox"
                      id="isConvertible"
                      value={formatPrice(filterData.isConvertible)}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        if (isChecked === false) {
                          handleFilterChange("isConvertible", "");
                        } else {
                          handleFilterChange("isConvertible", "true");
                        }
                      }}
                      checked={
                        filterData.isConvertible === "true" ? true : false
                      }
                    />
                  </label>
                </div>
              </>
            ) : (
              (filterData as any).dealType !== "اجاره" && (
                <>
                  <div className="w-full">
                    <h4>قیمت کل : </h4>
                    <div className="reang w-full flex flex-wrap items-start md:flex-row">
                      <div className="flex items-center gap-3">
                        از
                        <input
                          type="text"
                          id="minPrice"
                          className="w-[200px] h-[40px]"
                          value={formatPrice(filterData.minPrice)}
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(
                              /\D/g,
                              "",
                            );
                            handleFilterChange("minPrice", numericValue);
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        تا
                        <input
                          type="text"
                          id="maxPrice"
                          className="w-[200px] h-[40px]"
                          value={formatPrice(filterData.maxPrice)}
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(
                              /\D/g,
                              "",
                            );
                            handleFilterChange("maxPrice", numericValue);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-full mt-10">
                    <h4>قیمت به ازای هر متر : </h4>
                    <div className="reang w-full flex flex-wrap items-start md:flex-row">
                      <div className="flex items-center gap-3">
                        از
                        <input
                          type="text"
                          id=""
                          className="w-[200px] h-[40px]"
                          value={formatPrice(filterData.minMeterPrice)}
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(
                              /\D/g,
                              "",
                            );
                            handleFilterChange("minMeterPrice", numericValue);
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        تا
                        <input
                          type="text"
                          id=""
                          className="w-[200px] h-[40px]"
                          value={formatPrice(filterData.maxMeterPrice)}
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(
                              /\D/g,
                              "",
                            );
                            handleFilterChange("maxMeterPrice", numericValue);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )
            )}
          </div>

          <div className="inputsCategory pt-10">
            <h2>ویژگی های ملک</h2>
            <div className="w-full flex flex-wrap gap-5">
              {[
                "آپارتمان",
                "ویلا",
                "حیاط دار",
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
              ].includes((filterData as any).propertyType) && (
                  <>

                    <div className="w-full mt-0">
                      <h4>سال ساخت : </h4>
                      <div className="reang w-full flex flex-wrap items-start md:flex-row">
                        <div className="flex items-center gap-3">
                          از
                          <input
                            type="text"
                            id="minCreateYear"
                            className="w-[200px] h-[40px]"
                            value={formatPrice(filterData.minCreateYear)}
                            onChange={(e) => {
                              const numericValue = e.target.value.replace(
                                /\D/g,
                                "",
                              );
                              handleFilterChange("minCreateYear", numericValue);
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          تا
                          <input
                            type="text"
                            id="maxCreateYear"
                            className="w-[200px] h-[40px]"
                            value={formatPrice(filterData.maxCreateYear)}
                            onChange={(e) => {
                              const numericValue = e.target.value.replace(
                                /\D/g,
                                "",
                              );
                              handleFilterChange("maxCreateYear", numericValue);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <SelectInput
                      place="جهت ملک"
                      category="propertydirection"
                      values={["شمالی", "غربی", "جتوبی", "شرقی"]}
                      value={filterData.propertydirection}
                      handlePropertyChange={handleFilterChange}
                    />
                    <SelectInput
                      place="تعداد اتاق"
                      category="roomNumber"
                      values={["1", "2", "3", "4", "5"]}
                      value={filterData.roomNumber}
                      handlePropertyChange={handleFilterChange}
                    />
                    {/* <TextInput 
                    place="سال ساخت"
                    category="createYear"
                    value={filterData.createYear}
                    handlePropertyChange={handleFilterChange}
                  /> */}
                  </>
                )}

              {[
                "آپارتمان",
                "دفتر کار",
                "مغازه",
                "مستغلات",
                "هتل",
                "سوئیت",
              ].includes((filterData as any).propertyType) && (
                  <>
                    <SelectInput
                      place="جهت واحد"
                      category="propertyUnit"
                      values={["شمالی", "غربی", "جتوبی", "شرقی"]}
                      value={filterData.propertyUnit}
                      handlePropertyChange={handleFilterChange}
                    />
                    <SelectInput
                      place="تعداد کل طبقات"
                      category="propertyFloors"
                      values={["1", "2", "3", "4", "5", "6"]}
                      value={filterData.propertyFloors}
                      handlePropertyChange={handleFilterChange}
                    />
                    <SelectInput
                      place="طبقه"
                      category="floor"
                      values={["1", "2", "3", "4", "5", "6", "7"]}
                      value={filterData.floor}
                      handlePropertyChange={handleFilterChange}
                    />

                    <SelectInput
                      place="تعداد واحد در طبقه"
                      category="unitInFloor"
                      values={["1", "2", "3", "4", "5", "6", "7"]}
                      value={filterData.unitInFloor}
                      handlePropertyChange={handleFilterChange}
                    />

                    <SelectInput
                      place="تعداد پارکینگ"
                      category="parkingnum"
                      values={["1", "2", "3", "4", "5", "6", "7"]}
                      value={filterData.parkingnum}
                      handlePropertyChange={handleFilterChange}
                    />

                    <SelectInput
                      place="تعداد کل واحد ها"
                      category="propertyUnit"
                      values={["1", "2", "3", "4", "5", "6", "7"]}
                      value={filterData.propertyUnit}
                      handlePropertyChange={handleFilterChange}
                    />
                  </>
                )}
            </div>

            {[
              "آپارتمان",
              "ویلا",
              "حیاط دار",
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
            ].includes((filterData as any).propertyType) && (
                <div className="w-full mt-10">
                  <h4>متراژ بنا : </h4>
                  <div className="reang w-full flex flex-wrap items-start md:flex-row">
                    <div className="flex items-center gap-3">
                      از
                      <input
                        type="text"
                        id="minBuildingArea"
                        className="w-[200px] h-[40px]"
                        value={formatPrice(filterData.minBuildingArea)}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(/\D/g, "");
                          handleFilterChange("minBuildingArea", numericValue);
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      تا
                      <input
                        type="text"
                        id="maxBuildingArea"
                        className="w-[200px] h-[40px]"
                        value={formatPrice(filterData.maxBuildingArea)}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(/\D/g, "");
                          handleFilterChange("maxBuildingArea", numericValue);
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

            <div className="w-full mt-10">
              <h4>متراژ زمین : </h4>
              <div className="reang w-full flex flex-wrap items-start md:flex-row">
                <div className="flex items-center gap-3">
                  از
                  <input
                    type="text"
                    id="minLandArea"
                    className="w-[200px] h-[40px]"
                    value={formatPrice(filterData.minLandArea)}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, "");
                      handleFilterChange("minLandArea", numericValue);
                    }}
                  />
                </div>
                <div className="flex items-center gap-3">
                  تا
                  <input
                    type="text"
                    id="maxLandArea"
                    className="w-[200px] h-[40px]"
                    value={formatPrice(filterData.maxLandArea)}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, "");
                      handleFilterChange("maxLandArea", numericValue);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="inputsCategory featuesoptions pt-10 gap-5">
            <h2>امکانات ملک</h2>

            {propertyFeatures.length > 0 &&
              propertyFeatures.map((property, idx) => {
                if (property.statusType === "options") {
                  return;
                }
                if (
                  property.condition.propertyType &&
                  property.type === "select" &&
                  property.condition.propertyType.includes(
                    (filterData as any).propertyType,
                  )
                ) {
                  return (
                    <SelectInput
                      key={idx}
                      place={property.category}
                      category={(faToEn as any)[property.category]}
                      values={property.features}
                      value={(filterData as any)[property.category]}
                      handlePropertyChange={handleFilterChange}
                    />
                  );
                } else if (
                  property.condition.propertyType &&
                  property.type === "checkbox" &&
                  property.condition.propertyType.includes(
                    (filterData as any).propertyType,
                  )
                ) {
                  const isExpanded = expandedCategories[property.category];
                  const visibleItems = isExpanded
                    ? property.features
                    : property.features.slice(0, 3);
                  // count = 0;
                  return (
                    <div key={idx} className="flex flex-wrap gap-5">
                      {property.condition.propertyType &&
                        property.condition.propertyType.includes(
                          (filterData as any).propertyType,
                        ) ? (
                        <>
                          <h4>{property.category}</h4>
                          {visibleItems.map((check: any, index) => {
                            return (
                              <label
                                key={index}
                                htmlFor={(faToEn as any)[check]}
                                className={`checkboxlabel w-[300px] h-[50px] ${Array.isArray(
                                  (filterData as any)[
                                  (faToEn as any)[property.category]
                                  ],
                                ) &&
                                  (filterData as any)[
                                    (faToEn as any)[property.category]
                                  ].includes(check)
                                  ? "active"
                                  : ""
                                  }`}
                              >
                                <div className="flex items-center gap-2">
                                  {property.icons && (
                                    <i className={property.icons[index]}></i>
                                  )}
                                  {check}
                                </div>
                                <input
                                  type="checkbox"
                                  id={(faToEn as any)[property.category]}
                                  value={
                                    (filterData as any)[
                                    (faToEn as any)[property.category]
                                    ]
                                  }
                                  onChange={(e) => {
                                    handleArrayFieldChange(
                                      (faToEn as any)[property.category],
                                      check,
                                    );
                                  }}
                                  checked={
                                    Array.isArray(
                                      (filterData as any)[
                                      (faToEn as any)[property.category]
                                      ],
                                    ) &&
                                    (filterData as any)[
                                      (faToEn as any)[property.category]
                                    ].includes(check)
                                  }
                                />
                              </label>
                            );
                          })}
                          {!isExpanded && property.features.length > 3 && (
                            <button
                              className="cursor-pointer hover:text-[var(--title)] w-[300px] text-right px-5"
                              onClick={() =>
                                setExpandedCategories((prev) => ({
                                  ...prev,
                                  [property.category]: true,
                                }))
                              }
                            >
                              + مشاهده بیشتر
                            </button>
                          )}
                          {isExpanded && (
                            <button
                              className="cursor-pointer hover:text-[var(--title)] w-[300px] text-right px-5"
                              onClick={() =>
                                setExpandedCategories((prev) => ({
                                  ...prev,
                                  [property.category]: false,
                                }))
                              }
                            >
                              - نمایش کمتر
                            </button>
                          )}
                        </>
                      ) : null}
                    </div>
                  );
                }
              })}
          </div>
        </div>

        <div className="foot absolute w-full h-[80px] bottom-0 left-0 px-3 md:px-10 flex justify-between items-center bg-[var(--inputback)] ">
          {filterList.length > 0 && (
            <button
              onClick={() => {
                if (filterList.length > 0 && onFilterChange) {
                  setFilterList([]);
                  onFilterChange("");
                  closedlightBox();
                }
              }}
              className="w-[47%] md:w-[200px] h-[60px] rounded-xl cursor-pointer transition hover:shadow-[var(--blackshadow)] border border-[var(--headertext)]/10 shadow-none bg-[var(--inputback)]"
            >
              پاک کردن همه فیلتر ها
            </button>
          )}
          <button
            className="dubleClick w-[47%] md:w-[200px] h-[55px] rounded-xl cursor-pointer transition hover:shadow-[var(--yellowshadow)] border border-[var(--headertext)]/10 shadow-none bg-[var(--title)] text-[var(--blackmosh)]"
            onClick={() => {
              handleFilters();
            }}
          >
            اعمال فیلتر ها
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterBox;
