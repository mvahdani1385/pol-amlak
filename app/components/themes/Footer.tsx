"use client";
import "@/app/css/themes.css"
import { useEffect, useState } from 'react'
import { useData } from '@/app/context/DataContext';
import Link from "next/link";

function Footer() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [0, 1, 2];
    const { dynamicdata, dynamicloading, dynamicerror, refetch } = useData();

    const [cotactBox, setCotactBox] = useState<any>([]);

    useEffect(() => {
        if (dynamicdata === null) return;
        if (dynamicdata?.ContactPage === undefined) return;

        try {
            let finalcontact = JSON.parse(dynamicdata.ContactPage);

            // چک کردن اینکه finalcontact وجود داره و contactBoxs داره
            if (!finalcontact || !finalcontact.contactBoxs) {
                setCotactBox([]);  // مقدار پیش‌فرض خالی
                return;
            }

            setCotactBox(finalcontact.contactBoxs);
        } catch (error) {
            console.error('Error parsing ContactPage:', error);
            setCotactBox([]);  // مقدار پیش‌فرض خالی
        }
    }, [dynamicdata]);

    // useEffect(()=>{
    //     console.log('cotactBox : ', cotactBox)
    // }, [cotactBox])

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === dynamicdata?.certificates?.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? dynamicdata?.certificates?.length - 1 : prev - 1));
    };

    return (
        <footer className="w-full h-fit flex-col md:flex-row gap-y-10 md:h-[285px]">
            <section className="siteInfo ccdiv flex-col w-full md:w-[25%] h-full pt-10 md:pt-0">
                <div className="logo w-[100px]">
                    <img src={`/uploads/${dynamicdata?.logo}`} className="" />
                </div>
                <p
                    className="text-sm text-center w-[70%] mt-3"
                >{dynamicdata?.footerText}</p>
            </section>
            <section className="conection ccdiv flex-col gap-5 w-full md:w-[50%] h-full">
                <div className="biginfo w-[95%] md:w-fit px-5 py-3 md:py-0 md:h-[40px] rounded-lg gap-3 md:gap-8">
                    <div>
                        <i className="">@</i>
                        ایمل : {dynamicdata?.siteEmail}
                    </div>

                    <div>
                        <i className="ri-phone-line"></i>
                        شماره تماس : <a href={`tel:${dynamicdata?.sitePhone}`}>{dynamicdata?.sitePhone}</a>
                    </div>

                    <div>
                        <i className="ri-user-location-line"></i>
                        {dynamicdata?.address}
                    </div>
                </div>

                <div className="iconbox w-fit px-5 h-[40px] rounded-lg gap-8">
                    {cotactBox.length > 0 ? (
                        <>
                            {cotactBox.map((so: any) => {
                                if (so.link === '') { return }
                                return (
                                    <Link key={so.name} href={so.link ? `http://${so.link}` : ''}>
                                        {so.icon.slice()[0] === '/' ? (
                                            <img src={`/media${so.icon}.png`} className="w-[20px] h-[20px]" />
                                        ) : (
                                            <i className={`${so.icon} text-lg`}></i>
                                        )}
                                    </Link>
                                )
                            })}
                        </>
                    ) : (
                        <p>بدون شبکه های اجتماعی</p>
                    )}
                </div>
            </section>
            <div className="harim w-full h-[25px] text-xs ccdiv">
                <p>{dynamicdata?.coptright}</p>
            </div>
            <section className="access ccdiv flex-col w-full md:w-[25%] h-[250px] md:h-full">
                <h2 className="font-medium text-lg text-[var(--title)]">گواهی ها</h2>
                {dynamicdata?.certificates?.length > 0 ? (
                    <div className="w-[200px] h-[150px] rounded-xl overflow-hidden relative">
                        <button
                            onClick={prevSlide}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--background)] cursor-pointer transition-colors z-10"
                        >
                            <i className="ri-arrow-left-s-line text-lg font-bold text-[var(--title)]"></i>
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--background)] cursor-pointer transition-colors z-10"
                        >
                            <i className="ri-arrow-right-s-line text-lg font-bold text-[var(--title)]"></i>
                        </button>

                        {/* Slides */}
                        <div className="w-full h-full flex items-center justify-center">
                            {dynamicdata?.certificates?.map((slide: any, index: any) => (
                                <Link
                                    href={slide.link ? `http://${slide.link}` : ''}
                                    key={index}
                                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                                        }`}
                                >
                                    {slide.img !== '' && (
                                        <img
                                            src={`/uploads/${slide.img}`}
                                            alt="Logo"
                                            className="w-[80px] h-[80px] object-contain"
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Dots */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {dynamicdata?.certificates?.map((_: any, index: any) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                        ? 'bg-[var(--title)] w-6'
                                        : 'bg-gray-400 hover:bg-gray-600'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>بدون گواهی</p>
                )}
            </section>
            <div className="blur"></div>
            <div className="hale hale0"></div>
            <div className="hale hale1"></div>
            <div className="hale hale2"></div>
        </footer>
    )
}

export default Footer