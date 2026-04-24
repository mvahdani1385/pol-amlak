# badanie JSON untuk tes API tentang kami

## Metode PUT ke /api/about

Badan permintaan harus dalam format ini:

```json
{
  "aboutData": {
    "title": "amlaq pal",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "video": "1775011631088.mp4",
    "poster": "1773253562874.jpg",
    "services": [
      {
        "img": "ruls.png",
        "name": "Trusted by thousands",
        "desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
      },
      {
        "img": "loca.png",
        "name": "Wide range of properties",
        "desc": "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
      },
      {
        "img": "room.png",
        "name": "Easy financing",
        "desc": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris"
      }
    ],
    "ourteem": [
      { "img": "teem1.png", "name": "Karim Bagheri", "position": "CEO" },
      { "img": "teem2.jpg", "name": "Ziba Hosseini", "position": "Sales Manager" },
      { "img": "teem3.jpg", "name": "Sajad Ashouri", "position": "Commercial Secretary" },
      { "img": "teem4.jpg", "name": "Ilya Monfared", "position": "Digital Marketing Manager" }
    ]
  }
}
```

## Catatan penting:
1. `aboutData` adalah objek utama
2. Di dalam `aboutData` ada field `title`, `description`, `video`, `poster`, `services`, dan `ourteem`
3. `services` adalah array dari objek layanan
4. `ourteem` adalah array dari objek tim

## Contoh curl:
```bash
curl -X PUT http://localhost:3000/api/about \
  -H "Content-Type: application/json" \
  -d '{
    "aboutData": {
      "title": "amlaq pal",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "video": "1775011631088.mp4",
      "poster": "1773253562874.jpg",
      "services": [
        {
          "img": "ruls.png",
          "name": "Trusted by thousands",
          "desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
        },
        {
          "img": "loca.png",
          "name": "Wide range of properties",
          "desc": "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
        },
        {
          "img": "room.png",
          "name": "Easy financing",
          "desc": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris"
        }
      ],
      "ourteem": [
        { "img": "teem1.png", "name": "Karim Bagheri", "position": "CEO" },
        { "img": "teem2.jpg", "name": "Ziba Hosseini", "position": "Sales Manager" },
        { "img": "teem3.jpg", "name": "Sajad Ashouri", "position": "Commercial Secretary" },
        { "img": "teem4.jpg", "name": "Ilya Monfared", "position": "Digital Marketing Manager" }
      ]
    }
  }'
```

## Untuk testing GET:
```bash
curl -X GET http://localhost:3000/api/about
```
