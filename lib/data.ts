export const navLinks = [
  { href: "#about", label: "Biz haqimizda" },
  { href: "#services", label: "Xizmatlar" },
  { href: "#projects", label: "Loyihalar" },
  { href: "#team", label: "Jamoa" },
  { href: "#contact", label: "Aloqa" },
] as const;

export const stats = [
  { target: 50, suffix: "+", label: "Loyiha" },
  { target: 8, suffix: "+", label: "Yillik tajriba" },
  { target: 30, suffix: "+", label: "Mijoz" },
  { target: 15, suffix: "", label: "Mutaxassis" },
] as const;

export const services = [
  {
    title: "Arxitektura loyihalash",
    description:
      "Bino va inshootlarning arxitektura qismi — rejalar, fasadlar, kesimlar va 3D modellar.",
    icon: "architecture",
  },
  {
    title: "Konstruktiv loyihalash",
    description:
      "Konstruktiv tizimlar, poydevor, karkas va mustahkamlik hisob-kitoblari BIM formatida.",
    icon: "structure",
  },
  {
    title: "Muhandislik tizimlari",
    description:
      "Elektr, suv ta'minoti, isitish va ventilyatsiya tizimlarining BIM modellashtirilishi.",
    icon: "engineering",
  },
  {
    title: "BIM koordinatsiyasi",
    description:
      "Turli soha modellarini birlashtirish, to'qnashuvlarni aniqlash va bartaraf etish.",
    icon: "coordination",
  },
  {
    title: "3D vizualizatsiya",
    description:
      "Loyihalarning fotorealistik 3D ko'rinishlari va virtual sayohatlar yaratish.",
    icon: "visualization",
  },
  {
    title: "Revit Familiya yaratish",
    description:
      "Maxsus parametrik komponentlar va oilalar yaratish — eshik, deraza, jihozlar.",
    icon: "family",
  },
] as const;

export const projects = [
  {
    name: "example",
    category: "Tijorat",
    year: "2024",
    hue: 210,
    tall: true,
    icon: "office",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "example",
    category: "Turar-joy",
    year: "2023",
    hue: 180,
    tall: false,
    icon: "home",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "example",
    category: "Sanoat",
    year: "2023",
    hue: 240,
    tall: false,
    icon: "factory",
    image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "example",
    category: "Tijorat",
    year: "2024",
    hue: 200,
    tall: true,
    icon: "building",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "example",
    category: "Tijorat",
    year: "2022",
    hue: 190,
    tall: false,
    icon: "mall",
    image: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "example",
    category: "Turar-joy",
    year: "2022",
    hue: 220,
    tall: false,
    icon: "apartment",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop",
  },
] as const;

export const processSteps = [
  {
    number: "01",
    title: "Texnik topshiriq",
    description: "Mijoz talablarini o'rganish va loyiha parametrlarini belgilash",
  },
  {
    number: "02",
    title: "Konseptual loyiha",
    description: "Dastlabki dizayn va 3D konseptsiya ishlab chiqish",
  },
  {
    number: "03",
    title: "BIM modeling",
    description: "Revit da to'liq 3D model va koordinatsiya ishlari",
  },
  {
    number: "04",
    title: "Hujjatlashtirish",
    description: "Chizma to'plamlari va texnik hujjatlarni tayyorlash",
  },
  {
    number: "05",
    title: "Topshirish",
    description: "Tayyor loyihani mijozga topshirish va qo'llab-quvvatlash",
  },
] as const;

export const teamMembers = [
  { initials: "BK", name: "Bobur Karimov", role: "Bosh arxitektor" },
  { initials: "DY", name: "Dilnoza Yusupova", role: "BIM menejeri" },
  { initials: "JT", name: "Jasur Toshmatov", role: "Konstruktor" },
  { initials: "KR", name: "Kamola Rahimova", role: "Vizualizator" },
] as const;

