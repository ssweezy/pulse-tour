import Header from "./comp/Header/Header";
import TourBlock from "./comp/TourBlock/TourBlock";
import TourPage from "./pages/TourPage/TourPage.jsx";
import "./App.css";

function App() {
  return (
    <>
      {/* <Header></Header>
      <div className="tour-section">
      <h1 className="title">Мы - готовы,<br/>а вы?</h1>
        <TourBlock></TourBlock>
        <TourBlock></TourBlock>
        <TourBlock></TourBlock>
        <TourBlock></TourBlock>
      </div> */}
      <TourPage/>
    </>
  );
}

export default App;
