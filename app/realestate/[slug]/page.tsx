import { redirect } from "next/navigation";
import Header from "@/app/components/themes/Header";
import Footer from "@/app/components/themes/Footer";
import Breadcrumbs from "@/app/components/themes/Breadcrumbs";
import FileDetile from "./FileDetile";
import { propertyFeatures } from '@/propertyFeatures.config'
import { features } from "process";

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    // Handle both direct params and Promise params
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;

    if (!slug) {
      console.error('No slug provided in generateMetadata for property');
      return {
        title: 'Property',
        description: 'Property description',
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    console.log('Fetching property for metadata:', slug);

    const response = await fetch(`${baseUrl}/api/properties/${slug}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error('Failed to fetch property for metadata:', response.status, response.statusText);
      return {
        title: 'Property',
        description: 'Property description',
      };
    }

    const property = await response.json();
    console.log('Property data for metadata:', property);

    const title = property.seoTitle || property.title || 'Property';
    const description = property.seoMeta || property.seoDestination || property.description || property.title || 'Property description';

    // Get main image
    const mainImage = property.images?.find((img: any) => img.isMain === true)?.imageUrl ||
      property.images?.[0]?.imageUrl || '';

    return {
      title,
      description,
      keywords: property.propertyType ? [property.propertyType, property.dealType].filter(Boolean).join(', ') : '',
      canonical: property.seoCanonikalOrigin || `${baseUrl}/realestate/${slug}`,
      openGraph: {
        type: 'website',
        title,
        description,
        url: property.seoOrigin || `${baseUrl}/realestate/${slug}`,
        images: mainImage ? [mainImage] : [],
        siteName: 'Real Estate',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: mainImage ? [mainImage] : [],
      },
      authors: [{ name: 'Real Estate Team' }],
      robots: 'index, follow',
      other: {
        language: 'fa-IR',
        'property:type': property.propertyType || '',
        'property:deal_type': property.dealType || '',
        'property:city': property.city || '',
        'property:province': property.province || '',
        'property:price': property.price || '',
        'property:area': property.landArea || property.buildingArea || '',
        'property:rooms': property.roomNumber || '',
        'article:published_time': property.createdAt,
        'article:modified_time': property.updatedAt,
        'article:section': 'realestate',
      },
    };
  } catch (error) {
    console.error('Error in generateMetadata for property:', error);
    return {
      title: 'Property',
      description: 'Property description',
    };
  }
}

interface PageProps {
  params: {
    slug: string;
  };
}
interface ImageData {
  propertyId: number;
  imageUrl: string;
  isMain: boolean;
  sortOrder: string;
}

export default async function ShowProperty({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  let mainimage: ImageData | null = null;
  let maindata: any[] = [];
  const translatedList = [
    { name: "propertyType", trans: "نوع ملک" },
    { name: "dealType", trans: "نوع معامله" },
    { name: "statusfile", trans: "وضعیت فایل" },
    { name: "occupancyStatus", trans: "وضعیت سکونت" },
    { name: "province", trans: "استان" },
    { name: "city", trans: "شهر" },
    { name: "district", trans: "منطقه" },
    { name: "address", trans: "آدرس" },
    { name: "postalCode", trans: "کد پستی" },
    { name: "createYear", trans: "سال ساخت" },
    { name: "allUnit", trans: "تعداد واحد" },
    { name: "buildingArea", trans: "مساحت ساختمان" },
    { name: "landArea", trans: "مساحت زمین" },
    { name: "floor", trans: "طبقه" },
    { name: "propertyFloors", trans: "تعداد طبقات ملک" },
    { name: "propertyUnit", trans: "واحد ملک" },
    { name: "propertydirection", trans: "جهت ملک" },
    { name: "roomNumber", trans: "تعداد اتاق" },
    { name: "unitInFloor", trans: "واحد در هر طبقه" },
    { name: "buildingFacade", trans: "نمای ساختمان" },
    { name: "floorCovering", trans: "پوشش کف" },
    { name: "parkingnum", trans: "تعداد پارکینگ" },
  ];

  const allFeatures: any[] = [];
  const featuresData: any[] = [];
  const featureList = [
    "bathroomFeatures",
    "commonAreas",
    "heatingCooling",
    "kitchenFeatures",
    "otherFeatures",
    "parkingTypes",
    "propertySpecs",
    "utilities",
  ];

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/properties/${slug}`,
  );
  const property = await res.json();

  // Check for redirect
  if (property.seoDestination && property.seoDestination.trim() !== "") {
    redirect(property.seoDestination);
  }

  if (property.images.length > 0) {
    property.images.find((fin: any) => {
      if (fin.isMain === true) {
        mainimage = fin;
      }
    });
  }

  for (const key in property) {
    if (Object.prototype.hasOwnProperty.call(property, key)) {
      if (
        property[key] === "" ||
        property[key] === null ||
        property[key] === undefined
      )
        continue;

      if (featureList.includes(key)) {
        property[key].map((lis: any) => {
          featuresData.push(lis);
        })
      }

      translatedList.find((fin: any) => {
        if (key === fin.name) {
          maindata.push({ name: key, trans: fin.trans });
        }
      });
    }
  }

  propertyFeatures.map((fea) => {
    if (!fea.icons) { return }
    fea.features.map((find, idx) => {
      if (fea.icons[idx]) {
        allFeatures.push({ name: find, icon: fea.icons[idx] })
      } else {
        allFeatures.push({ name: find, icon: '' })
      }
    })
  })


  // console.log(allFeatures);

  // console.log("Property Data:", property);

  return (
    <>
      <Header />
      <div className="container w-[95%] md:w-[80%] m-auto mt-25 md:mt-45">
        <Breadcrumbs
          sitMap={[
            { name: "املاک", url: "/realestate" },
            { name: property.title, url: `/articles/${slug}` },
          ]}
        />
        <FileDetile
          property={property}
          mainImage={mainimage as unknown as ImageData}
          maindata={maindata}
          allFeatures={allFeatures}
          featuresData={featuresData}
        />
      </div>
      <Footer />
    </>
  );
}
