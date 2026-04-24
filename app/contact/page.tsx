"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useState, useEffect } from "react";
import Header from "../components/themes/Header";
import Footer from "../components/themes/Footer";
import ContactForm from "./ContactForm";
import ContactFix from "./ContactFix";

function Contact() {
  const [contactData, setContactData] = useState({
    title: "تماس با ما",
    textUnderTitle: "با کارشناسان ما در ارتباط باشید",
    littleText:
      "با راه های ارتباطی که در اختیار شما قرار داده ایم میتوانید با کارشناسان ما درارتباط باشید",
    contactBoxs: [
        { icon: "/eitaa", name: "ایتا", link: "https://eitaa.com/" },
        { icon: "/aparat", name: "آپارات", link: "https://www.aparat.com/" },
        { icon: "ri-instagram-line", name: "اینستاگرام", link: "https://www.instagram.com/" },
        { icon: "ri-whatsapp-line", name: "واتساپ", link: "https://www.whatsapp.com/" },
        { icon: "ri-telegram-line", name: "تلگرام", link: "https://telegram.org/" },
        { icon: "ri-mail-line", name: "ایمیل", link: "https://mail.google.com/" },
    ],
  });

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch('/api/contact');
        if (response.ok) {
          const data = await response.json();
          setContactData(data);
        }
      } catch (error) {
        console.error('Error fetching contact data:', error);
      }
    };

    fetchContactData();
  }, []);

  useEffect(() => {
    document.title = 'تماس با ما';
  }, []);

  function cleanUrl(url: string) {
    if (!url) return "";

    return url
      .replace(/^https?:\/\//, "") // حذف http:// یا https://
      .replace(/^www\./, "") // حذف www.
      .replace(/\/$/, "");
  }

  return (
    <>
      <Header />
      <ContactFix contactBoxs={contactData} />

      <div className="container w-[100%] md:w-[80%] mx-auto mt-20 md:mt-40 py-10">
        <div className="headBox ccdiv flex-col w-full text-center px-3">
          <h1 className="font-medium text-5xl pb-5 px-5 border-b border-[var(--title)]">
            {contactData.title}
          </h1>
          <h2 className="mt-5 text-3xl font-bold text-[var(--title)]">
            {contactData.textUnderTitle}
          </h2>
          <p className="mt-5 font-light text-lg">{contactData.littleText}</p>
        </div>
        {contactData.contactBoxs.length > 0 && (
          <div className="contactBoxs w-full flex flex-wrap justify-center gap-[1%] gap-y-3 mt-5">
            {contactData.contactBoxs.map((box: any) => {
              if(box.link === ''){return}
              return (
                <Link
                  key={box.name}
                  href={`http://${box.link}`}
                  className="box ccdiv flex-col gap-5 w-[30%] sm:w-[15%] border-[2px] border-[var(--title)] p-5 rounded-lg cursor-pointer hover:bg-[var(--title)]/20 transition"
                >
                  <div className="icon">
                    {box.icon !== "" && box.icon.slice()[0] === "/" ? (
                      <img src={`/media/${box.icon}.png`} className="w-[30px] shadow" />
                    ) : (
                      <i
                        className={`${box.icon} text-4xl text-[var(--title)]`}
                      ></i>
                    )}
                  </div>
                  <h3 className="font-bold text-xl">{box.name}</h3>
                  <h4 className="font-light text-xs text-[var(--foreground)]/50">
                    {cleanUrl(box.link)}
                  </h4>
                </Link>
              );
            })}
          </div>
        )}

        <ContactForm />

        {contactData.contactBoxs.length > 0 && (
            <div className="ccdiv flex-wrap mt-15 gap-5">
                <h3 className="w-full text-center text-xl">مارا در شبکه های اجتماعی دنبال کنید</h3>
                {contactData.contactBoxs.map((box: any)=>{
                  if(box.link === ''){return}
                    return(
                        <Link key={box.name} href={`http://${box.link}`}>
                            {box.icon !== "" && box.icon.slice()[0] === "/" ? (
                            <img src={`/media/${box.icon}.png`} className="w-[30px] shadow" />
                            ) : (
                            <i
                                className={`${box.icon} text-4xl text-[var(--title)]`}
                            ></i>
                            )}
                        </Link>
                    )
                })}
            </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Contact;
