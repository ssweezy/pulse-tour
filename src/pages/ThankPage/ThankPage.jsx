import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ThankPage.css";
import WebApp from "@twa-dev/sdk";
import { BackButton } from "@twa-dev/sdk/react";

// Хук для определения мобильного устройства
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

// Компонент заглушки для десктопа
const DesktopStub = () => (
  <div className="desktop-stub">
    <div className="desktop-stub-content">
      <span className="desktop-stub-text">ВЕРСИЯ</span>
      <span className="desktop-stub-text">В РАЗРАБОТКЕ</span>
    </div>
  </div>
);

// Функция для haptic feedback
const hapticFeedback = (type = 'light') => {
  try {
    if (WebApp?.HapticFeedback) {
      if (type === 'success') {
        WebApp.HapticFeedback.notificationOccurred('success');
      } else {
        WebApp.HapticFeedback.impactOccurred(type);
      }
    }
  } catch (e) {
    console.log('Haptic feedback not available');
  }
};

export default function ThankPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Анимация появления
    setTimeout(() => setIsVisible(true), 100);
    // Вибрация успеха при загрузке страницы
    hapticFeedback('success');
  }, []);

  const handleGoHome = () => {
    hapticFeedback('light');
    navigate("/");
  };

  if (!isMobile) {
    return <DesktopStub />;
  }

  return (
    <div className={`thank-page ${isVisible ? 'visible' : ''}`}>
      {/* Телеграм кнопка назад - возвращает на главную */}
      <BackButton onClick={handleGoHome} />

      {/* Декоративные элементы */}
      <div className="thank-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>

      {/* Основной контент */}
      <div className="thank-content">
        {/* Иконка успеха */}
        <div className="thank-icon">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="4"/>
            <path
              d="M24 42L34 52L56 30"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="check-path"
            />
          </svg>
        </div>

        {/* Заголовок */}
        <div className="thank-header">
          <h1 className="thank-title">СПАСИБО</h1>
          <h2 className="thank-subtitle">ЧТО ВЫБРАЛИ НАС</h2>
        </div>

        {/* Сообщение */}
        <div className="thank-message">
          <p>Ваш заказ успешно оформлен!</p>
        </div>

        {/* Один красивый блок "Ожидайте подтверждения" */}
        <div className="thank-confirmation-block">
          <div className="confirmation-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="currentColor"/>
            </svg>
          </div>
          <span className="confirmation-text">ОЖИДАЙТЕ ПОДТВЕРЖДЕНИЯ</span>
          <p className="confirmation-subtext">Мы свяжемся с вами в ближайшее время</p>
        </div>
      </div>

      {/* Кнопка */}
      <div className="thank-bottom">
        <button className="home-button" onClick={handleGoHome}>
          <span>НА ГЛАВНУЮ</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
