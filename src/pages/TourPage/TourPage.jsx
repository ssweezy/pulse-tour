// TourPage.jsx
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import { BackButton } from "@twa-dev/sdk/react";
import "./TourPage.css";

const PAYLOAD_API_URL = `${import.meta.env.VITE_API_URL}/api`;

// Компонент заглушки для десктопа
const DesktopStub = () => (
  <div className="desktop-stub">
    <div className="desktop-stub-content">
      <span className="desktop-stub-text">ВЕРСИЯ</span>
      <span className="desktop-stub-text">В РАЗРАБОТКЕ</span>
    </div>
  </div>
);

// Хук для определения мобильного устройства
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

// Вспомогательная функция для формирования URL изображения
const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${import.meta.env.VITE_API_URL}${url}`;
};

// Функция для haptic feedback
const hapticFeedback = (type = "light") => {
  try {
    if (WebApp?.HapticFeedback) {
      if (type === "light") {
        WebApp.HapticFeedback.impactOccurred("light");
      } else if (type === "medium") {
        WebApp.HapticFeedback.impactOccurred("medium");
      } else if (type === "success") {
        WebApp.HapticFeedback.notificationOccurred("success");
      } else if (type === "error") {
        WebApp.HapticFeedback.notificationOccurred("error");
      }
    }
  } catch (e) {
    console.log("Haptic feedback not available");
  }
};

// Компонент карусели с свайпом и полноэкранным просмотром
const Carousel = ({ images, tourTitle, closeFullscreenRef }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef(null);

  const minSwipeDistance = 50;

  // Экспортируем функцию закрытия для родителя (для BackButton телеграма)
  useEffect(() => {
    if (closeFullscreenRef) {
      closeFullscreenRef.current = () => {
        if (isFullscreen) {
          setIsFullscreen(false);
          return true; // Был закрыт fullscreen
        }
        return false; // Fullscreen не был открыт
      };
    }
  }, [isFullscreen, closeFullscreenRef]);

  // Получить URL изображения с приоритетом оптимизированных версий
  const getOptimizedImageUrl = useCallback((imageData) => {
    if (!imageData) return "/fallback.jpg";

    const image = imageData.image || imageData;

    // Приоритет: tablet > card > оригинал
    const url =
      image?.sizes?.tablet?.url || image?.sizes?.card?.url || image?.url;

    return getImageUrl(url) || "/fallback.jpg";
  }, []);

  // Обработка загрузки изображения
  const handleImageLoad = (index) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };

  // Обработка ошибки загрузки
  const handleImageError = (index) => {
    setLoadedImages((prev) => ({ ...prev, [index]: "error" }));
  };

  // Touch handlers для свайпа
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const onTouchMove = (e) => {
    if (!touchStart) return;
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    setDragOffset(currentTouch - touchStart);
  };

  const onTouchEnd = () => {
    setIsDragging(false);
    setDragOffset(0);

    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < images.length - 1) {
      hapticFeedback("light");
      setCurrentIndex((prev) => prev + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      hapticFeedback("light");
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Открытие полноэкранного просмотра
  const openFullscreen = () => {
    hapticFeedback("light");
    setIsFullscreen(true);
  };

  // Закрытие полноэкранного просмотра
  const closeFullscreen = () => {
    hapticFeedback("light");
    setIsFullscreen(false);
  };

  // Preload соседних изображений
  useEffect(() => {
    const preloadIndexes = [
      currentIndex - 1,
      currentIndex,
      currentIndex + 1,
    ].filter((i) => i >= 0 && i < images.length);

    preloadIndexes.forEach((index) => {
      if (!loadedImages[index]) {
        const img = new Image();
        img.src = getOptimizedImageUrl(images[index]);
      }
    });
  }, [currentIndex, images, getOptimizedImageUrl, loadedImages]);

  if (!images || images.length === 0) {
    return <div className="carousel-empty">Нет изображений</div>;
  }

  return (
    <>
      {/* Основная карусель */}
      <div
        className="carousel"
        ref={carouselRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="carousel-track"
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${isDragging ? dragOffset : 0}px))`,
            transition: isDragging
              ? "none"
              : "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {images.map((img, index) => (
            <div
              key={index}
              className="carousel-slide"
              onClick={openFullscreen}
            >
              {loadedImages[index] !== true &&
                loadedImages[index] !== "error" && (
                  <div className="carousel-loader">
                    <div className="loader-spinner"></div>
                  </div>
                )}
              {loadedImages[index] === "error" ? (
                <div className="carousel-error">Ошибка загрузки</div>
              ) : (
                <img
                  src={getOptimizedImageUrl(img)}
                  alt={img?.image?.alt || `${tourTitle} - фото ${index + 1}`}
                  className={`carousel-image ${loadedImages[index] === true ? "loaded" : ""}`}
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                  draggable={false}
                />
              )}
            </div>
          ))}
        </div>

        {/* Индикаторы */}
        <div className="carousel-indicators">
          {images.map((_, index) => (
            <span
              key={index}
              className={`indicator ${index === currentIndex ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                hapticFeedback("light");
                setCurrentIndex(index);
              }}
            />
          ))}
        </div>

        {/* Счетчик фото */}
        <div className="carousel-counter">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Полноэкранный просмотр */}
      {isFullscreen && (
        <div
          className={`fullscreen-gallery ${isFullscreen ? "open" : ""}`}
          onClick={closeFullscreen}
        >
          <div className="fullscreen-header">
            <span className="fullscreen-title">{tourTitle}</span>
            <button className="fullscreen-close" onClick={closeFullscreen}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div
            className="fullscreen-content"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="fullscreen-track"
              style={{
                transform: `translateX(calc(-${currentIndex * 100}% + ${isDragging ? dragOffset : 0}px))`,
                transition: isDragging
                  ? "none"
                  : "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              {images.map((img, index) => (
                <div key={index} className="fullscreen-slide">
                  <img
                    src={getOptimizedImageUrl(img)}
                    alt={img?.image?.alt || `${tourTitle} - фото ${index + 1}`}
                    className="fullscreen-image"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Миниатюры */}
          <div className="fullscreen-thumbnails">
            {images.map((img, index) => (
              <div
                key={index}
                className={`thumbnail ${index === currentIndex ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  hapticFeedback("light");
                  setCurrentIndex(index);
                }}
              >
                <img
                  src={getOptimizedImageUrl(img)}
                  alt={`Миниатюра ${index + 1}`}
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Индикаторы в полноэкранном режиме */}
          <div className="fullscreen-indicators">
            {images.map((_, index) => (
              <span
                key={index}
                className={`indicator ${index === currentIndex ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  hapticFeedback("light");
                  setCurrentIndex(index);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// Компонент корзины доп услуг
const Cart = ({ cart, services, onUpdateCart, onClose, isOpen }) => {
  // Группируем услуги в корзине по id
  const groupedCart = cart.reduce((acc, item) => {
    const existing = acc.find((i) => i.id === item.id);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ ...item, count: 1 });
    }
    return acc;
  }, []);

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const handleIncrease = (service) => {
    hapticFeedback("light");
    const serviceData = services.find((s) => s.id === service.id);
    const currentCount = cart.filter((item) => item.id === service.id).length;

    if (serviceData && currentCount < serviceData.quantity) {
      onUpdateCart([...cart, service]);
    } else {
      hapticFeedback("error");
    }
  };

  const handleDecrease = (serviceId) => {
    hapticFeedback("light");
    const index = cart.findIndex((item) => item.id === serviceId);
    if (index !== -1) {
      const newCart = [...cart];
      newCart.splice(index, 1);
      onUpdateCart(newCart);
    }
  };

  return (
    <div className={`cart-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
      <div className="cart-container" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h3 className="cart-title">КОРЗИНА</h3>
          <button className="cart-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {groupedCart.length === 0 ? (
          <div className="cart-empty">
            <span>Корзина пуста</span>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {groupedCart.map((item) => {
                const serviceData = services.find((s) => s.id === item.id);
                const maxQuantity = serviceData?.quantity || 1;

                return (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <span className="cart-item-name">{item.name}</span>
                      <span className="cart-item-price">
                        {item.price * item.count} ₽
                      </span>
                    </div>
                    <div className="cart-item-controls">
                      <button
                        className="cart-btn minus"
                        onClick={() => handleDecrease(item.id)}
                      >
                        −
                      </button>
                      <span className="cart-item-count">{item.count}</span>
                      <button
                        className="cart-btn plus"
                        onClick={() => handleIncrease(item)}
                        disabled={item.count >= maxQuantity}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-total">
              <span className="cart-total-label">ИТОГО</span>
              <span className="cart-total-price">{totalPrice} ₽</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default function TourPage() {
  const { slug } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [tabsInitialized, setTabsInitialized] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const tabIndicatorRef = useRef(null);
  const tabsRef = useRef([]);
  const closeFullscreenRef = useRef(null); // Ref для закрытия fullscreen из BackButton

  // Состояние для jiggle анимации
  const [jigglingItem, setJigglingItem] = useState(null);

  // Функция для запуска jiggle анимации
  // const triggerJiggle = (itemId) => {
  //   hapticFeedback("light");
  //   setJigglingItem(itemId);
  //   setTimeout(() => setJigglingItem(null), 400); // Длительность анимации
  // };

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await fetch(
          `${PAYLOAD_API_URL}/tours?where[slug][equals]=${slug}`,
        );
        if (!res.ok) throw new Error("Тур не найден");
        const data = await res.json();
        if (data.docs.length === 0) throw new Error("Тур не найден");
        setTour(data.docs[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchTour();
    }
  }, [slug]);

  // Обновление позиции индикатора табов
  useEffect(() => {
    const tabIndex = ["about", "included", "extras"].indexOf(activeTab);
    if (tabIndicatorRef.current && tabsRef.current[tabIndex]) {
      const tab = tabsRef.current[tabIndex];
      tabIndicatorRef.current.style.width = `${tab.offsetWidth}px`;
      tabIndicatorRef.current.style.left = `${tab.offsetLeft}px`;

      // Отмечаем что табы инициализированы (для показа индикатора сразу)
      if (!tabsInitialized) {
        setTabsInitialized(true);
      }
    }
  }, [activeTab, tabsInitialized]);

  // Инициализация индикатора табов при первой загрузке
  useEffect(() => {
    // Небольшая задержка для корректного расчета размеров
    const timer = setTimeout(() => {
      if (tabIndicatorRef.current && tabsRef.current[0]) {
        const tab = tabsRef.current[0];
        tabIndicatorRef.current.style.width = `${tab.offsetWidth}px`;
        tabIndicatorRef.current.style.left = `${tab.offsetLeft}px`;
        setTabsInitialized(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [tour]);

  // Показываем заглушку для ПК
  if (!isMobile) {
    return <DesktopStub />;
  }

  if (loading) {
    return (
      <div className="tour-page loading-state">
        <div className="loader-container">
          <div className="loader-spinner large"></div>
          <span className="loader-text">Загрузка...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tour-page error-state">
        <BackButton onClick={() => window.history.back()} />
        <div className="error-container">
          <span className="error-text">Ошибка: {error}</span>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="tour-page error-state">
        <BackButton onClick={() => window.history.back()} />
        <div className="error-container">
          <span className="error-text">Тур не найден</span>
        </div>
      </div>
    );
  }

  // Форматирование даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Форматирование времени
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Добавление услуги в корзину
  const addToCart = (service) => {
    hapticFeedback("medium");

    const currentCount = cart.filter((item) => item.id === service.id).length;

    if (currentCount >= service.quantity) {
      hapticFeedback("error");
      return;
    }

    setCart((prevCart) => [...prevCart, service]);
  };

  // Удаление одной услуги из корзины
  const removeFromCart = (serviceId) => {
    hapticFeedback("light");
    const index = cart.findIndex((item) => item.id === serviceId);
    if (index !== -1) {
      const newCart = [...cart];
      newCart.splice(index, 1);
      setCart(newCart);
    }
  };

  // Переход на страницу оплаты
  const toPayPage = () => {
    hapticFeedback("success");
    navigate(`/pay`, { state: { tour, cart } });
  };

  // Смена таба
  const handleTabChange = (tab) => {
    hapticFeedback("light");
    setActiveTab(tab);
  };

  // Количество товаров в корзине
  const cartItemsCount = cart.length;

  // Обработчик BackButton - закрывает полноэкранный режим или возвращается назад
  const handleBackButton = () => {
    // Пробуем закрыть fullscreen через ref
    if (closeFullscreenRef.current && closeFullscreenRef.current()) {
      return; // Fullscreen был закрыт
    }
    window.history.back();
  };

  return (
    <div className="tour-page">
      <BackButton onClick={handleBackButton} />

      {/* Галерея фото */}
      <div className="tour-gallery">
        <Carousel
          images={tour.gallery}
          tourTitle={tour.title}
          closeFullscreenRef={closeFullscreenRef}
        />
      </div>

      {/* Основной контент */}
      <div className="tour-content">
        {/* Заголовок */}
        <div className="tour-header">
          <h1 className="tour-title">{tour.title}</h1>
          <div className="tour-price-block">
            <span className="tour-price">
              {tour.price.toLocaleString("ru-RU")}
            </span>
            <span className="tour-currency">₽</span>
          </div>
        </div>

        {/* Быстрая информация - с jiggle анимацией при нажатии */}
        <div className="tour-quick-info">
          <div
            className={`quick-info-item ${jigglingItem === "date" ? "jiggling" : ""}`}
            onClick={() => triggerJiggle("date")}
          >
            <span className="quick-info-label">Дата</span>
            <span className="quick-info-value">{formatDate(tour.date)}</span>
          </div>
          <div
            className={`quick-info-item ${jigglingItem === "time" ? "jiggling" : ""}`}
            onClick={() => triggerJiggle("time")}
          >
            <span className="quick-info-label">Время</span>
            <span className="quick-info-value">{formatTime(tour.time)}</span>
          </div>
          <div
            className={`quick-info-item ${jigglingItem === "seats" ? "jiggling" : ""}`}
            onClick={() => triggerJiggle("seats")}
          >
            <span className="quick-info-label">Мест</span>
            <span className="quick-info-value">
              {tour.remainingSeats || tour.seats}
            </span>
          </div>
        </div>

        {/* Навигация по разделам */}
        <div className="tour-tabs">
          <div className="tabs-container">
            {["about", "included", "extras"].map((tab, index) => (
              <button
                key={tab}
                ref={(el) => (tabsRef.current[index] = el)}
                className={`tab-button ${activeTab === tab ? "active" : ""}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab === "about" && "О ТУРЕ"}
                {tab === "included" && "В СТОИМОСТИ"}
                {tab === "extras" && "ДОП УСЛУГИ"}
              </button>
            ))}
            {/* Индикатор виден сразу после инициализации */}
            <div
              className={`tab-indicator ${tabsInitialized ? "visible" : ""}`}
              ref={tabIndicatorRef}
            ></div>
          </div>
        </div>

        {/* Контент разделов */}
        <div className="tour-sections">
          {/* О туре */}
          <div className={`section ${activeTab === "about" ? "active" : ""}`}>
            <div className="section-content about-section">
              {/* Локация в начале раздела с jiggle анимацией */}
              <div
                className={`location-block ${jigglingItem === "location" ? "jiggling" : ""}`}
                onClick={() => triggerJiggle("location")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
                    fill="currentColor"
                  />
                </svg>
                <span>{tour.location}</span>
              </div>

              <p className="about-text">{tour.info}</p>
            </div>
          </div>

          {/* Что входит */}
          <div
            className={`section ${activeTab === "included" ? "active" : ""}`}
          >
            <div className="section-content included-section">
              {tour.included?.length > 0 ? (
                <ul className="included-list">
                  {tour.included.map((item, i) => (
                    <li key={i} className="included-item">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                          fill="currentColor"
                        />
                      </svg>
                      <span>{item.item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-text">Информация отсутствует</p>
              )}
            </div>
          </div>

          {/* Доп услуги */}
          <div className={`section ${activeTab === "extras" ? "active" : ""}`}>
            <div className="section-content extras-section">
              {tour.extraServices?.length > 0 ? (
                <ul className="extras-list">
                  {tour.extraServices.map((service, i) => {
                    const inCart = cart.filter(
                      (item) => item.id === service.id,
                    ).length;
                    const isMaxed = inCart >= service.quantity;

                    return (
                      <li key={i} className="extra-item">
                        <div className="extra-info">
                          <span className="extra-name">{service.name}</span>
                          {service.description && (
                            <span className="extra-description">
                              {service.description}
                            </span>
                          )}
                          <span className="extra-availability">
                            Доступно: {service.quantity - inCart} из{" "}
                            {service.quantity}
                          </span>
                        </div>
                        <div className="extra-right">
                          <span className="extra-price">{service.price} ₽</span>
                          {/* Контролы +/- вертикально: плюс сверху, счетчик, минус снизу */}
                          <div
                            className={`extra-controls ${inCart > 0 ? "expanded" : ""}`}
                          >
                            {/* Кнопка плюс - сверху */}
                            <button
                              className={`extra-btn plus ${isMaxed ? "disabled" : ""}`}
                              onClick={() => addToCart(service)}
                              disabled={isMaxed}
                              aria-label="Добавить"
                            >
                              +
                            </button>
                            {/* Счетчик - посередине */}
                            {inCart > 0 ? (
                              <span className="extra-count">{inCart}</span>
                            ) : null}
                            {/* Кнопка минус - снизу, появляется когда есть товары */}
                            <button
                              className={`extra-btn minus ${inCart > 0 ? "visible" : ""}`}
                              onClick={() => removeFromCart(service.id)}
                              aria-label="Убрать"
                            >
                              −
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="empty-text">Дополнительные услуги отсутствуют</p>
              )}
            </div>
          </div>
        </div>

        {/* Нижняя панель */}
        <div className="tour-bottom-bar">
          {cartItemsCount > 0 && (
            <button
              className="cart-button"
              onClick={() => {
                hapticFeedback("light");
                setIsCartOpen(true);
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z"
                  fill="currentColor"
                />
              </svg>
              <span className="cart-badge">{cartItemsCount}</span>
            </button>
          )}

          <button className="pay-button" onClick={toPayPage}>
            <span>ОПЛАТИТЬ</span>
            <span className="pay-price">
              {(
                tour.price + cart.reduce((sum, item) => sum + item.price, 0)
              ).toLocaleString("ru-RU")}{" "}
              ₽
            </span>
          </button>
        </div>
      </div>

      {/* Корзина */}
      <Cart
        cart={cart}
        services={tour.extraServices || []}
        onUpdateCart={setCart}
        onClose={() => setIsCartOpen(false)}
        isOpen={isCartOpen}
      />
    </div>
  );
}
