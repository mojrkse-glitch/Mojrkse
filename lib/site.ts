export const siteConfig = {
  name: "Mo.jrk",
  description: "منصة Mo.jrk للخدمات الرقمية وطلبات الشحن والتصميم والخدمات الإلكترونية",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  whatsappPhone: "00963934053425",
  whatsappMessage: "مرحبًا، أريد إتمام طلب عبر التسليم باليد من خلال موقع Mo.jrk"
};

export const navigation = [
  { href: "/", label: "الرئيسية" },
  { href: "/services", label: "الخدمات" },
  { href: "/faq", label: "الأسئلة الشائعة" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل معنا" }
];
