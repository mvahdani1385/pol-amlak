"use client";

import { useState } from "react";
import TextInput from "../components/themes/TextInput";
import TextArey from "../components/themes/TextArey";
import { toast } from "react-toastify";

function ContactForm() {
  const [contactForm, setContactForm] = useState({
    fullName: "",
    phoneNumber: "",
    text: "",
  });

  const handlePropertyChange = (key: string, value: any) => {
    setContactForm((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      fetch("/api/contactForm", {
        method: "POST",
        headers: {},
        body: JSON.stringify(contactForm),
      });
      toast.success('نطر با موفقیت ارسال شد');
    } catch (error) {
        toast.error('مشکلی در ارسال نطر پیش آمده');
        console.error('خطا در ارسال نظر', error)
    }
  };

  return (
    <div className="mt-15 ccdiv flex-col">
      <div className="headForm ccdiv flex-col w-full text-center px-3">
        <h2 className="font-bold text-3xl text-[var(--title)]">
          فرم تماس با ما
        </h2>
        <p className="text-lg mt-5">
          فرم زیر را تکمیل کنید تا کارشناسان ما دراسرع وقت با شما تماس بگیرند
        </p>
      </div>
      <div className="form w-[95%] md:w-[70%] shadow-[var(--blackshadow)] p-5 rounded-xl mt-5">
        <div className="inputs flex flex-wrap gap-7 gap-y-2 mb-3">
          <TextInput
            place="نام کامل"
            category="fullName"
            handlePropertyChange={handlePropertyChange}
            isNumber={false}
            value={contactForm.fullName}
          />
          <TextInput
            place="شماره تماس"
            category="phoneNumber"
            handlePropertyChange={handlePropertyChange}
            isNumber={true}
            value={contactForm.phoneNumber}
          />
        </div>
        <TextArey
          place="نظر شما"
          handlePropertyChange={handlePropertyChange}
          category="text"
          value={contactForm.text}
        />
        <button
          onClick={() => handleSubmit}
          className="subBtn w-full h-[45px] mt-5"
        >
          ارسال نظر
        </button>
      </div>
    </div>
  );
}

export default ContactForm;
