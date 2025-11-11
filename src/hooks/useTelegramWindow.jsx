import WebApp from '@twa-dev/sdk'

let tg = WebApp

export default function useTelegramWindow() {
  // Настройка окна при монтировании
  if (tg.expand) tg.expand();
  tg.requestFullscreen();
  tg.setBackgroundColor?.("#ffffff");
  tg.setHeaderColor?.("#007bff");
}
