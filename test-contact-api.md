# بدنه صحیح برای ارسال به API تماس

## متد POST به /api/contact

بدنه درخواست باید به این شکل باشد:

```json
{
  "contactData": {
    "title": "تماس با ما",
    "textUnderTitle": "با کارشناسان ما در ارتباط باشید",
    "littleText": "با راه های ارتباطی که در اختیار شما قرار داده ایم میتوانید با کارشناسان ما درارتباط باشید",
    "contactBoxs": [
      { "icon": "/eitaa", "name": "ایتا", "link": "https://eitaa.com/" },
      { "icon": "/aparat", "name": "آپارات", "link": "https://www.aparat.com/" }
    ]
  }
}
```

## نکات مهم:
1. `contactData` آبجکت اصلی است
2. داخل `contactData` فیلدهای `title`، `textUnderTitle`، `littleText` و `contactBoxs` قرار دارند
3. `contactBoxs` یک آرایه از آبجکت‌های شبکه اجتماعی است

## مثال curl:
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "contactData": {
      "title": "تماس با ما",
      "textUnderTitle": "با کارشناسان ما در ارتباط باشید",
      "littleText": "با راه های ارتباطی که در اختیار شما قرار داده ایم میتوانید با کارشناسان ما درارتباط باشید",
      "contactBoxs": [
        { "icon": "/eitaa", "name": "ایتا", "link": "https://eitaa.com/" },
        { "icon": "/aparat", "name": "آپارات", "link": "https://www.aparat.com/" }
      ]
    }
  }'
```
