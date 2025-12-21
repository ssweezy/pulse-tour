// TourPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import { BackButton } from "@twa-dev/sdk/react";
import MyBackButton from "../../comp/BackButton/BackButton";
import "./TourPage.css";

// Укажи URL твоего Payload-сервера (локально или в облаке)
const PAYLOAD_API_URL = "https://abaxgeetudaf.beget.app/api"; // ← изменено на полный URL для работы с отдельным сервером CMS

export default function TourPage() {
  const { slug } = useParams(); // Получаем slug из URL: /tour/:slug
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await fetch(
          `${PAYLOAD_API_URL}/tours?where[slug][equals]=${slug}`
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
      console.log(tour);
    };

    if (slug) {
      fetchTour();
    }
  }, [slug]);

  if (loading) return <div className="tour-page">Загрузка...</div>;
  if (error) return <div className="tour-page">Ошибка: {error}</div>;
  if (!tour) return <div className="tour-page">Тур не найден</div>;

  // Формируем URL изображения
  const coverImageUrl = tour.coverImage?.url
    ? `${PAYLOAD_API_URL.split("/api")[0]}${tour.coverImage.url}`
    : "/fallback.jpg";

  // Форматируем дату (опционально)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Форматируем время (из поля date с timeOnly)
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Функция добавления услуги в корзину
  const addToCart = (service) => {
    // Проверяем, сколько уже добавлено данной услуги
    const currentCount = cart.filter((item) => item.id === service.id).length;

    // Проверяем, не превышено ли количество доступных услуг
    if (currentCount >= service.quantity) {
      alert(
        `Доступное количество услуги "${service.name}" ограничено: ${service.quantity} шт.`
      );
      return;
    }

    setCart((prevCart) => [...prevCart, service]);
  };

  // Функция перехода на страницу оплаты с передачей данных
  function toPayPage() {
    // Передаем tour и cart как state
    navigate(`/pay`, { state: { tour, cart } });
  }

  return (
    <div className="tour-page">
      <MyBackButton>Back</MyBackButton>
      <BackButton onClick={() => window.history.back()} />
      <div className="tour-img">
        <Carousel images={tour.gallery} tourTitle={tour.title} />
      </div>

      <div className="tour-inner">
        <div className="tour-header-info">
          <div className="tour-name">{tour.title}</div>

          <div className="price-section">
            <div className="price">{tour.price} руб</div>
            <div className="per-one">
              <svg
                className="close"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
              <svg
                className="person"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Навигация по разделам */}
        <div className="tour-tab-nav">
          <button
            className={`tab-link ${activeTab === "about" ? "active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            О туре
          </button>
          <button
            className={`tab-link ${activeTab === "included" ? "active" : ""}`}
            onClick={() => setActiveTab("included")}
          >
            Что входит
          </button>
          <button
            className={`tab-link ${activeTab === "extras" ? "active" : ""}`}
            onClick={() => setActiveTab("extras")}
          >
            Доп услуги
          </button>
        </div>

        {/* Секция "О туре" */}
        {activeTab === "about" && (
          <div className="tour-section">
            <div className="tour-about-section">
              <div className="tour-about-text">{tour.info}</div>
            </div>

            <div className="tour-details">
              <p>
                <strong>Дата:</strong> {formatDate(tour.date)}
              </p>
              <p>
                <strong>Время:</strong> {formatTime(tour.time)}
              </p>
              <p>
                <strong>Места:</strong> {tour.seats} доступно
              </p>
              <p>
                <strong>Локация:</strong> {tour.location}
              </p>
            </div>
          </div>
        )}

        {/* Секция "Что входит в стоимость" */}
        {activeTab === "included" && (
          <div className="tour-section">
            <div className="tour-included-section">
              <h3>Что входит в стоимость:</h3>
              <ul>
                {tour.included?.map((item, i) => (
                  <li key={i}>{item.item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Секция "Доп услуги" */}
        {activeTab === "extras" && (
          <div className="tour-section">
            {tour.extraServices?.length > 0 && (
              <div className="tour-extras-section">
                <h3>Дополнительные услуги:</h3>
                <ul className="extras-list">
                  {tour.extraServices.map((service, i) => (
                    <li key={i} className="extra-item">
                      <div className="extra-info">
                        <span className="extra-name">{service.name}</span>
                        <span className="extra-price">{service.price} руб</span>
                      </div>
                      <button
                        className="extra-add-btn"
                        onClick={() => addToCart(service)}
                      >
                        +
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <button className="select-button" onClick={toPayPage}>
          Оплатить
        </button>
      </div>
    </div>
  );
}

// Компонент карусели
const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="carousel">
      <button className="carousel-btn prev-btn" onClick={goToPrevious}>
        &#8249;
      </button>
      <img src={images[currentIndex].image.url} className="carousel-image" />
      <button className="carousel-btn next-btn" onClick={goToNext}>
        &#8250;
      </button>
      <div className="carousel-indicators">
        {images.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};
