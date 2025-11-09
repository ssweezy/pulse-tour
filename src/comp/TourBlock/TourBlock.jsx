import { Routes, Route, Link } from "react-router";
import "./TourBlock.css";

export default function TourBlock() {
  return (
    <div className="tour-block">
      <div className="tour-location">КБР, Верхняя Балкария</div>
      <div className="tour-info">
        <div className="">
          <div className="tour-name">Пеший тур в Верхнюю Балкарию</div>
          <div className="tour-caption">невероятная информация</div>
        </div>
        <div className="tour-button">
          <Link to="/tour">ВСТУПИТЬ</Link>
        </div>

      </div>
    </div>
  );
}
