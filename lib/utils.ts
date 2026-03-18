import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("ar-SY", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(date));
}

export function formatCurrency(value: number | string, currency = "USD") {
  const numeric = Number(value || 0);
  return new Intl.NumberFormat("ar-SY", {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  }).format(numeric);
}

export function generateWhatsAppLink(message: string, phone: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^\u0600-\u06FF\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
