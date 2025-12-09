import { useEffect, useState } from 'react';
import Header from "../../comp/Header/Header";
import TourBlock from "../../comp/TourBlock/TourBlock";
import "./HomePage.css";
import WebApp from '@twa-dev/sdk';

let tg = WebApp;

export default function HomePage() {
  tg.BackButton.hide();
  
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch('/api/tours?limit=10'); // ← проксируется на localhost:3000
        const data = await res.json();
        setTours(data.docs);
      } catch (err) {
        console.error('Ошибка:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  if (loading) {
    return <div className="loading" style={{ padding: '50px', textAlign: 'center' }}>Загрузка...</div>;
  }

  return (
    <>
      <Header />
      <div className="tour-section">
        <h1 className="title">
          Мы - готовы,
          <br />а вы?
        </h1>
        {tours.map(tour => (
          <TourBlock key={tour.id} tour={tour} />
        ))}
      </div>
    </>
  );
}