import tg from "../utils/telegram"

export default function useTelegramWindow() {
  // Настройка окна при монтировании
  tg.disableVerticalSwipes()
  tg.requestFullscreen();
  tg.setBackgroundColor?.("#fefefc");
  tg.setHeaderColor?.("#596bb1");
}
