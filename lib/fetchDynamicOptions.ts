// این فایل فقط در سمت سرور اجرا می‌شود
export async function fetchDynamicOptions() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dynamicOptions`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error('Error fetching dynamic options:', error);
    return null; // یا return {} برای دیتای خالی
  }
}