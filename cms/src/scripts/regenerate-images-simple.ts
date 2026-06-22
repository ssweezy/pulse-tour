/**
 * Упрощенный скрипт для регенерации изображений
 * Использует прямой доступ к файловой системе и Sharp
 *
 * Использование:
 * npx tsx src/scripts/regenerate-images-simple.ts
 */

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Путь к директории с медиафайлами
const MEDIA_DIR = '/var/www/html/media'

// Конфигурация размеров (те же что в Media.ts)
const IMAGE_SIZES = [
  {
    name: 'thumbnail',
    width: 400,
    height: 300,
    quality: 70,
  },
  {
    name: 'card',
    width: 768,
    height: 576,
    quality: 80,
  },
  {
    name: 'tablet',
    width: 1024,
    height: null, // Сохраняем пропорции
    quality: 85,
  },
]

const regenerateImage = async (filePath: string, filename: string) => {
  try {
    const ext = path.extname(filename)
    const baseName = path.basename(filename, ext)

    console.log(`  Обработка: ${filename}`)

    // Создаем оптимизированный оригинал (если еще не WebP)
    if (ext.toLowerCase() !== '.webp') {
      const originalWebP = path.join(MEDIA_DIR, `${baseName}.webp`)
      await sharp(filePath)
        .resize({ width: 1920, fit: 'inside' })
        .webp({ quality: 90 })
        .toFile(originalWebP)
      console.log(`    ✓ Создан оригинал WebP: ${baseName}.webp`)
    }

    // Создаем все размеры
    for (const size of IMAGE_SIZES) {
      const sizeName = size.height
        ? `${baseName}-${size.width}x${size.height}.webp`
        : `${baseName}-${size.width}xAUTO.webp`

      const outputPath = path.join(MEDIA_DIR, sizeName)

      const resizeOptions: any = { width: size.width, fit: 'cover' }
      if (size.height) {
        resizeOptions.height = size.height
      }

      await sharp(filePath)
        .resize(resizeOptions)
        .webp({ quality: size.quality })
        .toFile(outputPath)

      console.log(`    ✓ Создан размер '${size.name}': ${sizeName}`)
    }

    return true
  } catch (error) {
    console.error(`    ✗ Ошибка: ${error instanceof Error ? error.message : String(error)}`)
    return false
  }
}

const main = async () => {
  console.log('🚀 Запуск упрощенной регенерации изображений...\n')

  // Проверяем существование директории
  if (!fs.existsSync(MEDIA_DIR)) {
    console.error(`❌ Директория ${MEDIA_DIR} не найдена!`)
    console.log(
      'Подсказка: Измените путь MEDIA_DIR в начале скрипта на правильный путь к вашей папке media',
    )
    process.exit(1)
  }

  // Получаем список всех файлов
  const files = fs.readdirSync(MEDIA_DIR)

  // Фильтруем только изображения (исключаем уже созданные размеры)
  const imageFiles = files.filter((file) => {
    const ext = path.extname(file).toLowerCase()
    const isImage = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
    const isNotSize =
      !file.includes('-400x300') && !file.includes('-768x576') && !file.includes('-1024xAUTO')

    return isImage && isNotSize
  })

  console.log(`📊 Найдено оригинальных изображений: ${imageFiles.length}\n`)

  if (imageFiles.length === 0) {
    console.log('⚠️  Изображений для обработки не найдено')
    process.exit(0)
  }

  let processed = 0
  let errors = 0

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i]
    const filePath = path.join(MEDIA_DIR, file)
    const progress = `[${i + 1}/${imageFiles.length}]`

    console.log(`${progress} ${file}`)

    const success = await regenerateImage(filePath, file)
    if (success) {
      processed++
    } else {
      errors++
    }

    console.log('') // Пустая строка для читаемости
  }

  console.log('='.repeat(50))
  console.log('📈 Статистика:')
  console.log(`   Всего изображений: ${imageFiles.length}`)
  console.log(`   Успешно обработано: ${processed}`)
  console.log(`   Ошибок: ${errors}`)
  console.log('='.repeat(50))

  if (errors === 0) {
    console.log('\n🎉 Все изображения успешно перегенерированы!')
    console.log(
      '\n💡 Теперь новые изображения будут загружаться значительно быстрее!\n',
    )
  } else {
    console.log(
      `\n⚠️  Завершено с ошибками. Проверьте ${errors} изображени${errors === 1 ? 'е' : 'й'}.\n`,
    )
  }
}

// Запускаем
main().catch((error) => {
  console.error('\n❌ Критическая ошибка:')
  console.error(error)
  process.exit(1)
})
