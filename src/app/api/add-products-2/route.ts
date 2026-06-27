import { NextResponse } from 'next/server'
import { getPayload } from '@/lib/getPayload'

type LocalizedText = { tr: string; en: string; ar: string }
type SpecRow = { label: string; value: string }

async function uploadImageFromUrl(
  payload: Awaited<ReturnType<typeof getPayload>>,
  url: string,
  slug: string,
  alt: LocalizedText,
  referer = 'https://www.otto.de/',
) {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Referer: referer,
    },
  })
  if (!res.ok) throw new Error(`Failed to fetch image ${url}: ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const urlPath = new URL(url).pathname
  const extMatch = urlPath.match(/\.(jpe?g|png|webp)$/i)
  const ext = extMatch ? `.${extMatch[1].toLowerCase()}` : '.jpg'
  const filename = `${slug}-${Date.now()}${ext}`
  const mimetype = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'
  const created = await payload.create({
    collection: 'media',
    data: { alt: alt.en },
    locale: 'en',
    file: { data: buffer, mimetype, name: filename, size: buffer.length },
  })
  for (const loc of ['tr', 'ar'] as const) {
    await payload.update({ collection: 'media', id: created.id, data: { alt: alt[loc] }, locale: loc })
  }
  return created.id
}

type NewProduct = {
  slug: string
  sku: string
  price: number
  salePrice?: number
  isNew?: boolean
  featured?: boolean
  categorySlug: string
  imageUrl: string
  imageReferer?: string
  title: LocalizedText
  description: LocalizedText
  excerpt: LocalizedText
  tags: LocalizedText
  specs: { en: SpecRow[]; tr: SpecRow[]; ar: SpecRow[] }
}

const NEW_PRODUCTS: NewProduct[] = [
  // ── KITCHEN ACCESSORIES (dining tables) → living-room ──────────────────────
  {
    slug: 'altona-column-dining-table',
    sku: 'TBL-004',
    price: 349,
    isNew: true,
    categorySlug: 'living-room',
    imageUrl:
      'https://i.otto.de/i/otto/a665ee27-8860-5df9-b54a-14851b0d94dd/otto-home-saulen-esstisch-altona-esstisch-kuchentisch-ausziehbar-auf-180-cm-weiss-weiss-weiss.jpg',
    title: {
      en: 'Altona Column Dining Table – Extendable to 180 cm',
      tr: 'Altona Sütun Yemek Masası – 180 cm\'ye Uzatılabilir',
      ar: 'طاولة طعام عمودية Altona – قابلة للتمديد إلى 180 سم',
    },
    description: {
      en: 'A stylish column dining table that extends up to 180 cm. The column base allows chairs to be moved in any direction without bumping. One extension leaf included. Modern wood-composite tabletop, dimensionally stable and load-bearing. Dimensions: W 140–180 cm, D 90 cm, H 76 cm.',
      tr: '180 cm\'ye kadar uzayan şık sütun yemek masası. Sütun taban, sandalyelerin her yönde serbestçe hareket etmesini sağlar. Bir uzatma yaprağı dahildir. Modern ahşap bileşik masa tablası. Ölçüler: G 140-180 cm, D 90 cm, Y 76 cm.',
      ar: 'طاولة طعام عمودية أنيقة قابلة للتمديد حتى 180 سم. القاعدة العمودية تتيح تحريك الكراسي في أي اتجاه. تشمل ورقة تمديد واحدة. سطح طاولة من الخشب المركب الحديث. الأبعاد: العرض 140-180 سم، العمق 90 سم، الارتفاع 76 سم.',
    },
    excerpt: {
      en: 'Extendable column dining table from 140 to 180 cm. Column base for unrestricted seating movement.',
      tr: '140\'tan 180 cm\'ye uzatılabilir sütun yemek masası. Serbest sandalye hareketi için sütun taban.',
      ar: 'طاولة طعام عمودية قابلة للتمديد من 140 إلى 180 سم. قاعدة عمودية لحرية حركة الكراسي.',
    },
    tags: {
      en: 'Dining Table, Extendable, Column Base, Kitchen',
      tr: 'Yemek Masası, Uzatılabilir, Sütun Taban, Mutfak',
      ar: 'طاولة طعام، قابلة للتمديد، قاعدة عمودية، مطبخ',
    },
    specs: {
      en: [
        { label: 'Base Type', value: 'Column base' },
        { label: 'Function', value: 'Extendable' },
        { label: 'Width (min–max)', value: '140–180 cm' },
        { label: 'Depth', value: '90 cm' },
        { label: 'Height', value: '76 cm' },
        { label: 'Tabletop Thickness', value: '3.6 cm' },
        { label: 'Material', value: 'Wood composite' },
        { label: 'Shape', value: 'Rectangular' },
      ],
      tr: [
        { label: 'Taban Tipi', value: 'Sütun taban' },
        { label: 'Fonksiyon', value: 'Genişletilebilir' },
        { label: 'Genişlik (min–maks)', value: '140-180 cm' },
        { label: 'Derinlik', value: '90 cm' },
        { label: 'Yükseklik', value: '76 cm' },
        { label: 'Masa Tablası Kalınlığı', value: '3,6 cm' },
        { label: 'Malzeme', value: 'Ahşap bileşik' },
        { label: 'Şekil', value: 'Dikdörtgen' },
      ],
      ar: [
        { label: 'نوع القاعدة', value: 'قاعدة عمودية' },
        { label: 'الوظيفة', value: 'قابل للتمديد' },
        { label: 'العرض (أدنى–أقصى)', value: '140-180 سم' },
        { label: 'العمق', value: '90 سم' },
        { label: 'الارتفاع', value: '76 سم' },
        { label: 'سماكة سطح الطاولة', value: '3.6 سم' },
        { label: 'المادة', value: 'خشب مركب' },
        { label: 'الشكل', value: 'مستطيل' },
      ],
    },
  },
  {
    slug: 'wotkon-dining-table',
    sku: 'TBL-005',
    price: 259,
    categorySlug: 'living-room',
    imageUrl:
      'https://i.otto.de/i/otto/1338a4bf-9cc2-56ce-9000-460ec1c813e1/mirjan24-esstisch-wotkon-185x90x75-cm-sandbeige.jpg',
    title: {
      en: 'Wotkon Dining Table 185×90×75 cm',
      tr: 'Wotkon Yemek Masası 185×90×75 cm',
      ar: 'طاولة طعام Wotkon 185×90×75 سم',
    },
    description: {
      en: 'A solid, contemporary dining table with clean proportions. 28 mm laminate tabletop with ABS edging for durability. 16 mm MDF/laminate legs. Non-extendable — a timeless piece available in sandbeige.',
      tr: 'Temiz oranlara sahip sağlam ve çağdaş bir yemek masası. ABS kenarlıklı 28 mm laminat masa tablası. 16 mm MDF/laminat bacaklar. Genişlemeyen — kum bej renkte zamansız bir parça.',
      ar: 'طاولة طعام متينة بتصميم معاصر ونسب واضحة. سطح طاولة لامينيت 28 مم مع حافة ABS. أرجل MDF/لامينيت 16 مم. غير قابلة للتمديد — قطعة كلاسيكية بلون رملي بيج.',
    },
    excerpt: {
      en: 'Solid 185 cm dining table in sandbeige. 28 mm laminate top with ABS edge, sturdy and timeless.',
      tr: 'Kum bej renkte sağlam 185 cm yemek masası. ABS kenarlıklı 28 mm laminat tabla, dayanıklı ve zamansız.',
      ar: 'طاولة طعام 185 سم متينة بلون رملي بيج. سطح لامينيت 28 مم مع حافة ABS، راسخة وكلاسيكية.',
    },
    tags: {
      en: 'Dining Table, Solid, Laminate, Sandbeige',
      tr: 'Yemek Masası, Sağlam, Laminat, Kum Bej',
      ar: 'طاولة طعام، متينة، لامينيت، رملي بيج',
    },
    specs: {
      en: [
        { label: 'Width', value: '185 cm' },
        { label: 'Depth', value: '90 cm' },
        { label: 'Height', value: '75 cm' },
        { label: 'Tabletop', value: '28 mm laminate, ABS edge' },
        { label: 'Legs', value: '16 mm MDF/laminate' },
        { label: 'Extendable', value: 'No' },
        { label: 'Color', value: 'Sandbeige' },
      ],
      tr: [
        { label: 'Genişlik', value: '185 cm' },
        { label: 'Derinlik', value: '90 cm' },
        { label: 'Yükseklik', value: '75 cm' },
        { label: 'Masa Tablası', value: '28 mm laminat, ABS kenar' },
        { label: 'Bacaklar', value: '16 mm MDF/laminat' },
        { label: 'Genişletilebilir', value: 'Hayır' },
        { label: 'Renk', value: 'Kum bej' },
      ],
      ar: [
        { label: 'العرض', value: '185 سم' },
        { label: 'العمق', value: '90 سم' },
        { label: 'الارتفاع', value: '75 سم' },
        { label: 'سطح الطاولة', value: 'لامينيت 28 مم، حافة ABS' },
        { label: 'الأرجل', value: 'MDF/لامينيت 16 مم' },
        { label: 'قابل للتمديد', value: 'لا' },
        { label: 'اللون', value: 'رملي بيج' },
      ],
    },
  },
  {
    slug: 'linnea-round-extendable-dining-table',
    sku: 'TBL-006',
    price: 429,
    isNew: true,
    featured: true,
    categorySlug: 'living-room',
    imageUrl:
      'https://i.otto.de/i/otto/e200b474-3fe0-44dd-ae3b-52e57c41dd5c/yourhouse24-esstisch-linnea-o120-160cm-ausziehbar-saule-lamellen-einzeltisch-1-st-1x-esstisch-saule-in-lamellen-optik-kaschmir-schwarz-kaschmir.jpg',
    title: {
      en: 'LINNEA Round Extendable Dining Table Ø120–160 cm',
      tr: 'LINNEA Yuvarlak Genişletilebilir Yemek Masası Ø120-160 cm',
      ar: 'طاولة طعام دائرية قابلة للتمديد LINNEA Ø120-160 سم',
    },
    description: {
      en: 'LINNEA combines elegant design with everyday practicality. The round milled column base and matte tabletop create a noble look that fits modern, glamorous, and classic interiors. Extends from Ø120 to Ø160 cm — ideal for everyday meals or social evenings. Available in black and cashmere.',
      tr: 'LINNEA zarif tasarımı günlük pratiklikle birleştirir. Yuvarlak frezelenmiş sütun taban ve mat masa yüzeyi modern, görkemli ve klasik mekanlara uyan asil bir görünüm yaratır. Ø120\'den Ø160 cm\'ye uzar. Siyah ve kaşmir renklerde.',
      ar: 'تجمع طاولة LINNEA بين التصميم الأنيق والعملية اليومية. القاعدة العمودية الدائرية وسطح الطاولة المطفي يخلقان مظهراً راقياً يناسب الديكورات الحديثة والكلاسيكية. تمتد من Ø120 إلى Ø160 سم. متوفرة بالأسود والكاشمير.',
    },
    excerpt: {
      en: 'Round extendable dining table from Ø120 to Ø160 cm with slat-look column base. Modern and timeless.',
      tr: 'Ø120\'den Ø160 cm\'ye uzayan yuvarlak yemek masası, lamelli görünümlü sütun taban. Modern ve zamansız.',
      ar: 'طاولة طعام دائرية قابلة للتمديد من Ø120 إلى Ø160 سم بقاعدة عمودية بمظهر الشرائح. عصرية وكلاسيكية.',
    },
    tags: {
      en: 'Dining Table, Round, Extendable, Column Base',
      tr: 'Yemek Masası, Yuvarlak, Uzatılabilir, Sütun Taban',
      ar: 'طاولة طعام، دائرية، قابلة للتمديد، قاعدة عمودية',
    },
    specs: {
      en: [
        { label: 'Shape', value: 'Round' },
        { label: 'Diameter (min–max)', value: 'Ø120–160 cm' },
        { label: 'Function', value: 'Extendable' },
        { label: 'Base', value: 'Column, slat look' },
        { label: 'Tabletop', value: 'Matte finish' },
        { label: 'Colors', value: 'Black, Cashmere' },
      ],
      tr: [
        { label: 'Şekil', value: 'Yuvarlak' },
        { label: 'Çap (min–maks)', value: 'Ø120-160 cm' },
        { label: 'Fonksiyon', value: 'Genişletilebilir' },
        { label: 'Taban', value: 'Sütun, lamelli görünüm' },
        { label: 'Masa Tablası', value: 'Mat yüzey' },
        { label: 'Renkler', value: 'Siyah, Kaşmir' },
      ],
      ar: [
        { label: 'الشكل', value: 'دائري' },
        { label: 'القطر (أدنى–أقصى)', value: 'Ø120-160 سم' },
        { label: 'الوظيفة', value: 'قابل للتمديد' },
        { label: 'القاعدة', value: 'عمودي بمظهر الشرائح' },
        { label: 'سطح الطاولة', value: 'تشطيب مطفي' },
        { label: 'الألوان', value: 'أسود، كاشمير' },
      ],
    },
  },

  // ── ACCESSORIES (LED furniture) ─────────────────────────────────────────────
  {
    slug: 'led-extendable-table-with-storage',
    sku: 'ACC-001',
    price: 389,
    isNew: true,
    categorySlug: 'accessories',
    imageUrl:
      'https://i.otto.de/i/otto/5767bf19-534b-4f66-903d-574eb18dd2df/flieks-esstisch-ausziehbar-kuchentisch-mit-led-beleuchtung-erweiterbare-tischplatte-in-holzoptik-lange110-140x80x75-cm-1-st-1-tisch-rechteckig-arbeitstisch-mit-glastur-und-2-schubladen-schreibtisch-schwarz-schwarz.jpg',
    title: {
      en: 'LED Extendable Table with Storage 110–140×80×75 cm',
      tr: 'LED Uzatılabilir Masa Depolama ile 110-140×80×75 cm',
      ar: 'طاولة LED قابلة للتمديد مع تخزين 110-140×80×75 سم',
    },
    description: {
      en: 'A versatile extendable table with integrated LED lighting. Features a wood-effect tabletop, glass-door cabinet section, and 2 drawers. Extends from 110 to 140 cm. The LED strip creates an elegant ambient atmosphere. Suitable for dining rooms or home offices.',
      tr: 'Entegre LED aydınlatmalı çok yönlü uzatılabilir masa. Ahşap efektli yüzey, cam kapılı dolap bölümü ve 2 çekmece. 110\'dan 140 cm\'ye uzar. LED şerit zarif bir ortam yaratır. Yemek odası veya ev ofisi için uygundur.',
      ar: 'طاولة قابلة للتمديد متعددة الأغراض مع إضاءة LED متكاملة. سطح بمظهر الخشب، قسم خزانة بباب زجاجي، و2 أدراج. تمتد من 110 إلى 140 سم. شريط LED يخلق أجواءً أنيقة.',
    },
    excerpt: {
      en: 'Extendable table 110–140 cm with LED strip, glass cabinet, and 2 drawers. Dining room and home office.',
      tr: '110-140 cm uzatılabilir LED şeritli masa, cam dolap ve 2 çekmece. Yemek odası ve ev ofisi.',
      ar: 'طاولة قابلة للتمديد 110-140 سم مع شريط LED وخزانة زجاجية و2 أدراج.',
    },
    tags: {
      en: 'Table, LED, Extendable, Storage, Dining',
      tr: 'Masa, LED, Uzatılabilir, Depolama, Yemek',
      ar: 'طاولة، LED، قابلة للتمديد، تخزين، طعام',
    },
    specs: {
      en: [
        { label: 'Width (min–max)', value: '110–140 cm' },
        { label: 'Depth', value: '80 cm' },
        { label: 'Height', value: '75 cm' },
        { label: 'LED Lighting', value: 'Yes' },
        { label: 'Storage', value: 'Glass door + 2 drawers' },
        { label: 'Tabletop', value: 'Wood-effect' },
        { label: 'Shape', value: 'Rectangular' },
      ],
      tr: [
        { label: 'Genişlik (min–maks)', value: '110-140 cm' },
        { label: 'Derinlik', value: '80 cm' },
        { label: 'Yükseklik', value: '75 cm' },
        { label: 'LED Aydınlatma', value: 'Evet' },
        { label: 'Depolama', value: 'Cam kapı + 2 çekmece' },
        { label: 'Masa Tablası', value: 'Ahşap efektli' },
        { label: 'Şekil', value: 'Dikdörtgen' },
      ],
      ar: [
        { label: 'العرض (أدنى–أقصى)', value: '110-140 سم' },
        { label: 'العمق', value: '80 سم' },
        { label: 'الارتفاع', value: '75 سم' },
        { label: 'إضاءة LED', value: 'نعم' },
        { label: 'التخزين', value: 'باب زجاجي + 2 أدراج' },
        { label: 'سطح الطاولة', value: 'بمظهر الخشب' },
        { label: 'الشكل', value: 'مستطيل' },
      ],
    },
  },
  {
    slug: 'led-coffee-table-rgb',
    sku: 'ACC-002',
    price: 219,
    isNew: true,
    categorySlug: 'accessories',
    imageUrl:
      'https://i.otto.de/i/otto/f96fba92-a302-4c0a-b28c-edea51439c84/pxloue-couchtisch-led-couchtisch-mit-stauraum-und-modernem-design-hochglanzender-praktischer-tisch-mit-schubladen-und-integrierter-beleuchtung-schwarz.jpg',
    title: {
      en: 'LED Coffee Table with RGB Lighting & Storage',
      tr: 'RGB LED Sehpa Depolama ile',
      ar: 'طاولة قهوة LED مع إضاءة RGB وتخزين',
    },
    description: {
      en: 'A modern coffee table made from high-quality high-gloss MDF with RGB LED lighting offering over 6,000 colours, controlled by remote or app. Features 2 drawers and shelves for organised storage. A stylish centrepiece for any modern living room.',
      tr: 'Yüksek kaliteli yüksek parlak MDF\'den üretilmiş modern sehpa. RGB LED aydınlatma 6.000\'den fazla renk sunar, uzaktan kumanda veya uygulama ile kontrol edilir. 2 çekmece ve raflar düzenli depolama sağlar.',
      ar: 'طاولة قهوة حديثة من MDF عالي الجودة واللمعان مع إضاءة RGB LED تقدم أكثر من 6000 لون، يتم التحكم بها عبر جهاز التحكم عن بعد أو التطبيق. تتميز بـ2 أدراج وأرفف للتخزين المنظم.',
    },
    excerpt: {
      en: 'High-gloss coffee table with 6,000+ colour RGB LED, remote & app control, 2 drawers.',
      tr: '6.000+ renkli RGB LED, uzaktan kumanda ve uygulama kontrollü, 2 çekmeceli parlak sehpa.',
      ar: 'طاولة قهوة لامعة مع RGB LED بأكثر من 6000 لون، تحكم عن بعد وتطبيق، 2 أدراج.',
    },
    tags: {
      en: 'Coffee Table, LED, RGB, High Gloss, Storage',
      tr: 'Sehpa, LED, RGB, Yüksek Parlak, Depolama',
      ar: 'طاولة قهوة، LED، RGB، عالي اللمعان، تخزين',
    },
    specs: {
      en: [
        { label: 'LED Lighting', value: 'RGB – 6,000+ colours' },
        { label: 'LED Control', value: 'Remote + App' },
        { label: 'Storage', value: '2 drawers + shelves' },
        { label: 'Material', value: 'High-gloss MDF' },
        { label: 'Power', value: 'USB' },
      ],
      tr: [
        { label: 'LED Aydınlatma', value: 'RGB – 6.000+ renk' },
        { label: 'LED Kontrol', value: 'Uzaktan kumanda + Uygulama' },
        { label: 'Depolama', value: '2 çekmece + raflar' },
        { label: 'Malzeme', value: 'Yüksek parlak MDF' },
        { label: 'Güç', value: 'USB' },
      ],
      ar: [
        { label: 'إضاءة LED', value: 'RGB – 6000+ لون' },
        { label: 'التحكم بالإضاءة', value: 'جهاز تحكم + تطبيق' },
        { label: 'التخزين', value: '2 أدراج + أرفف' },
        { label: 'المادة', value: 'MDF عالي اللمعان' },
        { label: 'الطاقة', value: 'USB' },
      ],
    },
  },
  {
    slug: 'led-tv-board',
    sku: 'ACC-003',
    price: 299,
    categorySlug: 'accessories',
    imageUrl:
      'https://i.otto.de/i/otto/de8dd4c1-cbe8-4f1a-a0d1-a39ae2238260/sonni-tv-schrank-schwarzer-tv-stander-mit-led-beleuchtung-stilvoll-140-180cm-breit-mit-12-led-farben-beleuchtung-tv-board-weiss.jpg',
    title: {
      en: 'LED TV Board 140–180 cm',
      tr: 'LED TV Ünitesi 140-180 cm',
      ar: 'وحدة تلفزيون LED 140-180 سم',
    },
    description: {
      en: 'Stylish TV board in scratch-resistant high-gloss MDF with 12-colour LED lighting powered via USB or outlet. Dust-proof flip-top door. Remote control range 2.5 m. Available in widths from 140 to 180 cm. Wall-mounted or freestanding.',
      tr: 'Çizilmeye dayanıklı yüksek parlak MDF\'den şık TV ünitesi. 12 renkli LED aydınlatma USB veya priz üzerinden çalışır. Toza dayanıklı açılır kapı. Uzaktan kumanda menzili 2,5 m. 140-180 cm genişliklerde.',
      ar: 'وحدة تلفزيون أنيقة من MDF مقاوم للخدش عالي اللمعان مع إضاءة LED بـ12 لوناً تعمل عبر USB أو مقبس كهربائي. باب قلاب مقاوم للغبار. نطاق التحكم عن بعد: 2.5 م. متوفرة بعروض 140-180 سم.',
    },
    excerpt: {
      en: 'High-gloss TV board 140–180 cm with 12-colour LED, dust-proof door, wall or floor mounting.',
      tr: '12 renkli LED, toza dayanıklı kapı, duvar veya zemin montajlı 140-180 cm yüksek parlak TV ünitesi.',
      ar: 'وحدة تلفزيون لامعة 140-180 سم مع LED 12 لون، باب مقاوم للغبار، تثبيت جداري أو أرضي.',
    },
    tags: {
      en: 'TV Board, LED, High Gloss, Living Room',
      tr: 'TV Ünitesi, LED, Yüksek Parlak, Oturma Odası',
      ar: 'وحدة تلفزيون، LED، عالي اللمعان، غرفة معيشة',
    },
    specs: {
      en: [
        { label: 'Width', value: '140–180 cm' },
        { label: 'Material', value: 'High-gloss MDF' },
        { label: 'LED Colours', value: '12' },
        { label: 'LED Power', value: 'USB / Power outlet' },
        { label: 'Remote Range', value: '2.5 m' },
        { label: 'Door Type', value: 'Flip-top (dust-proof)' },
        { label: 'Mounting', value: 'Wall-mounted or Freestanding' },
      ],
      tr: [
        { label: 'Genişlik', value: '140-180 cm' },
        { label: 'Malzeme', value: 'Yüksek parlak MDF' },
        { label: 'LED Renkleri', value: '12' },
        { label: 'LED Gücü', value: 'USB / Priz' },
        { label: 'Uzaktan Kumanda Menzili', value: '2,5 m' },
        { label: 'Kapı Tipi', value: 'Açılır kapak (toza dayanıklı)' },
        { label: 'Montaj', value: 'Duvara monte veya ayaklı' },
      ],
      ar: [
        { label: 'العرض', value: '140-180 سم' },
        { label: 'المادة', value: 'MDF عالي اللمعان' },
        { label: 'ألوان LED', value: '12' },
        { label: 'طاقة LED', value: 'USB / مقبس كهربائي' },
        { label: 'نطاق التحكم عن بعد', value: '2.5 م' },
        { label: 'نوع الباب', value: 'قلاب (مقاوم للغبار)' },
        { label: 'التثبيت', value: 'جداري أو أرضي' },
      ],
    },
  },

  // ── OFFICE ─────────────────────────────────────────────────────────────────
  {
    slug: 'flo-compact-desk',
    sku: 'OFF-001',
    price: 149,
    categorySlug: 'office',
    imageUrl:
      'https://i.otto.de/i/otto/08003d03-8786-5259-a782-686daeadf6ff/vogl-mobelfabrik-schreibtisch-flo-schulerschreibtisch-auch-mit-tastaturauszug-erhaltlich-breite-91-cm-weiss.jpg',
    title: {
      en: 'Flo Compact Desk – Width 91 cm',
      tr: 'Flo Kompakt Masa – Genişlik 91 cm',
      ar: 'مكتب Flo المدمج – عرض 91 سم',
    },
    description: {
      en: 'A modern desk made of melamine-coated chipboard. Features 1 drawer on metal rails and a small open compartment above it. Available in two versions and four colours. Dimensions: W 91 cm, D 50 cm, H 72 cm.',
      tr: 'Melamin kaplı yonga levhadan modern masa. Metal raylarda 1 çekmece ve üzerinde küçük açık bölme. İki versiyon ve dört renkte mevcuttur. Ölçüler: G 91 cm, D 50 cm, Y 72 cm.',
      ar: 'مكتب حديث من الرقائق الخشبية المطلية بالميلامين. يتميز بدرج واحد على قضبان معدنية وخانة مفتوحة صغيرة فوقه. متوفر بإصدارين وأربعة ألوان. الأبعاد: العرض 91 سم، العمق 50 سم، الارتفاع 72 سم.',
    },
    excerpt: {
      en: 'Compact 91 cm desk with 1 drawer on metal rails and open shelf. Melamine-coated, 4 colour options.',
      tr: 'Metal raylarda 1 çekmece ve açık raf bulunan 91 cm kompakt masa. Melamin kaplı, 4 renk seçeneği.',
      ar: 'مكتب مدمج 91 سم مع درج واحد على قضبان معدنية ورف مفتوح. مطلي بالميلامين، 4 خيارات ألوان.',
    },
    tags: {
      en: 'Desk, Compact, Office, Student',
      tr: 'Masa, Kompakt, Ofis, Öğrenci',
      ar: 'مكتب، مدمج، مكتب، طلاب',
    },
    specs: {
      en: [
        { label: 'Width', value: '91 cm' },
        { label: 'Depth', value: '50 cm' },
        { label: 'Height', value: '72 cm' },
        { label: 'Drawers', value: '1' },
        { label: 'Open Compartments', value: '1' },
        { label: 'Material', value: 'Melamine-coated chipboard' },
      ],
      tr: [
        { label: 'Genişlik', value: '91 cm' },
        { label: 'Derinlik', value: '50 cm' },
        { label: 'Yükseklik', value: '72 cm' },
        { label: 'Çekmeceler', value: '1' },
        { label: 'Açık Bölmeler', value: '1' },
        { label: 'Malzeme', value: 'Melamin kaplı yonga levha' },
      ],
      ar: [
        { label: 'العرض', value: '91 سم' },
        { label: 'العمق', value: '50 سم' },
        { label: 'الارتفاع', value: '72 سم' },
        { label: 'الأدراج', value: '1' },
        { label: 'الأقسام المفتوحة', value: '1' },
        { label: 'المادة', value: 'رقائق خشبية مطلية بالميلامين' },
      ],
    },
  },
  {
    slug: 'l-shape-corner-desk',
    sku: 'OFF-002',
    price: 229,
    isNew: true,
    categorySlug: 'office',
    imageUrl:
      'https://i.otto.de/i/otto/c15bf9fe-2c94-4bbc-85a7-d757f0a10ec7/gtplayer-schreibtisch-gaming-tisch-eckschreibtisch-mit-regal-usb-ladeanschluss-und-steckdose-1-tisch-120-100cm-computertisch-l-form-pc-tisch-fur-buro-heimburo-weiss.jpg',
    title: {
      en: 'L-Shape Corner Desk 120/100 cm – USB & Power Outlet',
      tr: 'L Şekilli Köşe Masası 120/100 cm – USB ve Priz',
      ar: 'مكتب زاوية بشكل L 120/100 سم – USB ومقبس كهربائي',
    },
    description: {
      en: 'L-shaped corner desk with an integrated power strip: 1 socket and 2 USB ports for convenient device connections. Two-tier shelves provide ample storage for accessories, books, or decorations. Spacious L-shape supports dual-monitor setups. Suitable for office and home office.',
      tr: 'Entegre priz şeritli L şekilli köşe masası: 1 priz ve 2 USB portu. İki kademeli raflar geniş depolama sunar. Geniş L şekli çift monitörü destekler. Ofis ve ev ofisi için uygundur.',
      ar: 'مكتب زاوية بشكل L مع شريط طاقة متكامل: مقبس كهربائي واحد و2 منفذ USB. أرفف ثنائية الطابق توفر مساحة وفيرة. تصميم L الفسيح يدعم شاشتين. مناسب للمكاتب ومكاتب المنزل.',
    },
    excerpt: {
      en: 'L-shape corner desk 120×100 cm with built-in socket, 2 USB ports, and 2-tier storage shelves.',
      tr: 'Dahili priz, 2 USB ve 2 kademeli raf bulunan 120×100 cm L şekilli köşe masası.',
      ar: 'مكتب زاوية L 120×100 سم مع مقبس مدمج و2 USB وأرفف تخزين ثنائية.',
    },
    tags: {
      en: 'Desk, L-Shape, Corner, USB, Gaming, Office',
      tr: 'Masa, L Şekil, Köşe, USB, Gaming, Ofis',
      ar: 'مكتب، شكل L، زاوية، USB، ألعاب، مكتب',
    },
    specs: {
      en: [
        { label: 'Shape', value: 'L-Form corner desk' },
        { label: 'Dimensions', value: '120 × 100 cm' },
        { label: 'Power Socket', value: '1' },
        { label: 'USB Ports', value: '2' },
        { label: 'Shelves', value: '2-tier' },
        { label: 'Suitable For', value: 'Office, Home office' },
      ],
      tr: [
        { label: 'Şekil', value: 'L şekilli köşe masası' },
        { label: 'Ölçüler', value: '120 × 100 cm' },
        { label: 'Priz', value: '1' },
        { label: 'USB Portları', value: '2' },
        { label: 'Raflar', value: '2 kademeli' },
        { label: 'Uygun Kullanım', value: 'Ofis, Ev ofisi' },
      ],
      ar: [
        { label: 'الشكل', value: 'مكتب زاوية بشكل L' },
        { label: 'الأبعاد', value: '120 × 100 سم' },
        { label: 'مقبس كهربائي', value: '1' },
        { label: 'منافذ USB', value: '2' },
        { label: 'الأرفف', value: 'طابقين' },
        { label: 'مناسب لـ', value: 'المكتب، مكتب المنزل' },
      ],
    },
  },
  {
    slug: 'tim-desk-138',
    sku: 'OFF-003',
    price: 199,
    categorySlug: 'office',
    imageUrl:
      'https://i.otto.de/i/otto/6b1ff643-7edc-5ffc-8a77-2d13686e7dab/vogl-mobelfabrik-schreibtisch-tim-mit-seitlich-offenen-fachern-tastaturauszug-druckerablage-1-schublade-breite-138-cm-made-in-germany-weissfarben.jpg',
    title: {
      en: 'Tim Desk – Keyboard Tray, Printer Shelf & Drawer, 138 cm',
      tr: 'Tim Masa – Klavye Çekmecesi, Yazıcı Rafı ve Çekmece, 138 cm',
      ar: 'مكتب Tim – درج لوحة المفاتيح، رف الطابعة والدرج، 138 سم',
    },
    description: {
      en: 'A thoughtfully designed modern desk for contemporary workspaces. Features a printer shelf, keyboard tray, 1 drawer, and various compartments with and without doors. Melamine-coated surface for easy care. Width 138 cm. Made in Germany.',
      tr: 'Çağdaş çalışma alanları için düşünceli modern masa. Yazıcı rafı, klavye çekmecesi, 1 çekmece ve kapılı/kapısız çeşitli bölmeler. Melamin kaplı kolay bakım yüzeyi. Genişlik 138 cm. Made in Germany.',
      ar: 'مكتب حديث بتصميم مدروس لأماكن العمل المعاصرة. يتميز برف طابعة وحامل لوحة مفاتيح ودرج واحد وخانات متنوعة مع وبدون أبواب. سطح مطلي بالميلامين سهل العناية. العرض 138 سم. صناعة ألمانية.',
    },
    excerpt: {
      en: '138 cm office desk with printer shelf, keyboard tray, and drawer. Made in Germany.',
      tr: 'Yazıcı rafı, klavye çekmecesi ve çekmeceli 138 cm ofis masası. Made in Germany.',
      ar: 'مكتب 138 سم مع رف طابعة وحامل لوحة مفاتيح ودرج. صناعة ألمانية.',
    },
    tags: {
      en: 'Desk, Office, Keyboard Tray, Printer Shelf, Made in Germany',
      tr: 'Masa, Ofis, Klavye Çekmecesi, Yazıcı Rafı, Made in Germany',
      ar: 'مكتب، مكتب، درج لوحة مفاتيح، رف طابعة، صناعة ألمانية',
    },
    specs: {
      en: [
        { label: 'Width', value: '138 cm' },
        { label: 'Keyboard Tray', value: 'Yes' },
        { label: 'Printer Shelf', value: 'Yes' },
        { label: 'Drawers', value: '1' },
        { label: 'Material', value: 'Melamine-coated' },
        { label: 'Origin', value: 'Made in Germany' },
      ],
      tr: [
        { label: 'Genişlik', value: '138 cm' },
        { label: 'Klavye Çekmecesi', value: 'Evet' },
        { label: 'Yazıcı Rafı', value: 'Evet' },
        { label: 'Çekmeceler', value: '1' },
        { label: 'Malzeme', value: 'Melamin kaplı' },
        { label: 'Menşei', value: 'Made in Germany' },
      ],
      ar: [
        { label: 'العرض', value: '138 سم' },
        { label: 'حامل لوحة المفاتيح', value: 'نعم' },
        { label: 'رف الطابعة', value: 'نعم' },
        { label: 'الأدراج', value: '1' },
        { label: 'المادة', value: 'مطلي بالميلامين' },
        { label: 'المنشأ', value: 'صناعة ألمانية' },
      ],
    },
  },

  // ── LIVING ROOM sofas (medusahome.com.tr) ──────────────────────────────────
  {
    slug: 'solen-luxury-sofa-set',
    sku: 'SOF-004',
    price: 2499,
    isNew: true,
    featured: true,
    categorySlug: 'living-room',
    imageUrl: 'https://witcdn.medusahome.com.tr/solen-koltuk-takimi-luxury-koltuk-takimlari-262358-36-B.jpg',
    imageReferer: 'https://www.medusahome.com.tr/',
    title: {
      en: 'Solen Luxury Sofa Set (3+3+1)',
      tr: 'Solen Lüks Koltuk Takımı (3+3+1)',
      ar: 'طقم كنب سولن فاخر (3+3+1)',
    },
    description: {
      en: 'The Solen Luxury Sofa Set consists of two triple sofas and one armchair. The frame is kiln-dried beechwood with wooden legs. Imported fabric upholstery with 35-density HR foam provides medium-firmness seating comfort. Wipeable fabric. No bed mechanism.',
      tr: 'Solen Lüks Koltuk Takımı iki üçlü koltuk ve bir berjerden oluşur. İskelet fırınlanmış gürgen ağacı, ahşap ayaklar. İthal kumaş döşeme ve 35 dansite HR sünger orta sertlikte konfor sağlar. Silinebilir kumaş. Yatak mekanizması yoktur.',
      ar: 'يتكون طقم كنب سولن الفاخر من أريكتين ثلاثيتين ومقعد فردي. الهيكل من خشب الزان المجفف بالفرن مع أرجل خشبية. تنجيد من قماش مستورد برغوة HR بكثافة 35 لراحة جلوس متوسطة. قماش قابل للمسح. لا توجد آلية سرير.',
    },
    excerpt: {
      en: 'Luxury 3+3+1 sofa set with beechwood frame, HR35 foam, and wipeable imported fabric.',
      tr: 'Gürgen iskeletli, HR35 süngerli ve silinebilir ithal kumaşlı lüks 3+3+1 koltuk takımı.',
      ar: 'طقم كنب فاخر 3+3+1 بإطار خشب الزان ورغوة HR35 وقماش مستورد قابل للمسح.',
    },
    tags: {
      en: 'Sofa Set, Luxury, 3+3+1, Beechwood, Living Room',
      tr: 'Koltuk Takımı, Lüks, 3+3+1, Gürgen, Oturma Odası',
      ar: 'طقم كنب، فاخر، 3+3+1، خشب الزان، غرفة معيشة',
    },
    specs: {
      en: [
        { label: 'Set Content', value: '3+3+1 (2× triple + 1× armchair)' },
        { label: 'Frame', value: 'Kiln-dried beechwood' },
        { label: 'Legs', value: 'Wood' },
        { label: 'Fabric', value: 'Imported fabric' },
        { label: 'Foam', value: '35-density HR' },
        { label: 'Firmness', value: 'Medium' },
        { label: 'Bed Mechanism', value: 'None' },
        { label: 'Triple Sofa Dimensions', value: '235×95×72 cm' },
        { label: 'Armchair Dimensions', value: '88×80×77 cm' },
      ],
      tr: [
        { label: 'Takım İçeriği', value: '3+3+1 (2× üçlü + 1× berjer)' },
        { label: 'İskelet', value: 'Fırınlanmış gürgen ağacı' },
        { label: 'Ayaklar', value: 'Ahşap' },
        { label: 'Kumaş', value: 'İthal kumaş' },
        { label: 'Sünger', value: '35 dansite HR' },
        { label: 'Sertlik', value: 'Orta' },
        { label: 'Yatak Mekanizması', value: 'Yok' },
        { label: 'Üçlü Koltuk Ölçüsü', value: '235×95×72 cm' },
        { label: 'Berjer Ölçüsü', value: '88×80×77 cm' },
      ],
      ar: [
        { label: 'محتوى الطقم', value: '3+3+1 (أريكتان ثلاثيتان + مقعد)' },
        { label: 'الهيكل', value: 'خشب زان مجفف بالفرن' },
        { label: 'الأرجل', value: 'خشب' },
        { label: 'القماش', value: 'قماش مستورد' },
        { label: 'الإسفنج', value: 'HR بكثافة 35' },
        { label: 'الثبات', value: 'متوسط' },
        { label: 'آلية السرير', value: 'لا يوجد' },
        { label: 'أبعاد الأريكة الثلاثية', value: '235×95×72 سم' },
        { label: 'أبعاد المقعد الفردي', value: '88×80×77 سم' },
      ],
    },
  },
  {
    slug: 'brisa-modern-sofa-set',
    sku: 'SOF-005',
    price: 2899,
    isNew: true,
    categorySlug: 'living-room',
    imageUrl: 'https://witcdn.medusahome.com.tr/brisa-koltuk-takimi-modern-koltuk-takimlari-235718-34-B.jpg',
    imageReferer: 'https://www.medusahome.com.tr/',
    title: {
      en: 'Brisa Modern Sofa Set with Bed Function (Relax+4+1)',
      tr: 'Brisa Modern Koltuk Takımı Yatak Fonksiyonlu (Relax+4+1)',
      ar: 'طقم كنب برسا العصري بوظيفة السرير (ريلاكس+4+1)',
    },
    description: {
      en: 'The Brisa Modern Sofa Set features a Relax module, 4-seater, and armchair with a bed function on 2 seats. Kiln-dried beechwood frame, wooden legs, imported fabric, 35-density HR foam. Reclining mechanism tilts the backrest 40 cm.',
      tr: 'Brisa Modern Koltuk Takımı; Relax modülü, 4+1 konfigürasyonu ve 2 koltukta yatak fonksiyonu sunar. Fırınlanmış gürgen iskelet, ahşap ayak, ithal kumaş, 35 dansite HR sünger. Sırttan atlamalı mekanizma sırtı 40 cm geri yatırır.',
      ar: 'يتميز طقم كنب برسا العصري بوحدة ريلاكس و4 مقاعد ومقعد فردي مع آلية سرير في مقعدين. هيكل من خشب الزان المجفف، أرجل خشبية، قماش مستورد، رغوة HR بكثافة 35. آلية الإمالة تميل الظهر 40 سم.',
    },
    excerpt: {
      en: 'Modern Relax+4+1 sofa set with bed function on 2 seats and 40 cm reclining backrest.',
      tr: '2 koltukta yatak fonksiyonu ve 40 cm yatırılabilir sırtlıklı modern Relax+4+1 koltuk takımı.',
      ar: 'طقم كنب ريلاكس+4+1 عصري مع وظيفة سرير في مقعدين وظهر قابل للإمالة 40 سم.',
    },
    tags: {
      en: 'Sofa Set, Modern, Relax, Bed Function, Living Room',
      tr: 'Koltuk Takımı, Modern, Relax, Yatak Fonksiyonu, Oturma Odası',
      ar: 'طقم كنب، عصري، ريلاكس، وظيفة سرير، غرفة معيشة',
    },
    specs: {
      en: [
        { label: 'Set Content', value: 'Relax+4+1' },
        { label: 'Bed Function', value: 'Yes – 2 seats' },
        { label: 'Mechanism', value: 'Reclining – 40 cm tilt' },
        { label: 'Frame', value: 'Kiln-dried beechwood' },
        { label: 'Foam', value: '35-density HR' },
        { label: 'Corner Module', value: '135×135×77 cm' },
        { label: 'Relax Module', value: '135×135×77 cm' },
        { label: 'Large Middle Module', value: '90×100×77 cm' },
        { label: 'Small Middle Module', value: '70×100×77 cm' },
        { label: 'Arm Module', value: '120×100×77 cm' },
      ],
      tr: [
        { label: 'Takım İçeriği', value: 'Relax+4+1' },
        { label: 'Yatak Fonksiyonu', value: 'Evet – 2 koltuk' },
        { label: 'Mekanizma', value: 'Sırttan atlamalı – 40 cm' },
        { label: 'İskelet', value: 'Fırınlanmış gürgen' },
        { label: 'Sünger', value: '35 dansite HR' },
        { label: 'Köşe Modül', value: '135×135×77 cm' },
        { label: 'Relax Modül', value: '135×135×77 cm' },
        { label: 'Büyük Ara Modül', value: '90×100×77 cm' },
        { label: 'Küçük Ara Modül', value: '70×100×77 cm' },
        { label: 'Kollu Modül', value: '120×100×77 cm' },
      ],
      ar: [
        { label: 'محتوى الطقم', value: 'ريلاكس+4+1' },
        { label: 'وظيفة السرير', value: 'نعم – مقعدان' },
        { label: 'الآلية', value: 'إمالة 40 سم' },
        { label: 'الهيكل', value: 'خشب زان مجفف' },
        { label: 'الإسفنج', value: 'HR بكثافة 35' },
        { label: 'وحدة الزاوية', value: '135×135×77 سم' },
        { label: 'وحدة ريلاكس', value: '135×135×77 سم' },
        { label: 'الوحدة الوسطى الكبيرة', value: '90×100×77 سم' },
        { label: 'الوحدة الوسطى الصغيرة', value: '70×100×77 سم' },
        { label: 'وحدة الذراع', value: '120×100×77 سم' },
      ],
    },
  },
  {
    slug: 'tesla-modern-sofa-set',
    sku: 'SOF-006',
    price: 2699,
    isNew: true,
    categorySlug: 'living-room',
    imageUrl: 'https://witcdn.medusahome.com.tr/tesla-koltuk-takimi-331-modern-koltuk-takimlari-274388-38-B.jpg',
    imageReferer: 'https://www.medusahome.com.tr/',
    title: {
      en: 'Tesla Modern Sofa Set 3+3+1 with Bed Function',
      tr: 'Tesla Modern Koltuk Takımı 3+3+1 Yatak Fonksiyonlu',
      ar: 'طقم كنب تيسلا العصري 3+3+1 بوظيفة السرير',
    },
    description: {
      en: 'The Tesla Modern Sofa Set features a 3+3+1 configuration with a bed function on both triple sofas. Kiln-dried beechwood frame, wooden legs, imported fabric, 35-density HR foam. Reclining mechanism tilts the backrest 40 cm.',
      tr: 'Tesla Modern Koltuk Takımı, her iki üçlü koltukta yatak fonksiyonu olan 3+3+1 konfigürasyona sahiptir. Fırınlanmış gürgen iskelet, ahşap ayak, ithal kumaş, 35 dansite HR sünger. Sırttan atlamalı mekanizma 40 cm geri yatırır.',
      ar: 'يتميز طقم كنب تيسلا العصري بتهيئة 3+3+1 مع آلية سرير في كلتا الأريكتين الثلاثيتين. هيكل من خشب الزان المجفف، أرجل خشبية، قماش مستورد، رغوة HR بكثافة 35. آلية الإمالة تميل الظهر 40 سم.',
    },
    excerpt: {
      en: '3+3+1 sofa set with bed function on both triple sofas. 40 cm reclining backrest mechanism.',
      tr: 'Her iki üçlü koltuğunda yatak fonksiyonu bulunan 3+3+1 koltuk takımı. 40 cm yatırılabilir sırtlık.',
      ar: 'طقم كنب 3+3+1 مع وظيفة سرير في كلتا الأريكتين الثلاثيتين. ظهر قابل للإمالة 40 سم.',
    },
    tags: {
      en: 'Sofa Set, Modern, 3+3+1, Bed Function, Reclining',
      tr: 'Koltuk Takımı, Modern, 3+3+1, Yatak Fonksiyonu, Yatırılabilir',
      ar: 'طقم كنب، عصري، 3+3+1، وظيفة سرير، قابل للإمالة',
    },
    specs: {
      en: [
        { label: 'Set Content', value: '3+3+1' },
        { label: 'Bed Function', value: 'Yes – both triple sofas' },
        { label: 'Mechanism', value: 'Reclining – 40 cm tilt' },
        { label: 'Frame', value: 'Kiln-dried beechwood' },
        { label: 'Foam', value: '35-density HR' },
        { label: 'Triple Sofa Dimensions', value: '240×100×75 cm' },
        { label: 'Armchair Dimensions', value: '83×83×80 cm' },
      ],
      tr: [
        { label: 'Takım İçeriği', value: '3+3+1' },
        { label: 'Yatak Fonksiyonu', value: 'Evet – her iki üçlü koltuk' },
        { label: 'Mekanizma', value: 'Sırttan atlamalı – 40 cm' },
        { label: 'İskelet', value: 'Fırınlanmış gürgen' },
        { label: 'Sünger', value: '35 dansite HR' },
        { label: 'Üçlü Koltuk Ölçüsü', value: '240×100×75 cm' },
        { label: 'Berjer Ölçüsü', value: '83×83×80 cm' },
      ],
      ar: [
        { label: 'محتوى الطقم', value: '3+3+1' },
        { label: 'وظيفة السرير', value: 'نعم – كلتا الأريكتين الثلاثيتين' },
        { label: 'الآلية', value: 'إمالة 40 سم' },
        { label: 'الهيكل', value: 'خشب زان مجفف' },
        { label: 'الإسفنج', value: 'HR بكثافة 35' },
        { label: 'أبعاد الأريكة الثلاثية', value: '240×100×75 سم' },
        { label: 'أبعاد البرجير', value: '83×83×80 سم' },
      ],
    },
  },

  // ── BEDROOM sets (medusahome.com.tr) ────────────────────────────────────────
  {
    slug: 'magna-modern-bedroom-set',
    sku: 'BED-004',
    price: 3299,
    isNew: true,
    featured: true,
    categorySlug: 'bed-room',
    imageUrl: 'https://witcdn.medusahome.com.tr/magna-yatak-odasi-modern-yatak-odasi-255314-36-B.jpg',
    imageReferer: 'https://www.medusahome.com.tr/',
    title: {
      en: 'Magna Modern Bedroom Set',
      tr: 'Magna Modern Yatak Odası',
      ar: 'طقم غرفة نوم مودرن ماجنا',
    },
    description: {
      en: 'The Magna Modern Bedroom Set includes a wardrobe, bed frame with headboard, 2 nightstands, dresser, and mirror. Headboard and bed frame in first-class fabric upholstery. Fits a 160×200 cm mattress. Wardrobe: chipboard body with 2 sliding doors. Nightstands and dresser in MDF with lake paint.',
      tr: 'Magna Modern Yatak Odası; gardırop, yataklı başlık, 2 komodin, şifonyer ve ayna içerir. Başlık ve karyola birinci sınıf kumaş döşemelidir. 160×200 cm şilteye uygundur. Gardırop: yonga levha gövde, 2 sürgülü kapı. Komodin ve şifonyer MDF üzeri lake boya.',
      ar: 'يشمل طقم غرفة النوم مودرن ماجنا خزانة وإطار سرير مع لوح رأس و2 طاولات سرير وخزانة أدراج ومرآة. لوح الرأس والسرير منجدان بقماش من الدرجة الأولى. مناسب لمرتبة 160×200 سم. الخزانة: جسم يونكا بابان منزلقان. طاولات السرير والشيفونيير بطلاء لاكيه على MDF.',
    },
    excerpt: {
      en: 'Complete modern bedroom set: wardrobe, bed, 2 nightstands, dresser, mirror. Fabric-upholstered bed frame.',
      tr: 'Eksiksiz modern yatak odası takımı: gardırop, karyola, 2 komodin, şifonyer, ayna. Kumaş döşemeli karyola.',
      ar: 'طقم غرفة نوم عصري كامل: خزانة، سرير، 2 كومودين، شيفونيير، مرآة. إطار سرير منجد بالقماش.',
    },
    tags: {
      en: 'Bedroom Set, Modern, Wardrobe, Bed, Dresser',
      tr: 'Yatak Odası Takımı, Modern, Gardırop, Karyola, Şifonyer',
      ar: 'طقم غرفة نوم، عصري، خزانة، سرير، شيفونيير',
    },
    specs: {
      en: [
        { label: 'Set Content', value: 'Wardrobe + Bed + 2 Nightstands + Dresser + Mirror' },
        { label: 'Upholstery', value: 'First-class fabric' },
        { label: 'Mattress Size', value: '160×200 cm' },
        { label: 'Wardrobe Body', value: 'Chipboard' },
        { label: 'Wardrobe Doors', value: '2 sliding doors' },
        { label: 'Nightstand / Dresser Material', value: 'MDF lake paint' },
        { label: 'Wardrobe Dimensions', value: '261×68×220 cm' },
        { label: 'Bed Dimensions', value: '250×216×120 cm' },
        { label: 'Nightstand Dimensions', value: '60×48×43 cm' },
      ],
      tr: [
        { label: 'Set İçeriği', value: 'Gardırop + Karyola + 2 Komodin + Şifonyer + Ayna' },
        { label: 'Döşeme', value: 'Birinci sınıf kumaş' },
        { label: 'Şilte Ölçüsü', value: '160×200 cm' },
        { label: 'Gardırop Gövdesi', value: 'Yonga levha' },
        { label: 'Gardırop Kapıları', value: '2 sürgülü kapı' },
        { label: 'Komodin/Şifonyer', value: 'MDF lake boya' },
        { label: 'Gardırop Ölçüsü', value: '261×68×220 cm' },
        { label: 'Karyola Ölçüsü', value: '250×216×120 cm' },
        { label: 'Komodin Ölçüsü', value: '60×48×43 cm' },
      ],
      ar: [
        { label: 'محتوى الطقم', value: 'خزانة + سرير + 2 كومودين + شيفونيير + مرآة' },
        { label: 'التنجيد', value: 'قماش درجة أولى' },
        { label: 'مقاس المرتبة', value: '160×200 سم' },
        { label: 'جسم الخزانة', value: 'لوح يونكا' },
        { label: 'أبواب الخزانة', value: 'بابان منزلقان' },
        { label: 'مادة الكومودين والشيفونيير', value: 'MDF طلاء لاكيه' },
        { label: 'أبعاد الخزانة', value: '261×68×220 سم' },
        { label: 'أبعاد السرير', value: '250×216×120 سم' },
        { label: 'أبعاد الكومودين', value: '60×48×43 سم' },
      ],
    },
  },
  {
    slug: 'osvin-luxury-bedroom-set',
    sku: 'BED-005',
    price: 3899,
    isNew: true,
    categorySlug: 'bed-room',
    imageUrl: 'https://witcdn.medusahome.com.tr/osvin-luxury-yatak-odasi-luxury-yatak-odasi-253892-36-B.jpg',
    imageReferer: 'https://www.medusahome.com.tr/',
    title: {
      en: 'Osvin Luxury Bedroom Set',
      tr: 'Osvin Luxury Yatak Odası',
      ar: 'طقم غرفة نوم لاكشري أوسفين',
    },
    description: {
      en: 'The Osvin Luxury Bedroom Set includes a wardrobe, bed with headboard, 2 nightstands, dresser, mirror, and laundry cabinet. All in first-class fabric upholstery with MDF lake-paint finish and CNC decorations. Fits 160×200 cm mattress.',
      tr: 'Osvin Luxury Yatak Odası; gardırop, yataklı karyola, 2 komodin, şifonyer, ayna ve çamaşırlık içerir. Tümü birinci sınıf kumaş döşeme, MDF lake boya ve CNC dekorasyonludur. 160×200 cm şilteye uygundur.',
      ar: 'يشمل طقم لاكشري أوسفين خزانة وسرير مع لوح رأس و2 كومودين وشيفونيير ومرآة وخزانة غسيل. الجميع بتنجيد قماش درجة أولى وطلاء لاكيه MDF مع نقوش CNC. يناسب مرتبة 160×200 سم.',
    },
    excerpt: {
      en: 'Luxury bedroom set with CNC decoration: wardrobe, bed, 2 nightstands, dresser, mirror, laundry cabinet.',
      tr: 'CNC dekorasyonlu lüks yatak odası: gardırop, karyola, 2 komodin, şifonyer, ayna, çamaşırlık.',
      ar: 'طقم غرفة نوم فاخر مع نقوش CNC: خزانة، سرير، 2 كومودين، شيفونيير، مرآة، خزانة غسيل.',
    },
    tags: {
      en: 'Bedroom Set, Luxury, CNC, Wardrobe, Bed',
      tr: 'Yatak Odası Takımı, Lüks, CNC, Gardırop, Karyola',
      ar: 'طقم غرفة نوم، فاخر، CNC، خزانة، سرير',
    },
    specs: {
      en: [
        { label: 'Set Content', value: 'Wardrobe + Bed + 2 Nightstands + Dresser + Mirror + Laundry Cabinet' },
        { label: 'Upholstery', value: 'First-class fabric' },
        { label: 'Mattress Size', value: '160×200 cm' },
        { label: 'Material', value: 'MDF lake paint + CNC decoration' },
        { label: 'Wardrobe Dimensions', value: '260×59×216 cm' },
        { label: 'Bed Dimensions', value: '208×221×115 cm' },
        { label: 'Nightstand Dimensions', value: '60×41×43 cm' },
        { label: 'Dresser Dimensions', value: '135×46×79 cm' },
        { label: 'Laundry Cabinet', value: '67×43×99 cm' },
      ],
      tr: [
        { label: 'Set İçeriği', value: 'Gardırop + Karyola + 2 Komodin + Şifonyer + Ayna + Çamaşırlık' },
        { label: 'Döşeme', value: 'Birinci sınıf kumaş' },
        { label: 'Şilte Ölçüsü', value: '160×200 cm' },
        { label: 'Malzeme', value: 'MDF lake boya + CNC dekor' },
        { label: 'Gardırop Ölçüsü', value: '260×59×216 cm' },
        { label: 'Karyola Ölçüsü', value: '208×221×115 cm' },
        { label: 'Komodin Ölçüsü', value: '60×41×43 cm' },
        { label: 'Şifonyer Ölçüsü', value: '135×46×79 cm' },
        { label: 'Çamaşırlık', value: '67×43×99 cm' },
      ],
      ar: [
        { label: 'محتوى الطقم', value: 'خزانة + سرير + 2 كومودين + شيفونيير + مرآة + خزانة غسيل' },
        { label: 'التنجيد', value: 'قماش درجة أولى' },
        { label: 'مقاس المرتبة', value: '160×200 سم' },
        { label: 'المادة', value: 'MDF طلاء لاكيه + نقوش CNC' },
        { label: 'أبعاد الخزانة', value: '260×59×216 سم' },
        { label: 'أبعاد السرير', value: '208×221×115 سم' },
        { label: 'أبعاد الكومودين', value: '60×41×43 سم' },
        { label: 'أبعاد الشيفونيير', value: '135×46×79 سم' },
        { label: 'خزانة الغسيل', value: '67×43×99 سم' },
      ],
    },
  },
  {
    slug: 'luvia-luxury-bedroom-set',
    sku: 'BED-006',
    price: 4499,
    isNew: true,
    categorySlug: 'bed-room',
    imageUrl: 'https://witcdn.medusahome.com.tr/luvia-yatak-odasi-luxury-yatak-odasi-253644-36-B.jpg',
    imageReferer: 'https://www.medusahome.com.tr/',
    title: {
      en: 'Luvia Luxury Bedroom Set',
      tr: 'Luvia Luxury Yatak Odası',
      ar: 'طقم غرفة نوم لاكشري لوفيا',
    },
    description: {
      en: 'The Luvia Luxury Bedroom Set offers a complete suite: wardrobe with 6 hinged doors, bed with headboard, 2 nightstands, dresser, dresser add-on, mirror, puf, laundry cabinet, and full-length mirror. All MDF lake paint with CNC decorations. Fits 160×200 cm mattress.',
      tr: 'Luvia Luxury Yatak Odası eksiksiz bir suite sunar: 6 menteşe kapılı gardırop, yataklı karyola, 2 komodin, şifonyer, şifonyer ek ünitesi, ayna, puf, çamaşırlık ve boy aynası. Tümü MDF lake boya ve CNC dekorasyonlu. 160×200 cm şilteye uygundur.',
      ar: 'يقدم طقم لاكشري لوفيا مجموعة متكاملة: خزانة بـ6 أبواب مفصلية، سرير مع لوح رأس، 2 كومودين، شيفونيير، إضافة شيفونيير، مرآة، بوف، خزانة غسيل ومرآة طول كامل. الجميع من MDF بطلاء لاكيه ونقوش CNC. يناسب مرتبة 160×200 سم.',
    },
    excerpt: {
      en: 'Full luxury bedroom suite with 9 pieces including 6-door wardrobe, puf, laundry cabinet, and full mirror.',
      tr: '6 kapılı gardırop, puf, çamaşırlık ve boy aynası dahil 9 parçalı tam lüks yatak odası seti.',
      ar: 'طقم غرفة نوم فاخر كامل 9 قطع يشمل خزانة 6 أبواب وبوف وخزانة غسيل ومرآة طول.',
    },
    tags: {
      en: 'Bedroom Set, Luxury, Full Suite, CNC, 9 Pieces',
      tr: 'Yatak Odası Takımı, Lüks, Tam Set, CNC, 9 Parça',
      ar: 'طقم غرفة نوم، فاخر، كامل، CNC، 9 قطع',
    },
    specs: {
      en: [
        { label: 'Set Content', value: 'Wardrobe + Bed + 2 Nightstands + Dresser + Add-on + Mirror + Puf + Laundry + Full Mirror' },
        { label: 'Wardrobe Doors', value: '6 hinged doors' },
        { label: 'Material', value: 'MDF lake paint + CNC decoration' },
        { label: 'Mattress Size', value: '160×200 cm' },
        { label: 'Wardrobe Dimensions', value: '260×59×215 cm' },
        { label: 'Bed Dimensions', value: '182×243×101 cm' },
        { label: 'Nightstand Dimensions', value: '60×43×42 cm' },
        { label: 'Dresser Dimensions', value: '144×43×75 cm' },
        { label: 'Laundry Cabinet', value: '60×43×75 cm' },
        { label: 'Full Mirror', value: '46×35×169 cm' },
      ],
      tr: [
        { label: 'Set İçeriği', value: 'Gardırop + Karyola + 2 Komodin + Şifonyer + Ek + Ayna + Puf + Çamaşırlık + Boy Aynası' },
        { label: 'Gardırop Kapıları', value: '6 menteşe kapı' },
        { label: 'Malzeme', value: 'MDF lake boya + CNC dekor' },
        { label: 'Şilte Ölçüsü', value: '160×200 cm' },
        { label: 'Gardırop Ölçüsü', value: '260×59×215 cm' },
        { label: 'Karyola Ölçüsü', value: '182×243×101 cm' },
        { label: 'Komodin Ölçüsü', value: '60×43×42 cm' },
        { label: 'Şifonyer Ölçüsü', value: '144×43×75 cm' },
        { label: 'Çamaşırlık', value: '60×43×75 cm' },
        { label: 'Boy Aynası', value: '46×35×169 cm' },
      ],
      ar: [
        { label: 'محتوى الطقم', value: 'خزانة + سرير + 2 كومودين + شيفونيير + إضافة + مرآة + بوف + غسيل + مرآة طول' },
        { label: 'أبواب الخزانة', value: '6 أبواب مفصلية' },
        { label: 'المادة', value: 'MDF طلاء لاكيه + نقوش CNC' },
        { label: 'مقاس المرتبة', value: '160×200 سم' },
        { label: 'أبعاد الخزانة', value: '260×59×215 سم' },
        { label: 'أبعاد السرير', value: '182×243×101 سم' },
        { label: 'أبعاد الكومودين', value: '60×43×42 سم' },
        { label: 'أبعاد الشيفونيير', value: '144×43×75 سم' },
        { label: 'خزانة الغسيل', value: '60×43×75 سم' },
        { label: 'مرآة طول كامل', value: '46×35×169 سم' },
      ],
    },
  },
]

// ────────────────────────────────────────────
// Route handler
// ────────────────────────────────────────────

export async function POST() {
  const payload = await getPayload()

  // Look up category IDs
  const catDocs = await payload.find({ collection: 'categories', limit: 20, depth: 0 })
  const categoryIdBySlug: Record<string, string | number> = {}
  for (const cat of catDocs.docs) {
    if (cat.slug) categoryIdBySlug[cat.slug] = cat.id
  }

  const results: { slug: string; status: string; id?: string | number }[] = []

  for (const p of NEW_PRODUCTS) {
    try {
      // Skip if already exists
      const existing = await payload.find({
        collection: 'products',
        where: { slug: { equals: p.slug } },
        limit: 1,
        depth: 0,
      })
      if (existing.docs.length > 0) {
        results.push({ slug: p.slug, status: 'skipped – already exists', id: existing.docs[0].id })
        continue
      }

      const catId = categoryIdBySlug[p.categorySlug]
      if (!catId) {
        results.push({ slug: p.slug, status: `skipped – category "${p.categorySlug}" not found` })
        continue
      }

      const imgId = await uploadImageFromUrl(payload, p.imageUrl, p.slug, {
        tr: p.title.tr,
        en: p.title.en,
        ar: p.title.ar,
      }, p.imageReferer)

      const created = await payload.create({
        collection: 'products',
        locale: 'en',
        data: {
          title: p.title.en,
          slug: p.slug,
          sku: p.sku,
          price: p.price,
          ...(p.salePrice ? { salePrice: p.salePrice } : {}),
          isNew: p.isNew ?? false,
          featured: p.featured ?? false,
          category: catId,
          tags: p.tags.en,
          description: p.description.en,
          excerpt: p.excerpt.en,
          images: [{ image: imgId }],
          specs: p.specs.en,
        },
      })

      for (const loc of ['tr', 'ar'] as const) {
        await payload.update({
          collection: 'products',
          id: created.id,
          locale: loc,
          data: {
            title: p.title[loc],
            tags: p.tags[loc],
            description: p.description[loc],
            excerpt: p.excerpt[loc],
            specs: p.specs[loc],
          },
        })
      }

      results.push({ slug: p.slug, status: 'created', id: created.id })
    } catch (err) {
      results.push({ slug: p.slug, status: `error: ${err instanceof Error ? err.message : String(err)}` })
    }
  }

  const created = results.filter((r) => r.status === 'created').length
  const skipped = results.filter((r) => r.status.startsWith('skipped')).length
  const errors = results.filter((r) => r.status.startsWith('error')).length

  return NextResponse.json({ success: true, summary: { created, skipped, errors }, results })
}
