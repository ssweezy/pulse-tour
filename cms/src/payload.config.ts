import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import Tours from './collections/Tours'
import Payments from './collections/Payments'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Tours, Payments],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    // На Vercel (NODE_ENV=production) Payload по умолчанию НЕ создаёт схему,
    // а миграций в проекте нет. push создаёт/синхронизирует таблицы при старте.
    // Оставь включённым для первого деплоя; после успешного старта можно
    // выставить PAYLOAD_DB_PUSH=false в переменных окружения Vercel.
    push: process.env.PAYLOAD_DB_PUSH !== 'false',
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      // Ограничиваем пул: Supabase session-пулер (free) даёт лимит 15 клиентов,
      // а serverless плодит инстансы. max=3 не даёт исчерпать лимит.
      max: Number(process.env.DB_POOL_MAX || 3),
    },
  }),
  sharp,
  plugins: [
    // Хранение медиа в Vercel Blob. Локально без токена плагин выключается
    // и Payload пишет файлы на диск (см. staticDir в Media.ts).
    vercelBlobStorage({
      // Всегда включён: иначе при отсутствии токена на этапе сборки плагин
      // выключался и Payload пытался писать медиа на диск Vercel (ENOENT mkdir /vercel).
      enabled: true,
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],

  // Server URL. Если PAYLOAD_PUBLIC_SERVER_URL не задан — оставляем undefined,
  // тогда админка использует относительные URL (свой же домен на Vercel).
  // Раньше здесь был хардкод старого бегет-домена → админка ходила на чужой сервер.
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || undefined,

  // CORS: разрешить запросы с фронтенда и с самого себя
  cors: [
    'https://pulsetravel.ru',
    'https://www.pulsetravel.ru',
    'https://abaxgeetudaf.beget.app',
    ...(process.env.CORS_ORIGINS?.split(',') || []),
  ],

  // CSRF: разрешить запросы с фронтенда и с самого себя
  csrf: [
    'https://pulsetravel.ru',
    'https://www.pulsetravel.ru',
    'https://abaxgeetudaf.beget.app',
    ...(process.env.CSRF_ORIGINS?.split(',') || []),
  ],

  // Note: To increase file upload size limits beyond the default 10MB,
  // you need to configure this in your hosting environment or server setup.
  // For Next.js deployments, you can set the maxFileSize in your media collection
  // or adjust the body parser limits in your deployment configuration.
})
