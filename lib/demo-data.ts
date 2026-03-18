import type { Banner, Category, FaqItem, PaymentMethod, Service, Testimonial } from "@/lib/types";

export const demoCategories: Category[] = [
  {
    id: "cat-games",
    name: "خدمات الألعاب",
    slug: "games",
    description: "شحن وخدمات الألعاب الأكثر طلبًا"
  },
  {
    id: "cat-design",
    name: "التصميم والمونتاج",
    slug: "design-media",
    description: "خدمات تصميم احترافية ومحتوى مرئي عصري"
  },
  {
    id: "cat-digital",
    name: "الخدمات الإلكترونية",
    slug: "digital-services",
    description: "تحويلات إلكترونية واشتراكات ورصيد اتصالات"
  }
];

export const demoServices: Service[] = [
  {
    id: "svc-pubg",
    category_id: "cat-games",
    category_slug: "games",
    slug: "pubg-mobile-uc",
    title: "شحن PUBG Mobile",
    image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    description: "شحن UC للعبة PUBG Mobile بسرعة عالية ومراجعة يدوية دقيقة.",
    price_usd: 5,
    starting_price: 5,
    delivery_time_text: "من 5 دقائق إلى 30 دقيقة",
    is_active: true,
    is_featured: true,
    fields: [
      {
        id: "fld-pubg-1",
        field_key: "player_id",
        field_label: "معرف اللاعب",
        field_type: "text",
        placeholder: "أدخل Player ID",
        is_required: true
      },
      {
        id: "fld-pubg-2",
        field_key: "player_name",
        field_label: "اسم اللاعب",
        field_type: "text",
        placeholder: "الاسم داخل اللعبة",
        is_required: true
      },
      {
        id: "fld-pubg-3",
        field_key: "package",
        field_label: "الباقة المطلوبة",
        field_type: "select",
        is_required: true,
        options: ["60 UC", "325 UC", "660 UC", "1800 UC"]
      },
      {
        id: "fld-pubg-4",
        field_key: "notes",
        field_label: "ملاحظات",
        field_type: "textarea",
        placeholder: "أي ملاحظات إضافية",
        is_required: false
      }
    ]
  },
  {
    id: "svc-freefire",
    category_id: "cat-games",
    category_slug: "games",
    slug: "free-fire-topup",
    title: "شحن Free Fire",
    image_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    description: "شحن جواهر Free Fire مع متابعة حالة الطلب من لوحة المستخدم.",
    price_usd: 4,
    starting_price: 4,
    delivery_time_text: "حتى 20 دقيقة",
    is_active: true,
    is_featured: true,
    fields: [
      {
        id: "fld-ff-1",
        field_key: "player_id",
        field_label: "Player ID",
        field_type: "text",
        placeholder: "أدخل معرف اللاعب",
        is_required: true
      },
      {
        id: "fld-ff-2",
        field_key: "package",
        field_label: "الباقة",
        field_type: "select",
        is_required: true,
        options: ["100 جوهرة", "310 جوهرة", "520 جوهرة", "1060 جوهرة"]
      }
    ]
  },
  {
    id: "svc-logo",
    category_id: "cat-design",
    category_slug: "design-media",
    slug: "logo-design",
    title: "تصميم شعارات",
    image_url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80",
    description: "تصميم شعار احترافي حديث مناسب للمتاجر والمشاريع الشخصية والشركات الناشئة.",
    price_usd: 15,
    starting_price: 15,
    delivery_time_text: "من يوم إلى 3 أيام",
    is_active: true,
    is_featured: true,
    fields: [
      {
        id: "fld-logo-1",
        field_key: "brand_name",
        field_label: "اسم العلامة",
        field_type: "text",
        placeholder: "اسم المشروع أو المتجر",
        is_required: true
      },
      {
        id: "fld-logo-2",
        field_key: "style",
        field_label: "الطابع المطلوب",
        field_type: "textarea",
        placeholder: "صف الشكل أو الألوان أو الأسلوب الذي تفضله",
        is_required: true
      },
      {
        id: "fld-logo-3",
        field_key: "reference",
        field_label: "رفع مرجع",
        field_type: "file",
        is_required: false
      }
    ]
  },
  {
    id: "svc-ai-video",
    category_id: "cat-design",
    category_slug: "design-media",
    slug: "ai-video-production",
    title: "فيديوهات عبر AI",
    image_url: "https://images.unsplash.com/photo-1574717024453-3540568f09bb?auto=format&fit=crop&w=1200&q=80",
    description: "إنتاج فيديوهات جذابة باستخدام تقنيات الذكاء الاصطناعي للمنصات الاجتماعية والإعلانات.",
    price_usd: 20,
    starting_price: 20,
    delivery_time_text: "من يومين إلى 4 أيام",
    is_active: true,
    is_featured: false,
    fields: [
      {
        id: "fld-ai-1",
        field_key: "script",
        field_label: "نص الفيديو أو الفكرة",
        field_type: "textarea",
        placeholder: "اكتب الفكرة أو النص المطلوب",
        is_required: true
      },
      {
        id: "fld-ai-2",
        field_key: "duration",
        field_label: "المدة التقريبية",
        field_type: "select",
        is_required: true,
        options: ["15 ثانية", "30 ثانية", "60 ثانية", "90 ثانية"]
      }
    ]
  },
  {
    id: "svc-swap-usdt",
    category_id: "cat-digital",
    category_slug: "digital-services",
    slug: "swap-to-usdt",
    title: "Swap رصيد إلى USDT",
    image_url: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&w=1200&q=80",
    description: "تحويل الرصيد إلى USDT مع احتساب رسوم خدمة تلقائية 3%.",
    price_usd: 0,
    delivery_time_text: "حتى 30 دقيقة",
    is_active: true,
    is_featured: true,
    is_swap_service: true,
    fields: [
      {
        id: "fld-swap-1",
        field_key: "source_balance_type",
        field_label: "نوع الرصيد المراد تحويله",
        field_type: "select",
        is_required: true,
        options: ["رصيد محلي", "شام كاش سوري", "شام كاش دولار"]
      },
      {
        id: "fld-swap-2",
        field_key: "receiver_wallet",
        field_label: "عنوان المحفظة المستلمة",
        field_type: "text",
        placeholder: "أدخل عنوان USDT",
        is_required: true
      },
      {
        id: "fld-swap-3",
        field_key: "transfer_amount",
        field_label: "المبلغ الأصلي",
        field_type: "number",
        placeholder: "أدخل المبلغ",
        is_required: true
      }
    ]
  },
  {
    id: "svc-chatgpt",
    category_id: "cat-digital",
    category_slug: "digital-services",
    slug: "chatgpt-plus-monthly",
    title: "اشتراك ChatGPT Plus شهري",
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    description: "اشتراك شهري مع تنفيذ يدوي ومتابعة حالة الطلب من داخل المنصة.",
    price_usd: 12,
    starting_price: 12,
    delivery_time_text: "من 30 دقيقة إلى ساعتين",
    is_active: true,
    is_featured: false,
    fields: [
      {
        id: "fld-gpt-1",
        field_key: "account_email",
        field_label: "البريد الإلكتروني للحساب",
        field_type: "text",
        placeholder: "أدخل البريد الإلكتروني",
        is_required: true
      }
    ]
  }
];

