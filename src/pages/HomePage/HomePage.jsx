import Header from "../../comp/Header/Header";
import TourBlock from "../../comp/TourBlock/TourBlock";
import "./HomePage.css"
import WebApp from '@twa-dev/sdk' 

let tg = WebApp

export default function HomePage() {
  tg.BackButton.hide();
  
  return (
    <>
  
      <Header></Header>
      <div className="tour-section">
        <h1 className="title">
          Мы - готовы,
          <br />а вы?
        </h1>
        <TourBlock></TourBlock>
        <TourBlock></TourBlock>
        <TourBlock></TourBlock>
        <TourBlock></TourBlock>
      </div>
    </>
  );
}
