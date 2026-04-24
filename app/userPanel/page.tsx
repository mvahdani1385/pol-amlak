"use client";

import Link from "next/link"
import { useEffect } from "react";

function userPanle() {
     useEffect(() => {
        document.title = 'ادمین پنل';
      }, []);
    return (
        <div className="container w-[90%] md:w-[80%] mr-[5%] md:mr-[10%] py-10">
            <div className="head w-full h-fit md:h-[15vh] flex flex-col md:flex-row items-center justify-between bg-[var(--inputback)] rounded-xl border border-[var(--foreground)]/10 md:px-7">
                <div className="w-full md:w-[50%] h-full mt-5 md:mt-0 flex flex-col md:flex-row flex-wrap items-center gap-5">
                    <img src="/media/teem2.jpg" className="w-[70px] h-[70px] object-cover border-[4px] rounded-full" />
                    <div className="userinfo w-full md:w-fit text-center md:text-right">
                        <h4 className="font-medium text-[var(--title)] text-lg mb-2">زیبا حسینی</h4>
                        <span className="px-3 border font-light rounded-full">مدیر</span>
                    </div>
                </div>
                <div className="btns h-full flex items-center gap-5 my-5 md:my-0">
                    <button className="w-[40px] h-[40px] border rounded-xl ccdiv cursor-pointer transition hover:bg-[var(--background)]">
                        <i className="ri-notification-2-line"></i>
                    </button>
                    <Link href={`/`} className="w-[40px] h-[40px] border rounded-xl ccdiv cursor-pointer transition hover:bg-[var(--background)]">
                        <i className="ri-home-line"></i>
                    </Link>
                    <button className="w-[40px] h-[40px] border rounded-xl ccdiv cursor-pointer transition hover:bg-[var(--background)]">
                        <i className="ri-arrow-left-line"></i>
                    </button>
                </div>
            </div>
            <div className="folders flex flex-wrap gap-5 mt-10">
                <Link href={'/userPanel/realestate'} className="normBtn w-[200px] h-[45px]">مدیریت املاک</Link>
                <Link href={'/userPanel/articlesManager'} className="normBtn w-[200px] h-[45px]">مدیریت وبلاگ</Link>
                <Link href={'/userPanel/siteSetting'} className="normBtn w-[200px] h-[45px]">تنظیمات سایت</Link>
                <Link href={'/userPanel/pageSetting'} className="normBtn w-[200px] h-[45px]">تنظیمات صفحات</Link>
                <Link href={'/userPanel/comments'} className="normBtn w-[200px] h-[45px]">دیدگاه ها</Link>
            </div>
        </div>
    )
}

export default userPanle