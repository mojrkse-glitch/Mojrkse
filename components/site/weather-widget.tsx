"use client";

import { useEffect, useState } from "react";
import { CloudSun, LoaderCircle, MapPin, RefreshCw } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WeatherResponse = {
  city: string;
  temperature: number;
  windspeed: number;
  weatherCode: number;
  timezone: string;
  fetchedAt: string;
};

const weatherLabels: Record<number, string> = {
  0: "صحو",
  1: "غالبًا صحو",
  2: "غائم جزئيًا",
  3: "غائم",
  45: "ضباب",
  48: "ضباب متجمد",
  51: "رذاذ خفيف",
  61: "مطر خفيف",
  63: "مطر",
  65: "مطر غزير",
  71: "ثلوج خفيفة",
  80: "زخات مطر",
  95: "عاصفة رعدية"
};

export function WeatherWidget() {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(siteConfig.weatherDefaultCity)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "تعذر جلب حالة الطقس.");
      setData(json);
    } catch (err: any) {
      setError(err.message || "تعذر جلب حالة الطقس.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadWeather(); }, []);

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><CloudSun className="h-5 w-5 text-primary" /> الطقس الآن</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex min-h-[180px] items-center justify-center text-muted-foreground"><LoaderCircle className="h-5 w-5 animate-spin" /></div>
        ) : error ? (
          <div className="space-y-4">
            <p className="text-sm text-danger">{error}</p>
            <Button variant="outline" onClick={loadWeather} className="gap-2"><RefreshCw className="h-4 w-4" /> إعادة المحاولة</Button>
          </div>
        ) : data ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/60 p-4">
              <div>
                <p className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4" /> {data.city}</p>
                <p className="mt-2 text-4xl font-black text-primary">{Math.round(data.temperature)}°</p>
                <p className="mt-2 text-sm text-muted-foreground">{weatherLabels[data.weatherCode] || "حالة جوية"}</p>
              </div>
              <div className="text-left text-sm text-muted-foreground">
                <p>الرياح: {Math.round(data.windspeed)} كم/س</p>
                <p className="mt-2">التحديث: {new Date(data.fetchedAt).toLocaleTimeString("ar-SY", { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
            </div>
            <p className="text-xs leading-6 text-muted-foreground">تم الربط عبر Open-Meteo المجاني بدون مفتاح API. يمكن تغيير المدينة الافتراضية لاحقًا بسهولة.</p>
            <Button variant="outline" onClick={loadWeather} className="gap-2"><RefreshCw className="h-4 w-4" /> تحديث الطقس</Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
