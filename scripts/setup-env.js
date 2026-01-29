#!/usr/bin/env node

/**
 * Скрипт для настройки переменных окружения
 * Использование: node scripts/setup-env.js [development|production]
 */

const fs = require("fs");
const path = require("path");

const envType = process.argv[2] || "development";

// Конфигурации для разных окружений
const configs = {
  development: {
    frontend: {
      VITE_API_URL: "http://localhost:3000",
    },
    backend: {
      CORS_ORIGINS: "http://localhost:5173,http://localhost:3000",
      CSRF_ORIGINS: "http://localhost:5173,http://localhost:3000",
    },
  },
  production: {
    frontend: {
      VITE_API_URL: process.env.PROD_FRONTEND_URL || "https://yourdomain.com",
    },
    backend: {
      CORS_ORIGINS:
        process.env.PROD_BACKEND_CORS ||
        "https://yourdomain.com,https://www.yourdomain.com",
      CSRF_ORIGINS:
        process.env.PROD_BACKEND_CSRF ||
        "https://yourdomain.com,https://www.yourdomain.com",
    },
  },
};

// Функция для обновления .env файла
function updateEnvFile(filePath, newValues) {
  let content = "";

  // Если файл существует, читаем его
  if (fs.existsSync(filePath)) {
    content = fs.readFileSync(filePath, "utf8");
  }

  // Преобразуем содержимое в объект
  const lines = content.split("\n");
  const envVars = {};

  lines.forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)/);
    if (match) {
      envVars[match[1]] = match[2];
    }
  });

  // Обновляем значения
  Object.entries(newValues).forEach(([key, value]) => {
    envVars[key] = value;
  });

  // Формируем новое содержимое
  const newContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  // Записываем обратно в файл
  fs.writeFileSync(filePath, newContent);
  console.log(`✓ Обновлен файл: ${filePath}`);
}

console.log(`Настройка окружения: ${envType}`);

try {
  // Обновляем frontend .env
  if (configs[envType]?.frontend) {
    updateEnvFile(path.join(__dirname, "../.env"), configs[envType].frontend);
  }

  // Обновляем backend .env
  if (configs[envType]?.backend) {
    updateEnvFile(
      path.join(__dirname, "../cms/.env"),
      configs[envType].backend,
    );
  }

  console.log(`\n✅ Окружение ${envType} успешно настроено!`);
  console.log("\nДля применения изменений перезапустите сервер разработки.");
} catch (error) {
  console.error("❌ Ошибка при настройке окружения:", error.message);
  process.exit(1);
}
