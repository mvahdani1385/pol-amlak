import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// export async function GET() {
//   try {
//     const properties = await prisma.property.findMany({
//       include: {
//         images: true,
//         fieldValues: {
//           include: {
//             field: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     // تبدیل BigInt به Number برای JSON serialization
//     const serializedProperties = properties.map(property => ({
//       ...property,
//       price: property.price ? Number(property.price) : null,
//       depositPrice: property.depositPrice ? Number(property.depositPrice) : null,
//       rentPrice: property.rentPrice ? Number(property.rentPrice) : null,
//       pricePerMeter: property.pricePerMeter ? Number(property.pricePerMeter) : null,
//     }));

//     return NextResponse.json(serializedProperties);
//   } catch (error) {
//     console.error("GET properties error:", error);
//     return NextResponse.json(
//       { error: "خطا در دریافت املاک" },
//       { status: 500 }
//     );
//   }
// }

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // // ساخت شرط WHERE برای کوئری Prisma
    // const whereClause: any = {};

    // // دقیقا باید یکی باشه مساوی مساوی
    // const city = searchParams.get('city');
    // if (city) {
    //   whereClause.city = city;
    // }
    // const dealType = searchParams.get('dealType');
    // if (dealType) {
    //   whereClause.dealType = dealType;
    // }
    // const propertyType = searchParams.get('propertyType');
    // if (propertyType) {
    //   whereClause.propertyType = propertyType;
    // }
    // const status = searchParams.get('status');
    // if (status) {
    //   whereClause.status = status;
    // }
    // const occupancyStatus = searchParams.get('occupancyStatus');
    // if (occupancyStatus) {
    //   whereClause.occupancyStatus = occupancyStatus;
    // }
    // const isConvertible = searchParams.get('isConvertible');
    // if (isConvertible) {
    //   whereClause.isConvertible = isConvertible;
    // }
    // const ownerName = searchParams.get('ownerName');
    // if (ownerName) {
    //   whereClause.ownerName = ownerName;
    // }
    // const province = searchParams.get('province');
    // if (province) {
    //   whereClause.province = province;
    // }
    // const district = searchParams.get('district');
    // if (district) {
    //   whereClause.district = district;
    // }
    // const propertyUnit = searchParams.get('propertyUnit');
    // if (propertyUnit) {
    //   whereClause.propertyUnit = propertyUnit;
    // }
    // const isFeatured = searchParams.get('isFeatured');
    // if (isFeatured) {
    //   whereClause.isFeatured = isFeatured;
    // }
    // const propertydirection = searchParams.get('propertydirection');
    // if (propertydirection) {
    //   whereClause.propertydirection = propertydirection;
    // }
    // const buildingFacade = searchParams.get('buildingFacade');
    // if (buildingFacade) {
    //   whereClause.buildingFacade = buildingFacade;
    // }
    // const floorCovering = searchParams.get('floorCovering');
    // if (floorCovering) {
    //   whereClause.floorCovering = floorCovering;
    // }

    // // دیتا های اینها به صورت آرایه هست و فیلتر باشد چک کنه که آیا دیتا برابر با یک یا چند تا از عناصر  آن آرایه هست یا نه
    // const utilities = searchParams.get('utilities');
    // if (utilities) {
    //   whereClause.utilities = utilities;
    // }
    // const propertySpecs = searchParams.get('propertySpecs');
    // if (propertySpecs) {
    //   whereClause.propertySpecs = propertySpecs;
    // }
    // const commonAreas = searchParams.get('commonAreas');
    // if (commonAreas) {
    //   whereClause.commonAreas = commonAreas;
    // }
    // const heatingCooling = searchParams.get('heatingCooling');
    // if (heatingCooling) {
    //   whereClause.heatingCooling = heatingCooling;
    // }
    // const kitchenFeatures = searchParams.get('kitchenFeatures');
    // if (kitchenFeatures) {
    //   whereClause.kitchenFeatures = kitchenFeatures;
    // }
    // const bathroomFeatures = searchParams.get('bathroomFeatures');
    // if (bathroomFeatures) {
    //   whereClause.bathroomFeatures = bathroomFeatures;
    // }
    // const wallCeiling = searchParams.get('wallCeiling');
    // if (wallCeiling) {
    //   whereClause.wallCeiling = wallCeiling;
    // }
    // const parkingTypes = searchParams.get('parkingTypes');
    // if (parkingTypes) {
    //   whereClause.parkingTypes = parkingTypes;
    // }
    // const otherFeatures = searchParams.get('otherFeatures');
    // if (otherFeatures) {
    //   whereClause.otherFeatures = otherFeatures;
    // }

    // //باید به صورت رنج باشه یعنی ما بین اعداد
    // const roomNumber = searchParams.get('roomNumber');
    // if (roomNumber) {
    //   whereClause.roomNumber = roomNumber;
    // }
    // const price = searchParams.get('price');
    // if (price) {
    //   whereClause.price = price;
    // }
    // const depositPrice = searchParams.get('depositPrice');
    // if (depositPrice) {
    //   whereClause.depositPrice = depositPrice;
    // }
    // const rentPrice = searchParams.get('rentPrice');
    // if (rentPrice) {
    //   whereClause.rentPrice = rentPrice;
    // }
    // const propertyFloors = searchParams.get('propertyFloors');
    // if (propertyFloors) {
    //   whereClause.propertyFloors = propertyFloors;
    // }
    // const floor = searchParams.get('floor');
    // if (floor) {
    //   whereClause.floor = floor;
    // }
    // const allUnit = searchParams.get('allUnit');
    // if (allUnit) {
    //   whereClause.allUnit = allUnit;
    // }
    // const unitInFloor = searchParams.get('unitInFloor');
    // if (unitInFloor) {
    //   whereClause.unitInFloor = unitInFloor;
    // }
    // const buildingArea = searchParams.get('buildingArea');
    // if (buildingArea) {
    //   whereClause.buildingArea = buildingArea;
    // }
    // const landArea = searchParams.get('landArea');
    // if (landArea) {
    //   whereClause.landArea = landArea;
    // }

    // فرض کنید searchParams از اینجا دریافت شده است:
    // const searchParams = new URLSearchParams(window.location.search);

    interface PrismaFilter {
      [key: string]: any; // یا نوع دقیق‌تری اگر می‌دانید
    }

    const whereClause: PrismaFilter = {};

    const simpleFields = [
      "city",
      "dealType",
      "propertyType",
      "status",
      "occupancyStatus",
      "isConvertible",
      "ownerName",
      "province",
      "district",
      "roomNumber",
      "propertyFloors",
      "floor",
      "allUnit",
      "unitInFloor",
      "propertyUnit",
      "isFeatured",
      "propertydirection",
      "buildingFacade",
      "floorCovering",
      "statusfile",
      "parkingnum",
      "categoryTitle",
    ];

    const arrayFields = [
      "utilities",
      "propertySpecs",
      "commonAreas",
      "heatingCooling",
      "kitchenFeatures",
      "bathroomFeatures",
      "wallCeiling",
      "parkingTypes",
      "otherFeatures",
    ];

    const rangeFields = [
      "price",
      "depositPrice",
      "rentPrice",
      "buildingArea",
      "landArea",
      "meterPrice",
      "createYear",
    ];

    // --- پردازش فیلدهای ساده (تساوی مستقیم) ---
    simpleFields.forEach((field) => {
      const value = searchParams.get(field);
      if (value !== null && value !== undefined) {
        // اگر فیلد بولین است، مقدار را به boolean تبدیل کنید
        if (value === "true" || value === "false") {
          whereClause[field] = value === "true";
        } else {
          whereClause[field] = value;
        }
      }
    });

    // --- پردازش فیلدهای آرایه‌ای ---
    // arrayFields.forEach((field) => {
    //   const value = searchParams.get(field);
    //   if (value !== null && value !== undefined) {
    //     try {
    //       const parsedValue = JSON.parse(value);
    //       if (Array.isArray(parsedValue) && parsedValue.length > 0) {
    //         whereClause[field] = { hasSome: parsedValue };
    //       } else {
    //         console.warn(
    //           `Invalid or empty array provided for ${field}: ${value}`,
    //         );
    //       }
    //     } catch (e) {
    //       console.error(`Error parsing JSON for ${field}: ${value}`, e);
    //       // می‌توانید در صورت خطا، مقدار را نادیده بگیرید یا خطا برگردانید
    //     }
    //   }
    // });

    arrayFields.forEach((field) => {
      const rawValue = searchParams.get(field);

      if (rawValue !== null && rawValue !== undefined) {
        let parsedValue = null;
        try {
          // تلاش اول: parse مستقیم (اگر URL ساز درست باشد)
          parsedValue = JSON.parse(rawValue);
        } catch (e) {
          // تلاش دوم: اگر JSON.parse شکست خورد، سعی کن دستی فرمت [value1,value2] را به ["value1","value2"] تبدیل کنی
          // این بخش فقط برای سازگاری با URL های نامعتبر است
          try {
            // فقط اگر مقدار با [ شروع و با ] تمام شود
            if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
              // مقدار داخل کروشه را بگیر، کوتیشن اضافه کن و دوباره JSON بساز
              const contentInsideBrackets = rawValue.substring(
                1,
                rawValue.length - 1,
              );
              // مقادیر را با کاما جدا کن و برای هر کدام کوتیشن بگذار
              const quotedItems = contentInsideBrackets
                .split(",")
                .map((item) => `"${item.trim()}"`) // trim() برای حذف فضاهای خالی احتمالی
                .join(",");
              parsedValue = JSON.parse(`[${quotedItems}]`);
            }
          } catch (manualParseError) {
            console.error(
              `Error parsing field "${field}" with raw value "${rawValue}":`,
              manualParseError,
            );
          }
        }

        if (
          parsedValue &&
          Array.isArray(parsedValue) &&
          (parsedValue as any[]).length > 0
        ) {
          whereClause[field] = { hasSome: parsedValue };
        } else if (rawValue !== null && rawValue !== undefined) {
          // اگر مقدار بود ولی parse نشد یا خالی بود
          console.warn(
            `Field "${field}" received a value but it was not a valid non-empty array after parsing:`,
            rawValue,
          );
        }
      }
    });

    // --- پردازش فیلدهای عددی/محدوده ---
    rangeFields.forEach((field) => {
      const value = searchParams.get(field);
      if (value !== null && value !== undefined) {
        // ابتدا سعی می‌کنیم مقدار را به عدد تبدیل کنیم
        const numericValue = parseInt(value, 10);

        if (!isNaN(numericValue)) {
          // اگر فیلد به صورت "minPrice" یا "maxPrice" آمده بود
          if (field.startsWith("min")) {
            const actualField = field.substring(3).toLowerCase(); // مانند price
            if (!whereClause[actualField]) whereClause[actualField] = {};
            whereClause[actualField].gte = numericValue;
          } else if (field.startsWith("max")) {
            const actualField = field.substring(3).toLowerCase(); // مانند price
            if (!whereClause[actualField]) whereClause[actualField] = {};
            whereClause[actualField].lte = numericValue;
          } else {
            // برای فیلدهایی که مستقیماً خودشان مقادیر عددی هستند (مانند roomNumber)
            // اگر نیاز به فیلتر محدوده داشتید (مثلا 'roomNumber_gte', 'roomNumber_lte')
            // باید اینجا منطق آن را اضافه کنید.
            // در حال حاضر، فرض می‌کنیم که مقادیر دریافتی مستقیماً برای فیلد مربوطه استفاده می‌شوند.
            // اگر price, roomNumber و ... نیاز به محدوده دارند، باید به صورت minPrice/maxPrice یا ... ارسال شوند.
            // اگر فقط یک مقدار عددی ارسال شد، آن را به عنوان تساوی در نظر می‌گیریم:
            whereClause[field] = numericValue;

            // مثال: اگر بخواهیم roomNumber را به صورت محدوده 'gte' فیلتر کنیم:
            // if (field === 'roomNumber') {
            //   if (!whereClause.roomNumber) whereClause.roomNumber = {};
            //   whereClause.roomNumber.gte = numericValue;
            // }
          }
        } else {
          console.warn(`Invalid numeric value for ${field}: ${value}`);
        }
      }
    });

    // --- مدیریت فیلترهای خاص (مانند roomNumber و price که نیاز به محدوده دارند) ---
    // این بخش برای اطمینان از اینکه مقادیر عددی به درستی برای فیلترهای محدوده تنظیم می‌شوند
    // اگر مقادیر min/maxPrice یا min/maxRoomNumber ارسال شده باشند.

    const minPrice = searchParams.get("minPrice");
    if (minPrice !== null) {
      const numericMinPrice = parseInt(minPrice, 10);
      if (!isNaN(numericMinPrice)) {
        if (!whereClause.price) whereClause.price = {};
        whereClause.price.gte = numericMinPrice;
      }
    }

    const maxPrice = searchParams.get("maxPrice");
    if (maxPrice !== null) {
      const numericMaxPrice = parseInt(maxPrice, 10);
      if (!isNaN(numericMaxPrice)) {
        if (!whereClause.price) whereClause.price = {};
        whereClause.price.lte = numericMaxPrice;
      }
    }

    // پردازش حداقل قیمت اجاره (rentPrice)
    const minRentPrice = searchParams.get("minRentPrice");
    if (minRentPrice !== null) {
      const numericMinRentPrice = parseInt(minRentPrice, 10);
      if (!isNaN(numericMinRentPrice)) {
        if (!whereClause.rentPrice) {
          whereClause.rentPrice = {};
        }
        whereClause.rentPrice.gte = numericMinRentPrice; // حداقل قیمت اجاره
      }
    }

    // پردازش حداکثر قیمت اجاره (rentPrice)
    const maxRentPrice = searchParams.get("maxRentPrice");
    if (maxRentPrice !== null) {
      const numericMaxRentPrice = parseInt(maxRentPrice, 10);
      if (!isNaN(numericMaxRentPrice)) {
        if (!whereClause.rentPrice) {
          whereClause.rentPrice = {};
        }
        whereClause.rentPrice.lte = numericMaxRentPrice; // حداکثر قیمت اجاره
      }
    }

    // پردازش حداقل مبلغ رهن (depositPrice)
    const minDepositPrice = searchParams.get("minDeposit");
    if (minDepositPrice !== null) {
      const numericMinDepositPrice = parseInt(minDepositPrice, 10);
      if (!isNaN(numericMinDepositPrice)) {
        if (!whereClause.depositPrice) {
          whereClause.depositPrice = {};
        }
        whereClause.depositPrice.gte = numericMinDepositPrice; // حداقل مبلغ رهن
      }
    }

    // پردازش حداکثر مبلغ رهن (depositPrice)
    const maxDepositPrice = searchParams.get("maxDeposit");
    if (maxDepositPrice !== null) {
      const numericMaxDepositPrice = parseInt(maxDepositPrice, 10);
      if (!isNaN(numericMaxDepositPrice)) {
        if (!whereClause.depositPrice) {
          whereClause.depositPrice = {};
        }
        whereClause.depositPrice.lte = numericMaxDepositPrice; // حداکثر مبلغ رهن
      }
    }

    const minLandArea = searchParams.get("minLandArea");
    if (minLandArea !== null) {
      const numericMinLandArea = parseInt(minLandArea, 10);
      if (!isNaN(numericMinLandArea)) {
        if (!whereClause.landArea) whereClause.landArea = {};
        whereClause.landArea.gte = numericMinLandArea;
      }
    }

    const maxLandArea = searchParams.get("maxLandArea");
    if (maxLandArea !== null) {
      const numericMaxLandArea = parseInt(maxLandArea, 10);
      if (!isNaN(numericMaxLandArea)) {
        if (!whereClause.landArea) whereClause.landArea = {};
        whereClause.landArea.lte = numericMaxLandArea;
      }
    }

    // minMeterPrice
    const minMeterPrice = searchParams.get("minMeterPrice");
    if (minMeterPrice !== null) {
      const numericMinMeterPrice = parseInt(minMeterPrice, 10);
      if (!isNaN(numericMinMeterPrice)) {
        if (!whereClause.meterPrice) whereClause.meterPrice = {};
        whereClause.meterPrice.gte = numericMinMeterPrice;
      }
    }

    // maxMeterPrice
    const maxMeterPrice = searchParams.get("maxMeterPrice");
    if (maxMeterPrice !== null) {
      const numericMaxMeterPrice = parseInt(maxMeterPrice, 10);
      if (!isNaN(numericMaxMeterPrice)) {
        if (!whereClause.meterPrice) whereClause.meterPrice = {};
        whereClause.meterPrice.lte = numericMaxMeterPrice;
      }
    }

    const minCreateYear = searchParams.get("minCreateYear");
    if (minCreateYear !== null) {
      const numericminCreateYear = parseInt(minCreateYear, 10);
      if (!isNaN(numericminCreateYear)) {
        if (!whereClause.createYear) whereClause.createYear = {};
        whereClause.createYear.gte = numericminCreateYear;
      }
    }

    const maxCreateYear = searchParams.get("maxCreateYear");
    if (maxCreateYear !== null) {
      const numericmaxCreateYear = parseInt(maxCreateYear, 10);
      if (!isNaN(numericmaxCreateYear)) {
        if (!whereClause.createYear) whereClause.createYear = {};
        whereClause.createYear.lte = numericmaxCreateYear;
      }
    }

    const minBuildingArea = searchParams.get("minBuildingArea");
    if (minBuildingArea !== null) {
      const numericMinBuildingArea = parseInt(minBuildingArea, 10);
      if (!isNaN(numericMinBuildingArea)) {
        // اگر whereClause.buildingArea وجود نداشته باشد، آن را ایجاد می‌کنیم
        if (!whereClause.buildingArea) {
          whereClause.buildingArea = {};
        }
        // تنظیم حداقل مقدار برای مساحت زیربنا
        whereClause.buildingArea.gte = numericMinBuildingArea;
      }
    }

    // پردازش حداکثر مساحت زیربنا (buildingArea)
    const maxBuildingArea = searchParams.get("maxBuildingArea");
    if (maxBuildingArea !== null) {
      const numericMaxBuildingArea = parseInt(maxBuildingArea, 10);
      if (!isNaN(numericMaxBuildingArea)) {
        // اگر whereClause.buildingArea وجود نداشته باشد، آن را ایجاد می‌کنیم
        if (!whereClause.buildingArea) {
          whereClause.buildingArea = {};
        }
        // تنظیم حداکثر مقدار برای مساحت زیربنا
        whereClause.buildingArea.lte = numericMaxBuildingArea;
      }
    }

    // حال whereClause آماده است تا در findMany استفاده شود:
    // const properties = await prisma.property.findMany({
    //   where: whereClause,
    //   // ... سایر آپشن‌ها مانند include, orderBy, skip, take
    // });

    console.log(
      "Generated Where Clause:",
      JSON.stringify(whereClause, null, 2),
    );

    // فیلتر بر اساس سیستم گرمایشی/سرمایشی
    const heatingCoolingParam = searchParams.get("heatingCooling");
    if (heatingCoolingParam) {
      try {
        // فرض می‌کنیم heatingCooling به صورت یک رشته JSON آرایه ارسال شده است
        // مثال: /api/properties?heatingCooling=["بخاری","اسپلیت"]
        const heatingCoolingArray = JSON.parse(heatingCoolingParam);
        if (
          Array.isArray(heatingCoolingArray) &&
          heatingCoolingArray.length > 0
        ) {
          // برای فیلتر کردن در ستونی که رشته‌ای از مقادیر را ذخیره می‌کند (مانند joining شده در POST)
          // یا اگر ستون به صورت آرایه ذخیره شده باشد، از 'has' یا 'hasSome' استفاده کنید.
          // اگر ستون `heatingCooling` در دیتابیس به صورت رشته ذخیره شده (مثلا "بخاری, اسپلیت")
          // نیاز به فیلتر با contain دارید.
          // فرض می‌کنیم در POST با join ذخیره شده است:
          whereClause.heatingCooling = {
            // اگر فیلد به صورت آرایه در دیتابیس ذخیره شده باشد:
            // hasSome: heatingCoolingArray
            // اگر فیلد به صورت رشته ذخیره شده باشد (مانند join):
            contains: heatingCoolingArray.join(", "), // یا منطق دقیق‌تر برای تطابق
          };
          // نکته: اگر `heatingCooling` در دیتابیس به صورت `String` ذخیره شده و با `, ` جدا شده باشد،
          // باید دقت کنید که جستجوی `contains` ممکن است نتایج دقیقی ندهد.
          // مثلاً اگر آرایه `["بخاری", "اسپلیت"]` باشد، و در دیتابیس `"بخاری, اسپلیت"` ذخیره شده باشد،
          // `contains: "بخاری, اسپلیت"` کار می‌کند.
          // اما اگر بخواهیم هر کدام از آیتم‌های آرایه را جداگانه چک کنیم، نیاز به منطق پیچیده‌تری داریم
          // یا تغییر ساختار دیتابیس به آرایه واقعی (اگر Prisma و دیتابیس پشتیبانی کنند).
        }
      } catch (e) {
        console.error("Error parsing heatingCooling parameter:", e);
        // در صورت بروز خطا در پارسینگ، می‌توانیم خطا برگردانیم یا پارامتر را نادیده بگیریم
      }
    }

    // اضافه کردن سایر پارامترهای مورد نیاز به صورت مشابه
    // const propertyType = searchParams.get('propertyType');
    // if (propertyType) {
    //   whereClause.propertyType = propertyType;
    // }

    // const dealType = searchParams.get('dealType');
    // if (dealType) {
    //   whereClause.dealType = dealType;
    // }

    const properties = await prisma.property.findMany({
      where: whereClause, // استفاده از شرط WHERE ساخته شده
      include: {
        images: true,
        fieldValues: {
          include: {
            field: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // تبدیل BigInt به Number برای JSON serialization
    const serializedProperties = properties.map((property: any) => ({
      ...property,
      price: property.price ? Number(property.price) : null,
      meterPrice: property.meterPrice ? Number(property.meterPrice) : null,
      createYear: property.createYear ? Number(property.createYear) : null,
      depositPrice: property.depositPrice
        ? Number(property.depositPrice)
        : null,
      rentPrice: property.rentPrice ? Number(property.rentPrice) : null,
      pricePerMeter: property.pricePerMeter
        ? Number(property.pricePerMeter)
        : null,
      buildingArea: property.buildingArea
        ? Number(property.buildingArea)
        : null,
      landArea: property.landArea ? Number(property.landArea) : null,
      // اگر فیلدهای دیگری از نوع BigInt دارید، اینجا اضافه کنید
    }));

    return NextResponse.json(serializedProperties);
  } catch (error) {
    console.error("GET properties error:", error);
    // اطمینان از اینکه خطا به صورت واضح‌تر نمایش داده شود
    let errorMessage = "خطا در دریافت املاک";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// =======================
// POST - ثبت ملک جدید
// =======================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("=== PROPERTY SUBMISSION DEBUG ===");
    console.log("Raw body:", JSON.stringify(body, null, 2));
    console.log("Title:", body.title);
    console.log("PropertyType:", body.propertyType);
    console.log("DealType:", body.dealType);
    console.log("Images array:", body.images);
    console.log("MainImageIndex:", body.mainImageIndex);
    console.log("Latitude:", body.latitude);
    console.log("Longitude:", body.longitude);
    console.log("================================");

    // Validate required fields
    if (!body.title || !body.propertyType || !body.dealType) {
      console.error("Missing required fields");
      return NextResponse.json(
        { error: "فیلدهای الزامی (عنوان، نوع ملک، نوع معامله) باید پر شوند" },
        { status: 400 },
      );
    }

    // Check for duplicate slug
    if (body.slug) {
      const existingProperty = await prisma.property.findUnique({
        where: { slug: body.slug },
        select: { id: true, slug: true }
      });

      if (existingProperty) {
        console.log("Duplicate slug found:", body.slug);
        return NextResponse.json(
          { error: "نامک تکراری است", code: "DUPLICATE_SLUG" },
          { status: 409 }
        );
      }
    }

    const newProperty = await prisma.property.create({
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        ownerName: body.ownerName,
        ownerMobile: body.ownerMobile,
        ownerPhone: body.ownerPhone,
        guardName: body.guardName,
        guardPhone: body.guardPhone,
        propertyType: body.propertyType,
        dealType: body.dealType,
        status: body.status || "active",
        occupancyStatus: body.occupancyStatus,
        isConvertible: body.isConvertible,
        isFeatured: body.isFeatured || false,
        price: body.price ? BigInt(body.price) : null,
        depositPrice: body.depositPrice ? BigInt(body.depositPrice) : null,
        rentPrice: body.rentPrice ? BigInt(body.rentPrice) : null,
        pricePerMeter: body.pricePerMeter ? BigInt(body.pricePerMeter) : null,
        meterPrice: body.meterPrice ? BigInt(body.meterPrice) : null,
        parkingnum: body.parkingnum,
        statusfile: body.statusfile,
        createYear: body.createYear ? BigInt(body.createYear) : null,
        province: body.province,
        // --- seo ---
        seoTitle: body.seoTitle,
        seoMeta: body.seoMeta,
        seoCanonikalOrigin: body.seoCanonikalOrigin,
        seoCanonikalDestination: body.seoCanonikalDestination,
        seoOrigin: body.seoOrigin,
        seoDestination: body.seoDestination,
        seoRedirect: body.seoRedirect,
        // --- seo ---
        city: body.city,
        district: body.district,
        address: body.address,
        postalCode: body.postalCode,
        latitude: parseFloat(body.latitude),
        longitude: parseFloat(body.longitude),
        categoryTitle: body.categoryTitle,
        roomNumber: body.roomNumber,
        propertydirection: body.propertydirection,
        propertyUnit: body.propertyUnit,
        propertyFloors: body.propertyFloors,
        floor: body.floor,
        unitInFloor: body.unitInFloor,
        allUnit: body.allUnit,
        landArea: body.landArea ? BigInt(body.landArea) : null,
        buildingArea: body.buildingArea ? BigInt(body.buildingArea) : null,

        // فیلدهای آرایه‌ای - تبدیل به رشته اگر آرایه است
        buildingFacade: Array.isArray(body.buildingFacade)
          ? body.buildingFacade.join(", ")
          : body.buildingFacade,
        floorCovering: Array.isArray(body.floorCovering)
          ? body.floorCovering.join(", ")
          : body.floorCovering,
        utilities: body.utilities || [],
        propertySpecs: body.propertySpecs || [],
        commonAreas: body.commonAreas || [],
        heatingCooling: body.heatingCooling || [],
        kitchenFeatures: body.kitchenFeatures || [],
        bathroomFeatures: body.bathroomFeatures || [],
        wallCeiling: body.wallCeiling || [],
        parkingTypes: body.parkingTypes || [],
        otherFeatures: body.otherFeatures || [],

        // ایجاد تصاویر در جدول PropertyImage
        images:
          body.images && body.images.length > 0
            ? {
                create: body.images.map((imageName: string, index: number) => ({
                  imageUrl: `/uploads/${imageName}`,
                  isMain: index === (body.mainImageIndex || 0),
                  sortOrder: index,
                })),
              }
            : undefined,
      },
      include: {
        images: true,
      },
    });

    console.log("✅ Property created successfully:", newProperty.id);

    // تبدیل BigInt به Number برای JSON serialization
    const serializedProperty = {
      ...newProperty,
      price: newProperty.price ? Number(newProperty.price) : null,
      meterPrice: newProperty.meterPrice
        ? Number(newProperty.meterPrice)
        : null,
      createYear: newProperty.createYear
        ? Number(newProperty.createYear)
        : null,
      depositPrice: newProperty.depositPrice
        ? Number(newProperty.depositPrice)
        : null,
      rentPrice: newProperty.rentPrice ? Number(newProperty.rentPrice) : null,
      pricePerMeter: newProperty.pricePerMeter
        ? Number(newProperty.pricePerMeter)
        : null,
      buildingArea: newProperty.buildingArea
        ? Number(newProperty.buildingArea)
        : null,
      landArea: newProperty.landArea ? Number(newProperty.landArea) : null,
    };

    return NextResponse.json(serializedProperty);
  } catch (error) {
    console.error("❌ Property creation error:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace",
    );

    return NextResponse.json(
      {
        error: "خطا در ثبت ملک",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
