import { Routes, Route, Link } from "react-router";
import "./TourBlock.css";
import { BackButton } from '@twa-dev/sdk/react';
import WebApp from '@twa-dev/sdk'



export default function TourBlock() {
  if(!WebApp.BackButton.isVisible()) WebApp.BackButton.show();

  
  return (
    
    <div className="tour-block">
      <BackButton onClick={() => window.history.back()} />
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
