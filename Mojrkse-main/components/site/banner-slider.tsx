"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Banner } from "@/lib/types";
import { Button } from "@/components/ui/button";

export function BannerSlider({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(() => {
      setCurrent((value) => (value + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners.length) return null;

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`relative min-h-[360px] transition-opacity duration-700 ${index === current ? "opacity-100" : "pointer-events-none absolute inset-0 opacity-0"}`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `linear-gradient(to left, rgba(7,10,18,.78), rgba(7,10,18,.55)), url(${banner.image_url})` }}
          />
          <div className="relative flex min-h-[360px] items-end p-8 md:p-12">
            <div className="max-w-2xl">
              <p className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
                بانر ترويجي ديناميكي
              </p>
              <h2 className="text-3xl font-black leading-tight text-white md:text-5xl">
                {banner.title}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-white/80">
                {banner.description}
              </p>
              <div className="mt-6">
                <Link href={banner.button_link}>
                  <Button>{banner.button_text}</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 right-4 flex gap-2">
        {banners.map((banner, index) => (
          <button
            key={banner.id}
            onClick={() => setCurrent(index)}
            className={`h-2.5 w-8 rounded-full transition ${index === current ? "bg-primary" : "bg-white/20"}`}
            aria-label={`بانر ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
