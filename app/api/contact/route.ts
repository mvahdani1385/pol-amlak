import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("Starting contact API call...");
    
    // Get the first DynamicOptions record that has ContactPage data
    const contactData = await prisma.dynamicOptions.findFirst({
      where: {
        ContactPage: {
          not: null
        }
      }
    });

    console.log("Contact data from DB:", contactData);

    if (!contactData || !contactData.ContactPage) {
      console.log("No contact data found, returning default");
      // Return default data if no contact data exists in database
      const defaultData = {
        title: "تماس با ما",
        textUnderTitle: "با کارشناسان ما در ارتباط باشید",
        littleText: "با راه های ارتباطی که در اختیار شما قرار داده ایم میتوانید با کارشناسان ما درارتباط باشید",
        contactBoxs: [
          { icon: "/eitaa", name: "ایتا", link: "https://eitaa.com/" },
          { icon: "/aparat", name: "آپارات", link: "https://www.aparat.com/" },
          { icon: "ri-instagram-line", name: "اینستاگرام", link: "https://www.instagram.com/" },
          { icon: "ri-whatsapp-line", name: "واتساپ", link: "https://www.whatsapp.com/" },
          { icon: "ri-telegram-line", name: "تلگرام", link: "https://telegram.org/" },
          { icon: "ri-mail-line", name: "ایمیل", link: "https://mail.google.com/" },
        ],
      };
      return NextResponse.json(defaultData);
    }

    console.log("ContactPage field content:", contactData.ContactPage);
    
    // Parse the JSON data from ContactPage field
    let parsedData;
    try {
      parsedData = JSON.parse(contactData.ContactPage);
      console.log("Parsed data successfully:", parsedData);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      // Return default data if JSON parsing fails
      const defaultData = {
        title: "تماس با ما",
        textUnderTitle: "با کارشناسان ما در ارتباط باشید",
        littleText: "با راه های ارتباطی که در اختیار شما قرار داده ایم میتوانید با کارشناسان ما درارتباط باشید",
        contactBoxs: [
          { icon: "/eitaa", name: "ایتا", link: "https://eitaa.com/" },
          { icon: "/aparat", name: "آپارات", link: "https://www.aparat.com/" },
          { icon: "ri-instagram-line", name: "اینستاگرام", link: "https://www.instagram.com/" },
          { icon: "ri-whatsapp-line", name: "واتساپ", link: "https://www.whatsapp.com/" },
          { icon: "ri-telegram-line", name: "تلگرام", link: "https://telegram.org/" },
          { icon: "ri-mail-line", name: "ایمیل", link: "https://mail.google.com/" },
        ],
      };
      return NextResponse.json(defaultData);
    }
    
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("Error fetching contact data:", error);
    return NextResponse.json(
      { message: "Failed to fetch contact data", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { contactData } = body;

    if (!contactData) {
      return NextResponse.json(
        { message: "Contact data is required" },
        { status: 400 }
      );
    }

    // Convert contact data to JSON string
    const contactDataJson = JSON.stringify(contactData);

    // Find existing record or create new one
    const existingRecord = await prisma.dynamicOptions.findFirst({
      where: {
        ContactPage: {
          not: null
        }
      }
    });

    let updatedRecord;
    if (existingRecord) {
      // Update existing record
      updatedRecord = await prisma.dynamicOptions.update({
        where: {
          id: existingRecord.id
        },
        data: {
          ContactPage: contactDataJson
        }
      });
    } else {
      // Create new record with default province and city
      updatedRecord = await prisma.dynamicOptions.create({
        data: {
          Province: "Default",
          city: ["Default"],
          ContactPage: contactDataJson
        }
      });
    }

    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.error("Error updating contact data:", error);
    return NextResponse.json(
      { message: "Failed to update contact data" },
      { status: 500 }
    );
  }
}
