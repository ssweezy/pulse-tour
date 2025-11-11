import TourPage from "./pages/TourPage/TourPage.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import useTelegramWindow from "./hooks/useTelegramWindow";
import { Routes, Route } from "react-router";

function App() {
  useTelegramWindow();

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/tour" element={<TourPage />}></Route>
      </Routes>
    </>
  );
}

export default App;
