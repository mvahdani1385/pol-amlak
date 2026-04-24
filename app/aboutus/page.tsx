"use client";

import Header from "../components/themes/Header";
import Footer from "../components/themes/Footer";
import { useState, useEffect } from "react";
import Link from "next/link";

function about() {
  const [aboutData, setAboutData] = useState({
    title: "املاک پل",
    description: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.",
    video: "1775011631088.mp4",
    poster: "1773254181022.jpg",
    services: [
      {name: 'خدمت شماره یک', img: '1.png', desc: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است'},
      {name: 'خدمت شماره دو', img: '2.png', desc: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است'},
      {name: 'خدمت شماره سه', img: '3.png', desc: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ '},
    ],
    ourteem: [
      {name: 'محمد وحدانی', position: 'برنامه نوبس', img: ''},
      {name: 'زیبا حسینی', position: 'مدیر فروش', img: ''},
      {name: 'کامران سلطانی', position: 'مدیر عامل', img: ''},
      {name: 'ایلیا سعادت', position: 'مدیر بازرگانی', img: ''},
    ],
  });

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch('/api/dynamicOptions');
        if (response.ok) {
          const data = await response.json();
          // Find the record with aboutPage data
          const aboutRecord = data.find((item: any) => item.aboutPage);
          if (aboutRecord && aboutRecord.aboutPage) {
            const parsedAboutData = JSON.parse(aboutRecord.aboutPage);
            setAboutData(parsedAboutData);
          }
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };

    fetchAboutData();
  }, []);

  useEffect(() => {
    document.title = 'درباره ما';
  }, []);

  return (
    <>
      <Header />
      <div className="container w-[90%] md:w-[80%] mx-auto mt-20 md:mt-40 py-10">
        <div className="realestatei flex flex-wrap justify-between">
          <div className="info w-full md:w-[45%] h-fit md:h-[400px]">
            <h1 className="font-bold text-5xl text-[var(--title)]">
              {aboutData.title}
            </h1>
            <p className="mt-8 text-justify">{aboutData.description}</p>
            <div className="btns flex mt-10 gap-5">
              <Link href={"/realestate"} className="subBtn w-[150px] h-[45px]">
                مشاهده املاک
              </Link>
              <Link href={"/realestate/requester"} className="tabBtn w-[150px] h-[45px] ccdiv">
                ثبت ملک شما
              </Link>
            </div>
          </div>
          <div className="vid w-full md:w-[50%] h-[400px] mt-5 md:mt-0 rounded-xl overflow-hidden">
            <video
                src={`/uploads/${aboutData.video}`}
                poster={`/uploads/${aboutData.poster}`}
                controls
                controlsList="nodownload"
                className="w-full h-full object-cover"
            ></video>
        </div>
        </div>
        <div className="services mt-15">
          <div className="title">
            <h2>چرا ما را انتخاب کنید ؟</h2>
            <p className="mt-3 md:mr-[50px]">
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
              استفاده.
            </p>
          </div>
          {aboutData.services && aboutData.services.length > 0 ? (
            <div className="servises flex flex-wrap justify-center gap-[3%] mt-5">
              {aboutData.services.map((ser: any) => {
                return (
                  <div
                    key={ser.name}
                    className="box w-full md:w-[30%] ccdiv flex-col text-center mt-5 border-[2px] border-[var(--title)] p-5 rounded-xl"
                  >
                    <div className="img">
                      {ser.img !== "" ? (
                        <img src={`/uploads/${ser.img}`} className="w-[50px]" />
                      ) : (
                        <img src="/media/404.jpg" className="w-[50px]" />
                      )}
                    </div>
                    <h3 className="mt-5 text-xl font-bold">{ser.name}</h3>
                    <p className="mt-3 text-sm text-[var(--foreground)]/50">
                      {ser.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center mt-5 text-red-300">هیچ سرویسی جهت نمایش پیدا نشد</p>
          )}
        </div>

        <div className="uorteem mt-15">
          <div className="title">
            <h2>تیم ما</h2>
            <p className="mt-3 md:mr-[50px]">
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
              استفاده.
            </p>
          </div>
          {aboutData?.ourteem?.length  > 0 ? (
            <div className="uorteem flex flex-wrap justify-center gap-[1%] mt-5 gap-y-5">
              {aboutData.ourteem.map((teem: any) => {
                return (
                  <div
                    key={teem.name}
                    className="box relative w-full md:w-[24%] h-[450px] shadow-[var(--blackshadow)] md:h-[400px] flex flex-col justify-end text-center mt-5 border[2px] border-[var(--title)] rounded-xl overflow-hidden"
                  >
                    <div className="img absolute w-full h-full object-cover z-0">
                      {teem.img !== "" ? (
                        <img src={`/uploads/${teem.img}`} className="w-full h-full object-cover transition duration-1000 hover:scale-150" />
                      ) : (
                        <img src="/media/404.jpg" className="w-full h-full object-cover transition duration-500 hover:scale-101" />
                      )}
                    </div>
                    <div className="info w-full h-[70%] p-3 py-5 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/50 z-1 pointer-events-none flex flex-col justify-end items-center">
                        <h3 className="font-bold text-xl text-[var(--title)]">{teem.position}</h3>
                        <p className="text-lg font-light mt-2">{teem.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center mt-5 text-red-300">هیچ تیمی جهت نمایش پیدا نشد</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default about;
