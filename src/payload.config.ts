import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { fileURLToPath } from 'url'
import { Products } from './collections/Products'
import { Categories } from './collections/Categories'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Homepage } from './globals/Homepage'
import { ContactInfo } from './globals/ContactInfo'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',

  admin: {
    meta: {
      title: 'Mobilyam Admin',
      description: 'Mobilyam content management',
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/admin-logo.svg' }],
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo#default',
        Icon: '/components/admin/Icon#default',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: [Products, Categories, ContactSubmissions, Media, Posts],

  globals: [Homepage, ContactInfo, SiteSettings],

  localization: {
    locales: [
      { label: 'Türkçe', code: 'tr' },
      { label: 'English', code: 'en' },
      { label: 'العربية', code: 'ar', rtl: true },
    ],
    defaultLocale: 'tr',
    fallback: true,
  },

  editor: lexicalEditor({}),

  plugins: [
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            enabled: true,
            collections: {
              media: true,
            },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],

  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DATABASE_URI || `postgres://${process.env.USER || 'postgres'}@localhost:5432/mobilyam`,
    },
  }),

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  secret: process.env.PAYLOAD_SECRET || 'fallback-secret',
})
