import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";

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
};

async function getProperties(): Promise<Property[]> {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const origin = host ? `${proto}://${host}` : "";

  const res = await fetch(`${origin}/api/properties`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("خطا در دریافت املاک");
  }

  return res.json();
}

export default async function SHOWaMLAKPage() {
  const properties = await getProperties();

  return (
    <div className="min-h-screen bg-zinc-50 p-6 font-sans dark:bg-black">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">نمایش املاک ثبت‌شده</h1>
          <div className="flex gap-4">
            <Link href="/addMelk" className="rounded-lg bg-blue-600 px-4 py-2 text-white">
              ثبت ملک جدید
            </Link>
            <Link href="/" className="rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 dark:text-zinc-100">
              خانه
            </Link>
          </div>
        </div>

        {properties.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
            هنوز هیچ ملکی ثبت نشده است.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => {
              const mainImage = p.images?.find((img) => img.isMain) ?? p.images?.[0];

              return (
                <Link
                  key={p.id}
                  href={`/SHOWaMLAK/${encodeURIComponent(p.slug)}`}
                  className="block overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="relative h-44 w-full bg-zinc-100 dark:bg-zinc-900">
                    {mainImage?.imageUrl ? (
                      <Image
                        src={mainImage.imageUrl}
                        alt={p.title || "property"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                        بدون تصویر
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 p-4">
                    <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{p.title}</div>

                    <div className="text-sm text-zinc-600 dark:text-zinc-300">
                      {p.propertyType} | {p.dealType}
                    </div>

                    <div className="text-sm text-zinc-600 dark:text-zinc-300">
                      {p.city ? `شهر: ${p.city}` : ""}
                      {p.city && p.district ? " - " : ""}
                      {p.district ? `منطقه: ${p.district}` : ""}
                    </div>

                    <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                      {p.dealType === "اجاره" ? (
                        <>
                          {p.depositPrice != null ? `رهن: ${p.depositPrice.toLocaleString()}` : ""}
                          {p.depositPrice != null && p.rentPrice != null ? " | " : ""}
                          {p.rentPrice != null ? `اجاره: ${p.rentPrice.toLocaleString()}` : ""}
                        </>
                      ) : (
                        <>{p.price != null ? `قیمت: ${p.price.toLocaleString()}` : ""}</>
                      )}
                    </div>

                    <div className="pt-2 text-xs text-zinc-500">
                      وضعیت: {p.status}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
