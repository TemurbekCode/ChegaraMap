# 🗺️ Chegara

**Yer sotib olishdan oldin uni xaritada o'lchab ko'ring.**

Chegara — foydalanuvchi interaktiv xaritada yer uchastkasining chegaralarini chizib, uning maydonini (m² va sotix), perimetrini va tomonlar uzunligini bir necha soniyada bilib olishi mumkin bo'lgan veb-ilova. Sotuvchi aytgan o'lchamni xarita asosidagi hisob-kitob bilan solishtirish imkonini ham beradi — professional geodezist chaqirishdan oldin dastlabki tekshiruv uchun.

> ⚠️ Bu vosita **rasmiy kadastr o'lchovi emas** — faqat xarita/GPS ma'lumotlariga asoslangan taxminiy baholash.

---

## ✨ Imkoniyatlar

- 🖱️ **Xaritada chizish** — burchaklarni bosib, istalgan shakldagi uchastkani belgilash
- 📐 **Geodezik hisob-kitob** — maydon, perimetr va har bir tomon uzunligi ([`@turf/turf`](https://turfjs.org/) orqali, taxminiy tekis geometriya emas)
- ⚖️ **Sotuvchi bilan solishtirish** — sotuvchi aytgan o'lchamni xarita natijasi bilan solishtirib, farqni foizda ko'rish
- 💾 **Saqlash va yuklash** — o'lchovlarni brauzerda saqlash, keyin ro'yxatdan bosib qayta ochish
- 🔗 **Ulashish** — natijani Web Share API yoki clipboard orqali yuborish
- 🌐 **To'liq ikki tilli interfeys** — O'zbekcha (asosiy) va English, bir zumda almashtiriladi
- 🛰️ **Standart va sun'iy yo'ldosh xarita** rejimlari
- 📱 **Mobile-first dizayn** — birinchi navbatda telefon uchun, keyin planshet/desktopga moslashadi

## 🧱 Texnologiyalar

| Qatlam | Texnologiya |
|---|---|
| UI | React 18 (functional components + hooks) |
| Build | Vite |
| Uslub | SCSS (component-based, har bir komponent o'z faylida) |
| Xarita | Leaflet + React-Leaflet, OpenStreetMap / Esri World Imagery |
| Geometriya | Turf.js (geodezik maydon/masofa hisob-kitoblari) |
| Holat boshqaruvi | React Context (qo'shimcha kutubxonasiz) |
| Saqlash | Brauzer `localStorage` |

## 🚀 Ishga tushirish

```bash
npm install
npm run dev
```

Terminalda ko'rsatilgan havolani (odatda `http://localhost:5173`) brauzerda oching — xarita darhol ishlaydi, internet aloqasi kerak (xarita plitalari va shriftlar tashqi manbadan yuklanadi).

Boshqa buyruqlar:

```bash
npm run build     # production uchun yig'ish (dist/ papkasi)
npm run preview   # yig'ilgan versiyani mahalliy ko'rish
```

## 📁 Loyiha tuzilishi

Har bir bo'lim o'z papkasida — `.jsx` (mantiq) + `.scss` (uslub) juftligida:

```
src/
├── main.jsx                  # kirish nuqtasi
├── App.jsx / App.scss        # sahifalarni almashtiruvchi qobiq
│
├── context/
│   └── AppContext.jsx        # til, birlik, xarita turi, joriy sahifa, toast, tasdiqlash oynasi
│
├── i18n/
│   └── translations.js       # o'zbekcha / inglizcha to'liq lug'at
│
├── utils/
│   ├── geometry.js           # geodezik hisob-kitoblar (maydon, perimetr, tomonlar)
│   └── storage.js            # saqlangan o'lchovlar bilan ishlash (localStorage)
│
├── data/
│   └── locations.js          # demo qidiruv manzillari — real geokodlash bilan almashtiriladi
│
├── styles/
│   └── global.scss           # umumiy o'zgaruvchilar, tugmalar va boshqa umumiy klasslar
│
└── components/
    ├── Navbar/                # yuqori navigatsiya
    ├── Hero/                  # bosh sahifa banneri
    ├── HowItWorks/            # "Qanday ishlaydi" bo'limi
    ├── Features/               # imkoniyatlar bo'limi
    ├── TrustCard/             # ishonch/ogohlantirish kartochkasi
    ├── CtaBand/               # pastki chaqiruv bo'limi
    ├── Footer/                # footer
    ├── Home/                  # yuqoridagi bo'limlarni birlashtiradi
    ├── Settings/              # sozlamalar sahifasi
    ├── Toast/                 # bildirishnoma
    ├── ConfirmModal/          # tasdiqlash oynasi (Tozalash tugmasi uchun)
    │
    └── Measure/               # 🎯 ASOSIY O'LCHASH QISMI
        ├── Measure.jsx        # butun sahifaning holatini boshqaradi
        ├── MapCanvas.jsx      # haqiqiy Leaflet xaritasi — bosib chizish, qatlamlar
        ├── SearchBar.jsx      # joy qidirish
        ├── MapControls.jsx    # Bekor qilish / Tozalash / Yakunlash
        └── ResultPanel.jsx    # natija, sotuvchi bilan solishtirish, saqlash/ulashish
```

## 🧮 Hisob-kitob qanday ishlaydi

1. Har bir bosilgan nuqta `{lat, lng}` sifatida saqlanadi.
2. **Yakunlash** bosilganda nuqtalar yopiq ko'pburchakka aylantiriladi va **Turf.js** (`turf.area`) orqali maydon hisoblanadi — bu tekis lat/lng gradusidan emas, Yer yuzasining haqiqiy geometriyasidan foydalanadi.
3. Perimetr va har bir tomon uzunligi **haversine** formulasi bilan (katta doira masofasi) hisoblanadi.
4. Taxminiy o'lcham (masalan, 30.0 × 20.0 m) ko'pburchakning geodezik bounding box'idan olinadi.
5. `sotix = m² / 100`.

## 🗺️ Keyingi bosqichlar (roadmap)

- [ ] `src/data/locations.js` dagi demo manzillarni haqiqiy geokodlash xizmati (masalan, Nominatim yoki Google Places) bilan almashtirish
- [ ] Saqlangan o'lchovlarni qurilmalar orasida sinxronlash uchun backend + ma'lumotlar bazasi qo'shish
- [ ] Rasmiy kadastr integratsiyasi
- [ ] O'lchov natijasini PDF hisobot sifatida eksport qilish
- [ ] Mobil ilova versiyasi

## ⚠️ Muhim eslatma

Chegara faqat **dastlabki, xarita asosidagi baholash** vositasi. Rasmiy yer chegaralari, mulkchilik va yuridik bitimlar uchun rasmiy kadastr hujjatlari va malakali mutaxassisga murojaat qiling.
