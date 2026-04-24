"use client";

import { useState } from "react";

export default function CreatePropertyFieldForm() {
  const [form, setForm] = useState({
    title: "",
    type: "text",
    propertyType: "",
    dealTypeConditions: [] as string[], 
    isRequired: false,
    isFilterable: false,
    options: [] as { label: string; value: string }[],
  });

  const [optionInput, setOptionInput] = useState("");

  const addOption = () => {
    if (!optionInput) return;

    setForm((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        { label: optionInput, value: optionInput },
      ],
    }));

    setOptionInput("");
  };

  const handleSubmit = async () => {
    await fetch("/api/property-fields", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    alert("ویژگی ثبت شد");
  };

  return (
    <div className="p-6 border rounded-xl space-y-4">
      <h2 className="text-xl font-bold">ایجاد ویژگی جدید</h2>

      {/* عنوان */}
      <input
        type="text"
        placeholder="عنوان ویژگی"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
        className="border p-2 w-full"
      />

      {/* نوع */}
      <select
        value={form.type}
        onChange={(e) =>
          setForm({ ...form, type: e.target.value })
        }
        className="border p-2 w-full"
      >
        <option value="text">متنی</option>
        <option value="number">عددی</option>
        <option value="boolean">بله/خیر</option>
        <option value="select">چند گزینه‌ای</option>
      </select>

      {/* شرطی‌سازی نوع ملک */}
      <div className="space-y-2">
        <h3 className="font-medium">شرطی‌سازی نوع ملک</h3>
        <p className="text-sm text-gray-600">این فیلد فقط برای کدام نوع ملک نمایش داده شود؟</p>
        
        <div className="space-y-2">
          {["آپارتمان", "ویلا", "حیاط‌دار", "زمین", "دفتر کار", "مغازه", "مستغلات", "کلنگی", "انبار", "هتل", "باغ", "دامداری", "مرغداری", "کارخانه", "کارگاه", "سوله", "زیرزمین", "سالن", "سوئیت"].map((propertyType) => (
            <label key={propertyType} className="flex items-center space-x-2 space-x-reverse">
              <input
                type="checkbox"
                checked={form.dealTypeConditions.includes(propertyType)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setForm({
                      ...form,
                      dealTypeConditions: [...form.dealTypeConditions, propertyType],
                    });
                  } else {
                    setForm({
                      ...form,
                      dealTypeConditions: form.dealTypeConditions.filter(
                        (type) => type !== propertyType
                      ),
                    });
                  }
                }}
              />
              <span>{propertyType}</span>
            </label>
          ))}
        </div>
      </div>

      {/* چک‌باکس‌ها */}
      <label>
        <input
          type="checkbox"
          checked={form.isRequired}
          onChange={(e) =>
            setForm({ ...form, isRequired: e.target.checked })
          }
        />
        اجباری
      </label>

      <label>
        <input
          type="checkbox"
          checked={form.isFilterable}
          onChange={(e) =>
            setForm({ ...form, isFilterable: e.target.checked })
          }
        />
        قابل فیلتر
      </label>

      {/* اگر select بود */}
      {form.type === "select" && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="افزودن گزینه"
              value={optionInput}
              onChange={(e) =>
                setOptionInput(e.target.value)
              }
              className="border p-2 flex-1"
            />
            <button
              type="button"
              onClick={addOption}
              className="bg-blue-500 text-white px-4"
            >
              افزودن
            </button>
          </div>

          <ul className="list-disc pl-6">
            {form.options.map((opt, i) => (
              <li key={i}>{opt.label}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        ذخیره
      </button>
    </div>
  );
}