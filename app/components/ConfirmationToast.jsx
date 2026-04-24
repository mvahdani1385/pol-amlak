// components/ConfirmationToast.jsx
// "use client"; // این فایل باید در یک Client Component باشد

import React from 'react';
import { ToastContainer, toast } from 'react-toastify'; // ToastContainer لازم نیست اینجا باشه، فقط toast

// یک تابع کمکی برای بستن پیغام با نتیجه
const closeToast = (callback, result) => {
  toast.dismiss(); // بستن پیغام فعلی
  if (callback) {
    callback(result); // فراخوانی تابع بازگشتی با نتیجه
  }
};

export const ConfirmationToast = ({ message, onConfirm, onCancel }) => {
  return (
    <div>
      <p>{message}</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
        <button
          onClick={() => closeToast(onCancel, false)}
          style={{ padding: '8px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white' }}
        >
          لغو
        </button>
        <button
          onClick={() => closeToast(onConfirm, true)}
          style={{ padding: '8px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white' }}
        >
          تأیید
        </button>
      </div>
    </div>
  );
};

// نکته: این کامپوننت به تنهایی استفاده نمی‌شود، بلکه توسط تابع toast فراخوانی می‌شود.
