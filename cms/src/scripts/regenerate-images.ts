/**
 * Скрипт для регенерации всех изображений в коллекции Media
 * с новыми оптимизированными размерами и WebP форматом
 *
 * Использование:
 * npx tsx src/scripts/regenerate-images.ts
 */

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Загружаем переменные окружения из .env файла
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

import { getPayload } from 'payload'
import config from '../payload.config'

const regenerateImages = async () => {
  console.log('🚀 Запуск регенерации изображений...\n')

  try {
    // Инициализируем Payload
    const payload = await getPayload({ config })

    console.log('✓ Payload инициализирован')

    // Получаем все медиафайлы
    const { docs: mediaFiles, totalDocs } = await payload.find({
      collection: 'media',
      limit: 1000,
      depth: 0,
    })

    console.log(`📊 Найдено изображений: ${totalDocs}\n`)

    if (totalDocs === 0) {
      console.log('⚠️  Изображений не найдено')
      process.exit(0)
    }

    let processed = 0
    let errors = 0

    for (let i = 0; i < mediaFiles.length; i++) {
      const media = mediaFiles[i]
      const progress = `[${i + 1}/${totalDocs}]`

      try {
        console.log(`${progress} Обработка: ${media.filename}`)

        // Обновляем изображение - это заставит PayloadCMS перегенерировать все размеры
        await payload.update({
          collection: 'media',
          id: media.id,
          data: {
            alt: media.alt || 'Image', // Не меняем данные, просто триггерим обновление
          },
        })

        processed++
        console.log(`${progress} ✓ Успешно обработано: ${media.filename}`)

        // Небольшая пауза чтобы не перегружать сервер
        await new Promise((resolve) => setTimeout(resolve, 100))
      } catch (error) {
        errors++
        console.error(`${progress} ✗ Ошибка при обработке ${media.filename}:`)
        console.error(`   ${error instanceof Error ? error.message : String(error)}`)
      }
    }

    console.log('\n' + '='.repeat(50))
    console.log('📈 Статистика:')
    console.log(`   Всего изображений: ${totalDocs}`)
    console.log(`   Успешно обработано: ${processed}`)
    console.log(`   Ошибок: ${errors}`)
    console.log('='.repeat(50))

    if (errors === 0) {
      console.log('\n🎉 Все изображения успешно перегенерированы!')
    } else {
      console.log(
        `\n⚠️  Завершено с ошибками. Проверьте ${errors} изображени${errors === 1 ? 'е' : 'й'}.`,
      )
    }
  } catch (error) {
    console.error('\n❌ Критическая ошибка:')
    console.error(error)
    process.exit(1)
  }

  process.exit(0)
}

// Запускаем скрипт
regenerateImages()
