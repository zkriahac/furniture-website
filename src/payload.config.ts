import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
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
    ...(process.env.R2_BUCKET
      ? [
          s3Storage({
            collections: {
              media: {
                generateFileURL: ({ filename, prefix }) => {
                  const base = process.env.R2_PUBLIC_URL || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET}`
                  return prefix ? `${base}/${prefix}/${filename}` : `${base}/${filename}`
                },
              },
            },
            bucket: process.env.R2_BUCKET,
            config: {
              endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
              region: 'auto',
              credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
              },
            },
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