export const demoBanners: Banner[] = [
  {
    id: "ban-1",
    title: "منصة Mo.jrk للخدمات الرقمية",
    description: "اطلب خدمتك الآن، ارفع إثبات الدفع، وتابع حالتها لحظة بلحظة.",
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
    button_text: "اطلب الآن",
    button_link: "/services",
    is_enabled: true,
    sort_order: 1
  },
  {
    id: "ban-2",
    title: "خدمات تحويل وسواب برسوم واضحة",
    description: "احتساب تلقائي للرسوم ومراجعة يدوية دقيقة قبل التنفيذ.",
    image_url: "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1600&q=80",
    button_text: "استعرض الخدمات",
    button_link: "/services?category=digital-services",
    is_enabled: true,
    sort_order: 2
  }
];

export const demoPaymentMethods: PaymentMethod[] = [
  {
    id: "pay-usdt",
    slug: "usdt",
    title: "USDT",
    instructions: "حوّل المبلغ إلى المحفظة التالية ثم ارفع صورة إثبات الدفع.",
    wallet_address: "TRC20 / BEP20 Wallet Address Here",
    requires_proof: true,
    is_enabled: true
  },
  {
    id: "pay-ltc",
    slug: "ltc",
    title: "LTC",
    instructions: "أرسل المبلغ إلى عنوان LTC الموضح ثم أرفق لقطة الشاشة.",
    wallet_address: "Litecoin Wallet Address Here",
    requires_proof: true,
    is_enabled: true
  },
  {
    id: "pay-syriatel-cash",
    slug: "syriatel-cash",
    title: "Syriatel Cash",
    instructions: "أرسل الحوالة ثم ارفع صورة واضحة تحتوي رقم العملية.",
    requires_proof: true,
    is_enabled: true
  },
  {
    id: "pay-mtn-cash",
    slug: "mtn-cash",
    title: "MTN Cash",
    instructions: "أرسل الحوالة عبر MTN Cash ثم أرفق صورة الإثبات.",
    requires_proof: true,
    is_enabled: true
  },
  {
    id: "pay-shamcash",
    slug: "shamcash",
    title: "شام كاش",
    instructions: "حوّل المبلغ إلى عنوان شام كاش المخصص وأرفق الإثبات.",
    requires_proof: true,
    is_enabled: true
  },
  {
    id: "pay-hand",
    slug: "hand-delivery",
    title: "التسليم باليد داخل مصياف - حماة",
    instructions: "سيتم تحويلك إلى واتساب لتنسيق التسليم اليدوي.",
    requires_proof: false,
    is_hand_delivery: true,
    is_enabled: true
  }
];

