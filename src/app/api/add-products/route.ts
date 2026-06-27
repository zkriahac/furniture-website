import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'
import { getPayload } from '@/lib/getPayload'

type LocalizedText = { tr: string; en: string; ar: string }
type SpecRow = { label: string; value: string }

const ASSETS = path.resolve(process.cwd(), 'seed-assets')

// Upload from local disk (used for hero images)
async function uploadImageFromDisk(
  payload: Awaited<ReturnType<typeof getPayload>>,
  relPath: string,
  alt: LocalizedText,
) {
  const filePath = path.join(ASSETS, relPath)
  const data = await fs.readFile(filePath)
  const ext = path.extname(filePath)
  const flatName = relPath.replace(/[\\/]/g, '-').replace(ext, '')
  const filename = `${flatName}-${Date.now()}${ext}`
  const created = await payload.create({
    collection: 'media',
    data: { alt: alt.en },
    locale: 'en',
    file: { data, mimetype: ext === '.png' ? 'image/png' : 'image/webp', name: filename, size: data.length },
  })
  for (const loc of ['tr', 'ar'] as const) {
    await payload.update({ collection: 'media', id: created.id, data: { alt: alt[loc] }, locale: loc })
  }
  return created.id
}

// Download from URL and upload to Payload/R2
async function uploadImageFromUrl(
  payload: Awaited<ReturnType<typeof getPayload>>,
  url: string,
  slug: string,
  alt: LocalizedText,
) {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Referer: 'https://www.otto.de/',
    },
  })
  if (!res.ok) throw new Error(`Failed to fetch image ${url}: ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const urlPath = new URL(url).pathname
  const ext = path.extname(urlPath).toLowerCase() || '.jpg'
  const filename = `${slug}-${Date.now()}${ext}`
  const mimetype =
    ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'
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

// ────────────────────────────────────────────
// Product data
// ────────────────────────────────────────────

type NewProduct = {
  slug: string
  sku: string
  price: number
  salePrice?: number
  isNew?: boolean
  featured?: boolean
  categorySlug: string
  imageUrl: string
  title: LocalizedText
  description: LocalizedText
  excerpt: LocalizedText
  tags: LocalizedText
  specs: { en: SpecRow[]; tr: SpecRow[]; ar: SpecRow[] }
}

const NEW_PRODUCTS: NewProduct[] = [
  // ── SOFAS ──────────────────────────────────────────────────────────────────
  {
    slug: 'mks-mobel-peter-l-corner-sofa',
    sku: 'SOF-001',
    price: 1299,
    featured: true,
    categorySlug: 'living-room',
    imageUrl:
      'https://i.otto.de/i/otto/ae41f14c-e6d3-5ac2-86b1-dcd67c6c92b3/mks-mobel-ecksofa-peter-l-set-ecksofa-l-form-hr35-schaum-wellenfederkern-bettfunktion-einstellbare-kopfstutzen-bettkasten-dunkelgrau-matana.jpg',
    title: {
      en: 'PETER L Corner Sofa',
      tr: 'PETER L Köşe Koltuk',
      ar: 'أريكة زاوية PETER L',
    },
    description: {
      en: 'The PETER corner sofa presents itself in a stylish L-shape, offering both visual and functional highlights. Available in right or left-hand configuration, it combines aesthetic design, comfort, and practical functions. Featuring HR35 foam and wave spring core for superior seating comfort. Dimensions: Width 273 cm, Depth 208 cm, Height 76 cm, Seat height 50 cm, Sleeping surface 125×200 cm.',
      tr: 'PETER köşe koltuk, görsel ve işlevsel özellikler sunarak şık L-şeklinde karşınıza çıkar. Sağ veya sol konfigürasyonda mevcut olup estetik tasarım, konfor ve pratik işlevleri bir araya getirir. Üstün oturma konforu için HR35 köpük ve dalga yay çekirdeği içerir. Ölçüler: Genişlik 273 cm, Derinlik 208 cm, Yükseklik 76 cm, Oturma yüksekliği 50 cm, Uyku yüzeyi 125×200 cm.',
      ar: 'تتميز أريكة الزاوية PETER بشكلها الأنيق على هيئة حرف L، مما يوفر مميزات بصرية ووظيفية رائعة. متوفرة بتهيئة يمنى أو يسرى، تجمع بين التصميم الجمالي والراحة والوظائف العملية. مزودة برغوة HR35 ونابض موجي لراحة جلوس فائقة. الأبعاد: العرض 273 سم، العمق 208 سم، الارتفاع 76 سم، ارتفاع المقعد 50 سم، سطح النوم 125×200 سم.',
    },
    excerpt: {
      en: 'Stylish L-shaped corner sofa with sleeping function and HR35 foam comfort. Left or right configuration available.',
      tr: 'HR35 köpük konforuyla uyku fonksiyonlu şık L-şekilli köşe koltuk. Sol veya sağ yapılandırmada mevcuttur.',
      ar: 'أريكة زاوية بشكل L أنيق مع وظيفة النوم ورغوة HR35. متوفرة بتهيئة يمنى أو يسرى.',
    },
    tags: {
      en: 'Sofa, Corner Sofa, L-Shape, Sleeping Function',
      tr: 'Kanepe, Köşe Koltuk, L Şekil, Uyku Fonksiyonu',
      ar: 'أريكة، أريكة زاوية، شكل L، وظيفة النوم',
    },
    specs: {
      en: [
        { label: 'Shape', value: 'L-Shape (Corner Sofa)' },
        { label: 'Upholstery', value: 'HR35 Foam, Wave Spring Core' },
        { label: 'Sleeping Function', value: 'Yes – sleeping surface 125×200 cm' },
        { label: 'Configuration', value: 'Left or Right' },
        { label: 'Width', value: '273 cm' },
        { label: 'Depth', value: '208 cm' },
        { label: 'Height', value: '76 cm' },
        { label: 'Seat Height', value: '50 cm' },
      ],
      tr: [
        { label: 'Şekil', value: 'L-Şekli (Köşe Koltuk)' },
        { label: 'Döşeme', value: 'HR35 Köpük, Dalga Yay Çekirdeği' },
        { label: 'Uyku Fonksiyonu', value: 'Evet – uyku yüzeyi 125×200 cm' },
        { label: 'Yapılandırma', value: 'Sol veya Sağ' },
        { label: 'Genişlik', value: '273 cm' },
        { label: 'Derinlik', value: '208 cm' },
        { label: 'Yükseklik', value: '76 cm' },
        { label: 'Oturma Yüksekliği', value: '50 cm' },
      ],
      ar: [
        { label: 'الشكل', value: 'شكل L (أريكة زاوية)' },
        { label: 'التنجيد', value: 'رغوة HR35، نابض موجي' },
        { label: 'وظيفة النوم', value: 'نعم – سطح النوم 125×200 سم' },
        { label: 'التهيئة', value: 'يمنى أو يسرى' },
        { label: 'العرض', value: '273 سم' },
        { label: 'العمق', value: '208 سم' },
        { label: 'الارتفاع', value: '76 سم' },
        { label: 'ارتفاع المقعد', value: '50 سم' },
      ],
    },
  },
  {
    slug: 'altdecor-eskar-l-corner-sofa',
    sku: 'SOF-002',
    price: 899,
    isNew: true,
    categorySlug: 'living-room',
    imageUrl:
      'https://i.otto.de/i/otto/615f8d21-49d1-59f0-899d-c17dd1091121/altdecor-ecksofa-eskar-l-couch-mit-schlaffunktion-wohnzimmer-wohnlandschaft-corner-sofa-bett-eckcouch-couch-l-form-schlafcouch-ausziehbar-rosa-poso-145.jpg',
    title: {
      en: 'ESKAR-L Corner Sofa with Sleeping Function',
      tr: 'ESKAR-L Uyku Fonksiyonlu Köşe Koltuk',
      ar: 'أريكة زاوية ESKAR-L بوظيفة النوم',
    },
    description: {
      en: 'A modern upholstered corner sofa with sleeping function, offering high comfort for sitting, lying, and sleeping. Available in left or right-sided L-shape configuration. Elegant feet give the sofa a visual lightness. Features a robust pull-out mechanism for easy conversion to a sleeping surface. Ideal for living rooms and lounges.',
      tr: 'Uyku fonksiyonlu modern döşemeli köşe koltuk, oturma, uzanma ve uyuma için yüksek konfor sunar. Sol veya sağ L-şekli konfigürasyonunda mevcuttur. Zarif ayaklar koltuka görsel hafiflik kazandırır. Kolay yatağa dönüştürme için sağlam açılır mekanizma. Oturma odaları ve salonlar için idealdir.',
      ar: 'أريكة زاوية منجدة حديثة بوظيفة النوم، توفر راحة عالية للجلوس والاستلقاء والنوم. متوفرة بتهيئة يمنى أو يسرى على شكل حرف L. تمنح الأرجل الأنيقة الأريكة خفة بصرية مميزة. تتميز بآلية سحب قوية لسهولة التحويل إلى سطح للنوم. مثالية لغرف المعيشة والصالات.',
    },
    excerpt: {
      en: 'Modern L-shaped corner sofa with pull-out sleeping function and elegant feet. Left or right configuration available.',
      tr: 'Açılır uyku fonksiyonlu ve zarif ayaklı modern L-şekilli köşe koltuk.',
      ar: 'أريكة زاوية حديثة بشكل L مع آلية سحب ووظيفة نوم وأرجل أنيقة.',
    },
    tags: {
      en: 'Sofa, Corner Sofa, Sleeping Function, Modern',
      tr: 'Kanepe, Köşe Koltuk, Uyku Fonksiyonu, Modern',
      ar: 'أريكة، أريكة زاوية، وظيفة النوم، عصري',
    },
    specs: {
      en: [
        { label: 'Shape', value: 'L-Shape (Corner Sofa)' },
        { label: 'Sleeping Function', value: 'Yes – extendable pull-out mechanism' },
        { label: 'Configuration', value: 'Left or Right' },
        { label: 'Style', value: 'Modern with decorative cushions' },
      ],
      tr: [
        { label: 'Şekil', value: 'L-Şekli (Köşe Koltuk)' },
        { label: 'Uyku Fonksiyonu', value: 'Evet – uzatılabilir açılır mekanizma' },
        { label: 'Yapılandırma', value: 'Sol veya Sağ' },
        { label: 'Stil', value: 'Dekoratif yastıklı modern' },
      ],
      ar: [
        { label: 'الشكل', value: 'شكل L (أريكة زاوية)' },
        { label: 'وظيفة النوم', value: 'نعم – آلية سحب قابلة للتمديد' },
        { label: 'التهيئة', value: 'يمنى أو يسرى' },
        { label: 'الأسلوب', value: 'حديث مع وسادات زخرفية' },
      ],
    },
  },
  {
    slug: 'otto-home-onniko-cord-sofa-bed',
    sku: 'SOF-003',
    price: 699,
    categorySlug: 'living-room',
    imageUrl:
      'https://i.otto.de/i/otto/a6f53fbc-6d25-5a59-a9e2-dbd98653e676/otto-home-schlafsofa-onniko-cord-breite-192-cm-liegeflache-121x192-cm-softer-cord-bezug-mit-bettfunktion-bettkasten-creme.jpg',
    title: {
      en: 'ONNIKO Cord Sofa Bed',
      tr: 'ONNIKO Kord Yataklı Kanepe',
      ar: 'أريكة سرير ONNIKO كورد',
    },
    description: {
      en: 'The ONNIKO Cord sofa bed from OTTO home comes with a matching back cushion for added comfort. The soft cord fabric gives it a cozy, modern feel. Load capacity up to 110 kg per seat. Practical storage box underneath. Width 192 cm, sleeping surface 121×192 cm. Perfect for modern living rooms.',
      tr: 'OTTO home\'dan ONNIKO Kord yataklı kanepe, ekstra konfor için uyumlu bir sırt minderiyle birlikte gelir. Yumuşak kord kumaş sıcak, modern bir his verir. Her koltuk için 110 kg\'a kadar yük kapasitesi. Altında pratik depolama kutusu. Genişlik 192 cm, uyku yüzeyi 121×192 cm. Modern oturma odaları için mükemmeldir.',
      ar: 'تأتي أريكة سرير ONNIKO كورد من OTTO home مع وسادة خلفية مطابقة لراحة إضافية. يمنح القماش الكوردوري الناعم لمسة دافئة وعصرية. الحمولة حتى 110 كغ لكل مقعد. صندوق تخزين عملي أسفل الأريكة. العرض 192 سم، سطح النوم 121×192 سم. مثالية لغرف المعيشة العصرية.',
    },
    excerpt: {
      en: 'Cozy cord sofa bed with storage box, 192 cm wide and 110 kg load capacity per seat.',
      tr: 'Depolama kutulu rahat kord yataklı kanepe, 192 cm genişlik ve 110 kg yük kapasitesi.',
      ar: 'أريكة سرير مريحة من الكورد مع صندوق تخزين، عرض 192 سم وحمولة 110 كغ لكل مقعد.',
    },
    tags: {
      en: 'Sofa Bed, Cord, Storage, Modern',
      tr: 'Yataklı Kanepe, Kord, Depolama, Modern',
      ar: 'أريكة سرير، كورد، تخزين، عصري',
    },
    specs: {
      en: [
        { label: 'Width', value: '192 cm' },
        { label: 'Sleeping Surface', value: '121×192 cm' },
        { label: 'Cover Material', value: 'Cord (Corduroy)' },
        { label: 'Sleeping Function', value: 'Yes' },
        { label: 'Storage Box', value: 'Yes' },
        { label: 'Load Capacity per Seat', value: '110 kg' },
      ],
      tr: [
        { label: 'Genişlik', value: '192 cm' },
        { label: 'Uyku Yüzeyi', value: '121×192 cm' },
        { label: 'Kaplama Malzemesi', value: 'Kord' },
        { label: 'Uyku Fonksiyonu', value: 'Evet' },
        { label: 'Depolama Kutusu', value: 'Evet' },
        { label: 'Koltuk Başı Yük Kapasitesi', value: '110 kg' },
      ],
      ar: [
        { label: 'العرض', value: '192 سم' },
        { label: 'سطح النوم', value: '121×192 سم' },
        { label: 'مادة الغطاء', value: 'قماش كوردوري' },
        { label: 'وظيفة النوم', value: 'نعم' },
        { label: 'صندوق التخزين', value: 'نعم' },
        { label: 'الحمولة لكل مقعد', value: '110 كغ' },
      ],
    },
  },
  // ── BEDS ───────────────────────────────────────────────────────────────────
  {
    slug: 'fdm-cloudy-upholstered-bed',
    sku: 'BED-001',
    price: 549,
    featured: true,
    categorySlug: 'bed-room',
    imageUrl:
      'https://i.otto.de/i/otto/b3a1615e-8bec-463d-998a-2493cf50537e/fdm-polsterbett-cloudy-bettgestell-bett-140x200-160x200-180x200-cm-bestseller-verfugbar-140x200-160x200-180x200cm-bettrahmen-bett-mit-grossen-gepolsterten-kopfteil-mit-bettkasten-zum-aufklappen-hebbarer-metallrahmen-bettkasten-ohne-matratze.jpg',
    title: {
      en: 'CLOUDY Upholstered Bed',
      tr: 'CLOUDY Döşemeli Yatak',
      ar: 'سرير منجد CLOUDY',
    },
    description: {
      en: 'The CLOUDY upholstered bed features a large padded headboard and a practical storage box under the entire bed with a lifting mechanism. The metal frame with birch slats provides optimal sleeping comfort. Available in sizes 140×200, 160×200, and 180×200 cm. Material: MDF board with metal frame. Mattress not included.',
      tr: 'CLOUDY döşemeli yatak, büyük yastıklı başlık ve kaldırma mekanizmalı tüm yatak altında pratik depolama kutusu içerir. Huş ahşabı latalı metal çerçeve optimum uyku konforu sağlar. 140×200, 160×200 ve 180×200 cm boyutlarında mevcuttur. Malzeme: Metal çerçeveli MDF levha. Şilte dahil değildir.',
      ar: 'يتميز سرير CLOUDY المنجد بلوح رأس كبير ومبطن وصندوق تخزين عملي تحت السرير بالكامل مع آلية رفع. يوفر الإطار المعدني مع قضبان البتولا أقصى درجات الراحة للنوم. متوفر بأحجام 140×200، 160×200، و180×200 سم. المادة: لوح MDF مع إطار معدني. المرتبة غير مشمولة.',
    },
    excerpt: {
      en: 'Upholstered bed with padded headboard and under-bed storage box with lifting mechanism. Available in three sizes.',
      tr: 'Yastıklı başlıklı ve kaldırma mekanizmalı altlık depolama kutulu döşemeli yatak. Üç boyutta mevcuttur.',
      ar: 'سرير منجد بلوح رأس مبطن وصندوق تخزين تحت السرير بآلية رفع. متوفر بثلاثة أحجام.',
    },
    tags: {
      en: 'Bed, Upholstered, Storage, Bedroom',
      tr: 'Yatak, Döşemeli, Depolama, Yatak Odası',
      ar: 'سرير، منجد، تخزين، غرفة نوم',
    },
    specs: {
      en: [
        { label: 'Available Sizes', value: '140×200, 160×200, 180×200 cm' },
        { label: 'Headboard Height', value: '98 cm' },
        { label: 'Bed Height (without mattress)', value: '33 cm' },
        { label: 'Frame Material', value: 'MDF board, metal frame with birch slats' },
        { label: 'Storage Box', value: 'Yes – with lifting mechanism' },
        { label: 'Mattress', value: 'Not included' },
      ],
      tr: [
        { label: 'Mevcut Boyutlar', value: '140×200, 160×200, 180×200 cm' },
        { label: 'Başlık Yüksekliği', value: '98 cm' },
        { label: 'Yatak Yüksekliği (şiltesiz)', value: '33 cm' },
        { label: 'Çerçeve Malzemesi', value: 'MDF levha, huş ahşabı laталı metal çerçeve' },
        { label: 'Depolama Kutusu', value: 'Evet – kaldırma mekanizmalı' },
        { label: 'Şilte', value: 'Dahil değil' },
      ],
      ar: [
        { label: 'الأحجام المتاحة', value: '140×200، 160×200، 180×200 سم' },
        { label: 'ارتفاع لوح الرأس', value: '98 سم' },
        { label: 'ارتفاع السرير (بدون مرتبة)', value: '33 سم' },
        { label: 'مادة الإطار', value: 'لوح MDF، إطار معدني مع قضبان البتولا' },
        { label: 'صندوق التخزين', value: 'نعم – مع آلية رفع' },
        { label: 'المرتبة', value: 'غير مشمولة' },
      ],
    },
  },
  {
    slug: 'juskys-leona-upholstered-bed',
    sku: 'BED-002',
    price: 849,
    isNew: true,
    categorySlug: 'bed-room',
    imageUrl:
      'https://i.otto.de/i/otto/36b173c6-8a54-524a-a1bc-3d5050919505/juskys-polsterbett-leona-140x200-cm-boxspringbett-optik-samt-bezug-led-licht-h4-matratze-schwarz.jpg',
    title: {
      en: 'Leona Upholstered Bed',
      tr: 'Leona Döşemeli Yatak',
      ar: 'سرير منجد Leona',
    },
    description: {
      en: 'The Leona upholstered bed (140×200 cm) with black velvet cover offers the highest sleeping comfort. The combination of box springs, H4 mattress, and soft topper ensures an ideal sleeping height and restful sleep. LED lighting in the headboard and the soft velvet cover with stylish quilting complete this luxurious modern bed.',
      tr: 'Siyah kadife kaplı Leona döşemeli yatak (140×200 cm) en yüksek uyku konforunu sunar. Yaylı dip, H4 şilte ve yumuşak üst ped kombinasyonu ideal uyku yüksekliği ve dinlendirici uyku sağlar. Başlıktaki LED aydınlatma ve şık kapitone işlemeli yumuşak kadife kaplama bu lüks modern yatağı tamamlar.',
      ar: 'يوفر سرير Leona المنجد (140×200 سم) بغطاء مخمل أسود أعلى درجات الراحة للنوم. تضمن مجموعة النوابض الصندوقية والمرتبة H4 والطبقة العلوية الناعمة ارتفاعاً مثالياً ونوماً هانئاً. الإضاءة LED في لوح الرأس وغطاء المخمل الناعم مع الحياكة الأنيقة يكملان هذا السرير الفاخر العصري.',
    },
    excerpt: {
      en: 'Luxurious velvet upholstered bed with LED lighting, H4 mattress, and box spring look. 140×200 cm.',
      tr: 'LED aydınlatmalı, H4 şilteli ve baza görünümlü lüks kadife kaplı yatak. 140×200 cm.',
      ar: 'سرير منجد بالمخمل الفاخر مع إضاءة LED ومرتبة H4 وتصميم بوكسسبرينج. 140×200 سم.',
    },
    tags: {
      en: 'Bed, Velvet, LED, Boxspring, Luxury',
      tr: 'Yatak, Kadife, LED, Baza, Lüks',
      ar: 'سرير، مخمل، LED، بوكسسبرينج، فاخر',
    },
    specs: {
      en: [
        { label: 'Size', value: '140×200 cm' },
        { label: 'Style', value: 'Boxspring look' },
        { label: 'Cover Material', value: 'Velvet' },
        { label: 'Lighting', value: 'LED in headboard' },
        { label: 'Mattress', value: 'H4 mattress included' },
        { label: 'Topper', value: 'Included' },
      ],
      tr: [
        { label: 'Boyut', value: '140×200 cm' },
        { label: 'Stil', value: 'Baza görünümü' },
        { label: 'Kaplama Malzemesi', value: 'Kadife' },
        { label: 'Aydınlatma', value: 'Başlıkta LED' },
        { label: 'Şilte', value: 'H4 şilte dahil' },
        { label: 'Üst Ped', value: 'Dahil' },
      ],
      ar: [
        { label: 'الحجم', value: '140×200 سم' },
        { label: 'الأسلوب', value: 'تصميم بوكسسبرينج' },
        { label: 'مادة الغطاء', value: 'مخمل' },
        { label: 'الإضاءة', value: 'LED في لوح الرأس' },
        { label: 'المرتبة', value: 'مرتبة H4 مشمولة' },
        { label: 'الطبقة العلوية', value: 'مشمولة' },
      ],
    },
  },
  {
    slug: 'furnishings-home-led-storage-bed',
    sku: 'BED-003',
    price: 649,
    categorySlug: 'bed-room',
    imageUrl:
      'https://i.otto.de/i/otto/2ad75d8b-41ff-4617-b4c1-a8d8d9930175/furnishings-home-polsterbett-led-doppelbett-stauraumbett-mit-kopfteil-und-4-schubladen-leinenmaterial-polsterbett-mit-rgb-beleuchtung-mit-lattenrost-und-ladefunktion-mit-komforthoehe-leises-design-bett.jpg',
    title: {
      en: 'LED Storage Bed with Drawers',
      tr: 'Çekmeceli LED Depolama Yatağı',
      ar: 'سرير تخزين LED مع أدراج',
    },
    description: {
      en: 'This LED upholstered storage bed combines modern aesthetics with functionality. Features a padded headboard, 4 storage drawers, RGB mood lighting, and an integrated USB charging function. Comes complete with a slatted base at comfort height. Quiet design. Dimensions (W×D×H): 98×201×100 cm. Maximum load capacity: 300 kg.',
      tr: 'Bu LED döşemeli depolama yatağı modern estetik ile işlevselliği birleştirir. Yastıklı başlık, 4 depolama çekmecesi, RGB ortam aydınlatması ve entegre USB şarj işlevi içerir. Konfor yüksekliğinde kafesli taban ile eksiksiz gelir. Sessiz tasarım. Ölçüler (G×D×Y): 98×201×100 cm. Maksimum yük kapasitesi: 300 kg.',
      ar: 'يجمع سرير التخزين المنجد بإضاءة LED هذا بين الجماليات الحديثة والوظيفية. يتميز بلوح رأس مبطن و4 أدراج تخزين وإضاءة RGB للأجواء ووظيفة شحن USB متكاملة. يأتي كاملاً مع قاعدة مشرشرة بارتفاع مريح. تصميم هادئ. الأبعاد (ع×ع×ا): 98×201×100 سم. الحمولة القصوى: 300 كغ.',
    },
    excerpt: {
      en: 'Modern LED bed with 4 storage drawers, RGB lighting, and USB charging. 300 kg load capacity.',
      tr: '4 depolama çekmecesi, RGB aydınlatma ve USB şarj işlevli modern LED yatak. 300 kg yük kapasitesi.',
      ar: 'سرير LED حديث مع 4 أدراج تخزين وإضاءة RGB وشحن USB. حمولة 300 كغ.',
    },
    tags: {
      en: 'Bed, LED, Storage, Drawers, RGB',
      tr: 'Yatak, LED, Depolama, Çekmece, RGB',
      ar: 'سرير، LED، تخزين، أدراج، RGB',
    },
    specs: {
      en: [
        { label: 'Dimensions (W×D×H)', value: '98×201×100 cm' },
        { label: 'Max Load Capacity', value: '300 kg' },
        { label: 'Drawers', value: '4' },
        { label: 'Lighting', value: 'RGB LED' },
        { label: 'Charging Function', value: 'Yes (USB)' },
        { label: 'Slatted Base', value: 'Included – 12 slats' },
        { label: 'Frame Material', value: 'Wood, Metal, Linen' },
      ],
      tr: [
        { label: 'Ölçüler (G×D×Y)', value: '98×201×100 cm' },
        { label: 'Maksimum Yük Kapasitesi', value: '300 kg' },
        { label: 'Çekmeceler', value: '4' },
        { label: 'Aydınlatma', value: 'RGB LED' },
        { label: 'Şarj Fonksiyonu', value: 'Evet (USB)' },
        { label: 'Kafesli Taban', value: 'Dahil – 12 lata' },
        { label: 'Çerçeve Malzemesi', value: 'Ahşap, Metal, Keten' },
      ],
      ar: [
        { label: 'الأبعاد (ع×ع×ا)', value: '98×201×100 سم' },
        { label: 'الحمولة القصوى', value: '300 كغ' },
        { label: 'الأدراج', value: '4' },
        { label: 'الإضاءة', value: 'RGB LED' },
        { label: 'وظيفة الشحن', value: 'نعم (USB)' },
        { label: 'القاعدة المشرشرة', value: 'مشمولة – 12 قضيباً' },
        { label: 'مادة الإطار', value: 'خشب، معدن، كتان' },
      ],
    },
  },
  // ── CABINETS & WARDROBES → bed-room ────────────────────────────────────────
  {
    slug: 'home-collective-multipurpose-wardrobe',
    sku: 'CAB-001',
    price: 229,
    categorySlug: 'bed-room',
    imageUrl:
      'https://i.otto.de/i/otto/ce4dbf69-66bd-42d4-b867-397a65077bde/home-collective-kleiderschrank-garderobenschrank-mehrzweckschrank-schrank-platzsparend-vielseitig-50x40x1805-cm-bxtxh-ideal-fur-schlafzimmer-flur-arbeitszimmer-weiss.jpg',
    title: {
      en: 'Multi-Purpose Wardrobe',
      tr: 'Çok Amaçlı Gardırop',
      ar: 'خزانة متعددة الأغراض',
    },
    description: {
      en: 'This functional wardrobe offers a well-thought-out storage solution that fits seamlessly into different living spaces. Whether as an extra wardrobe in the bedroom, an organizer in the hallway, or storage in the study – its compact dimensions (50×40×180.5 cm) make it versatile. Features 3 fixed shelves and 3 spacious drawers.',
      tr: 'Bu fonksiyonel gardırop, farklı yaşam alanlarına sorunsuz uyum sağlayan düşünülmüş bir depolama çözümü sunar. Yatak odasında ek gardırop, koridorda düzenleyici veya çalışma odasında depolama olarak kullanın – kompakt boyutları (50×40×180.5 cm) onu çok yönlü kılar. 3 sabit raf ve 3 geniş çekmece içerir.',
      ar: 'تقدم هذه الخزانة الوظيفية حلاً للتخزين مدروساً يتناسب بسلاسة مع مختلف مساحات المعيشة. سواء كخزانة إضافية في غرفة النوم، أو عنصر تنظيم في الردهة، أو تخزين في غرفة الدراسة - أبعادها المدمجة (50×40×180.5 سم) تجعلها متعددة الاستخدامات. تتميز بـ3 رفوف ثابتة و3 أدراج فسيحة.',
    },
    excerpt: {
      en: 'Compact 50×40×180.5 cm wardrobe with 3 fixed shelves and 3 drawers. Bedroom, hallway, or study.',
      tr: '3 sabit raf ve 3 çekmeceli kompakt 50×40×180.5 cm gardırop. Yatak odası, koridor veya çalışma odası.',
      ar: 'خزانة مدمجة 50×40×180.5 سم مع 3 رفوف ثابتة و3 أدراج. لغرفة النوم أو الردهة أو الدراسة.',
    },
    tags: {
      en: 'Wardrobe, Cabinet, Storage, Bedroom',
      tr: 'Gardırop, Dolap, Depolama, Yatak Odası',
      ar: 'خزانة ملابس، خزانة، تخزين، غرفة نوم',
    },
    specs: {
      en: [
        { label: 'Width', value: '50 cm' },
        { label: 'Depth', value: '40 cm' },
        { label: 'Height', value: '180.5 cm' },
        { label: 'Doors', value: '1' },
        { label: 'Fixed Shelves', value: '3' },
        { label: 'Drawers', value: '3' },
        { label: 'Suitable For', value: 'Bedroom, Hallway, Study' },
      ],
      tr: [
        { label: 'Genişlik', value: '50 cm' },
        { label: 'Derinlik', value: '40 cm' },
        { label: 'Yükseklik', value: '180.5 cm' },
        { label: 'Kapılar', value: '1' },
        { label: 'Sabit Raflar', value: '3' },
        { label: 'Çekmeceler', value: '3' },
        { label: 'Uygun Kullanım', value: 'Yatak Odası, Koridor, Çalışma Odası' },
      ],
      ar: [
        { label: 'العرض', value: '50 سم' },
        { label: 'العمق', value: '40 سم' },
        { label: 'الارتفاع', value: '180.5 سم' },
        { label: 'الأبواب', value: '1' },
        { label: 'الرفوف الثابتة', value: '3' },
        { label: 'الأدراج', value: '3' },
        { label: 'مناسب لـ', value: 'غرفة النوم، الردهة، غرفة الدراسة' },
      ],
    },
  },
  {
    slug: 'home-affaire-edil-hallway-cabinet',
    sku: 'CAB-002',
    price: 279,
    categorySlug: 'bed-room',
    imageUrl:
      'https://i.otto.de/i/otto/b62ec038-1144-5c10-a6d4-3eebce6afa2d/home-affaire-garderobenschrank-edil-hohe-190cm-2-turen-5-boden-6-facher-moderne-farbkombination-platz-fur-ca-18-paar-schuhe-kleiderschrank-flurschrank-hochschrank-stauraumschrank.jpg',
    title: {
      en: 'EDIL Hallway Cabinet',
      tr: 'EDIL Koridor Dolabı',
      ar: 'خزانة الردهة EDIL',
    },
    description: {
      en: 'The EDIL hallway cabinet from Home affaire creates a welcoming impression in any home. Adjustable shelves can be arranged to suit individual needs. Stably constructed from wood composite with a smooth, resistant surface. Provides space for approximately 18 pairs of shoes across 6 compartments.',
      tr: 'Home affaire\'dan EDIL koridor dolabı her evde sıcak bir ilk izlenim yaratır. Ayarlanabilir raflar bireysel ihtiyaçlara göre düzenlenebilir. Pürüzsüz ve dayanıklı yüzeyiyle ahşap kompozitten sağlam şekilde üretilmiştir. 6 bölmede yaklaşık 18 çift ayakkabı için yer sağlar.',
      ar: 'تخلق خزانة الردهة EDIL من Home affaire انطباعاً ترحيبياً في أي منزل. يمكن ترتيب الرفوف القابلة للضبط لتناسب الاحتياجات الفردية. مبنية بشكل متين من الخشب المركب بسطح أملس ومقاوم. توفر مساحة لحوالي 18 زوجاً من الأحذية عبر 6 أقسام.',
    },
    excerpt: {
      en: 'Tall 190 cm hallway cabinet with 2 doors, 5 shelves, and space for 18 pairs of shoes.',
      tr: '2 kapılı, 5 raflı ve 18 çift ayakkabı için yeterli alanı olan 190 cm koridor dolabı.',
      ar: 'خزانة ردهة طويلة 190 سم بابان و5 رفوف ومساحة لـ18 زوجاً من الأحذية.',
    },
    tags: {
      en: 'Wardrobe, Cabinet, Hallway, Storage',
      tr: 'Gardırop, Dolap, Koridor, Depolama',
      ar: 'خزانة، ردهة، تخزين',
    },
    specs: {
      en: [
        { label: 'Height', value: '190 cm' },
        { label: 'Doors', value: '2' },
        { label: 'Shelves', value: '5' },
        { label: 'Compartments', value: '6' },
        { label: 'Shoe Capacity', value: 'Approx. 18 pairs' },
        { label: 'Material', value: 'Wood Composite' },
        { label: 'Type', value: 'Hallway / Tall Cabinet' },
      ],
      tr: [
        { label: 'Yükseklik', value: '190 cm' },
        { label: 'Kapılar', value: '2' },
        { label: 'Raflar', value: '5' },
        { label: 'Bölmeler', value: '6' },
        { label: 'Ayakkabı Kapasitesi', value: 'Yaklaşık 18 çift' },
        { label: 'Malzeme', value: 'Ahşap Kompozit' },
        { label: 'Tür', value: 'Koridor / Uzun Dolap' },
      ],
      ar: [
        { label: 'الارتفاع', value: '190 سم' },
        { label: 'الأبواب', value: '2' },
        { label: 'الرفوف', value: '5' },
        { label: 'الأقسام', value: '6' },
        { label: 'سعة الأحذية', value: 'حوالي 18 زوجاً' },
        { label: 'المادة', value: 'خشب مركب' },
        { label: 'النوع', value: 'خزانة ردهة / خزانة طويلة' },
      ],
    },
  },
  {
    slug: 'home-affaire-skarde-wardrobe',
    sku: 'CAB-003',
    price: 189,
    categorySlug: 'bed-room',
    imageUrl:
      'https://i.otto.de/i/otto/94b56251-4978-5cf2-a8c6-4e874ed5b583/home-affaire-kleiderschrank-skarde-schlafzimmerschrank-garderobe-schrank-otto-bestseller-garderobe-schlafzimmerschrank-breite-80-cm-weiss-kleiderstange-einlegeboden-weiss.jpg',
    title: {
      en: 'Skarde Wardrobe',
      tr: 'Skarde Giysi Dolabı',
      ar: 'خزانة ملابس Skarde',
    },
    description: {
      en: 'The spacious Skarde wardrobe from Home affaire features classic doors that can be opened independently. Ideal for bedrooms, it helps you maintain an overview of your clothing. Comes with a hanging rail and an adjustable shelf. Width 80 cm, made from quality wood composite.',
      tr: 'Home affaire\'dan geniş Skarde giysi dolabı, bağımsız olarak açılabilen klasik kapılara sahiptir. Yatak odaları için ideal olup kıyafetlerinize genel bakış sürdürmenize yardımcı olur. Askı rayı ve ayarlanabilir raf ile birlikte gelir. Genişlik 80 cm, kaliteli ahşap kompozitten üretilmiştir.',
      ar: 'تتميز خزانة الملابس الفسيحة Skarde من Home affaire بأبواب كلاسيكية يمكن فتحها بشكل مستقل. مثالية لغرف النوم، تساعدك في الحفاظ على نظرة عامة على ملابسك. مزودة بقضيب تعليق ورف قابل للتعديل. عرض 80 سم، مصنوعة من خشب مركب عالي الجودة.',
    },
    excerpt: {
      en: 'Classic 80 cm bedroom wardrobe with hanging rail and adjustable shelf. Quality wood composite.',
      tr: 'Askı rayı ve ayarlanabilir raflı klasik 80 cm yatak odası dolabı. Kaliteli ahşap kompozit.',
      ar: 'خزانة ملابس كلاسيكية 80 سم لغرفة النوم مع قضيب تعليق ورف قابل للتعديل.',
    },
    tags: {
      en: 'Wardrobe, Bedroom, Classic, Storage',
      tr: 'Gardırop, Giysi Dolabı, Klasik, Yatak Odası',
      ar: 'خزانة ملابس، غرفة نوم، كلاسيك، تخزين',
    },
    specs: {
      en: [
        { label: 'Width', value: '80 cm' },
        { label: 'Hanging Rail', value: 'Yes' },
        { label: 'Shelf', value: 'Yes – adjustable' },
        { label: 'Suitable For', value: 'Bedroom' },
        { label: 'Material', value: 'Wood Composite' },
      ],
      tr: [
        { label: 'Genişlik', value: '80 cm' },
        { label: 'Askı Rayı', value: 'Evet' },
        { label: 'Raf', value: 'Evet – ayarlanabilir' },
        { label: 'Uygun Kullanım', value: 'Yatak Odası' },
        { label: 'Malzeme', value: 'Ahşap Kompozit' },
      ],
      ar: [
        { label: 'العرض', value: '80 سم' },
        { label: 'قضيب التعليق', value: 'نعم' },
        { label: 'الرف', value: 'نعم – قابل للتعديل' },
        { label: 'مناسب لـ', value: 'غرفة النوم' },
        { label: 'المادة', value: 'خشب مركب' },
      ],
    },
  },
  // ── TABLES ─────────────────────────────────────────────────────────────────
  {
    slug: 'hela-coffee-table-height-adjustable',
    sku: 'TBL-001',
    price: 229,
    categorySlug: 'living-room',
    imageUrl:
      'https://i.otto.de/i/otto/36dd74cb-245e-502d-afe0-9a7dd7525ff2/hela-couchtisch-auf-rollen-hohenverstellbar-und-ausziehbar-sonoma-eiche.jpg',
    title: {
      en: 'Coffee Table on Wheels (Height Adjustable & Extendable)',
      tr: 'Tekerlekli Sehpa (Yükseklik Ayarlı ve Uzatılabilir)',
      ar: 'طاولة قهوة على عجلات قابلة للتعديل والتمديد',
    },
    description: {
      en: 'Practical coffee table on wheels in beech décor with a storage shelf and compartments for plenty of storage space. Height adjustable and extendable – ideal for flexible living spaces. Dimensions: Width 107–154 cm, Depth 67 cm, Height 54–64 cm.',
      tr: 'Depolama rafı ve bolca depolama alanı için bölmeleri olan beç dekoru pratik tekerlekli sehpa. Yükseklik ayarlı ve uzatılabilir – esnek yaşam alanları için idealdir. Ölçüler: Genişlik 107-154 cm, Derinlik 67 cm, Yükseklik 54-64 cm.',
      ar: 'طاولة قهوة عملية على عجلات بتشطيب خشب الزان مع رف تخزين وأقسام لمساحة تخزين وفيرة. قابلة لتعديل الارتفاع والتمديد - مثالية لمساحات المعيشة المرنة. الأبعاد: العرض 107-154 سم، العمق 67 سم، الارتفاع 54-64 سم.',
    },
    excerpt: {
      en: 'Height-adjustable coffee table on wheels, extends from 107 to 154 cm. Storage shelf included.',
      tr: 'Yükseklik ayarlı tekerlekli sehpa, 107\'den 154 cm\'ye uzatılabilir. Depolama rafı dahil.',
      ar: 'طاولة قهوة على عجلات قابلة لتعديل الارتفاع، تمتد من 107 إلى 154 سم. رف التخزين مشمول.',
    },
    tags: {
      en: 'Coffee Table, Height Adjustable, Wheels, Living Room',
      tr: 'Sehpa, Yükseklik Ayarlı, Tekerlekli, Oturma Odası',
      ar: 'طاولة قهوة، قابلة لتعديل الارتفاع، عجلات، غرفة المعيشة',
    },
    specs: {
      en: [
        { label: 'Width', value: '107 cm (extended: 154 cm)' },
        { label: 'Depth', value: '67 cm' },
        { label: 'Height', value: '54–64 cm (adjustable)' },
        { label: 'Feet', value: 'Wheels / Casters' },
        { label: 'Storage Shelves', value: '1' },
        { label: 'Tabletop Material', value: 'Wood Composite' },
        { label: 'Color', value: 'Sonoma Oak' },
        { label: 'Features', value: 'Height adjustable, extendable' },
      ],
      tr: [
        { label: 'Genişlik', value: '107 cm (uzatılmış: 154 cm)' },
        { label: 'Derinlik', value: '67 cm' },
        { label: 'Yükseklik', value: '54-64 cm (ayarlanabilir)' },
        { label: 'Ayaklar', value: 'Tekerlekler' },
        { label: 'Depolama Rafları', value: '1' },
        { label: 'Masa Üstü Malzemesi', value: 'Ahşap Kompozit' },
        { label: 'Renk', value: 'Sonoma Meşe' },
        { label: 'Özellikler', value: 'Yükseklik ayarlı, uzatılabilir' },
      ],
      ar: [
        { label: 'العرض', value: '107 سم (ممتد: 154 سم)' },
        { label: 'العمق', value: '67 سم' },
        { label: 'الارتفاع', value: '54-64 سم (قابل للتعديل)' },
        { label: 'الأرجل', value: 'عجلات' },
        { label: 'رفوف التخزين', value: '1' },
        { label: 'مادة سطح الطاولة', value: 'خشب مركب' },
        { label: 'اللون', value: 'بلوط سونوما' },
        { label: 'المميزات', value: 'قابل لتعديل الارتفاع، قابل للتمديد' },
      ],
    },
  },
  {
    slug: 'altdecor-asiv-extendable-dining-table',
    sku: 'TBL-002',
    price: 329,
    featured: true,
    categorySlug: 'living-room',
    imageUrl:
      'https://i.otto.de/i/otto/54f6d1a1-9a94-5fc6-9270-33c63feea245/altdecor-esstisch-asiv-esstisch-ausziehbar-esszimmertische-tisch-wohnzimmertisch-esszimmertisch-ausziehbar-120-160-x-80-x-75-cm-weiss-betonoptik-weiss-grau.jpg',
    title: {
      en: 'ASIV Extendable Dining Table',
      tr: 'ASIV Uzatılabilir Yemek Masası',
      ar: 'طاولة طعام ASIV قابلة للتمديد',
    },
    description: {
      en: 'The modern ASIV dining table impresses with its stylish design and robust materials. The spectacular base supports the sturdy tabletop, embodying modern industrial design that instantly upgrades any dining or living room. Extends from 120 to 160 cm to accommodate more guests. Dimensions: 120–160 × 80 × 75 cm.',
      tr: 'Modern ASIV yemek masası, şık tasarımı ve sağlam malzemeleriyle etkileyicidir. Muhteşem taban, sağlam masa üstünü destekleyerek herhangi bir yemek veya oturma odasını anında yükselten modern endüstriyel tasarımı somutlaştırır. Daha fazla misafiri ağırlamak için 120\'den 160 cm\'ye genişler. Ölçüler: 120-160 × 80 × 75 cm.',
      ar: 'تبهر طاولة الطعام الحديثة ASIV بتصميمها الأنيق وموادها المتينة. تدعم القاعدة المذهلة سطح الطاولة القوي، مجسدةً تصميم الأثاث الصناعي الحديث الذي يرقّي أي غرفة طعام أو معيشة فوراً. تمتد من 120 إلى 160 سم لاستيعاب المزيد من الضيوف. الأبعاد: 120-160 × 80 × 75 سم.',
    },
    excerpt: {
      en: 'Modern industrial dining table, extends from 120 to 160 cm. Robust design for any dining room.',
      tr: 'Modern endüstriyel yemek masası, 120\'den 160 cm\'ye uzatılabilir. Her yemek odası için sağlam tasarım.',
      ar: 'طاولة طعام صناعية حديثة، تمتد من 120 إلى 160 سم. تصميم متين لأي غرفة طعام.',
    },
    tags: {
      en: 'Dining Table, Extendable, Modern, Industrial',
      tr: 'Yemek Masası, Uzatılabilir, Modern, Endüstriyel',
      ar: 'طاولة طعام، قابلة للتمديد، حديث، صناعي',
    },
    specs: {
      en: [
        { label: 'Width', value: '120–160 cm (extendable)' },
        { label: 'Depth', value: '80 cm' },
        { label: 'Height', value: '75 cm' },
        { label: 'Function', value: 'Extendable' },
        { label: 'Style', value: 'Modern Industrial' },
      ],
      tr: [
        { label: 'Genişlik', value: '120-160 cm (uzatılabilir)' },
        { label: 'Derinlik', value: '80 cm' },
        { label: 'Yükseklik', value: '75 cm' },
        { label: 'Fonksiyon', value: 'Uzatılabilir' },
        { label: 'Stil', value: 'Modern Endüstriyel' },
      ],
      ar: [
        { label: 'العرض', value: '120-160 سم (قابل للتمديد)' },
        { label: 'العمق', value: '80 سم' },
        { label: 'الارتفاع', value: '75 سم' },
        { label: 'الوظيفة', value: 'قابل للتمديد' },
        { label: 'الأسلوب', value: 'صناعي حديث' },
      ],
    },
  },
  {
    slug: 'sanodesk-electric-height-adjustable-desk',
    sku: 'TBL-003',
    price: 479,
    isNew: true,
    categorySlug: 'office',
    imageUrl:
      'https://i.otto.de/i/otto/47345941-5317-4ea9-ab73-deb227e53c3b/sanodesk-schreibtisch-elektrisch-hohenverstellbarer-schreibtisch-inkl-vielseitigem-zubehor-2-fach-teleskop-mit-memory-steuerung-anti-kollisionssystem.jpg',
    title: {
      en: 'Electric Height-Adjustable Desk',
      tr: 'Elektrikli Yükseklik Ayarlı Çalışma Masası',
      ar: 'مكتب كهربائي قابل للتعديل',
    },
    description: {
      en: 'The minimalist electric height-adjustable desk adds a touch of elegance to any workspace. The spacious desktop provides ample room for work tools. Height range from 73.5 cm to 118 cm. Equipped with memory control panel, anti-collision system, and 2-stage telescopic legs. Assembly-friendly design. Maximum load capacity: 100 kg.',
      tr: 'Minimalist elektrikli yükseklik ayarlı çalışma masası, herhangi bir çalışma alanına zarafet katar. Geniş masa üstü çalışma araçları için yeterli alan sağlar. Yükseklik aralığı 73.5 cm\'den 118 cm\'ye. Hafıza kontrol paneli, çarpma önleyici sistem ve 2 kademeli teleskopik ayaklar ile donatılmıştır. Montaj dostu tasarım. Maksimum yük kapasitesi: 100 kg.',
      ar: 'يضيف المكتب الكهربائي البسيط القابل للتعديل لمسة من الأناقة لأي مساحة عمل. سطح المكتب الفسيح يوفر مساحة وفيرة لأدوات العمل. نطاق الارتفاع من 73.5 سم إلى 118 سم. مزود بلوحة تحكم بالذاكرة ونظام مانع للتصادم وأرجل تلسكوبية ثنائية المرحلة. تصميم سهل التركيب. الحمولة القصوى: 100 كغ.',
    },
    excerpt: {
      en: 'Electric standing desk from 73.5 to 118 cm height with memory panel and anti-collision system. 100 kg capacity.',
      tr: '73.5\'ten 118 cm yüksekliğe, hafıza panelli ve çarpma önleyicili elektrikli ayaklı masa. 100 kg kapasite.',
      ar: 'مكتب كهربائي يتراوح من 73.5 إلى 118 سم مع لوحة ذاكرة ونظام مانع للتصادم. سعة 100 كغ.',
    },
    tags: {
      en: 'Desk, Standing Desk, Electric, Height Adjustable, Office',
      tr: 'Masa, Ayaklı Masa, Elektrikli, Yükseklik Ayarlı, Ofis',
      ar: 'مكتب، مكتب واقف، كهربائي، قابل للتعديل، مكتب',
    },
    specs: {
      en: [
        { label: 'Height Range', value: '73.5–118 cm' },
        { label: 'Drive', value: 'Electric, 2-stage telescopic' },
        { label: 'Control', value: 'Memory control panel' },
        { label: 'Safety', value: 'Anti-collision system' },
        { label: 'Max Load Capacity', value: '100 kg' },
        { label: 'Style', value: 'Minimalist' },
      ],
      tr: [
        { label: 'Yükseklik Aralığı', value: '73.5-118 cm' },
        { label: 'Hareket Tipi', value: 'Elektrikli, 2 kademeli teleskopik' },
        { label: 'Kontrol', value: 'Hafıza kontrol paneli' },
        { label: 'Güvenlik', value: 'Çarpma önleyici sistem' },
        { label: 'Maksimum Yük Kapasitesi', value: '100 kg' },
        { label: 'Stil', value: 'Minimalist' },
      ],
      ar: [
        { label: 'نطاق الارتفاع', value: '73.5-118 سم' },
        { label: 'نوع الحركة', value: 'كهربائي، تلسكوبي ثنائي المرحلة' },
        { label: 'التحكم', value: 'لوحة تحكم بالذاكرة' },
        { label: 'الأمان', value: 'نظام مانع للتصادم' },
        { label: 'الحمولة القصوى', value: '100 كغ' },
        { label: 'الأسلوب', value: 'بسيط وأنيق' },
      ],
    },
  },
  // ── CHAIRS → living-room ───────────────────────────────────────────────────
  {
    slug: 'homavo-yz6-dining-chair-set-4',
    sku: 'CHR-009',
    price: 289,
    featured: true,
    categorySlug: 'living-room',
    imageUrl:
      'https://i.otto.de/i/otto/56416532-4abe-40f5-9a67-f571076729c0/homavo-esszimmerstuhl-stuhlset-4-stick-in-kunstleder-und-stoff-gepolstert-modern-4er-set-modernes-design-en12520-gepruft-fur-esszimmer-arbeitszimmer-geeignet-kunstleder-grau.jpg',
    title: {
      en: 'YZ6 Dining Chair Set of 4',
      tr: 'YZ6 Yemek Sandalyesi 4\'lü Set',
      ar: 'طقم كراسي طعام YZ6 (4 قطع)',
    },
    description: {
      en: 'The HOMAVO YZ6 Chair Set combines modern design, high seating comfort, and durable materials. With clean lines and versatile applications, it fits perfectly in dining rooms, home offices, or bedrooms. Upholstered seat and backrest in faux leather and fabric. Tested and certified to EN12520 standard.',
      tr: 'HOMAVO YZ6 Sandalye Seti modern tasarım, yüksek oturma konforu ve dayanıklı malzemeleri bir araya getirir. Temiz hatları ve çok yönlü uygulamalarıyla yemek odaları, ev ofisleri veya yatak odaları için mükemmel uyum sağlar. Suni deri ve kumaşta döşemeli koltuk ve arkalık. EN12520 standardına göre test edilmiş ve sertifikalandırılmıştır.',
      ar: 'يجمع طقم كراسي HOMAVO YZ6 بين التصميم الحديث وراحة الجلوس العالية والمواد المتينة. بخطوطه الواضحة وتطبيقاته المتعددة، يناسب تماماً غرف الطعام ومكاتب المنزل وغرف النوم. مقعد وظهر مبطنان بالجلد الصناعي والقماش. تم اختباره واعتماده وفق معيار EN12520.',
    },
    excerpt: {
      en: 'Set of 4 modern dining chairs in faux leather and fabric, EN12520 certified for dining rooms and offices.',
      tr: 'Suni deri ve kumaştan modern 4 yemek sandalyesi, yemek odaları ve ofisler için EN12520 sertifikalı.',
      ar: 'طقم 4 كراسي طعام حديثة بالجلد الصناعي والقماش، معتمدة وفق EN12520 لغرف الطعام والمكاتب.',
    },
    tags: {
      en: 'Dining Chair, Set of 4, Faux Leather, Modern',
      tr: 'Yemek Sandalyesi, 4\'lü Set, Suni Deri, Modern',
      ar: 'كرسي طعام، طقم 4، جلد صناعي، حديث',
    },
    specs: {
      en: [
        { label: 'Set', value: '4 chairs' },
        { label: 'Cover Material', value: 'Faux leather and fabric' },
        { label: 'Seat', value: 'Upholstered' },
        { label: 'Backrest', value: 'Upholstered' },
        { label: 'Certification', value: 'EN12520' },
        { label: 'Suitable For', value: 'Dining room, Home office, Bedroom' },
      ],
      tr: [
        { label: 'Set', value: '4 sandalye' },
        { label: 'Kaplama Malzemesi', value: 'Suni deri ve kumaş' },
        { label: 'Oturma Yüzeyi', value: 'Döşemeli' },
        { label: 'Arkalık', value: 'Döşemeli' },
        { label: 'Sertifikasyon', value: 'EN12520' },
        { label: 'Uygun Kullanım', value: 'Yemek odası, Ev ofisi, Yatak odası' },
      ],
      ar: [
        { label: 'الطقم', value: '4 كراسي' },
        { label: 'مادة الغطاء', value: 'جلد صناعي وقماش' },
        { label: 'المقعد', value: 'منجد' },
        { label: 'ظهر الكرسي', value: 'منجد' },
        { label: 'الاعتماد', value: 'EN12520' },
        { label: 'مناسب لـ', value: 'غرفة الطعام، مكتب المنزل، غرفة النوم' },
      ],
    },
  },
  {
    slug: 'albatros-bora-dining-chair-set-4',
    sku: 'CHR-010',
    price: 239,
    categorySlug: 'living-room',
    imageUrl:
      'https://i.otto.de/i/otto/c42230fe-3aa3-54f3-8b60-c5924cc8fd76/albatros-international-esszimmerstuhl-esszimmer-stuhle-4-er-set-bora-stuhl-stuhle-esszimmerstuhle-kuche-4er-set-beige-stoff-bezug-kuchenstuhl-kuchenstuhle-essstuhle-fur-den-esstisch-ess-stuhle.jpg',
    title: {
      en: 'BORA Dining Chair Set of 4',
      tr: 'BORA Yemek Sandalyesi 4\'lü Set',
      ar: 'طقم كراسي طعام BORA (4 قطع)',
    },
    description: {
      en: 'The BORA chair set creates a stylish and modern living atmosphere. The modern retro look combines perfectly with other design styles. Seat and backrest are upholstered with high-quality, durable structured fabric that is easy to clean. Thick padding for superior sitting comfort. Perfect for dining rooms and kitchens.',
      tr: 'BORA sandalye seti şık ve modern bir yaşam atmosferi yaratır. Modern retro görünüm diğer tasarım stilleriyle mükemmel uyum sağlar. Koltuk ve arkalık, temizlenmesi kolay yüksek kaliteli, dayanıklı dokuma kumaşla döşenmiştir. Üstün oturma konforu için kalın döşeme. Yemek odaları ve mutfaklar için mükemmeldir.',
      ar: 'يخلق طقم كراسي BORA أجواء معيشية أنيقة وعصرية. يتناسب المظهر الرجعي الحديث بشكل مثالي مع أساليب التصميم الأخرى. المقعد والظهر مبطنان بقماش منسج عالي الجودة ومتين يسهل تنظيفه. حشو سميك لراحة جلوس فائقة. مثالي لغرف الطعام والمطابخ.',
    },
    excerpt: {
      en: 'Set of 4 modern retro dining chairs with thick padding and structured fabric, easy to clean.',
      tr: 'Kalın döşemeli ve dokuma kumaşlı, temizlemesi kolay 4 modern retro yemek sandalyesi seti.',
      ar: 'طقم 4 كراسي طعام رجعية حديثة بحشو سميك وقماش منسج سهل التنظيف.',
    },
    tags: {
      en: 'Dining Chair, Set of 4, Modern Retro, Fabric',
      tr: 'Yemek Sandalyesi, 4\'lü Set, Modern Retro, Kumaş',
      ar: 'كرسي طعام، طقم 4، رجعي حديث، قماش',
    },
    specs: {
      en: [
        { label: 'Set', value: '4 chairs' },
        { label: 'Cover Material', value: 'Structured fabric' },
        { label: 'Style', value: 'Modern Retro' },
        { label: 'Padding', value: 'Thick upholstering' },
        { label: 'Suitable For', value: 'Dining room, Kitchen' },
      ],
      tr: [
        { label: 'Set', value: '4 sandalye' },
        { label: 'Kaplama Malzemesi', value: 'Dokuma kumaş' },
        { label: 'Stil', value: 'Modern Retro' },
        { label: 'Döşeme', value: 'Kalın döşeme' },
        { label: 'Uygun Kullanım', value: 'Yemek odası, Mutfak' },
      ],
      ar: [
        { label: 'الطقم', value: '4 كراسي' },
        { label: 'مادة الغطاء', value: 'قماش منسج' },
        { label: 'الأسلوب', value: 'رجعي حديث' },
        { label: 'الحشو', value: 'حشو سميك' },
        { label: 'مناسب لـ', value: 'غرفة الطعام، المطبخ' },
      ],
    },
  },
  {
    slug: 'woltu-swivel-dining-chair-set-6',
    sku: 'CHR-011',
    price: 419,
    categorySlug: 'living-room',
    imageUrl:
      'https://i.otto.de/i/otto/bc30dc10-d968-4752-bd21-13b0b845f147/woltu-polsterstuhl-6-st-drehbar-esszimmerstuhl-mit-armlehnen-ruckenlehne-braun-braun.jpg',
    title: {
      en: 'Swivel Upholstered Chair Set of 6',
      tr: 'Döner Döşemeli Sandalye 6\'lı Set',
      ar: 'طقم كراسي منجدة دوارة (6 قطع)',
    },
    description: {
      en: 'Swivel dining chair from Woltu in vintage faux leather with metal frame. 360° smooth rotating seat with a stable turntable. Includes padded armrests and backrest. Overall dimensions: 58.5×82.5×54.5 cm (W×H×D). Seat size: 42×41 cm. Maximum load capacity: 150 kg per chair.',
      tr: 'Woltu\'dan metal çerçeveli vintage suni derili döner yemek sandalyesi. Sabit döner tablayla 360° pürüzsüz dönen koltuk. Yastıklı kolçak ve arkalık içerir. Genel ölçüler: 58.5×82.5×54.5 cm (G×Y×D). Koltuk boyutu: 42×41 cm. Her sandalye için maksimum yük kapasitesi: 150 kg.',
      ar: 'كرسي طعام دوار من Woltu بالجلد الصناعي الكلاسيكي مع إطار معدني. مقعد دوار بسلاسة 360° مع قرص دوران مستقر. يشمل مساند يدين وظهر منجدين. الأبعاد الإجمالية: 58.5×82.5×54.5 سم (ع×ا×ع). حجم المقعد: 42×41 سم. الحمولة القصوى: 150 كغ لكل كرسي.',
    },
    excerpt: {
      en: 'Set of 6 swivel dining chairs with 360° rotation, armrests, and 150 kg capacity per chair.',
      tr: '360° döner, kolçaklı ve koltuk başı 150 kg kapasiteli 6\'lı yemek sandalyesi seti.',
      ar: 'طقم 6 كراسي طعام دوارة بزاوية 360° ومساند يدين وحمولة 150 كغ لكل كرسي.',
    },
    tags: {
      en: 'Dining Chair, Swivel, Set of 6, Faux Leather',
      tr: 'Yemek Sandalyesi, Döner, 6\'lı Set, Suni Deri',
      ar: 'كرسي طعام، دوار، طقم 6، جلد صناعي',
    },
    specs: {
      en: [
        { label: 'Set', value: '6 chairs' },
        { label: 'Cover Material', value: 'Vintage faux leather' },
        { label: 'Frame', value: 'Metal' },
        { label: 'Swivel Function', value: '360°' },
        { label: 'Overall Dimensions (W×H×D)', value: '58.5×82.5×54.5 cm' },
        { label: 'Seat Size (W×D)', value: '42×41 cm' },
        { label: 'Max Load Capacity', value: '150 kg per chair' },
      ],
      tr: [
        { label: 'Set', value: '6 sandalye' },
        { label: 'Kaplama Malzemesi', value: 'Vintage suni deri' },
        { label: 'Çerçeve', value: 'Metal' },
        { label: 'Döner Fonksiyon', value: '360°' },
        { label: 'Genel Ölçüler (G×Y×D)', value: '58.5×82.5×54.5 cm' },
        { label: 'Koltuk Boyutu (G×D)', value: '42×41 cm' },
        { label: 'Maksimum Yük Kapasitesi', value: 'Koltuk başı 150 kg' },
      ],
      ar: [
        { label: 'الطقم', value: '6 كراسي' },
        { label: 'مادة الغطاء', value: 'جلد صناعي كلاسيكي' },
        { label: 'الإطار', value: 'معدن' },
        { label: 'وظيفة الدوران', value: '360°' },
        { label: 'الأبعاد الإجمالية (ع×ا×ع)', value: '58.5×82.5×54.5 سم' },
        { label: 'حجم المقعد (ع×ع)', value: '42×41 سم' },
        { label: 'الحمولة القصوى', value: '150 كغ لكل كرسي' },
      ],
    },
  },
  // ── SHELVES & RACKS → accessories ─────────────────────────────────────────
  {
    slug: 'vasagle-bookshelf-with-doors',
    sku: 'SHF-001',
    price: 79,
    isNew: true,
    categorySlug: 'accessories',
    imageUrl:
      'https://i.otto.de/i/otto/6685a9f6-a69e-4753-af0e-36c6626b96c6/vasagle-bucherregal-standregal-2-facher-mit-turen-3-stockiges-regal-29-x-658-x-978-cm.jpg',
    title: {
      en: 'Bookshelf / Floor Shelf with Doors',
      tr: 'Kapılı Kitaplık / Zemin Rafı',
      ar: 'رف كتب أرضي مع أبواب',
    },
    description: {
      en: 'This modern 3-tier shelf combines minimalist design with practical functionality. Open compartments provide easy access, while closed sections with doors maintain order and privacy. Versatile use as a bookshelf, plant stand, or display shelf. Features a built-in anti-tip safety device. Dimensions: 29×65.8×97.8 cm.',
      tr: 'Bu modern 3 katlı raf, minimalist tasarım ile pratik işlevselliği birleştirir. Açık bölmeler kolay erişim sağlarken, kapılı kapalı bölmeler düzen ve gizlilik sağlar. Kitaplık, saksı askısı veya teşhir rafı olarak çok yönlü kullanım. Yerleşik devrilme önleyici güvenlik cihazı içerir. Ölçüler: 29×65.8×97.8 cm.',
      ar: 'يجمع رف الأرضية ثلاثي الطوابق الحديث هذا بين التصميم البسيط والوظيفية العملية. توفر الأقسام المفتوحة وصولاً سهلاً، بينما تحافظ الأقسام المغلقة بالأبواب على النظام والخصوصية. استخدام متعدد كرف كتب أو حامل نباتات أو رف عرض. يتميز بحماية مدمجة من الانقلاب. الأبعاد: 29×65.8×97.8 سم.',
    },
    excerpt: {
      en: 'Minimalist 3-tier shelf with doors, anti-tip protection, and versatile use as bookshelf or display rack.',
      tr: 'Kapılı, devrilme önleyicili ve kitaplık veya teşhir rafı olarak çok yönlü kullanımlı minimalist 3 katlı raf.',
      ar: 'رف ثلاثي الطوابق بسيط مع أبواب وحماية من الانقلاب، متعدد الاستخدامات كرف كتب أو عرض.',
    },
    tags: {
      en: 'Bookshelf, Shelf, Minimalist, Storage',
      tr: 'Kitaplık, Raf, Minimalist, Depolama',
      ar: 'رف كتب، رف، بسيط، تخزين',
    },
    specs: {
      en: [
        { label: 'Width', value: '29 cm' },
        { label: 'Depth', value: '65.8 cm' },
        { label: 'Height', value: '97.8 cm' },
        { label: 'Tiers', value: '3' },
        { label: 'Compartments with Doors', value: '2' },
        { label: 'Anti-Tip Protection', value: 'Yes' },
        { label: 'Suitable For', value: 'Bookshelf, plant stand, display shelf' },
      ],
      tr: [
        { label: 'Genişlik', value: '29 cm' },
        { label: 'Derinlik', value: '65.8 cm' },
        { label: 'Yükseklik', value: '97.8 cm' },
        { label: 'Katlar', value: '3' },
        { label: 'Kapılı Bölmeler', value: '2' },
        { label: 'Devrilme Koruması', value: 'Evet' },
        { label: 'Uygun Kullanım', value: 'Kitaplık, saksı askısı, teşhir rafı' },
      ],
      ar: [
        { label: 'العرض', value: '29 سم' },
        { label: 'العمق', value: '65.8 سم' },
        { label: 'الارتفاع', value: '97.8 سم' },
        { label: 'الطوابق', value: '3' },
        { label: 'الأقسام بالأبواب', value: '2' },
        { label: 'حماية من الانقلاب', value: 'نعم' },
        { label: 'مناسب لـ', value: 'رف كتب، حامل نباتات، رف عرض' },
      ],
    },
  },
  {
    slug: 'sekey-shoe-rack-10-tiers',
    sku: 'SHF-002',
    price: 59,
    categorySlug: 'accessories',
    imageUrl:
      'https://i.otto.de/i/otto/2b5c3d73-3c6f-40d7-a0dd-925a8edff36c/sekey-schuhregal-platzsparendes-schuhregal-mit-stecksystem-10-ebenen-hoch-schmal-schuhaufbewahrung-fur-20-30-paar-schuhe-transparent.jpg',
    title: {
      en: 'Shoe Rack with Plug System (10 Tiers)',
      tr: 'Takma Sistemli Ayakkabılık (10 Katlı)',
      ar: 'رف أحذية بنظام التجميع (10 طوابق)',
    },
    description: {
      en: 'Space-saving shoe rack with a tool-free plug-together system. Tall and narrow design with 10 tiers provides storage for 20–30 pairs of shoes. Stable construction achieved by firmly connecting the pieces. Transparent design blends with any interior. Easy to assemble and disassemble.',
      tr: 'Takma sistemiyle araçsız montaj sağlayan yer tasarrufu yapan ayakkabılık. 10 katlı tall ve dar tasarım, 20-30 çift ayakkabı için depolama sağlar. Parçaları sıkıca bağlayarak sağlam yapı elde edilir. Şeffaf tasarım her iç mekana uyum sağlar. Kolayca monte ve sökülebilir.',
      ar: 'رف أحذية موفر للمساحة بنظام تجميع بدون أدوات. تصميم طويل وضيق بـ10 طوابق يوفر تخزيناً لـ20-30 زوجاً من الأحذية. بناء ثابت يتحقق بتوصيل القطع بإحكام. التصميم الشفاف يتناسب مع أي ديكور داخلي. سهل التجميع والتفكيك.',
    },
    excerpt: {
      en: '10-tier transparent shoe rack for 20–30 pairs, tool-free assembly, space-saving narrow design.',
      tr: '20-30 çift için 10 katlı şeffaf ayakkabılık, araçsız montaj, yer tasarrufu sağlayan dar tasarım.',
      ar: 'رف أحذية شفاف 10 طوابق لـ20-30 زوجاً، تجميع بدون أدوات، تصميم ضيق موفر للمساحة.',
    },
    tags: {
      en: 'Shoe Rack, Storage, Transparent, Space Saving',
      tr: 'Ayakkabılık, Depolama, Şeffaf, Yer Tasarruflu',
      ar: 'رف أحذية، تخزين، شفاف، موفر للمساحة',
    },
    specs: {
      en: [
        { label: 'Tiers', value: '10' },
        { label: 'Capacity', value: '20–30 pairs of shoes' },
        { label: 'Design', value: 'Tall and narrow, space-saving' },
        { label: 'Assembly', value: 'Tool-free plug system' },
        { label: 'Color', value: 'Transparent' },
      ],
      tr: [
        { label: 'Katlar', value: '10' },
        { label: 'Kapasite', value: '20-30 çift ayakkabı' },
        { label: 'Tasarım', value: 'Tall ve dar, yer tasarrufu' },
        { label: 'Montaj', value: 'Araçsız takma sistemi' },
        { label: 'Renk', value: 'Şeffaf' },
      ],
      ar: [
        { label: 'الطوابق', value: '10' },
        { label: 'السعة', value: '20-30 زوجاً من الأحذية' },
        { label: 'التصميم', value: 'طويل وضيق، موفر للمساحة' },
        { label: 'التركيب', value: 'نظام تجميع بدون أدوات' },
        { label: 'اللون', value: 'شفاف' },
      ],
    },
  },
  {
    slug: 'otto-home-moid-wall-shelf',
    sku: 'SHF-003',
    price: 45,
    categorySlug: 'accessories',
    imageUrl:
      'https://i.otto.de/i/otto/5600581c-a7fa-5493-85c4-1968f1718669/otto-home-wandregal-moid-dekorativer-stauraum-wandmontage-weiss-korpus-weiss.jpg',
    title: {
      en: 'Moid Wall Shelf',
      tr: 'Moid Duvar Rafı',
      ar: 'رف جداري Moid',
    },
    description: {
      en: 'A smart wall-mounted shelf solution: vases, photographs, and decorative elements can be beautifully displayed on this Moid wall shelf from OTTO home. Maximum load capacity: 5 kg. Modern design with clean forms, complementing high-gloss surfaces and elements in chrome or stainless steel. Ideal for living rooms, bedrooms, or hallways.',
      tr: 'Akıllı duvara monte raf çözümü: vazolar, fotoğraflar ve dekoratif unsurlar OTTO home\'dan bu Moid duvar rafında güzelce sergilenebilir. Maksimum yük kapasitesi: 5 kg. Modern tasarım, yüksek parlak yüzeyler ve krom veya paslanmaz çelik elementlerle uyumlu net formlar. Oturma odaları, yatak odaları veya koridorlar için idealdir.',
      ar: 'حل ذكي لرف الجدار: يمكن عرض المزهريات والصور والعناصر الزخرفية بشكل جميل على رف الجدار Moid من OTTO home. الحمولة القصوى: 5 كغ. تصميم عصري بأشكال واضحة، يتناسق مع الأسطح عالية اللمعان والعناصر من الكروم أو الفولاذ المقاوم للصدأ. مثالي لغرف المعيشة وغرف النوم والردهات.',
    },
    excerpt: {
      en: 'Modern wall-mounted display shelf for decorative items, 5 kg capacity, fits any interior.',
      tr: 'Dekoratif eşyalar için modern duvara monte teşhir rafı, 5 kg kapasite, her iç mekana uyum sağlar.',
      ar: 'رف عرض حديث للتعليق على الجدار للعناصر الزخرفية، سعة 5 كغ، يناسب أي ديكور داخلي.',
    },
    tags: {
      en: 'Wall Shelf, Decor, Modern, Display',
      tr: 'Duvar Rafı, Dekor, Modern, Teşhir',
      ar: 'رف جداري، ديكور، عصري، عرض',
    },
    specs: {
      en: [
        { label: 'Mounting', value: 'Wall mounted' },
        { label: 'Max Load Capacity', value: '5 kg' },
        { label: 'Style', value: 'Modern' },
        { label: 'Suitable For', value: 'Decorative display, storage' },
        { label: 'Complementary Finishes', value: 'High-gloss, chrome, stainless steel' },
      ],
      tr: [
        { label: 'Montaj Tipi', value: 'Duvara monte' },
        { label: 'Maksimum Yük Kapasitesi', value: '5 kg' },
        { label: 'Stil', value: 'Modern' },
        { label: 'Uygun Kullanım', value: 'Dekoratif teşhir, depolama' },
        { label: 'Tamamlayıcı Kaplamalar', value: 'Yüksek parlak, krom, paslanmaz çelik' },
      ],
      ar: [
        { label: 'طريقة التثبيت', value: 'تثبيت جداري' },
        { label: 'الحمولة القصوى', value: '5 كغ' },
        { label: 'الأسلوب', value: 'عصري' },
        { label: 'مناسب لـ', value: 'عرض الديكور، التخزين' },
        { label: 'التشطيبات المتناسبة', value: 'عالي اللمعان، كروم، فولاذ مقاوم للصدأ' },
      ],
    },
  },
]

// ────────────────────────────────────────────
// Route handler
// ────────────────────────────────────────────

export async function POST() {
  const payload = await getPayload()
  const log: string[] = []

  // ── 1. Fix hero slides ──────────────────────────────────────────────────────
  try {
    log.push('Uploading hero images…')
    const heroIds = await Promise.all([
      uploadImageFromDisk(payload, 'hero/img-1.png', { tr: 'Modern mobilya', en: 'Modern furniture', ar: 'أثاث عصري' }),
      uploadImageFromDisk(payload, 'hero/img-2.png', { tr: 'Konfor ve tarz', en: 'Comfort and style', ar: 'راحة وأناقة' }),
      uploadImageFromDisk(payload, 'hero/img-3.png', { tr: 'Premium tasarım', en: 'Premium design', ar: 'تصميم فاخر' }),
    ])
    log.push(`Hero images uploaded: ${heroIds.join(', ')}`)

    // Read existing hero slides to preserve their text/IDs
    const enHome = await payload.findGlobal({ slug: 'homepage', locale: 'en', depth: 0 })
    const slideIds = ((enHome.heroSlides ?? []) as { id: string }[]).map((s) => s.id)

    // Patch only the image field for each slide
    const heroSlidesPatch = heroIds.map((imgId, i) => ({
      ...(slideIds[i] ? { id: slideIds[i] } : {}),
      image: imgId,
    }))
    await payload.updateGlobal({
      slug: 'homepage',
      locale: 'en',
      data: { heroSlides: heroSlidesPatch },
    })
    log.push('Hero slides updated with new images.')
  } catch (err) {
    log.push(`Hero fix error: ${err instanceof Error ? err.message : String(err)}`)
  }

  // ── 2. Look up existing category IDs ───────────────────────────────────────
  const catDocs = await payload.find({ collection: 'categories', limit: 20, depth: 0 })
  const categoryIdBySlug: Record<string, string | number> = {}
  for (const cat of catDocs.docs) {
    if (cat.slug) categoryIdBySlug[cat.slug] = cat.id
  }
  log.push(`Found categories: ${Object.keys(categoryIdBySlug).join(', ')}`)

  // ── 3. Add products ─────────────────────────────────────────────────────────
  const results: { slug: string; status: string; id?: string | number }[] = []

  for (const p of NEW_PRODUCTS) {
    try {
      const catId = categoryIdBySlug[p.categorySlug]
      if (!catId) {
        results.push({ slug: p.slug, status: `skipped – category "${p.categorySlug}" not found` })
        continue
      }

      log.push(`Downloading image for ${p.slug}…`)
      const imgId = await uploadImageFromUrl(payload, p.imageUrl, p.slug, {
        tr: p.title.tr,
        en: p.title.en,
        ar: p.title.ar,
      })

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
      log.push(`✓ Created: ${p.slug} (id=${created.id})`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      results.push({ slug: p.slug, status: `error: ${msg}` })
      log.push(`✗ Failed ${p.slug}: ${msg}`)
    }
  }

  return NextResponse.json({ success: true, log, results })
}
