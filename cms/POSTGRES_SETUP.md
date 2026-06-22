# Настройка подключения к PostgreSQL для Payload CMS

## Установка зависимостей

Перед настройкой подключения убедитесь, что вы установили все необходимые зависимости:

```bash
cd cms
pnpm install
```

## Настройка переменных окружения

1. Создайте файл `.env` в директории `cms/` на основе файла `.env.example`
2. Укажите строку подключения к вашей PostgreSQL базе данных в переменной `DATABASE_URI`

Пример строки подключения:

```
DATABASE_URI=postgresql://username:password@localhost:5432/pulse_tour_db
```

Где:

- `username` - имя пользователя PostgreSQL
- `password` - пароль пользователя
- `localhost` - адрес сервера (может отличаться)
- `5432` - порт PostgreSQL (по умолчанию)
- `pulse_tour_db` - имя вашей базы данных

## Структура строки подключения

Полный формат строки подключения к PostgreSQL:

```
postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]
```

## Примеры строк подключения

### Локальный сервер

```
DATABASE_URI=postgresql://postgres:mypassword@localhost:5432/pulse_tour_db
```

### Удаленный сервер

```
DATABASE_URI=postgresql://myuser:mypassword@db.example.com:5432/mydatabase
```

### С дополнительными параметрами

```
DATABASE_URI=postgresql://user:pass@localhost:5432/dbname?sslmode=require&connect_timeout=10
```

## Запуск приложения

После настройки строки подключения вы можете запустить приложение:

```bash
# Для разработки
pnpm dev

# Для сборки проекта
pnpm build
```

Payload CMS автоматически создаст необходимые таблицы в базе данных при первом запуске.

## Требования к PostgreSQL

Убедитесь, что ваша версия PostgreSQL поддерживается (Payload CMS обычно работает с PostgreSQL 12+).

## Устранение неполадок

Если возникают проблемы с подключением:

1. Проверьте, запущен ли сервер PostgreSQL
2. Убедитесь, что указанные учетные данные верны
3. Проверьте, доступен ли порт PostgreSQL (по умолчанию 5432)
4. Убедитесь, что база данных с указанным именем существует
