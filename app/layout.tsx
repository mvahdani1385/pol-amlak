import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/app/context/ThemeContext";
import { toJalaali } from "jalaali-js";
import { ToastContainer } from "react-toastify";
import { DataProvider } from '@/app/context/DataContext';
import { fetchDynamicOptions } from '@/lib/fetchDynamicOptions';
// import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import "@/app/css/style.css";
import "@/app/css/icon/remixicon.css";
import "@/app/css/custom-toast.css";
import "@fontsource/geist/100.css";
import "@fontsource/geist/200.css";
import "@fontsource/geist/300.css";
import "@fontsource/geist/400.css";
import "@fontsource/geist/500.css";
import "@fontsource/geist/600.css";
import "@fontsource/geist/700.css";
import "@fontsource/geist/800.css";
import "@fontsource/geist/900.css";
import "@fontsource/geist-mono/400.css";
import "@fontsource/geist-mono/500.css";
import "@fontsource/geist-mono/600.css";
import "@fontsource/geist-mono/700.css";

// دیگه نیازی به تعریف متغیرهای geistSans و geistMono نیست

export async function generateMetadata(): Promise<Metadata> {
  const dynamicData = await fetchDynamicOptions();
  
  return {
    // title: dynamicData?.siteName || "پیش‌فرض سایت",
    description: dynamicData?.siteTarget || "توضیحات پیش‌فرض سایت",
    icons: {
      icon: `/uploads/${dynamicData?.logo}` || "/media/logo.webp", // آدرس favicon از دیتابیس
      shortcut: `/uploads/${dynamicData?.logo}` || "/media/logo.webp",
      apple: `/uploads/${dynamicData?.logo}` || "/media/logo.webp",
    },
  };
}


function toJalali(dateString: string): string {
  const [gYear, gMonth, gDay] = dateString.slice(0, 10).split("/");

  const gy = parseInt(gYear, 10);
  const gm = parseInt(gMonth, 10);
  const gd = parseInt(gDay, 10);

  const gregorianDate = new Date(gy, gm - 1, gd);

  const jalaliResult = toJalaali(gregorianDate);
  if (
    !jalaliResult ||
    !jalaliResult.jy ||
    !jalaliResult.jm ||
    !jalaliResult.jd
  ) {
    return "تاریخ نامعتبر";
  }

  const jalaliDate = `${jalaliResult.jy}/${String(jalaliResult.jm).padStart(2, "0")}/${String(jalaliResult.jd).padStart(2, "0")}`;
  return jalaliDate;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const dynamicData = await fetchDynamicOptions();
  
  return (
    <html lang="en">
      <head>
        {/* <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
        <script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          defer
        /> */}
      </head>
      <body
        className="antialiased font-sans"
      >
        <DataProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </DataProvider>
        <ToastContainer
          position="top-right" // موقعیت نمایش پیغام‌ها
          autoClose={5000} // مدت زمان نمایش پیغام (به میلی‌ثانیه)
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false} // اگر راست به چپ فارسی نیاز دارید، true کنید
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark" // یا "dark"
        />
      </body>
    </html>
  );
}
