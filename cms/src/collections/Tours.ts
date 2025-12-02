import type { CollectionConfig } from 'payload'

const Tours: CollectionConfig = {
  slug: 'tours',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'location', 'date', 'time'],
  },
  fields: [
    // 1. Название тура
    {
      name: 'name',
      type: 'text',
      label: 'Название тура',
      required: true,
    },

    // 2. Локация
    {
      name: 'location',
      type: 'text',
      label: 'Локация',
      required: true,
    },

    // 3. Дата (тип date)
    {
      name: 'date',
      type: 'date',
      label: 'Дата тура',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'default', // покажет и дату, и время в админке
        },
      },
    },

    // 4. Время (отдельное поле, если нужно точное время, не связанное с датой)
    {
      name: 'time',
      type: 'date',
      label: 'Время тура',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'timeOnly', // покажет и дату, и время в админке
        },
      },
    },

    // 5. Фото для блока (обложка)
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Обложка (для карточки)',
    },

    // 6. Галерея фотографий
    {
      name: 'gallery',
      type: 'array',
      label: 'Галерея',
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Фотография',
        },
      ],
    },

    // 7. Краткое описание (для блока на главной)
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Краткое описание (для карточки)',
      required: true,
      maxLength: 25, // чтобы не писали романы
    },

    // 8. Подробное описание (для страницы тура)
    {
      name: 'longDescription',
      type: 'richText', // или 'textarea', но richText удобнее
      label: 'Подробное описание',
      required: true,
    },

    // 9. URL-часть (slug) — для красивых ссылок
    {
      name: 'slug',
      type: 'text',
      label: 'URL-часть (латиницей, например: balkaria-hike)',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },

    // 10. Цена (опционально, но полезно)
    {
      name: 'price',
      type: 'number',
      label: 'Цена RUB (только число, без букв)',
      required: true,
    },
  ],
};

export default Tours;