import { NextResponse } from 'next/server'
import { getPayload } from '@/lib/getPayload'

// Slug → cleaned titles per locale
const TITLE_FIXES: Record<string, { en: string; tr: string; ar: string }> = {
  'mks-mobel-peter-l-corner-sofa': {
    en: 'PETER L Corner Sofa',
    tr: 'PETER L Köşe Koltuk',
    ar: 'أريكة زاوية PETER L',
  },
  'altdecor-eskar-l-corner-sofa': {
    en: 'ESKAR-L Corner Sofa with Sleeping Function',
    tr: 'ESKAR-L Uyku Fonksiyonlu Köşe Koltuk',
    ar: 'أريكة زاوية ESKAR-L بوظيفة النوم',
  },
  'otto-home-onniko-cord-sofa-bed': {
    en: 'ONNIKO Cord Sofa Bed',
    tr: 'ONNIKO Kord Yataklı Kanepe',
    ar: 'أريكة سرير ONNIKO كورد',
  },
  'fdm-cloudy-upholstered-bed': {
    en: 'CLOUDY Upholstered Bed',
    tr: 'CLOUDY Döşemeli Yatak',
    ar: 'سرير منجد CLOUDY',
  },
  'juskys-leona-upholstered-bed': {
    en: 'Leona Upholstered Bed',
    tr: 'Leona Döşemeli Yatak',
    ar: 'سرير منجد Leona',
  },
  'furnishings-home-led-storage-bed': {
    en: 'LED Storage Bed with Drawers',
    tr: 'Çekmeceli LED Depolama Yatağı',
    ar: 'سرير تخزين LED مع أدراج',
  },
  'home-collective-multipurpose-wardrobe': {
    en: 'Multi-Purpose Wardrobe',
    tr: 'Çok Amaçlı Gardırop',
    ar: 'خزانة متعددة الأغراض',
  },
  'home-affaire-edil-hallway-cabinet': {
    en: 'EDIL Hallway Cabinet',
    tr: 'EDIL Koridor Dolabı',
    ar: 'خزانة الردهة EDIL',
  },
  'home-affaire-skarde-wardrobe': {
    en: 'Skarde Wardrobe',
    tr: 'Skarde Giysi Dolabı',
    ar: 'خزانة ملابس Skarde',
  },
  'hela-coffee-table-height-adjustable': {
    en: 'Coffee Table on Wheels (Height Adjustable & Extendable)',
    tr: 'Tekerlekli Sehpa (Yükseklik Ayarlı ve Uzatılabilir)',
    ar: 'طاولة قهوة على عجلات قابلة للتعديل والتمديد',
  },
  'altdecor-asiv-extendable-dining-table': {
    en: 'ASIV Extendable Dining Table',
    tr: 'ASIV Uzatılabilir Yemek Masası',
    ar: 'طاولة طعام ASIV قابلة للتمديد',
  },
  'sanodesk-electric-height-adjustable-desk': {
    en: 'Electric Height-Adjustable Desk',
    tr: 'Elektrikli Yükseklik Ayarlı Çalışma Masası',
    ar: 'مكتب كهربائي قابل للتعديل',
  },
  'homavo-yz6-dining-chair-set-4': {
    en: 'YZ6 Dining Chair Set of 4',
    tr: 'YZ6 Yemek Sandalyesi 4\'lü Set',
    ar: 'طقم كراسي طعام YZ6 (4 قطع)',
  },
  'albatros-bora-dining-chair-set-4': {
    en: 'BORA Dining Chair Set of 4',
    tr: 'BORA Yemek Sandalyesi 4\'lü Set',
    ar: 'طقم كراسي طعام BORA (4 قطع)',
  },
  'woltu-swivel-dining-chair-set-6': {
    en: 'Swivel Upholstered Chair Set of 6',
    tr: 'Döner Döşemeli Sandalye 6\'lı Set',
    ar: 'طقم كراسي منجدة دوارة (6 قطع)',
  },
  'vasagle-bookshelf-with-doors': {
    en: 'Bookshelf / Floor Shelf with Doors',
    tr: 'Kapılı Kitaplık / Zemin Rafı',
    ar: 'رف كتب أرضي مع أبواب',
  },
  'sekey-shoe-rack-10-tiers': {
    en: 'Shoe Rack with Plug System (10 Tiers)',
    tr: 'Takma Sistemli Ayakkabılık (10 Katlı)',
    ar: 'رف أحذية بنظام التجميع (10 طوابق)',
  },
  'otto-home-moid-wall-shelf': {
    en: 'Moid Wall Shelf',
    tr: 'Moid Duvar Rafı',
    ar: 'رف جداري Moid',
  },
}

export async function POST() {
  const payload = await getPayload()
  const results: { slug: string; status: string }[] = []

  for (const [slug, titles] of Object.entries(TITLE_FIXES)) {
    try {
      const found = await payload.find({
        collection: 'products',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 0,
      })
      if (!found.docs.length) {
        results.push({ slug, status: 'not found – skipped' })
        continue
      }
      const id = found.docs[0].id

      await payload.update({ collection: 'products', id, locale: 'en', data: { title: titles.en } })
      await payload.update({ collection: 'products', id, locale: 'tr', data: { title: titles.tr } })
      await payload.update({ collection: 'products', id, locale: 'ar', data: { title: titles.ar } })

      results.push({ slug, status: 'updated' })
    } catch (err) {
      results.push({ slug, status: `error: ${err instanceof Error ? err.message : String(err)}` })
    }
  }

  return NextResponse.json({ success: true, results })
}
