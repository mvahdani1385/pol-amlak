import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

function normalizeSlug(input: string) {
  return input
    .trim()
    .normalize("NFC")
    // Arabic -> Persian
    .replace(/ك/g, "ک")
    .replace(/ي/g, "ی")
    .replace(/ى/g, "ی")
    .replace(/ة/g, "ه")
    // normalize different hyphen characters
    .replace(/[‐‑‒–—―]/g, "-")
    // remove ZWNJ / ZWJ (often typed in Persian text)
    .replace(/[\u200C\u200D]/g, "");
}

type PageProps = {
  params: { slug?: string } | Promise<{ slug?: string }>;
};

export default async function PropertyDetailPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;

  if (!slug) {
    notFound();
  }

  const normalizedSlug = normalizeSlug(slug);
  const slugCandidates = Array.from(
    new Set([
      slug,
      normalizedSlug,
      // some slugs may include ZWNJ/ZWJ in DB but user types without (or vice versa)
      slug.replace(/[\u200C\u200D]/g, ""),
    ])
  );

  const property = await prisma.property.findFirst({
    where: {
      OR: slugCandidates.map((s) => ({ slug: s })),
    },
    include: {
      images: true,
      fieldValues: {
        include: {
          field: true,
        },
      },
    },
  });

  if (!property) {
    notFound();
  }

  const price = property.price ? Number(property.price) : null;
  const depositPrice = property.depositPrice ? Number(property.depositPrice) : null;
  const rentPrice = property.rentPrice ? Number(property.rentPrice) : null;
  const pricePerMeter = property.pricePerMeter ? Number(property.pricePerMeter) : null;

  const mainImage = property.images.find((img) => img.isMain) ?? property.images[0];

  return (
    <div className="min-h-screen bg-zinc-50 p-6 font-sans dark:bg-black">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{property.title}</h1>

          <div className="flex gap-3">
            <Link
              href="/SHOWaMLAK"
              className="rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
            >
              برگشت به لیست
            </Link>
            <Link href="/addMelk" className="rounded-lg bg-blue-600 px-4 py-2 text-white">
              ثبت ملک جدید
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="relative h-72 w-full bg-zinc-100 dark:bg-zinc-900">
            {mainImage?.imageUrl ? (
              <Image
                src={mainImage.imageUrl}
                alt={property.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1024px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-zinc-500">بدون تصویر</div>
            )}
          </div>

          <div className="space-y-6 p-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <div className="text-xs text-zinc-500">نوع ملک</div>
                <div className="font-medium text-zinc-900 dark:text-zinc-100">{property.propertyType}</div>
              </div>

              <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <div className="text-xs text-zinc-500">نوع معامله</div>
                <div className="font-medium text-zinc-900 dark:text-zinc-100">{property.dealType}</div>
              </div>

              <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <div className="text-xs text-zinc-500">شهر / منطقه</div>
                <div className="font-medium text-zinc-900 dark:text-zinc-100">
                  {property.city ?? "-"}
                  {property.district ? ` - ${property.district}` : ""}
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <div className="text-xs text-zinc-500">وضعیت</div>
                <div className="font-medium text-zinc-900 dark:text-zinc-100">{property.status}</div>
              </div>

              <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800 md:col-span-2">
                <div className="text-xs text-zinc-500">قیمت</div>
                <div className="font-medium text-zinc-900 dark:text-zinc-100">
                  {property.dealType === "اجاره" ? (
                    <>
                      {depositPrice != null ? `رهن: ${depositPrice.toLocaleString()}` : ""}
                      {depositPrice != null && rentPrice != null ? " | " : ""}
                      {rentPrice != null ? `اجاره: ${rentPrice.toLocaleString()}` : ""}
                    </>
                  ) : (
                    <>{price != null ? `قیمت: ${price.toLocaleString()}` : "-"}</>
                  )}
                  {pricePerMeter != null ? ` (هر متر: ${pricePerMeter.toLocaleString()})` : ""}
                </div>
              </div>
            </div>

            {property.description ? (
              <div className="space-y-2">
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">توضیحات</div>
                <div className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                  {property.description}
                </div>
              </div>
            ) : null}

            {property.images.length > 1 ? (
              <div className="space-y-2">
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">گالری</div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {property.images
                    .slice()
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((img) => (
                      <div key={img.id} className="relative h-28 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
                        <Image src={img.imageUrl} alt={property.title} fill className="object-cover" />
                      </div>
                    ))}
                </div>
              </div>
            ) : null}

            {property.fieldValues.length > 0 ? (
              <div className="space-y-2">
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">ویژگی‌های داینامیک</div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {property.fieldValues.map((fv) => (
                    <div key={fv.id} className="rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800">
                      <div className="text-xs text-zinc-500">{fv.field.title}</div>
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">{fv.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="text-xs text-zinc-500">اسلاگ: {property.slug}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
