"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";

export function AdminBannerForm() {
  const [title, setTitle] = useState("");
  const [buttonText, setButtonText] = useState("استعرض الخدمات");
  const [buttonLink, setButtonLink] = useState("/services");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80");
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);

    const res = await fetch("/api/admin/banners", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        description: "بانر تمت إضافته من لوحة الإدارة",
        button_text: buttonText,
        button_link: buttonLink,
        image_url: imageUrl,
        is_enabled: true
      })
    });

    const data = await res.json();
    setMessage(data.message || (res.ok ? "تمت إضافة البانر." : "فشل الإضافة."));
    if (res.ok) {
      setTitle("");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {message ? <Alert>{message}</Alert> : null}
      <Input placeholder="عنوان البانر" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Input placeholder="رابط الصورة" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
      <Input placeholder="نص الزر" value={buttonText} onChange={(e) => setButtonText(e.target.value)} required />
      <Input placeholder="رابط الزر" value={buttonLink} onChange={(e) => setButtonLink(e.target.value)} required />
      <Button type="submit">إضافة بانر</Button>
    </form>
  );
}