export const testimonials = [
  {
    quote:
      "BimUz jamoasi bizning biznes markazimiz loyihasini vaqtida va yuqori sifatda yakunladi. BIM texnologiyasi qurilish jarayonida juda ko'p vaqt tejadi.",
    name: "Alisher Nazarov",
    role: "Quruvchi, Toshkent",
  },
  {
    quote:
      "Professional yondashuv va batafsil 3D modellar tufayli loyihamizni investorlarga taqdim etish oson bo'ldi. BimUz ga ishonch bilan tavsiya qilaman.",
    name: "Malika Ergasheva",
    role: "Investor, Samarqand",
  },
  {
    quote:
      "Sanoat obyektimiz uchun murakkab muhandislik tizimlarini muvaffaqiyatli koordinatsiya qilishdi. Natija kutilganidan ham yaxshi chiqdi.",
    name: "Rustam Abdullayev",
    role: "Direktor, Namangan",
  },
] as const;

export type StaggerTestimonialItem = {
  testimonial: string;
  by: string;
  imgSrc: string;
};

export const staggerTestimonials: StaggerTestimonialItem[] = [
  {
    testimonial:
      "BimUz jamoasi biznes markazimiz loyihasini vaqtida va yuqori sifatda yakunladi. BIM texnologiyasi qurilishda juda ko'p vaqt tejadi.",
    by: "Alisher Nazarov, Quruvchi — Toshkent",
    imgSrc:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
  },
  {
    testimonial:
      "Batafsil 3D modellar tufayli loyihamizni investorlarga taqdim etish oson bo'ldi. BimUz ga ishonch bilan tavsiya qilaman.",
    by: "Malika Ergasheva, Investor — Samarqand",
    imgSrc:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
  },
  {
    testimonial:
      "Murakkab muhandislik tizimlarini muvaffaqiyatli koordinatsiya qilishdi. Natija kutilganidan ham yaxshi chiqdi.",
    by: "Rustam Abdullayev, Direktor — Namangan",
    imgSrc:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
  },
  {
    testimonial:
      "Revit asosidagi BIM hujjatlar aniq va tartibli. Qurilish maydonida hech qanday chalkashlik bo'lmadi.",
    by: "Javohir Rahimov, Loyiha menejeri — Toshkent",
    imgSrc:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    testimonial:
      "Turar-joy majmuasi uchun arxitektura va konstruktiv qismlar mukammal uyg'unlashgan. Jamoa juda professional.",
    by: "Dilfuza Karimova, Arxitektor — Andijon",
    imgSrc:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
  },
  {
    testimonial:
      "MEP tizimlarini BIM formatida olish bizga montaj jarayonida katta qulaylik berdi.",
    by: "Sardor Mirzayev, Muhandis — Farg'ona",
    imgSrc:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
  {
    testimonial:
      "3D vizualizatsiyalar mijozlarimizni jalb qilishda katta yordam berdi. Sifat va tezlik a'lo darajada.",
    by: "Nodira Tosheva, Marketing direktori — Buxoro",
    imgSrc:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    testimonial:
      "BimUz bilan ishlash — aniq muddatlar, shaffof jarayon va kutilganidan yuqori natija.",
    by: "Farhod Usmonov, Bosh muhandis — Qarshi",
    imgSrc:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
];

export const contactDetails = [
  {
    label: "Manzil",
    value: "Toshkent sh., Yunusobod tumani",
    icon: "location",
  },
  {
    label: "Telefon",
    value: "+998 71 123 45 67",
    icon: "phone",
  },
  {
    label: "Email",
    value: "info@bimuz.uz",
    icon: "email",
  },
] as const;

export const socialLinks = [
  { label: "Telegram", href: "https://t.me/BIMUz_uz", icon: "telegram" },
  { label: "Instagram", href: "https://www.instagram.com/bimuz_academy/", icon: "instagram" },
  { label: "LinkedIn", href: "#", icon: "linkedin" },
  { label: "YouTube", href: "https://www.youtube.com/@bimuz", icon: "youtube" },
] as const;
