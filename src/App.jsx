import TourPage from "./pages/TourPage/TourPage.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import { useTelegramWindow } from './hooks/useTelegramWindow';
import { Routes, Route} from "react-router";
import { useEffect } from 'react';


function App() {
  useEffect(() => {
  if (window.Telegram?.WebApp) {
    alert('✅ Запущено в Telegram!');
    window.Telegram.WebApp.ready();
  } else {
    alert('❌ Не в Telegram!');
  }
}, []);

  useTelegramWindow()


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
