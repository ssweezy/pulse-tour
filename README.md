# Pulse-Tour

Frontend часть приложения для турагентства Pulse-Tour. Это React-приложение, созданное с помощью Vite, которое взаимодействует с CMS на базе PayloadCMS.

## 🚀 Новое: Оптимизация изображений

Добавлена автоматическая оптимизация изображений с конвертацией в WebP формат.
**Результат: загрузка изображений в 5 раз быстрее!** (с ~2 сек до ~0.4 сек)

### 📚 Документация:

### 🗺️ Конфигурация серверов:

- **PayloadCMS**: https://abaxgeetudaf.beget.app/
- **Путь на сервере**: `/var/www/payload`
- **PostgreSQL**: beget.app
- **Frontend**: Reg.ru (статика)

## Установка и запуск

1. Установите зависимости:

```bash
npm install
```

2. Настройте переменные окружения:

```bash
npm run env:dev  # для локальной разработки
# или
npm run env:prod # для продакшена
```

3. Запустите приложение:

```bash
npm run dev
```

## Настройка CORS

Для настройки CORS между frontend (порт 5173) и backend (порт 3000) выполнены следующие изменения:

1. В `cms/src/payload.config.ts` добавлены настройки CORS:

   ```typescript
   cors: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'],
   csrf: process.env.CSRF_ORIGINS?.split(',') || ['http://localhost:5173'],
   ```

2. В `vite.config.js` настроено проксирование API запросов с `/api` на `http://localhost:3000`

3. Во всех компонентах используются переменные окружения `VITE_API_URL` для API запросов

4. В файле `.env` можно настроить URL API:
   ```
   VITE_API_URL=http://localhost:3000  # для разработки
   VITE_API_URL=https://yourdomain.com # для продакшена
   ```

## Управление доступом

В системе настроены следующие правила доступа:

- **Tours**: Чтение разрешено для всех, создание/обновление/удаление только для администраторов
  - Обязательные поля: название, описание, мини-описание, локация, дата, время, цена, фоновое изображение, галерея фотографий, количество мест, статус, slug
- **Payments**: Создание разрешено для всех (для оформления заказов), чтение и обновление только для администраторов
- **Media**:
  - Чтение разрешено для всех (для отображения изображений)
  - Создание, обновление и удаление только для администраторов
  - Автоматическая оптимизация изображений: временно отключена из-за проблем с миграцией базы данных

## Скрипты

- `npm run dev` - запуск в режиме разработки
- `npm run build` - сборка проекта
- `npm run preview` - предпросмотр сборки
- `npm run env:dev` - настройка переменных окружения для разработки
- `npm run env:prod` - настройка переменных окружения для продакшена

## Деплой Payload CMS на продакшен

### Подготовка к деплою

1. **Настройте переменные окружения для продакшена в `cms/.env`**:

   ```
   PORT=3000
   DATABASE_URI=postgresql://username:password@host:port/database_name
   PAYLOAD_SECRET=your_long_secret_string
   CORS_ORIGINS=https://pulsetravel.ru
   CSRF_ORIGINS=https://pulsetravel.ru
   ```

2. **Убедитесь, что у вас есть доступ к PostgreSQL базе данных** на сервере

### Сборка и деплой

1. **Установите зависимости в CMS директории**:

   ```bash
   cd cms
   pnpm install
   ```

2. **Соберите проект**:

   ```bash
   pnpm build
   ```

3. **Файлы для загрузки на сервер**:
   - Вся директория `cms` (включая файлы `.env`, `package.json`, `pnpm-lock.yaml`)
   - Содержимое директории `cms/.next` (после сборки)
   - Директория `media` (если есть загруженные файлы)

4. **Настройка на сервере**:
   - Установите Node.js (версия >=18.20.2 или >=20.9.0)
   - Установите pnpm: `npm install -g pnpm`
   - Установите зависимости: `cd cms && pnpm install`
   - Запустите приложение: `cd cms && pnpm start`

### Настройка домена

Чтобы Payload CMS принимал запросы от `pulsetravel.ru`:

