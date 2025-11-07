import "./TourPage.css";

export default function TourPage() {
  return (
    <div className="tour-section">
      <div className="tour-img">
        {/* <img src="/tour-pfp/balkaria.webp" alt="фото верхней балкарии" /> */}
      </div>

      <div className="tour-inner">
        <div className="tour-header-info">
          <div className="tour-name">Верхняя Балкария</div>

          <div className="price-section">
            <div className="price">7500 руб</div>
            <span className="span price-add-info">за человека</span>
          </div>
        </div>

        <div className="tour-tab-nav">
          <div className="tab-nav-button">раздел</div>
          <div className="tab-nav-button">раздел</div>
          <div className="tab-nav-button">раздел</div>
          <div className="tab-nav-button">раздел</div>
        </div>

        <div className="tour-about-section">
          <div className="tour-about-text">
            Тур в Верхнюю Балкарию — это уникальная возможность познакомиться с красотами региона. Стоимость участия — 7500 рублей с человека. Путешествие позволит насладиться неповторимыми пейзажами и узнать больше о культуре и традициях места. Мы предлагаем тщательно спланированный маршрут, который раскроет все прелести Верхней Балкарии. Выберите удобные для вас дни и отправьтесь в незабываемое путешествие!
          </div>
        </div>

        <button className="select-button">Выбрать дни</button>
      </div>
    </div>
  );
}
