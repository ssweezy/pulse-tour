// cms/src/collections/Tours.ts
import { CollectionConfig } from 'payload';

const Tours: CollectionConfig = {
  slug: 'tours', // URL API: /api/tours
  admin: {
    useAsTitle: 'title', // в админке заголовок — поле title
  },
  fields: [
    // 🔹 Название тура
    {
      name: 'title',
      type: 'text',
      label: 'Название тура',
      required: true,
    },

    // 🔹 Описание (краткое, для главной страницы)
    {
      name: 'description',
      type: 'textarea',
      label: 'Краткое описание',
      required: true,
    },

    // 🔹 Полное описание (опционально, для страницы тура)
    {
      name: 'fullDescription',
      type: 'richText', // или 'textarea', если не нужен форматированный текст
      label: 'Полное описание (для страницы тура)',
    },

    // 🔹 Дата проведения тура
    {
      name: 'date',
      type: 'date',
      label: 'Дата тура',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime', // покажет календарь + время (но время игнорируется)
        },
      },
    },

    // 🔹 Время начала (в часах: минуты)
    {
      name: 'time',
      type: 'text',
      label: 'Время начала (например: 10:00)',
      required: true,
      // Можно добавить валидацию позже
    },

    // 🔹 Цена в рублях
    {
      name: 'price',
      type: 'number',
      label: 'Цена (RUB)',
      required: true,
      min: 0,
    },

    // 🔹 Слаг для URL (например: balkaria-hike)
    {
      name: 'slug',
      type: 'text',
      label: 'URL-часть (латиницей, без пробелов)',
      required: true,
      unique: true,
      admin: {
        placeholder: 'balkaria-hike',
      },
    },

    // 🔹 Фон блока (одно изображение — для карточки на главной)
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Фон карточки (на главной странице)',
      required: true,
    },

    // 🔹 Галерея фотографий тура (много изображений)
    {
      name: 'gallery',
      type: 'array',
      label: 'Фотографии тура (галерея)',
      required: true,
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Подпись (опционально)',
        },
      ],
    },
  ],
};

export default Tours;