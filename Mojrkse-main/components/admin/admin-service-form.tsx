"use client";

import { useState, type FormEvent } from "react";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";

export function AdminServiceForm() {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priceUsd, setPriceUsd] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);

    const res = await fetch("/api/admin/services", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        slug: slugify(title),
        category_id: categoryId,
        price_usd: Number(priceUsd),
        description: "خدمة تمت إضافتها من لوحة الإدارة",
        image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
        is_active: true
      })
    });

    const data = await res.json();
    setMessage(data.message || (res.ok ? "تمت إضافة الخدمة بنجاح." : "فشل إضافة الخدمة."));
    if (res.ok) {
      setTitle("");
      setCategoryId("");
      setPriceUsd("");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {message ? <Alert>{message}</Alert> : null}
      <Input placeholder="عنوان الخدمة" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Input placeholder="معرف القسم category_id" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required />
      <Input placeholder="السعر بالدولار" type="number" value={priceUsd} onChange={(e) => setPriceUsd(e.target.value)} required />
      <Button type="submit">إضافة خدمة</Button>
    </form>
  );
}