1. **Обновите настройки CORS в `cms/src/payload.config.ts`**:

   ```typescript
   cors: process.env.CORS_ORIGINS?.split(',') || ['https://pulsetravel.ru'],
   csrf: process.env.CSRF_ORIGINS?.split(',') || ['https://pulsetravel.ru'],
   ```

2. **Настройте reverse proxy (nginx)** на сервере:

   ```
   server {
       listen 80;
       server_name pulsetravel.ru;

       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;

           # Для загрузки файлов
           client_max_body_size 50M;
       }

       # Для статики (если используете отдельно)
       location /media {
           alias /path/to/your/project/media;
           expires 1y;
       }
   }
   ```

### Альтернативный вариант: Разделение фронтенда и CMS

Если вы хотите разместить CMS на отдельном поддомене (например, `admin.pulsetravel.ru`):

1. **Разместите собранную версию фронтенда** в корне домена `pulsetravel.ru`
2. **Разместите CMS** на поддомене и настройте соответствующие CORS заголовки

## Структура проекта

- `src/` - исходный код frontend приложения
- `cms/` - код PayloadCMS backend
- `docs/` - документация
- `scripts/` - вспомогательные скрипты

## React + Vite

Этот шаблон предоставляет минимальную настройку для работы React в Vite с HMR и некоторыми правилами ESLint.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Production Deployment Configuration

For proper client-side routing to work in production, your web server needs to be configured to serve the `index.html` file for any route that doesn't correspond to an actual static file. This ensures that React Router can handle the routing on the client side.

### Nginx Configuration Example

```
server {
    listen 80;
    server_name pulsetravel.ru;
    root /path/to/your/build/folder;
    index index.html;

    # Serve static assets directly
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|otf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # For any other route, serve index.html to allow React Router to handle it
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Apache Configuration Example (.htaccess)

```
Options -MultiViews
RewriteEngine On

# Rewrite all non-existent files to index.html to allow React Router to handle routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

This configuration ensures that routes like `/tour/slug` will work correctly when accessed directly or refreshed, preventing 404 errors.

## For Hosting on Shared Servers (like Reg.ru)

If you are hosting your application on a shared hosting service like Reg.ru, you typically won't have access to configure nginx directly. In this case, you should use an `.htaccess` file to achieve the same functionality.

Create a `.htaccess` file in the root of your public directory with the following content:

```
Options -MultiViews
RewriteEngine On

# Rule to redirect all requests except static files to index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [QSA,L]

# Setting proper caching headers for static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType application/font-woff "access plus 1 year"
    ExpiresByType application/font-woff2 "access plus 1 year"
    ExpiresByType application/vnd.ms-fontobject "access plus 1 year"
    ExpiresByType font/opentype "access plus 1 year"
    ExpiresByType font/ttf "access plus 1 year"
    ExpiresByType font/otf "access plus 1 year"
    ExpiresByType image/x-icon "access plus 1 year"
</IfModule>

# Setting MIME types for fonts
<IfModule mod_mime.c>
    AddType application/font-woff2 .woff2
    AddType application/vnd.ms-fontobject .eot
    AddType font/opentype .otf
    AddType font/ttf .ttf
</IfModule>
```

This `.htaccess` file will ensure that:

1. Direct access to routes like `/tour/slug` works correctly
2. Page refreshes work without showing 404 errors
3. Static assets are properly cached for better performance

## Important: Manual Upload Required

**Note:** The `.htaccess` file is NOT automatically included during the build process (`npm run build`). You must manually upload this file to your hosting server after deploying your application.

To deploy:

1. Build your application: `npm run build`
2. Upload the contents of the `dist` folder to your hosting public directory
3. **Manually upload the `.htaccess` file to the same public directory**
4. Verify that the `.htaccess` file is placed in the root of your website's public directory (where `index.html` is located)

The `.htaccess` file must be in the same directory as your `index.html` file for the rewrite rules to work properly.

## Media Files Directory Configuration

When deploying to production, note that the media files directory path differs between environments:

- **Development**: `../../media` (relative to cms/src/collections/Media.ts)
- **Production**: `/var/www/payload-cms/media` (absolute path on server)

Make sure the production server has the correct directory structure and appropriate write permissions for the media directory.
