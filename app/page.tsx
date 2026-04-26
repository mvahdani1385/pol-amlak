import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import Header from "@/app/components/themes/Header";
import Footer from "@/app/components/themes/Footer";
import ShowRealestate from "./LandingPage";
import MainFilter from "./MainFilter"
import Categoris from "./Categoris";
import { fetchDynamicOptions } from '@/lib/fetchDynamicOptions';

type PropertyImage = {
    id: number;
    imageUrl: string;
    isMain: boolean;
    sortOrder: number;
};

type Property = {
    id: number;
    title: string;
    slug: string;
    propertyType: string;
    dealType: string;
    status: string;
    city: string | null;
    district: string | null;
    price: number | null;
    depositPrice: number | null;
    rentPrice: number | null;
    pricePerMeter: number | null;
    images: PropertyImage[];
    createdAt: string;
    roomNumber: string;
    landArea: string;
};

async function getProperties(): Promise<Property[]> {
    const h = await headers();
    const proto = h.get("x-forwarded-proto") ?? "http";
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const origin = host ? `${proto}://${host}` : "";

    const apiPath = "/api/properties";



    let queryString = ""; 


    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiPath}${queryString}`, { cache: "no-store" });


    if (!res.ok) {
        throw new Error("خطا در دریافت املاک");
    }

    return res.json();
}

export async function generateMetadata() {
  const dynamicData = await fetchDynamicOptions();
  
  return {
    title: dynamicData?.siteName || "پل املاک",
  };
}

export default async function SHOWaMLAKPage() {
    const properties = await getProperties();

    const h = await headers();

    return (
        <div>
            <Header />
            <MainFilter />
            {/* <Link className="normBtn top-45 left-40 mt-5 m-auto w-[90%] md:w-[200px] h-[45px]" href={'/userPanel'}>یوزر پنل</Link> */}
            <Categoris />
            <ShowRealestate />
            <Footer />
        </div>
    );
}
