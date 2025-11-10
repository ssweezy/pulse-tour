

let tg;

if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
  // Запущено внутри Telegram Mini App
  tg = window.Telegram.WebApp;
  tg.ready(); // Уведомляем Telegram, что приложение загружено
} else {
  // Режим разработки на localhost
  console.warn('Запущено не в Telegram. Используется mock WebApp.');

  tg = {
    ready: () => console.log('Mock: ready'),
    close: () => console.log('Mock: close'),
    sendData: (data) => console.log('Mock sendData:', data),
    expand: () => console.log('Mock: expand'),
    requestFullscreen: () => console.log('Mock: request fullscreen'),
    initData: '',
    initDataUnsafe: {
      user: {
        id: 123456789,
        first_name: 'Аслан',
        last_name: '',
        username: 'aslan_dev',
        language_code: 'ru',
      },
    },
    version: 'mock',
    platform: 'web',
  };
}

export default tg;