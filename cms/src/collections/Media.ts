import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
    mimeTypes: ['image/*'],
    adminThumbnail: 'thumbnail',

    // Создание нескольких версий изображения для адаптивной загрузки
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 70,
          },
        },
      },
      {
        name: 'card',
        width: 768,
        height: 576,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 80,
          },
        },
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined, // Сохраняем пропорции
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 85,
          },
        },
      },
    ],

    // Настройки для оригинального изображения
    formatOptions: {
      format: 'webp',
      options: {
        quality: 90,
      },
    },

    // Ограничение размера оригинального изображения
    resizeOptions: {
      width: 1920,
      height: undefined, // Сохраняем пропорции
      fit: 'inside',
    },
  },
}
