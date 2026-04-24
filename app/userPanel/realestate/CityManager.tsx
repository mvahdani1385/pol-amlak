import { useEffect, useState } from "react";
import SelectInput from "@/app/realestate/SelectInput";
import CheckboxInput from "@/app/components/themes/CheckboxInput";
import allCitysData from "./allCitysDatat.json";
import { toast } from "react-toastify";
import "@/app/css/themes.css";

interface City {
  status: boolean;
  setStatus: any;
}

interface data {
  city: string[] | null | undefined;
  Province: string | null | undefined;
}

function CityManager({ status, setStatus }: City) {
  const [citys, setCitys] = useState<data[]>([]);
  const [allCity, setAllCity] = useState([]);
  const [allProvince, setAllProvince] = useState<any[]>([]);
  const [citysData, setCityData] = useState({
    id: 2,
    Province: "",
    city: [],
  });

  const handleCityChange = (key: string, value: any) => {
    setCityData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCheckboxChange = (category: string, value: string | number) => {
    setCityData((prev: any) => {
      // بررسی می‌کنیم آیا مقدار از قبل در آرایه وجود دارد یا خیر
      const isSelected = prev[category].includes(value);

      return {
        ...prev,
        [category]: isSelected
          ? prev[category].filter((item: any) => item !== value) // اگر بود، حذفش کن
          : [...prev[category], value], // اگر نبود، به آرایه اضافه کن
      };
    });
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
          allCitysData.map((cp: any) => {
            if (cp.province === citysData.Province) {
              setAllCity(cp.cities);
              // handleCityChange("city", "");
            }
          });
        });
    } catch (error) {
      console.error("خطا در دریافت مقادیر داینامیک سایت", error);
    }
  }, []);

  useEffect(() => {
    if (citys && citys.length > 0) {
      handleCityChange("Province", citys[0].Province);
      if (citys[0].city && citys[0].city.length > 0) {
        citys[0].city.forEach((cts: any) => {
          handleCheckboxChange("city", cts);
        });
      }
    }
  }, [citys]);

  useEffect(() => {
    allCitysData.map((cp: any) => {
      if (cp.province === citysData.Province) {
        setAllCity(cp.cities);
        handleCityChange("city", "");
      }
    });
  }, [citysData.Province]);

  useEffect(() => {
    allCitysData.map((cp: any) => {
      if (cp.province === citysData.Province) {
        setAllCity(cp.cities);
      }
    });
  }, [citys]);

  useEffect(() => {
    const provinces = allCitysData.map((cp: any) => cp.province);
    setAllProvince(provinces);
    // if(citysData.Province !== ''){
    //   handleCityChange('Province', allProvince[0])
    // }
  }, [citysData.Province, citys]);

  const handleSubmit = async () => {
    if (citysData.Province === "") {
      toast.warn("انتخاب استان اجباری است");
      return;
    }
    if (citysData.city.length === 0) {
      toast.warn("انتخاب شهر اجباری است");
      return;
    }

    // console.log(citysData.city);

    try {
      const response = await fetch("/api/dynamicOptions", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(citysData),
      });

      if (!response.ok) {
        throw new Error("خطا در به‌روزرسانی داده‌ها");
      }

      const updatedData = await response.json();

      setCitys([updatedData]);

      toast.success("شهر و استان با موفقیت تغییر کرد");
      setStatus(false);

      allCitysData.map((cp: any) => {
        if (cp.province === citysData.Province) {
          setAllCity(cp.cities);
          handleCityChange("city", "");
        }
      });
    } catch (error) {
      console.error("خطا در دریافت مقادیر داینامیک سایت", error);
    }
  };

  return (
    <div
      className={`lightbox flex justify-center items-center ${status ? "flex" : "hidden"}`}
    >
      <div className="cityBox bg-[var(--background)] W-[90%] md:w-[50%] h-[80vh] md:h-[85vh] shadow-[var(--blackshadow)] rounded-xl overflow-hidden">
        <div className="head bg-[var(--inputback)] w-full h-[8vh] md:h-[12vh] flex items-center px-5">
          <button
            onClick={() => {
              setStatus(false);
            }}
            className="normBtn w-[100px] h-[50px]"
          >
            بستن
          </button>
        </div>
        <div
          className={`editor w-full h-[73vh] pb-5 p-5 flex items-start gap-5 flex-wrap overflow-y-scroll`}
        >
          {citys && citys.length > 0 && citys[0].city && citys[0].city.length > 0 ? (
            <>
              <p>
                <span className="text-[var(--title)]">استان فعلی : </span>
                {citys[0].Province}
              </p>
              <p className="flex flex-wrap gap-3 items-center">
                <span className="text-[var(--title)]">شهر فعلی : </span>
                {citys &&
                  citys[0].city &&
                  citys[0].city.length > 0 &&
                  citys[0].city.map((cts: any, idx: any) => {
                    return (
                      <span key={idx} className="border px-2 rounded">
                        {cts}
                      </span>
                    );
                  })}
              </p>
            </>
          ) : (
            <p>هنوز شهر و استان انتخاب نشده...</p>
          )}
          <div className="form w-full flex flex-wrap items-center gap-5">
            <SelectInput
              place="استان"
              category="Province"
              values={allProvince}
              handlePropertyChange={handleCityChange}
              value={
                citysData.Province !== "" ? citysData.Province : "انتخاب کنید"
              }
            />
            {/* <SelectInput
              place="شهر"
              category="city"
              values={allCity}
              handlePropertyChange={handleCheckboxChange}
              value={citysData.city.length > 0 ? citysData.city : "انتخاب کنید"}
            /> */}
            {citys && citys.length > 0 && citys[0].city && citys[0].Province ? (
              <button
                onClick={handleSubmit}
                className="subBtnRe h-[45px] w-[300px] mt-10"
              >
                به روز رسانی شهر و استان
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="subBtnRe h-[45px] w-[300px] mt-10"
              >
                ذخیره شهر و استان
              </button>
            )}
            {allCity.length > 0 ? (
              <div className="showCitis w-full flex flex-wrap gap-5 justify-start">
                {allCity &&
                  allCity.length > 0 && allCity.map((ct: never, idx: any) => {
                  return (
                    <div
                      key={ct}
                      className={`CheckboxInput ${citysData.city?.includes(ct) ? "active" : ""}`}
                    >
                      <label>
                        <span className="text-sm">{ct}</span>
                        <input
                          key={idx}
                          type="checkbox"
                          onChange={() => {
                            handleCheckboxChange("city", ct);
                          }}
                          className="custom-checkbox"
                          checked={citysData.city?.includes(ct) || false}
                        />
                      </label>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="w-full">
                برای نمایش شهر ها استان موردر نظر رو انتخاب کنید.
              </p>
            )}
            {citys && citys.length > 0 && citys[0].city && citys[0].Province ? (
              <button
                onClick={handleSubmit}
                className="subBtnRe h-[45px] w-full"
              >
                به روز رسانی شهر و استان
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="subBtnRe h-[45px] w-full"
              >
                ذخیره شهر و استان
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CityManager;
