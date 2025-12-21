import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import WebApp from "@twa-dev/sdk";
import BackButton from "../../comp/BackButton/BackButton"; // Импортируем компонент кнопки "Назад"
import TourBlock from "../../comp/TourBlock/TourBlock"; // Импортируем компонент блока тура

let tg = WebApp;

export default function HomePage() {
  tg.BackButton.hide();

  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch("https://abaxgeetudaf.beget.app/api/tours?limit=20");
        console.log(res)
        const data = await res.json();
        console.log(data)
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

  console.log(tours)

  if (loading) {
    return (
      <div className="loading" style={{ padding: "50px", textAlign: "center" }}>
        Загрузка...
      </div>
    );
  }

  return (
    <div className="home-page">
      <BackButton>Back</BackButton>
      <div className="tour-section">
        <h1 className="title">
          Мы - готовы,
          <br />а вы?
        </h1>
        {tours.map((tour) => (
          <TourBlock key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  );
}
