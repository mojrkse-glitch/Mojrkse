export const siteConfig = {
  name: "Mo.jrk",
  description: "منصة Mo.jrk للخدمات الرقمية وطلبات الشحن والتصميم والخدمات الإلكترونية",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  whatsappPhone: "963934053435",
  whatsappMessage: "مرحبًا، أريد إتمام طلب عبر موقع Mo.jrk",
  weatherDefaultCity: "Masyaf",
  developer: {
    name: "مطور الموقع",
    facebookUrl: "https://www.facebook.com/share/18PXcup1rM/",
    instagramUrl: "https://www.facebook.com/share/18PXcup1rM/"
  }
};

export const navigation = [
  { href: "/", label: "الرئيسية" },
  { href: "/services", label: "الخدمات" },
  { href: "/wallet", label: "المحفظة" },
  { href: "/faq", label: "الأسئلة الشائعة" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل معنا" }
];
