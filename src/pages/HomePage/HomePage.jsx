import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import WebApp from "@twa-dev/sdk";
import TourBlock from "../../comp/TourBlock/TourBlock";
import Footer from "../../comp/Footer/Footer";

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

export default function HomePage() {
  const isMobile = useIsMobile();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      WebApp?.BackButton?.hide();
    } catch (e) {
      console.log('BackButton not available');
    }
  }, []);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/tours?limit=20&where[status][equals]=active`,
        );
        const data = await res.json();
        console.log(data);
        setTours(data.docs || []);
      } catch (err) {
        console.error("Ошибка:", err);
        setTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [loading]);

  if (!isMobile) {
    return <DesktopStub />;
  }

  if (loading) {
    return (
      <div className="home-page-loading">
        <div className="loading-spinner"></div>
        <span>Загрузка...</span>
      </div>
    );
  }

  return (
    <div className={`home-page ${isVisible ? 'visible' : ''}`}>
      <div className="tour-section">
        <h1 className="title">
          Мы - готовы,
          <br />а вы?
        </h1>
        {tours.map((tour) => (
          <TourBlock key={tour.id} tour={tour} />
        ))}
      </div>
      <Footer />
    </div>
  );
}
