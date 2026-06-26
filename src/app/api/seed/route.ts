import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'
import { getPayload } from '@/lib/getPayload'

const ASSETS = path.resolve(process.cwd(), 'seed-assets')

type LocalizedText = { tr: string; en: string; ar: string }

async function uploadImage(payload: Awaited<ReturnType<typeof getPayload>>, relPath: string, alt: LocalizedText) {
  const filePath = path.join(ASSETS, relPath)
  const data = await fs.readFile(filePath)
  const ext = path.extname(filePath)
  const flatName = relPath.replace(/[\\/]/g, '-').replace(ext, '')
  const filename = `${flatName}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
  const created = await payload.create({
    collection: 'media',
    data: { alt: alt.en },
    locale: 'en',
    file: {
      data,
      mimetype: ext === '.png' ? 'image/png' : 'image/webp',
      name: filename,
      size: data.length,
    },
  })
  // Update alt for other locales
  for (const loc of ['tr', 'ar'] as const) {
    await payload.update({
      collection: 'media',
      id: created.id,
      data: { alt: alt[loc] },
      locale: loc,
    })
  }
  return created.id
}

async function clearCollection(payload: Awaited<ReturnType<typeof getPayload>>, slug: 'media' | 'products' | 'categories' | 'posts') {
  const all = await payload.find({ collection: slug, limit: 1000, depth: 0 })
  for (const doc of all.docs) {
    await payload.delete({ collection: slug, id: doc.id }).catch(() => {})
  }
}

const CATEGORIES: { slug: string; name: LocalizedText; image: string }[] = [
  {
    slug: 'bed-room',
    name: { tr: 'Yatak Odası', en: 'Bed Room', ar: 'غرفة النوم' },
    image: 'categories/img-1.webp',
  },
  {
    slug: 'living-room',
    name: { tr: 'Oturma Odası', en: 'Living Room', ar: 'غرفة المعيشة' },
    image: 'categories/img-2.webp',
  },
  {
    slug: 'office',
    name: { tr: 'Ofis', en: 'Office', ar: 'مكتب' },
    image: 'categories/img-3.webp',
  },
  {
    slug: 'accessories',
    name: { tr: 'Aksesuarlar', en: 'Accessories', ar: 'إكسسوارات' },
    image: 'categories/img-4.webp',
  },
  {
    slug: 'kitchen-accessories',
    name: { tr: 'Mutfak Aksesuarları', en: 'Kitchen Accessories', ar: 'إكسسوارات المطبخ' },
    image: 'categories/img-5.webp',
  },
]

const PRODUCTS: {
  slug: string
  title: LocalizedText
  description: LocalizedText
  price: number
  salePrice?: number
  isNew?: boolean
  featured?: boolean
  categorySlug: string
  sku: string
  tags: LocalizedText
  image: string
}[] = [
  {
    slug: 'modern-dark-wood-chair',
    title: { tr: 'Modern Koyu Ahşap Sandalye', en: 'Modern Dark Wood Chair', ar: 'كرسي خشبي داكن عصري' },
    description: {
      tr: 'Klasik bir görünüme sahip, dayanıklı ahşap iskelet ve premium döşemeli sandalye.',
      en: 'A timeless chair with a sturdy wood frame and premium upholstery.',
      ar: 'كرسي بإطار خشبي متين وتنجيد فاخر بمظهر كلاسيكي خالد.',
    },
    price: 299,
    featured: true,
    categorySlug: 'living-room',
    sku: 'MDC-001',
    tags: { tr: 'Sandalye, Ahşap, Modern', en: 'Chair, Wood, Modern', ar: 'كرسي, خشب, عصري' },
    image: 'products/img-1.webp',
  },
  {
    slug: 'modular-sofa-with-wood',
    title: { tr: 'Ahşap Modüler Koltuk', en: 'Modular Sofa With Wood', ar: 'أريكة مودولية بالخشب' },
    description: {
      tr: 'Geniş aile alanları için modüler tasarım, derin oturma derinliği.',
      en: 'Modular design for spacious family areas with deep seating depth.',
      ar: 'تصميم مودولي للمساحات العائلية مع عمق جلوس مريح.',
    },
    price: 399,
    featured: true,
    categorySlug: 'living-room',
    sku: 'MSW-002',
    tags: { tr: 'Koltuk, Modüler', en: 'Sofa, Modular', ar: 'أريكة, مودولي' },
    image: 'products/img-2.webp',
  },
  {
    slug: 'modern-tolik-chair',
    title: { tr: 'Modern Tolik Sandalye', en: 'Modern Tolik Chair', ar: 'كرسي توليك العصري' },
    description: {
      tr: 'Ergonomik dikiz açısı ile minimalist çalışma sandalyesi.',
      en: 'Minimalist task chair with ergonomic recline.',
      ar: 'كرسي عمل بسيط مع مسند ظهر مريح.',
    },
    price: 199,
    isNew: true,
    featured: true,
    categorySlug: 'office',
    sku: 'MTC-003',
    tags: { tr: 'Sandalye, Ofis', en: 'Chair, Office', ar: 'كرسي, مكتب' },
    image: 'products/img-3.webp',
  },
  {
    slug: 'ergonomic-cabinet',
    title: { tr: 'Ergonomik Dolap', en: 'Ergonomic Cabinet', ar: 'خزانة مريحة' },
    description: {
      tr: 'Modern saklama çözümü, yumuşak kapanır çekmeceler.',
      en: 'Modern storage solution with soft-close drawers.',
      ar: 'حل تخزين عصري مع أدراج بإغلاق ناعم.',
    },
    price: 199,
    salePrice: 149.25,
    featured: true,
    categorySlug: 'bed-room',
    sku: 'EGC-004',
    tags: { tr: 'Dolap, Saklama', en: 'Cabinet, Storage', ar: 'خزانة, تخزين' },
    image: 'products/img-4.webp',
  },
  {
    slug: 'baxter-colette-chair',
    title: { tr: 'Baxter Colette Sandalye', en: 'Baxter Colette Chair', ar: 'كرسي باكستر كوليت' },
    description: {
      tr: 'Yumuşak, davetkâr forma sahip premium dolgu kumaş.',
      en: 'Premium plush fabric with a soft, inviting form.',
      ar: 'قماش فاخر مع شكل ناعم ومريح.',
    },
    price: 299,
    isNew: true,
    featured: true,
    categorySlug: 'living-room',
    sku: 'BCC-005',
    tags: { tr: 'Sandalye, Premium', en: 'Chair, Premium', ar: 'كرسي, فاخر' },
    image: 'products/img-5.webp',
  },
  {
    slug: 'modern-accent-chair',
    title: { tr: 'Modern Aksan Sandalye', en: 'Modern Accent Chair', ar: 'كرسي عصري بارز' },
    description: {
      tr: 'Krom döner ayaklı zarif ofis sandalyesi.',
      en: 'Elegant office chair with chrome swivel base.',
      ar: 'كرسي مكتب أنيق بقاعدة دوارة من الكروم.',
    },
    price: 199,
    featured: true,
    categorySlug: 'office',
    sku: 'MAC-006',
    tags: { tr: 'Sandalye, Ofis', en: 'Chair, Office', ar: 'كرسي, مكتب' },
    image: 'products/img-6.webp',
  },
  {
    slug: 'wooden-table-lamp',
    title: { tr: 'Ahşap Masa Lambası', en: 'Wooden Table Lamp', ar: 'مصباح طاولة خشبي' },
    description: {
      tr: 'Modern bir konsol için sıcak ahşap aksanlı masa lambası.',
      en: 'Table lamp with warm wood accents for a modern console.',
      ar: 'مصباح طاولة بلمسات خشبية دافئة لتزيين الكونسول.',
    },
    price: 199,
    salePrice: 149.25,
    featured: true,
    categorySlug: 'accessories',
    sku: 'WTL-007',
    tags: { tr: 'Lamba, Aksesuar', en: 'Lamp, Accessory', ar: 'مصباح, إكسسوار' },
    image: 'products/img-7.webp',
  },
  {
    slug: 'cherie-chair',
    title: { tr: 'Cherie Sandalye', en: 'Cherie Chair', ar: 'كرسي شيري' },
    description: {
      tr: 'Yumuşak nane yeşili döşeme ile rahat aksan sandalyesi ve puf.',
      en: 'Comfortable accent chair with ottoman in soft mint upholstery.',
      ar: 'كرسي مريح مع بوف بقماش نعناعي ناعم.',
    },
    price: 199,
    featured: true,
    categorySlug: 'living-room',
    sku: 'CHR-008',
    tags: { tr: 'Sandalye, Yeşil', en: 'Chair, Green', ar: 'كرسي, أخضر' },
    image: 'products/img-8.webp',
  },
]

export async function POST() {
  const payload = await getPayload()

  // Ensure an admin user exists
  const users = await payload.find({ collection: 'users', limit: 1 })
  if (!users.docs.length) {
    await payload.create({
      collection: 'users',
      data: {
        email: 'zkriahagmohamad@gmail.com',
        password: 'changeme123',
      },
    })
  }

  // Clear existing data
  await clearCollection(payload, 'products')
  await clearCollection(payload, 'categories')
  await clearCollection(payload, 'media')

  // Wipe media files on disk
  const mediaDir = path.resolve(process.cwd(), 'public/media')
  try {
    const files = await fs.readdir(mediaDir)
    await Promise.all(files.map((f) => fs.unlink(path.join(mediaDir, f)).catch(() => {})))
  } catch {
    /* dir may not exist */
  }

  // Categories
  const categoryIdBySlug: Record<string, string | number> = {}
  for (const cat of CATEGORIES) {
    const imgId = await uploadImage(payload, cat.image, cat.name)
    const created = await payload.create({
      collection: 'categories',
      locale: 'en',
      data: { name: cat.name.en, slug: cat.slug, image: imgId },
    })
    for (const loc of ['tr', 'ar'] as const) {
      await payload.update({
        collection: 'categories',
        id: created.id,
        locale: loc,
        data: { name: cat.name[loc] },
      })
    }
    categoryIdBySlug[cat.slug] = created.id
  }

  // Products
  for (const p of PRODUCTS) {
    const imgId = await uploadImage(payload, p.image, p.title)
    const created = await payload.create({
      collection: 'products',
      locale: 'en',
      data: {
        title: p.title.en,
        slug: p.slug,
        description: p.description.en,
        category: categoryIdBySlug[p.categorySlug],
        price: p.price,
        salePrice: p.salePrice,
        isNew: p.isNew ?? false,
        featured: p.featured ?? false,
        sku: p.sku,
        tags: p.tags.en,
        images: [{ image: imgId }],
      },
    })
    for (const loc of ['tr', 'ar'] as const) {
      await payload.update({
        collection: 'products',
        id: created.id,
        locale: loc,
        data: {
          title: p.title[loc],
          description: p.description[loc],
          tags: p.tags[loc],
        },
      })
    }
  }

  // Hero slides (3)
  const heroIds = await Promise.all([
    uploadImage(payload, 'hero/img-1.png', { tr: 'Modern sandalye', en: 'Modern chair', ar: 'كرسي عصري' }),
    uploadImage(payload, 'hero/img-2.png', { tr: 'Modern sandalye', en: 'Modern chair', ar: 'كرسي عصري' }),
    uploadImage(payload, 'hero/img-3.png', { tr: 'Modern sandalye', en: 'Modern chair', ar: 'كرسي عصري' }),
  ])

  // Promo banners (3)
  const banner1 = await uploadImage(payload, 'banners/img-1.webp', { tr: 'Büyük indirim', en: 'Big sale', ar: 'تخفيضات كبيرة' })
  const banner2 = await uploadImage(payload, 'banners/img-2.webp', { tr: 'Yeni dolap', en: 'New cabinet', ar: 'خزانة جديدة' })
  const banner3 = await uploadImage(payload, 'banners/slider-1.webp', { tr: 'Mobilya & Dekor', en: 'Furniture & Decor', ar: 'أثاث وديكور' })

  // Brand showcase
  const brandData = await Promise.all([1, 2, 3].map(async (i) => {
    const imgId = await uploadImage(payload, `brands/img-${i}.webp`, { tr: `Marka ${i}`, en: `Brand ${i}`, ar: `علامة ${i}` })
    const logoId = await uploadImage(payload, `brands/logo-${i}.webp`, { tr: `Marka ${i} logo`, en: `Brand ${i} logo`, ar: `شعار ${i}` })
    return { name: ['Tangem', 'Texas Instruments', 'Go Pass'][i - 1], image: imgId, logo: logoId }
  }))

  // Collaborators (5 partners)
  const collaboratorData = await Promise.all([1, 2, 3, 4, 5].map(async (i) => {
    const logoId = await uploadImage(payload, `collaborators/img-${i}.webp`, {
      tr: `İş ortağı ${i}`,
      en: `Partner ${i}`,
      ar: `شريك ${i}`,
    })
    return { name: ['Finova', 'Navana', 'Net2000', 'Hemera', 'Accpac'][i - 1], logo: logoId }
  }))

  // Avatars
  const av1 = await uploadImage(payload, 'avatars/user-1.webp', { tr: 'Liam', en: 'Liam', ar: 'ليام' })
  const av2 = await uploadImage(payload, 'avatars/user-2.webp', { tr: 'Jon', en: 'Jon', ar: 'جون' })

  // Homepage Global - non-localized fields shared across locales
  const heroSlideTitles: Record<'en' | 'tr' | 'ar', { title: string; subtitle: string; ctaLabel: string }[]> = {
    en: [
      { title: 'Modern Furniture\nfor Every Space', subtitle: 'Showcase your furniture collections in the most appealing way.', ctaLabel: 'Shop Now' },
      { title: 'Crafted for\nComfort & Style', subtitle: 'Discover handcrafted pieces designed for everyday luxury.', ctaLabel: 'Explore' },
      { title: 'Bring Your Space\nto Life', subtitle: 'Premium materials, timeless design, lasting craftsmanship.', ctaLabel: 'View Collection' },
    ],
    tr: [
      { title: 'Her Mekân İçin\nModern Mobilyalar', subtitle: 'Mobilya koleksiyonlarınızı en çekici şekilde sergileyin.', ctaLabel: 'Şimdi Alışveriş Yap' },
      { title: 'Konfor ve Tarz İçin\nÖzel Üretim', subtitle: 'Günlük lüks için tasarlanmış el yapımı parçalar keşfedin.', ctaLabel: 'Keşfet' },
      { title: 'Mekânınıza\nHayat Verin', subtitle: 'Premium malzemeler, zamansız tasarım, kalıcı işçilik.', ctaLabel: 'Koleksiyonu Gör' },
    ],
    ar: [
      { title: 'أثاث عصري\nلكل مكان', subtitle: 'اعرض مجموعات أثاثك بأكثر الطرق جاذبية.', ctaLabel: 'تسوّق الآن' },
      { title: 'مصنوع للراحة\nوالأناقة', subtitle: 'اكتشف قطعًا مصنوعة يدويًا مصممة للفخامة اليومية.', ctaLabel: 'استكشف' },
      { title: 'امنح مساحتك\nالحياة', subtitle: 'مواد فاخرة، تصميم خالد، حرفية دائمة.', ctaLabel: 'عرض المجموعة' },
    ],
  }

  const bannerTitles: Record<'en' | 'tr' | 'ar', { eyebrow: string; title: string }[]> = {
    en: [
      { eyebrow: 'BIG SALE', title: 'Up To 70% Off\nFurniture & Decor' },
      { eyebrow: 'NEW PRODUCTS', title: 'Up To 25% Off Cabinet' },
      { eyebrow: '', title: 'Up To 70% Off Furniture & Decor' },
    ],
    tr: [
      { eyebrow: 'BÜYÜK İNDİRİM', title: "Mobilyada %70'e\nVaran İndirim" },
      { eyebrow: 'YENİ ÜRÜNLER', title: "Dolapta %25'e Varan İndirim" },
      { eyebrow: '', title: 'Mobilya ve Dekorda %70 İndirim' },
    ],
    ar: [
      { eyebrow: 'تخفيضات كبيرة', title: 'حتى 70% خصم على\nالأثاث والديكور' },
      { eyebrow: 'منتجات جديدة', title: 'حتى 25% خصم على الخزائن' },
      { eyebrow: '', title: 'حتى 70% خصم على الأثاث والديكور' },
    ],
  }

  const testimonialBase = [
    {
      name: 'Liam Smith',
      stars: 5,
      avatar: av1,
      role: { en: 'Co-Founder', tr: 'Kurucu Ortak', ar: 'شريك مؤسس' },
      text: {
        en: "I am thrilled with my new living Mobilyam. The quality of furniture is outstanding, the customization option allowed me get exactly what I wanted. Customer support team was incredibly helpful. Highly recommend!",
        tr: 'Yeni Mobilyam koltuk takımımdan çok memnunum. Kalitesi mükemmel ve müşteri desteği inanılmaz yardımcı oldu. Kesinlikle tavsiye ederim!',
        ar: 'أنا متحمس جدًا لأثاثي الجديد من موبيليام. الجودة استثنائية وفريق الدعم كان مفيدًا للغاية.',
      },
    },
    {
      name: 'Jon Deo',
      stars: 5,
      avatar: av2,
      role: { en: 'CEO, Net2000', tr: 'CEO, Net2000', ar: 'الرئيس التنفيذي، Net2000' },
      text: {
        en: 'Absolutely love my recent purchase from Mobilyam! The craftsmanship is superb — you can tell these pieces are built to last. The delivery was smooth and efficient.',
        tr: "Mobilyam'dan son alışverişim harikaydı! İşçilik birinci sınıf — bu parçaların uzun ömürlü olduğunu hissedebiliyorsunuz.",
        ar: 'أحببت بشدة شرائي الأخير من موبيليام! الحرفية رائعة — يمكنك أن ترى أن هذه القطع مصنوعة لتدوم.',
      },
    },
  ]

  const announcementByLoc: Record<'en' | 'tr' | 'ar', string> = {
    en: '15% off first order — sign up today!',
    tr: 'İlk siparişinizde %15 indirim — bugün kaydolun!',
    ar: 'خصم 15% على أول طلب — سجّل اليوم!',
  }

  const newsletterByLoc: Record<'en' | 'tr' | 'ar', { heading: string; placeholder: string; buttonLabel: string }> = {
    en: {
      heading: 'Signing up is easy! Just enter your email address\nand become a part of the Mobilyam family.',
      placeholder: 'Your email address',
      buttonLabel: 'Subscribe',
    },
    tr: {
      heading: 'Kayıt olmak çok kolay! E-posta adresinizi girin ve\nMobilyam ailesinin bir parçası olun.',
      placeholder: 'E-posta adresiniz',
      buttonLabel: 'Abone Ol',
    },
    ar: {
      heading: 'التسجيل سهل! أدخل بريدك الإلكتروني\nوكن جزءًا من عائلة موبيليام.',
      placeholder: 'بريدك الإلكتروني',
      buttonLabel: 'اشترك',
    },
  }

  const contactCtaByLoc: Record<'en' | 'tr' | 'ar', { title: string; subtitle: string }> = {
    en: { title: 'Get in Touch With Us', subtitle: 'We are always here to answer your questions.' },
    tr: { title: 'Bizimle İletişime Geçin', subtitle: 'Sorularınız için her zaman buradayız.' },
    ar: { title: 'تواصل معنا', subtitle: 'نحن هنا دائمًا للإجابة على استفساراتك.' },
  }

  type ArrayIdSet = { heroSlides: string[]; promoBanners: string[]; testimonials: string[] }

  const buildHomepageData = (loc: 'en' | 'tr' | 'ar', ids?: ArrayIdSet) => ({
    announcement: announcementByLoc[loc],
    heroSlides: heroSlideTitles[loc].map((s, i) => ({
      ...(ids ? { id: ids.heroSlides[i] } : {}),
      ...s,
      image: heroIds[i],
    })),
    promoBanners: bannerTitles[loc].map((b, i) => ({
      ...(ids ? { id: ids.promoBanners[i] } : {}),
      ...b,
      image: [banner1, banner2, banner3][i],
      background: ['amber', 'teal', 'gray'][i],
    })),
    brands: brandData,
    testimonials: testimonialBase.map((t, i) => ({
      ...(ids ? { id: ids.testimonials[i] } : {}),
      name: t.name,
      stars: t.stars,
      avatar: t.avatar,
      role: t.role[loc],
      text: t.text[loc],
    })),
    collaborators: collaboratorData,
    newsletter: newsletterByLoc[loc],
    contactCta: contactCtaByLoc[loc],
  })

  // First pass: save EN to allocate IDs
  await payload.updateGlobal({ slug: 'homepage', locale: 'en', data: buildHomepageData('en') })
  const enHome = await payload.findGlobal({ slug: 'homepage', locale: 'en', depth: 0 })
  const ids: ArrayIdSet = {
    heroSlides: (enHome.heroSlides ?? []).map((s) => String(s.id)),
    promoBanners: (enHome.promoBanners ?? []).map((s) => String(s.id)),
    testimonials: (enHome.testimonials ?? []).map((s) => String(s.id)),
  }
  // Second pass: TR and AR with same IDs to update localized fields in place
  for (const loc of ['tr', 'ar'] as const) {
    await payload.updateGlobal({ slug: 'homepage', locale: loc, data: buildHomepageData(loc, ids) })
  }

  // Contact Info
  const contactPayload = {
    en: {
      companyDescription: 'Mobilyam provides the essential pieces to build a stunning interior for your home and business.',
      phone: '+90 212 000 00 00',
      email: 'info@mobilyam.com',
      address: 'Furniture Street No:1, Istanbul, Turkey',
      hoursValue: 'Monday - Saturday: 09:00 - 18:00',
    },
    tr: {
      companyDescription: 'Mobilyam, eviniz ve işyeriniz için göz alıcı iç mekânlar oluşturmak için gerekli parçaları sunar.',
      phone: '+90 212 000 00 00',
      email: 'info@mobilyam.com',
      address: 'Mobilya Caddesi No:1, İstanbul, Türkiye',
      hoursValue: 'Pazartesi - Cumartesi: 09:00 - 18:00',
    },
    ar: {
      companyDescription: 'موبيليام يوفر القطع الأساسية لبناء ديكور داخلي مذهل لمنزلك وعملك.',
      phone: '+90 212 000 00 00',
      email: 'info@mobilyam.com',
      address: 'شارع الأثاث رقم ١، إسطنبول، تركيا',
      hoursValue: 'الاثنين - السبت: ٩:٠٠ - ١٨:٠٠',
    },
  } as const

  await payload.updateGlobal({ slug: 'contact-info', locale: 'en', data: contactPayload.en })
  await payload.updateGlobal({ slug: 'contact-info', locale: 'tr', data: contactPayload.tr })
  await payload.updateGlobal({ slug: 'contact-info', locale: 'ar', data: contactPayload.ar })

  // Site Settings
  const navByLoc: Record<'en' | 'tr' | 'ar', { label: string; href: string }[]> = {
    en: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    tr: [
      { label: 'Ana Sayfa', href: '/' },
      { label: 'Ürünler', href: '/products' },
      { label: 'Hakkımızda', href: '/about' },
      { label: 'İletişim', href: '/contact' },
    ],
    ar: [
      { label: 'الرئيسية', href: '/' },
      { label: 'المنتجات', href: '/products' },
      { label: 'من نحن', href: '/about' },
      { label: 'اتصل بنا', href: '/contact' },
    ],
  }
  const settingsLocByLoc: Record<'en' | 'tr' | 'ar', {
    siteName: string
    tagline: string
    metaTitle: string
    metaDescription: string
    metaKeywords: string
  }> = {
    en: {
      siteName: 'Mobilyam',
      tagline: 'Modern Furniture for Every Space',
      metaTitle: 'Mobilyam — Modern Furniture for Every Space',
      metaDescription: 'Premium furniture and decor for your home and office.',
      metaKeywords: 'furniture, home decor, office furniture, modern furniture',
    },
    tr: {
      siteName: 'Mobilyam',
      tagline: 'Her Mekân İçin Modern Mobilyalar',
      metaTitle: 'Mobilyam — Her Mekân İçin Modern Mobilyalar',
      metaDescription: 'Eviniz ve ofisiniz için premium mobilya ve dekorasyon.',
      metaKeywords: 'mobilya, ev dekorasyonu, ofis mobilyası, modern mobilya',
    },
    ar: {
      siteName: 'موبيليام',
      tagline: 'أثاث عصري لكل مكان',
      metaTitle: 'موبيليام — أثاث عصري لكل مكان',
      metaDescription: 'أثاث وديكور فاخر لمنزلك ومكتبك.',
      metaKeywords: 'أثاث, ديكور منزلي, أثاث مكتبي, أثاث عصري',
    },
  }

  const defaultLanguages = [
    { code: 'tr', enabled: true, isDefault: true },
    { code: 'en', enabled: true, isDefault: false },
    { code: 'ar', enabled: true, isDefault: false },
  ]

  // First save EN to allocate IDs
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: {
      ...settingsLocByLoc.en,
      navMenu: navByLoc.en,
      languages: defaultLanguages,
      gaMeasurementId: '',
      gtmId: '',
      facebookPixelId: '',
      aiProvider: 'gemini',
      aiApiKey: '',
      aiModel: '',
      resendApiKey: '',
      fromName: 'Mobilyam',
      fromEmail: '',
      notificationEmail: '',
      instagram: '',
      facebook: '',
      twitter: '',
      linkedin: '',
      youtube: '',
    },
  })
  const enSettings = await payload.findGlobal({ slug: 'site-settings', locale: 'en', depth: 0 })
  const navIds = (enSettings.navMenu ?? []).map((m) => String(m.id))
  for (const loc of ['tr', 'ar'] as const) {
    await payload.updateGlobal({
      slug: 'site-settings',
      locale: loc,
      data: {
        ...settingsLocByLoc[loc],
        navMenu: navByLoc[loc].map((m, i) => ({ id: navIds[i], ...m })),
      },
    })
  }

  // Sample blog posts
  await clearCollection(payload, 'posts').catch(() => {})
  const blogTopics = [
    {
      slug: 'choosing-a-perfect-chair',
      cover: 'blog/blog-1.webp',
      category: { en: 'Office Furniture', tr: 'Ofis Mobilyası', ar: 'أثاث المكتب' },
      title: {
        en: 'Comfortable Chairs for Your Home Office',
        tr: 'Ev Ofisiniz İçin Konforlu Sandalyeler',
        ar: 'كراسي مريحة لمكتبك المنزلي',
      },
      excerpt: {
        en: 'A great chair changes how you work — discover what to look for in ergonomics, materials, and design.',
        tr: 'İyi bir sandalye çalışma şeklinizi değiştirir — ergonomi, malzeme ve tasarımda nelere dikkat etmelisiniz.',
        ar: 'الكرسي الجيد يغيّر طريقة عملك — اكتشف ما يجب البحث عنه في الإرغونوميا والمواد والتصميم.',
      },
      body: {
        en: 'Your office chair is the single most important piece of furniture in your workspace. Look for adjustable lumbar support, breathable upholstery, and a base that swivels smoothly.',
        tr: 'Ofis sandalyeniz, çalışma alanınızdaki en önemli mobilyadır. Ayarlanabilir bel desteği, nefes alabilen döşeme ve sorunsuz dönen bir taban arayın.',
        ar: 'كرسي المكتب هو القطعة الأهم في مساحة عملك. ابحث عن دعم قطني قابل للتعديل وتنجيد قابل للتنفس وقاعدة دوارة بسلاسة.',
      },
    },
    {
      slug: 'choosing-furniture-for-your-home',
      cover: 'blog/blog-2.webp',
      category: { en: 'Home Decor', tr: 'Ev Dekorasyonu', ar: 'ديكور المنزل' },
      title: {
        en: 'The Ultimate Guide to Choosing Perfect Furniture',
        tr: 'Mükemmel Mobilya Seçiminin Eksiksiz Rehberi',
        ar: 'الدليل الكامل لاختيار الأثاث المثالي',
      },
      excerpt: {
        en: 'Match scale, materials, and palette so every piece in your home feels intentional.',
        tr: 'Ölçeği, malzemeyi ve paleti eşleştirin — evdeki her parça özenli görünsün.',
        ar: 'وفّق بين الحجم والمواد واللوحة اللونية لتبدو كل قطعة في منزلك مدروسة.',
      },
      body: {
        en: 'Start with the largest piece in the room (usually the sofa) and build outward. Mix two textures, no more than three woods, and one accent color throughout the space.',
        tr: 'Odadaki en büyük parça ile başlayın (genellikle koltuk) ve dışa doğru büyütün. İki doku, en fazla üç ahşap tonu ve mekân boyunca tek bir aksan rengi karıştırın.',
        ar: 'ابدأ بأكبر قطعة في الغرفة (عادة الأريكة) ثم تدرّج للخارج. امزج بين قوامين، وما لا يزيد عن ثلاثة أخشاب، ولون مميز واحد في جميع أنحاء المساحة.',
      },
    },
    {
      slug: 'small-space-styling',
      cover: 'blog/blog-3.webp',
      category: { en: 'Home Decor', tr: 'Ev Dekorasyonu', ar: 'ديكور المنزل' },
      title: {
        en: 'Smart Styling for Small Spaces',
        tr: 'Küçük Mekânlar İçin Akıllı Stil',
        ar: 'تنسيق ذكي للمساحات الصغيرة',
      },
      excerpt: {
        en: 'Multifunctional pieces, vertical storage, and clever lighting can transform a tight room.',
        tr: 'Çok fonksiyonlu parçalar, dikey depolama ve akıllı aydınlatma dar bir odayı dönüştürebilir.',
        ar: 'القطع متعددة الاستخدامات والتخزين العمودي والإضاءة الذكية يمكن أن تحوّل غرفة ضيقة.',
      },
      body: {
        en: 'In a small room, every piece should earn its place. Pick a sofa with hidden storage, a coffee table that lifts to a workstation, and shelving that goes vertical instead of wide.',
        tr: 'Küçük bir odada her parça yerini hak etmelidir. Gizli depolu bir koltuk, çalışma tezgâhına yükselen bir sehpa ve genişlik yerine yüksekliğe giden raflar seçin.',
        ar: 'في غرفة صغيرة، يجب أن تستحق كل قطعة مكانها. اختر أريكة بتخزين مخفي وطاولة قهوة ترتفع لتصبح طاولة عمل ورفوفًا تمتد عموديًا بدلاً من العرض.',
      },
    },
  ]

  for (const post of blogTopics) {
    const coverId = await uploadImage(payload, post.cover, post.title)
    const created = await payload.create({
      collection: 'posts',
      locale: 'en',
      data: {
        title: post.title.en,
        slug: post.slug,
        cover: coverId,
        category: post.category.en,
        excerpt: post.excerpt.en,
        body: post.body.en,
        author: 'Anna Maria',
        publishedAt: new Date().toISOString(),
        featured: true,
      },
    })
    for (const loc of ['tr', 'ar'] as const) {
      await payload.update({
        collection: 'posts',
        id: created.id,
        locale: loc,
        data: {
          title: post.title[loc],
          category: post.category[loc],
          excerpt: post.excerpt[loc],
          body: post.body[loc],
        },
      })
    }
  }

  return NextResponse.json({
    ok: true,
    counts: {
      categories: CATEGORIES.length,
      products: PRODUCTS.length,
      brands: brandData.length,
      collaborators: collaboratorData.length,
    },
  })
}
