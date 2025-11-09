import TourPage from "./pages/TourPage/TourPage.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import { Routes, Route} from "react-router";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/tour" element={<TourPage />}></Route>
        <Route path="/" element={<HomePage />}></Route>
      </Routes>
    </>
  );
}

export default App;
