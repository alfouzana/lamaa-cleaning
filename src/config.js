// ===== إعدادات لمعة: كل شيء قابل للتعديل من هنا =====

// رقم واتساب صاحب المشروع (بالصيغة الدولية بدون + أو أصفار)
export const WHATSAPP_NUMBER = "966542073727";

export const CURRENCY = "ريال";

// أنواع الأماكن: السعر الأساسي + حدود الحجم + سعر الغرفة/دورة المياه الإضافية
// baseRooms / baseBaths = العدد المشمول في السعر الأساسي
export const PLACE_TYPES = [
  { id: "studio", name: "استديو أو غرفة واحدة", icon: "🛏️", base: 300, rooms: [1, 1], baths: [1, 2], baseRooms: 1, baseBaths: 1 },
  { id: "room-hall", name: "غرفة وصالة", icon: "🛋️", base: 350, rooms: [1, 1], baths: [1, 2], baseRooms: 1, baseBaths: 1 },
  { id: "apartment", name: "شقة", icon: "🏢", base: 450, rooms: [2, 7], baths: [1, 5], baseRooms: 2, baseBaths: 1 },
  { id: "villa", name: "فيلا", icon: "🏡", base: 750, rooms: [3, 12], baths: [2, 10], baseRooms: 3, baseBaths: 2 },
  { id: "office", name: "مكتب", icon: "💼", base: 400, rooms: [1, 15], baths: [1, 6], baseRooms: 2, baseBaths: 1 },
];

export const EXTRA_ROOM_PRICE = 60;  // لكل غرفة فوق المشمول
export const EXTRA_BATH_PRICE = 40;  // لكل دورة مياه فوق المشمول

// الخدمات الأساسية (السعر 0 = مشمولة في السعر الأساسي)
export const SERVICES = [
  { id: "kitchen", name: "المطابخ", price: 0 },
  { id: "rooms", name: "الغرف والممرات", price: 0 },
  { id: "floors", name: "الأرضيات والأسطح", price: 0 },
  { id: "baths", name: "دورات المياه", price: 0 },
  { id: "organize", name: "ترتيب المساحات", price: 50 },
];

// الإضافات الاختيارية
export const ADDONS = [
  { id: "deep", name: "تنظيف عميق", price: 150 },
  { id: "pest", name: "رش مبيدات", price: 120 },
];

// الفترات المتاحة
export const TIME_SLOTS = [
  { id: "morning", name: "صباحاً", hint: "8:00 – 11:00" },
  { id: "noon", name: "ظهراً", hint: "12:00 – 2:00" },
  { id: "afternoon", name: "عصراً", hint: "3:00 – 5:00" },
  { id: "evening", name: "مساءً", hint: "6:00 – 9:00" },
];

// الساعات: المشمول في السعر وسعر الساعة الإضافية
export const HOURS = { min: 3, max: 8, included: 4, extraHourPrice: 50 };

export const NEIGHBORHOODS = [
  "العقربية", "الثقبة", "الخبر الشمالية", "الخبر الجنوبية", "الراكة الشمالية", "الراكة الجنوبية",
  "اليرموك", "العليا", "البندرية", "الجسر", "الروابي", "الحمراء", "قرطبة", "الأندلس",
  "مدينة العمال", "الكورنيش", "الحزام الذهبي", "اللؤلؤ",
];
