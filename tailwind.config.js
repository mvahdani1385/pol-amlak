/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        modam: ['Modam', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'inset-black': 'inset 0px 0px 5px black',
        // می‌توانید سایه‌های سفارشی دیگری هم اضافه کنید
      },
    }
  }
}
