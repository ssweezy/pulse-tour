import { CollectionConfig } from 'payload'

const Tours: CollectionConfig = {
  slug: 'tours',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    // Разрешаем чтение для всех
    read: () => true,
    // Остальные операции только для админов
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Название тура',
      maxLength: 30,
      required: true,
    },
    {
      name: 'info',
      type: 'text',
      label: 'Описание тура (без стоимости, базового тарифа и доп услуг)',
      required: true,
    },
    {
      name: 'miniinfo',
      type: 'text',
      maxLength: 70,
      label: 'Мини-описание тура (отображается в блоке тура на главной странице)',
      required: true,
    },
    {
      name: 'location',
      type: 'text',
      label: 'Локация тура',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      label: 'Дата',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'time',
      type: 'date',
      label: 'Время',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'timeOnly',
          displayFormat: 'HH:mm', // 24-часовой формат отображения
          timeFormat: 'HH:mm', // 24-часовой формат в выпадающем меню
        },
      },
    },
    {
      name: 'price',
      type: 'number',
      label: 'Цена (в рублях)',
      required: true,
      min: 0,
    },
    {
      name: 'included',
      type: 'array',
      label: 'Что входит в стоимость',
      fields: [
        {
          name: 'item',
          type: 'text',
          label: 'Пункт...',
          required: true,
        },
      ],
    },
    {
      name: 'extraServices',
      type: 'array',
      label: 'Дополнительные услуги',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Название',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          label: 'Описание',
        },
        {
          name: 'price',
          type: 'number',
          label: 'Цена',
          required: true,
          min: 0,
        },
        {
          name: 'quantity',
          type: 'number',
          label: 'Количество',
          required: true,
          min: 0,
          defaultValue: 1,
        },
      ],
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Фоновая картинка блока тура',
      required: true,
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Галерея фотографий',
      required: true,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'seats',
      type: 'number',
      label: 'Количество мест',
      required: true,
      min: 1,
    },
    {
      name: 'remainingSeats',
      type: 'number',
      label: 'Осталось мест',
      required: true,
      min: 0,
      defaultValue: 18, // Временное значение по умолчанию, будет перезаписано хуком
      admin: {
        readOnly: true, // Это поле будет обновляться автоматически
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Статус тура',
      options: [
        {
          label: 'Активный',
          value: 'active',
        },
        {
          label: 'Завершен',
          value: 'completed',
        },
        {
          label: 'Отменен',
          value: 'cancelled',
        },
      ],
      defaultValue: 'active',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label:
        'URL-идентификатор (slug) - название тура на английском без пробелов с маленькой буквы',
      unique: true,
      required: true,
      admin: {
        position: 'sidebar', // отображать в сайдбаре админки
      },
      hooks: {
        beforeValidate: [
          // Автоматически генерировать slug из title, если не задан
          ({ siblingData, value }) => {
            if (!value && siblingData.title) {
              return siblingData.title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '') // оставить только буквы, цифры, пробелы, дефисы
                .replace(/[\s-]+/g, '-') // заменить пробелы и группы дефисов на один дефис
                .replace(/^-+|-+$/g, '') // убрать дефисы в начале и конце
            }
            return value
          },
        ],
      },
    },
  ],
  hooks: {
    beforeChange: [
      // Устанавливаем начальное значение оставшихся мест при создании тура
      ({ data, operation }) => {
        if (operation === 'create') {
          // При создании тура устанавливаем remainingSeats равным seats
          return {
            ...data,
            remainingSeats: data.seats,
          }
        }
        return data
      },
    ],
  },
}

export default Tours
