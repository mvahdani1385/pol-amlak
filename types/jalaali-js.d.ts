declare module 'jalaali-js' {
  export function toJalaali(date: Date): { jy: number; jm: number; jd: number };
  export function toGregorian(jy: number, jm: number, jd: number): { jy: number; jm: number; jd: number };
}
