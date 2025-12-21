import { Link } from "react-router-dom";
import "./TourBlock.css";

export default function TourBlock({ tour }) {
  // Формируем URL изображения
  const imageUrl = tour.coverImage.url
    ? `${tour.coverImage.url}` 
    : '/fallback.jpg';

  console.log(tour); // для отладки

  return (
    <div 
      className="tour-block"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="tour-location">{tour.location}</div>
      <div className="tour-info">
        <div>
          <div className="tour-name">{tour.name}</div>
          <div className="tour-caption">{tour.miniinfo || 'Удивительный тур'}</div>
        </div>
        <div className="tour-button">
          <Link to={`/tour/${tour.slug}`} className="tour-link">
            ВСТУПИТЬ
          </Link>
        </div>
      </div>
    </div>
  );
}
