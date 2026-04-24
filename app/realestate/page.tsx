import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import Header from "@/app/components/themes/Header";
import Footer from "@/app/components/themes/Footer";
import ShowRealestate from "./ShowRealestate";

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


export default async function SHOWaMLAKPage() {
    const properties = await getProperties();

    const h = await headers();


    return (
        <div>
            <Header />
            <ShowRealestate />
            <Footer />
        </div>
    );
}
