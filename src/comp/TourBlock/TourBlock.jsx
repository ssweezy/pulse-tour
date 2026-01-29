import { Link } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import "./TourBlock.css";

// Функция для haptic feedback
const hapticFeedback = (type = 'light') => {
  try {
    if (WebApp?.HapticFeedback) {
      WebApp.HapticFeedback.impactOccurred(type);
    }
  } catch (e) {
    console.log('Haptic feedback not available');
  }
};

export default function TourBlock({ tour }) {
  // Вспомогательная функция для формирования URL изображения
  const getImageUrl = (url) => {
    if (!url) return null;
    // Если URL уже полный (начинается с http/https), возвращаем как есть
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Иначе добавляем базовый URL
    return `${import.meta.env.VITE_API_URL}${url}`;
  };

  // Используем оптимизированное изображение 'card' для блоков на главной
  // Fallback на оригинал, если sizes не доступны
  const imageUrl = getImageUrl(tour.coverImage?.sizes?.card?.url)
    || getImageUrl(tour.coverImage?.url)
    || "/fallback.jpg";

  // Обработчик нажатия на кнопку с вибрацией
  const handleButtonClick = () => {
    hapticFeedback('medium');
  };

  return (
    <div className="tour-block" style={{ backgroundImage: `url(${imageUrl})` }}>
      <div className="tour-location">{tour.location}</div>
      <div className="tour-info">
        <div>
          <div className="tour-name">{tour.name}</div>
          <div className="tour-caption">
            {tour.miniinfo || "Удивительный тур"}
          </div>
        </div>
        <div className="tour-button" onClick={handleButtonClick}>
          <Link to={`/tour/${tour.slug}`} className="tour-link">
            ВСТУПИТЬ
          </Link>
        </div>
      </div>
    </div>
  );
}
