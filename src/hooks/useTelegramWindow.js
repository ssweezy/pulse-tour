import { useEffect } from 'react';
import tg from '../utils/telegram'; 

export function useTelegramWindow() {
  useEffect(() => {
    // Настройка окна при монтировании
    if (tg.expand) tg.expand();
    tg.setBackgroundColor?.('#ffffff');
    tg.setHeaderColor?.('#007bff');

  }, []); // пустой deps = один раз при монтировании
}