export const demoFaqs: FaqItem[] = [
  {
    id: "faq-1",
    question: "كيف يتم تنفيذ الطلب؟",
    answer: "تختار الخدمة، تملأ التفاصيل، تحدد وسيلة الدفع، ترفع إثبات الدفع، ثم تتم مراجعة الطلب يدويًا.",
    is_enabled: true
  },
  {
    id: "faq-2",
    question: "هل الدفع أوتوماتيكي؟",
    answer: "حاليًا جميع وسائل الدفع يدوية مع إمكانية تطويرها لاحقًا إلى وسائل أوتوماتيكية.",
    is_enabled: true
  },
  {
    id: "faq-3",
    question: "كيف أعرف إن تم رفض الطلب؟",
    answer: "ستظهر لك حالة الطلب داخل لوحة المستخدم مع سبب الرفض إذا قام الأدمن بتسجيله.",
    is_enabled: true
  }
];

export const demoTestimonials: Testimonial[] = [
  {
    id: "t-1",
    name: "أحمد",
    text: "التنفيذ كان سريعًا جدًا والواجهة واضحة، خصوصًا تتبع حالة الطلب.",
    service: "شحن PUBG"
  },
  {
    id: "t-2",
    name: "لينا",
    text: "أعجبني وضوح التعليمات وطريقة رفع إثبات الدفع بدون تعقيد.",
    service: "تصميم شعار"
  },
  {
    id: "t-3",
    name: "محمد",
    text: "ميزة رسوم السواب الواضحة وتجربة الطلب السريعة ممتازة جدًا.",
    service: "Swap إلى USDT"
  }
];

export const demoSettings = {
  exchangeRate: 13500,
  swapFeePercentage: 3
};

export const demoOrders = [
  {
    id: "ord-demo-1",
    status: "بانتظار المراجعة",
    service_title: "شحن PUBG Mobile",
    payment_method_title: "USDT",
    final_usd_price: 5,
    original_amount: 5,
    fee_amount: 0,
    exchange_rate_used: 13500,
    created_at: new Date().toISOString()
  },
  {
    id: "ord-demo-2",
    status: "مكتمل",
    service_title: "تصميم شعارات",
    payment_method_title: "شام كاش",
    final_usd_price: 18,
    original_amount: 18,
    fee_amount: 0,
    exchange_rate_used: 13500,
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];
