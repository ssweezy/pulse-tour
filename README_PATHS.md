# 📁 Правильные пути для вашего проекта

## ⚠️ ВАЖНО: Путь на сервере

Ваш проект находится в `/var/www/payload`, а НЕ в `/var/www/payload-cms`

## 🗺️ Карта путей

### На сервере (beget.app)

```
/var/www/payload/                          ← Корень проекта
├── src/
│   ├── collections/
│   │   └── Media.ts                   ← Оптимизация изображений
│   └── scripts/
│       ├── regenerate-images.ts        ← Скрипт через API
│       └── regenerate-images-simple.ts ← Прямая работа с файлами
├── media/                              ← Хранилище изображений
│   ├── image.webp                      ← Оригиналы
│   ├── image-400x300.webp              ← thumbnail
│   ├── image-768x576.webp              ← card
│   └── image-1024xAUTO.webp            ← tablet
├── .next/                              ← Сборка Next.js
├── .env                                ← Переменные окружения
├── package.json                        ← Зависимости
└── ...
```

### В документации

При чтении документов **замените все** `/var/www/payload-cms` на `/var/www/payload`:

| В документах написано                           | Правильный путь для вас                     |
| ----------------------------------------------- | ------------------------------------------- |
| `/var/www/payload-cms`                          | `/var/www/payload`                          |
| `/var/www/payload-cms/media`                    | `/var/www/payload/media`                    |
| `/var/www/payload-cms/src/collections/Media.ts` | `/var/www/payload/src/collections/Media.ts` |
| `/var/www/payload-cms/.next`                    | `/var/www/payload/.next`                    |

---

## 📝 Файлы с исправленными путями

✅ Уже обновлены:

- `БЫСТРЫЙ_СТАРТ.md` - все пути правильные
- `СРОЧНОЕ_ИСПРАВЛЕНИЕ.md` - все пути правильные
- `QUICK_START_OPTIMIZATION.md` - все пути правильные
- `cms/src/collections/Media.ts` - staticDir: '/var/www/payload/media'
- `cms/src/scripts/regenerate-images-simple.ts` - MEDIA_DIR: '/var/www/payload/media'

⚠️ Требуют замены при чтении:

- `IMAGE_OPTIMIZATION_GUIDE.md` - замените пути при использовании
- `РЕШЕНИЕ_ОШИБКИ.md` - замените пути при использовании
- `РЕШЕНИЕ_ОШИБКИ_БД.md` - замените пути при использовании
- `README.md` - информационно, не критично

---

## 🎯 Какие команды использовать

### Правильно ✅

```bash
ssh user@abaxgeetudaf.beget.app
cd /var/www/payload
pm2 logs
pnpm dev
pnpm build
pnpm regenerate-images-simple
```

### Неправильно ❌

```bash
cd /var/www/payload-cms  # ← Неправильный путь!
```

---

## 🔧 Проверка правильности путей

### 1. Проверьте Media.ts

```bash
cat /var/www/payload/src/collections/Media.ts | grep staticDir
```

Должно быть:

```typescript
staticDir: '/var/www/payload/media',
```

### 2. Проверьте скрипт регенерации

```bash
cat /var/www/payload/src/scripts/regenerate-images-simple.ts | grep MEDIA_DIR
```

Должно быть:

```typescript
const MEDIA_DIR = "/var/www/payload/media";
```

### 3. Проверьте что папка media существует

```bash
ls -la /var/www/payload/media
```

---

## 📚 Используйте эти документы

Для быстрого старта с правильными путями:

1. **БЫСТРЫЙ_СТАРТ.md** ⭐ - самый актуальный, все пути правильные
2. **СРОЧНОЕ_ИСПРАВЛЕНИЕ.md** - для исправления ошибки БД
3. **QUICK_START_OPTIMIZATION.md** - пошаговое развертывание

Остальные документы используйте как справочные, заменяя пути.

---

## 💡 Совет

Добавьте в `.bashrc` на сервере алиас для быстрого перехода:

```bash
echo "alias cdcms='cd /var/www/payload'" >> ~/.bashrc
source ~/.bashrc

# Теперь можно использовать:
cdcms  # вместо cd /var/www/payload
```
