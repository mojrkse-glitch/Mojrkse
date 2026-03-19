import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "Masyaf";

  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ar&format=json`, { next: { revalidate: 1800 } });
    const geo = await geoRes.json();
    const location = geo?.results?.[0];
    if (!location) return NextResponse.json({ message: "لم يتم العثور على المدينة المطلوبة." }, { status: 404 });

    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`, { next: { revalidate: 900 } });
    const weather = await weatherRes.json();
    const current = weather?.current;
    if (!current) return NextResponse.json({ message: "تعذر جلب بيانات الطقس حاليًا." }, { status: 502 });

    return NextResponse.json({
      city: location.name,
      temperature: current.temperature_2m,
      windspeed: current.wind_speed_10m,
      weatherCode: current.weather_code,
      timezone: weather.timezone,
      fetchedAt: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message || "فشل الاتصال بخدمة الطقس." }, { status: 500 });
  }
}
