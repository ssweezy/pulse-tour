import { CollectionConfig } from 'payload'

const Payments: CollectionConfig = {
  slug: 'payments',
  admin: {
    useAsTitle: 'passengerName',
  },
  access: {
    // Разрешаем создание для всех (публичный доступ)
    create: () => true,
    // Только админы могут читать
    read: ({ req: { user } }) => {
      // Если пользователь существует и является админом
      if (user) {
        return true
      }
      // Запрещаем доступ для неавторизованных пользователей
      return false
    },
    // Только админы могут обновлять
    update: ({ req: { user } }) => {
      if (user) {
        return true
      }
      return false
    },
    // Только админы могут удалять
    delete: ({ req: { user } }) => {
      if (user) {
        return true
      }
      return false
    },
  },
  fields: [
    {
      name: 'passengerName',
      type: 'text',
      label: 'Имя пассажира',
      required: true,
    },
    {
      name: 'totalAmount',
      type: 'number',
      label: 'Итоговая сумма',
      required: true,
    },
    {
      name: 'phoneNumber',
      type: 'text',
      label: 'Номер телефона',
      required: true,
    },
    {
      name: 'tour',
      type: 'relationship',
      relationTo: 'tours',
      label: 'Тур',
      required: true,
      index: true,
    },
    {
      name: 'agreement',
      type: 'select',
      label: 'Соглашение',
      options: [
        {
          label: 'Да',
          value: 'Да',
        },
        {
          label: 'Нет',
          value: 'Нет',
        },
      ],
      required: true,
    },
    {
      name: 'tgId',
      type: 'number',
      label: 'Telegram ID',
      defaultValue: 0,
      required: true,
    },
    {
      name: 'orderTime',
      type: 'date',
      label: 'Время заказа',
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'paymentStatus',
      type: 'select',
      label: 'Состояние оплаты',
      options: [
        {
          label: 'Ожидает оплаты',
          value: 'ожидает оплаты',
        },
        {
          label: 'Оплачено',
          value: 'оплачено',
        },
      ],
      defaultValue: 'ожидает оплаты',
      required: true,
    },
    {
      name: 'checkId',
      type: 'text',
      label: 'Check ID',
      required: true,
    },
    {
      name: 'selectedServices',
      type: 'array',
      label: 'Доп услуги',
      fields: [
        {
          name: 'serviceName',
          type: 'text',
          label: 'Название услуги',
          required: true,
        },
        {
          name: 'servicePrice',
          type: 'number',
          label: 'Цена услуги',
          required: true,
        },
      ],
    },
    {
      name: 'passengerCount',
      type: 'number',
      label: 'Количество пассажиров',
      defaultValue: 1,
      required: true,
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        // Проверяем, что это обновление документа (не создание)
        if (operation === 'update' || operation === 'create') {
          // Проверяем, изменилось ли состояние оплаты
          if (doc.paymentStatus !== previousDoc?.paymentStatus) {
            const tourId = doc.tour // ID тура из текущего документа
            const passengerCount = doc.passengerCount || 1 // Количество пассажиров в чеке

            if (tourId) {
              try {
                // Получаем текущий тур
                const tourData = await req.payload.findByID({
                  collection: 'tours',
                  id: typeof tourId === 'object' ? tourId.id : tourId,
                  depth: 0,
                })

                let newRemainingSeats = tourData.remainingSeats || tourData.seats || 0

                // Если статус изменился с "ожидает оплаты" на "оплачено", уменьшаем количество мест
                if (
                  previousDoc.paymentStatus === 'ожидает оплаты' &&
                  doc.paymentStatus === 'оплачено'
                ) {
                  newRemainingSeats = Math.max(0, newRemainingSeats - passengerCount)
                }
                // Если статус изменился с "оплачено" на "ожидает оплаты", увеличиваем количество мест
                else if (
                  previousDoc.paymentStatus === 'оплачено' &&
                  doc.paymentStatus === 'ожидает оплаты'
                ) {
                  newRemainingSeats = Math.min(tourData.seats, newRemainingSeats + passengerCount)
                }

                // Обновляем количество оставшихся мест в туре с bypassAccessControl
                await req.payload.update({
                  collection: 'tours',
                  id: tourId,
                  data: {
                    remainingSeats: newRemainingSeats,
                  },
                  overrideAccess: true, // Обходим проверку доступа для внутренних операций
                })
              } catch (error) {
                console.error('Ошибка при обновлении оставшихся мест в туре:', error)
              }

              // Отправляем сообщение пользователю через бота при изменении статуса платежа
              if (doc.paymentStatus === 'оплачено' && previousDoc.paymentStatus !== 'оплачено') {
                try {
                  // Получаем информацию о туре для сообщения
                  const tourData = await req.payload.findByID({
                    collection: 'tours',
                    id: tourId,
                    depth: 0,
                  })

                  // Формируем сообщение для пользователя
                  const message =
                    `🎉 Поздравляем с успешным заказом!\n\n` +
                    `💳 ID чека: ${doc.checkId}\n` +
                    `イベ Название тура: ${tourData.location}\n` +
                    `👤 Имя пассажира: ${doc.passengerName}\n` +
                    `📅 Дата тура: ${formatDate(tourData.date)}\n` +
                    `🕒 Время тура: ${formatTime(tourData.time)}\n` +
                    `📅 Дата покупки билета: ${formatDate(doc.orderTime)}\n` +
                    `💰 Стоимость: ${doc.totalAmount} руб.`

                  // Отправляем запрос на бекенд для отправки сообщения через Telegram бота
                  // Здесь должна быть реализация отправки сообщения через Telegram API
                  // Пока что просто логируем для демонстрации
                  console.log(`Сообщение для отправки пользователю ${doc.tgId}:`, message)

                  // В реальной реализации здесь будет вызов Telegram API для отправки сообщения

                  await fetch(
                    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        chat_id: doc.tgId,
                        text: message,
                      }),
                    },
                  )
                } catch (error) {
                  console.error('Ошибка при формировании сообщения для пользователя:', error)
                }
              }
            }
          }
        }
      },
    ],
  },
}

// Вспомогательные функции для форматирования даты и времени
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU')
}

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

export default Payments
