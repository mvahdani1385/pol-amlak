"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/app/context/ThemeContext";
import { useData } from '@/app/context/DataContext';
import "@/app/css/themes.css";
import Link from "next/link";

function Header() {
  const [activeHeader, setActiveHeader] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { dynamicdata, dynamicloading, dynamicerror, refetch } = useData();

  useEffect(() => {
    document.body.style.overflow = activeHeader ? "hidden" : "auto";
  }, [activeHeader]);

  const menuItems = [
    { href: "/", label: "صفحه اصلی" },
    { href: "/realestate", label: "املاک" },
    { href: "/realestate/Favorites", label: "علاقه مندی ها" },
    // { href: '/userPanel/realestate', label: 'ادمین املاک' },
    // { href: '/request', label: 'ثبت درخواست' },
    // { href: '/userPanel/comments', label: 'کامنت ها' },
    { href: "/articles", label: "وبلاگ" },
    { href: "/contact", label: "تماس با ما" },
    { href: "/aboutus", label: "درباره ما" },
    // { href: '/userPanel/articlesManager', label: 'ادمین وبلاگ' },
    // { href: '/userPanel/articles/new', label: 'اف مق' },
    // { href: '/about', label: 'درباره ما' },
    // { href: '/contact', label: 'تماس با ما' },
  ];

  let firstSegment = "/" + pathname.split("/")[1];
  
  if (pathname.split("/")[pathname.split("/").length - 1] === "Favorites") {
    firstSegment = "/realestate/Favorites";
  }

  const handleClick = () => {};

  return (
    <>
      {/* نسخه دسکتاپ */}
      <header className="header hidden md:flex fixed top-10 justify-around xl:w-[80%] text-[var(--headertext)] lg:w-[95%] md:w-[95%] w-[95%] h-28 xl:right-[10%] lg:right-[2.5%] md:right-[2.5%] right-[2.5%] bg-[var(--headerback)] shadow-[var(--headershadow)] font-modam rounded-2xl z-100">
        <div className="logo w-35 flex items-center gap-3">
          <img
            src={`/uploads/${dynamicdata?.logo}`}
            alt="pol logo"
            className="w-15 yeshadow"
          />
          <h2 className="font-bold text-2xl text-nowrap text-[var(--title)]">{dynamicdata?.siteName}</h2>
        </div>
        <nav className="flex items-center justify-center">
          <ul className="flex gap-10 lg:text-xm text-sm">
            {menuItems.map((item) => (
              <li
                key={item.href}
                className={`text-[var(--headertext)] ${firstSegment === item.href ? "active" : ""}`}
                onClick={() => {
                  setActiveHeader(false);
                }}
              >
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="buttons flex xl:gap-10 gap-10 items-center">
          <div
            className="changeColorTheme cursor-pointer transition hover:rotate-45"
            onClick={toggleTheme}
          >
            <i className="ri-sun-line"></i>
          </div>
          <Link href={'/realestate/requester'} className="cursor-pointer text-[var(--headertext)] hover:text-[var(--title)] transition">
             فرم متقاضی
          </Link>
          {/* <button className="btngoldB w-40 h-12 p-0 cursor-pointer text-[var(--headertext)]">
            ورود / ثبت نام
          </button> */}
        </div>
      </header>

      {/* نسخه موبایل */}
      <header
        className={`header ${activeHeader ? "active" : ""} md:hidden flex flex-col justify-start items-start px-6 fixed overflow-hidden top-[1%] left-[2%] w-[96%] h-20 rounded-lg bg-[var(--headerback)] shadow-[var(--headershadow)] z-1000`}
      >
        <div className="hed ccdiv w-full min-h-20 flex justify-around">
          <div
            className="bar w-[100%] cursor-pointer"
            onClick={() => setActiveHeader((prev) => !prev)}
          >
            <i className="ri-bard-line"></i>
          </div>
          <div className="logo ccdiv gap-2">
            <img src={`/uploads/${dynamicdata?.logo}`} alt="pol logo" className="w-[15%]" />
            <h2 className="text-2xl font-bold text-[var(--title)]">{dynamicdata?.siteName}</h2>
          </div>
          <div className="changeColorTheme w-[100%] flex justify-end gap-3 cursor-pointer">
            <i
              className="ri-sun-line transition hover:rotate-95"
              onClick={toggleTheme}
            ></i>
            {/* <i className="ri-user-3-line"></i> */}
          </div>
        </div>
        <nav className="border-t w-full pt-8 px-0 mt-1">
          <button className="btngoldB cursor-pointer text-[var(--headertext)] w-[47%] h-10">
            ثبت ملک
          </button>
          <button className="btngoldB cursor-pointer text-[var(--headertext)] w-[47%] h-10 mr-[6%]">
            آگهی های املاک
          </button>
          <ul className="flex flex-col items-start gap-7 text-lg [var(--headertext)] mt-10 px-5">
            {menuItems.map((item) => (
              <li
                key={item.href}
                className={`text-[var(--headertext)] ${firstSegment === item.href ? "active" : ""}`}
                onClick={() => {
                  setActiveHeader(false);
                }}
              >
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
}

export default Header;
