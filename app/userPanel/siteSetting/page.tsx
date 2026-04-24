"use client";

import TextInput from "@/app/components/themes/TextInput";
import TextArey from "@/app/components/themes/TextArey";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

function siteSetting() {
  const [dynamicData, setDynamicData] = useState({
    logo: '',
    siteName: "",
    siteTarget: "",
    sitePhone: "",
    siteEmail: "",
    address: "",
    coptright: "",
    footerText: "",
    certificates: [],
  });

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      fetch("/api/dynamicOptions", {
        method: "GET",
        headers: {},
      })
        .then((res) => res.json())
        .then((data) => {
          setDynamicData(data[0]);
          setLoading(false)
        });
    } catch (error) {
      console.log("خطا در دریافت اطلاعات هویتی سایت", error);
    }
  }, []);

   useEffect(() => {
    document.title = 'ادمین پنل | تنظیمات سایت';
  }, []);

  const [newCert, setNewCert] = useState({ img: "", link: "" });

  const [btnType, setBtnType] = useState("");

  const [editIdx, setEditIdx] = useState(null);

  const imageref = useRef<any>(null);
  const logoref = useRef<any>(null);

  useEffect(() => {
    console.log(dynamicData);
  }, [dynamicData]);

  const handlePropertyChange = (key: string, value: any) => {
    setDynamicData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleLinkChange = (key: string, value: any) => {
    setNewCert((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddCertificate = (newCert: { img: string; link: string }) => {
    setDynamicData((prev: any) => ({
      ...prev,
      certificates: [...prev.certificates, newCert],
    }));
    toast.success("گواهی با موفقیت ایجاد شد");
  };

  const handleEditCertificate = () => {
    setDynamicData((prev: any) => ({
      ...prev,
      certificates: prev.certificates.map((cert: any, idx: number) =>
        idx === editIdx ? newCert : cert,
      ),
    }));
    toast.success("ویرایش با موفقیت انجام شد");
    setBtnType("");
    setNewCert({ img: "", link: "" });
  };

  const handleDelete = (indexToDelete: any) => {
    setDynamicData((prev) => {
      const certs = prev.certificates;
      if (indexToDelete < 0 || indexToDelete >= certs.length) {
        toast.error("چنین گواهی‌ای وجود ندارد.");
        return prev;
      }
      const updated = certs.filter((_, i) => i !== indexToDelete);
      return {
        ...prev,
        certificates: updated,
      };
    });
  };

  const handleDeleteClick = (index: any) => {
    if (index < 0 || index >= dynamicData.certificates.length) {
      toast.error("چنین گواهی‌ای وجود ندارد.");
    } else {
      handleDelete(index);
      toast.success("گواهی با موفقیت حذف شد.");
    }
  };

  const handleChangeImage = async (type: any, e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("لطفا فقط فایل تصویری انتخاب کنید");
      return;
    }

    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();

    let imageTimeName = `setting_${timestamp}.${fileExtension}`;

    if (type === 'cert') {
      imageTimeName = `certi_${timestamp}.${fileExtension}`;
    } else if (type === 'logo') {
      imageTimeName = `logo${timestamp}.${fileExtension}`;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", imageTimeName);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {

        if (type === 'cert') {
          setNewCert((prev) => ({ ...prev, img: imageTimeName }));
        } else if (type === 'logo') {
          handlePropertyChange('logo', imageTimeName)
        }

        console.log("تصویر با موفقیت آپلود شد:", imageTimeName);
      } else {
        console.error("خطا در آپلود تصویر");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }

    e.target.value = "";
  };

  const handlesubmit = () => {
    try {
      fetch('/api/dynamicOptions', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: 2,
          ...dynamicData  // اینجوری درست میشه
        })
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));

      toast.success('تظیمات سایت به روزرسانی شد.')
    } catch (error) {
      console.log('خطا در آپدیت بهروزرسانی تنظیمات سایت', error)
    }
  };

  if(loading){
    return(
      <div className="ccdiv w-full h-[100vh]">
        <p>درحال بارگذاری ...</p>
      </div>
    )
  }

  return (
    <div className="container w-[90%] md:w-[80%] mr-[5%] md:mr-[10%] py-10">
      <div className="backs flex gap-8 w-full justify-end text-xl cursor-pointer">
        <Link href={`/userPanel`}><i className="tabBtn ri-arrow-go-back-line"></i></Link>
        <Link href={'/userPanel'}><i className="tabBtn ri-home-line"></i></Link>
      </div>
      <h2 className="text-2xl font-bold text-[var(--title)]">هویت سایت</h2>
      <div className="box w-full border-r-[3px] mr-3 border-[var(--title)] p-5 flex flex-wrap gap-5">
        <div className="w-full flex flex-wrap gap-3">
          <input
            type="file"
            className="hidden"
            ref={logoref}
            onChange={(e) => handleChangeImage('logo', e)}
          />
          <h2 className="w-full">لوگو سایت :</h2>
          <div
            onClick={() => {
              logoref.current.click();
            }}
            className="openInput relative ccdiv flex-col gap-5 w-[150px] h-[150px] cursor-pointer border border-dashed border-[var(--foreground)]/60 rounded-lg overflow-hidden hover:bg-[var(--lightboxback)]"
          >
            <p className="z-1">+</p>
            <p className="z-1">افزودن تصویر</p>
          </div>
          <div
            onClick={() => {
              logoref.current.click();
            }}
            className="openInput relative ccdiv flex-col gap-5 w-[150px] h-[150px] cursor-pointer border border-dashed border-[var(--foreground)]/60 rounded-lg overflow-hidden hover:bg-[var(--lightboxback)]"
          >
            {dynamicData.logo !== "" && (
              <img
                src={`/uploads/${dynamicData.logo}`}
                className="w-[100px] top-0 left-0 object-cover z-0"
              />
            )}
          </div>
        </div>
        <TextInput
          place="نام سایت"
          category="siteName"
          handlePropertyChange={handlePropertyChange}
          value={dynamicData.siteName}
        />
        <TextInput
          place="شعار سایت"
          category="siteTarget"
          handlePropertyChange={handlePropertyChange}
          value={dynamicData.siteTarget}
        />
        <TextInput
          place="شماره تماس"
          category="sitePhone"
          isNumber={true}
          handlePropertyChange={handlePropertyChange}
          value={dynamicData.sitePhone}
        />
        <TextInput
          place="آدرس شما"
          category="address"
          handlePropertyChange={handlePropertyChange}
          value={dynamicData.address}
        />
        <TextInput
          place="ایمیل"
          category="siteEmail"
          lang={"en"}
          handlePropertyChange={handlePropertyChange}
          value={dynamicData.siteEmail}
        />
      </div>
      <h2 className="text-2xl font-bold text-[var(--title)]">
        فووتر (پابرگ) سایت
      </h2>
      <div className="box w-full mr-3 border-r-[3px] border-[var(--title)] p-5 flex flex-wrap gap-5 justify-between">
        <div className="footer w-full md:w-[48%]">
          <TextInput
            place="متن کپی رایت"
            category="coptright"
            handlePropertyChange={handlePropertyChange}
            value={dynamicData.coptright}
          />

          <TextArey
            place="متن توضیحات فووتر"
            category="footerText"
            handlePropertyChange={handlePropertyChange}
            value={dynamicData.footerText}
          />
        </div>

        <div className="addCertificate w-full md:w-[48%] h-fit flex flex-col">
          {btnType === "" ? (
            <button
              onClick={() => {
                setBtnType("create");
                setNewCert({ img: "", link: "" });
              }}
              className="subBtn w-full h-[45px]"
            >
              ایجاد گواهی جدید
            </button>
          ) : (btnType !== "" && (
            <button
              onClick={() => {
                setBtnType("");
                setNewCert({ img: "", link: "" });
              }}
              className="subBtn w-full h-[45px] mb-5"
            >
              بازگشت به لیست
            </button>
          )
          )}
          {btnType !== "" && (
            <div className="w-full h-fit flex flex-wrap border-b p-3 gap-3 items-end">
              <input
                type="file"
                className="hidden"
                ref={imageref}
                onChange={(e) => handleChangeImage('cert', e)}
              />

              <div
                onClick={() => {
                  imageref.current.click();
                }}
                className="openInput relative ccdiv flex-col gap-5 w-[150px] h-[150px] cursor-pointer border border-dashed border-[var(--foreground)]/60 rounded-lg overflow-hidden hover:bg-[var(--lightboxback)]"
              >
                <p className="z-1">+</p>
                <p className="z-1">افزودن تصویر</p>
                {newCert.img !== "" && (
                  <img
                    src={`/uploads/${newCert.img}`}
                    className="absolute w-full h-full top-0 left-0 object-cover z-0"
                  />
                )}
              </div>

              <div className="flex flex-col gap-3">
                <TextInput
                  place="لینک گواهی"
                  category="link"
                  lang={"en"}
                  handlePropertyChange={handleLinkChange}
                  value={newCert.link}
                />

                {btnType === "create" ? (
                  <button
                    onClick={() => {
                      handleAddCertificate(newCert);
                      setBtnType("");
                      setNewCert({ img: "", link: "" });
                    }}
                    className="subBtn w-[300px] h-[45px]"
                  >
                    افزودن گواهی
                  </button>
                ) : (
                  btnType === "edite" && (
                    <button
                      onClick={() => {
                        handleEditCertificate();
                      }}
                      className="subBtn w-[300px] h-[45px]"
                    >
                      ویرایش گواهی
                    </button>
                  )
                )}
              </div>
            </div>
          )}
          {dynamicData?.certificates?.length > 0 && (
            <div className="allCerti w-full mt-5 flex flex-wrap gap-[4%] md:gap-5">
              {dynamicData.certificates.map((cert: any, idx: any) => {
                return (
                  <div
                    key={idx}
                    className="certif w-[48%] md:w-[170px] overflow-hidden shadow-[var(--blackshadow)] p-3 rounded-lg"
                  >
                    <img
                      src={`/uploads/${cert.img}`}
                      className="w-[100px] md:w-[150px] h-[100px] md:h-[150px] object-cover rounded-lg overflow-hidden"
                    />
                    <Link
                      href={cert.link ? `http://${cert.link}` : '#'}
                      className="normBtn w-full h-[30px] mt-2"
                    >
                      لینک گواهی
                    </Link>
                    <button
                      onClick={() => {
                        setBtnType("edite");
                        setEditIdx(idx);
                        setNewCert({ img: cert.img, link: cert.link });
                      }}
                      className="subBtn w-full h-[30px] mt-2"
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => handleDeleteClick(idx)}
                      className="delBtn w-full h-[30px] mt-2"
                    >
                      حذف
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <button
          onClick={handlesubmit}
          className="subBtn w-[95%] h-[45px] m-auto mt-5"
        >
          به روزرسانی هویت سایت
        </button>
      </div>
    </div>
  );
}

export default siteSetting;
