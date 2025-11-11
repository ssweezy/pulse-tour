import { backButton } from '@telegram-apps/sdk-react';
import WebApp from '@twa-dev/sdk'

let tg = WebApp

export default function useTelegramWindow() {
  // Настройка окна при монтировании
  tg.BackButton.hide()
  tg.disableVerticalSwipes()
  tg.requestFullscreen();
  tg.setBackgroundColor?.("#ffffff");
  tg.setHeaderColor?.("#007bff");
}
