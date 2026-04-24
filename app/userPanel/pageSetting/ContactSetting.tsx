"use client";

import { useEffect, useState } from "react";
import TextInput from "@/app/components/themes/TextInput";
import { toast } from "react-toastify";

function ContactSetting(){
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

    const handlePropertyChange = (key: string, value: any) => {
        setContactData((prev: any) => ({
        ...prev,
        [key]: value,
        }));
    }

    const handleLinkChange = (index: string, newLink: string) => {
        setContactData((prev) => ({
            ...prev,
            contactBoxs: prev.contactBoxs.map((item, i) =>
                i === parseInt(index) ? { ...item, link: newLink } : item
            ),
        }));
    };

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


    const handleSubmit = async ()=>{
        const contactPageString = JSON.stringify({
            title: contactData.title,
            textUnderTitle: contactData.textUnderTitle,
            littleText: contactData.littleText,
            contactBoxs: contactData.contactBoxs,
        });

        const finalData = {
            id: 2,
            ContactPage: contactPageString, // دقیقا شبیه postman
        };
        
        console.log(finalData)


        try {
            await fetch('/api/dynamicOptions', {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalData),
            });

            toast.success('صفحه درباره ما به روز رسانی شد.')
        } catch (error) {
            console.error('خطا در به روز رسانی اطلاعات ص درباره ما : ', error)
        }

    }

    return (
        <div className="w-full flex flex-wrap gap-5">
            <h2 className="w-full">اطلاعات کلی صفحه : </h2>
            <TextInput 
                place="عنوان صفحه"
                category="title"
                handlePropertyChange={handlePropertyChange}
                value={contactData.title}
            />
            <TextInput 
                place="زیر  عنوان صفحه"
                category="textUnderTitle"
                handlePropertyChange={handlePropertyChange}
                value={contactData.textUnderTitle}
            />
            <TextInput 
                place="متن کوتاه"
                category="littleText"
                handlePropertyChange={handlePropertyChange}
                value={contactData.littleText}
            />
            <h2 className="w-full">شبکه های اجتماعی : </h2>
            <TextInput 
                place="ایتا"
                category="0"
                lang={'en'}
                handlePropertyChange={handleLinkChange}
                value={contactData.contactBoxs[0].link}
            />
            <TextInput 
                place="آپارات"
                category="1"
                lang={'en'}
                handlePropertyChange={handleLinkChange}
                value={contactData.contactBoxs[1].link}
            />
            <TextInput 
                place="اینستاگرام"
                category="2"
                lang={'en'}
                handlePropertyChange={handleLinkChange}
                value={contactData.contactBoxs[2].link}
            />
            <TextInput 
                place="واتساپ"
                category="3"
                lang={'en'}
                handlePropertyChange={handleLinkChange}
                value={contactData.contactBoxs[3].link}
            />
            <TextInput 
                place="تلگرام"
                category="4"
                lang={'en'}
                handlePropertyChange={handleLinkChange}
                value={contactData.contactBoxs[4].link}
            />
            <TextInput 
                place="ایمیل"
                category="5"
                lang={'en'}
                handlePropertyChange={handleLinkChange}
                value={contactData.contactBoxs[5].link}
            />
            <button
                onClick={()=>{handleSubmit()}}
                className="subBtn w-full h-[45px]"
            >به روز رسانی اطلاعات</button>
        </div>
    )
}

export default ContactSetting