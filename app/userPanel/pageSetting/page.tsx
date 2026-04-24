"use client";

import { useEffect, useState } from "react";
import ContactSetting from './ContactSetting'
import AboutSetting from './AboutSetting'
import Link from "next/link";

function pageSetting() {
  // state برای نگهداری وضعیت باز/بسته بودن هر آکاردئون
  const [openAccordions, setOpenAccordions] = useState({
    accordion1: false,  // اولی پیش‌فرض باز باشه
    accordion2: false,
    accordion3: false,
    accordion4: false,
  });

  // تابع برای تغییر وضعیت هر آکاردئون
  const toggleAccordion = (accordionKey: keyof typeof openAccordions) => {
    setOpenAccordions(prev => ({
      ...prev,
      [accordionKey]: !prev[accordionKey],
    }));
  };

  useEffect(() => {
    document.title = 'ادمین پنل | تنظیمات صفحات';
  }, []);

  return (
    <div className="container w-[90%] md:w-[80%] mr-[5%] md:mr-[10%] py-10">
      <div className="backs flex gap-8 w-full justify-end text-xl cursor-pointer">
        <Link href={`/userPanel`}><i className="tabBtn ri-arrow-go-back-line"></i></Link>
        <Link href={'/userPanel'}><i className="tabBtn ri-home-line"></i></Link>
      </div>
      <h1 className="text-3xl font-bold text-[var(--title)] mb-2">تنظیمات صفحات</h1>
      <p className="mb-8">مدیریت محتوای صفحات سایت</p>

      <div className="space-y-4 text-[var(--foreground)]/30">

        <div className="rounded-lg bg-[var(--inputback)] shadow-[var(--blackshadow)] overflow-hidden border">
          <button
            onClick={() => toggleAccordion("accordion1")}
            className="w-full flex justify-between text-[var(--foreground)] items-center p-5 cursor-pointer text-right font-medium hover:bg-[var(--background)] transition-colors"
          >
            <span>صفحه تماس با  ما</span>
            <i className={`ri-arrow-down-line transition-transform duration-200 ${openAccordions.accordion1 ? "rotate-180" : ""}`}></i>
          </button>
          {openAccordions.accordion1 && (
            <div className="p-5 bg-[var(--background)] text-[var(--foreground)]">
              <ContactSetting />
            </div>
          )}
        </div>

        <div className="rounded-lg bg-[var(--inputback)] shadow-[var(--blackshadow)] overflow-hidden border">
          <button
            onClick={() => toggleAccordion("accordion2")}
            className="w-full flex justify-between text-[var(--foreground)] items-center p-5 cursor-pointer text-right font-medium hover:bg-[var(--background)] transition-colors"
          >
            <span>صفحه درباره ما</span>
            <i className={`ri-arrow-down-line transition-transform duration-200 ${openAccordions.accordion2 ? "rotate-180" : ""}`}></i>
          </button>
          {openAccordions.accordion2 && (
            <div className="p-5 bg-[var(--background)] text-[var(--foreground)]">
              <AboutSetting />
            </div>
          )}
        </div>


        {/* <div className="rounded-lg bg-[var(--inputback)] shadow-[var(--blackshadow)] overflow-hidden border">
          <button
            onClick={() => toggleAccordion("accordion3")}
            className="w-full flex justify-between text-[var(--foreground)] items-center p-5 cursor-pointer text-right font-medium hover:bg-[var(--background)] transition-colors"
          >
            <span>صفحه اصلی - بخش هدر</span>
            <i className={`ri-arrow-down-line transition-transform duration-200 ${openAccordions.accordion3 ? "rotate-180" : ""}`}></i>
          </button>
          {openAccordions.accordion3 && (
            <div className="p-5 bg-[var(--background)] text-[var(--foreground)]">
              محتوای بخش هدر صفحه اصلی اینجا قرار می‌گیرد.
            </div>
          )}
        </div>


        <div className="rounded-lg bg-[var(--inputback)] shadow-[var(--blackshadow)] overflow-hidden border">
          <button
            onClick={() => toggleAccordion("accordion4")}
            className="w-full flex justify-between text-[var(--foreground)] items-center p-5 cursor-pointer text-right font-medium hover:bg-[var(--background)] transition-colors"
          >
            <span>صفحه اصلی - بخش هدر</span>
            <i className={`ri-arrow-down-line transition-transform duration-200 ${openAccordions.accordion4 ? "rotate-180" : ""}`}></i>
          </button>
          {openAccordions.accordion4 && (
            <div className="p-5 bg-[var(--background)] text-[var(--foreground)]">
              محتوای بخش هدر صفحه اصلی اینجا قرار می‌گیرد.
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}

export default pageSetting;