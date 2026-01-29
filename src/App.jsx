import TourPage from "./pages/TourPage/TourPage.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import PayPage from "./pages/PayPage/PayPage.jsx";
import ThankPage from "./pages/ThankPage/ThankPage.jsx";
import PageTransition from "./comp/PageTransition/PageTransition.jsx";
import useTelegramWindow from "./hooks/useTelegramWindow";
import { Routes, Route, useLocation } from "react-router-dom";
import tg from "./utils/telegram.jsx";

function App() {
  let user = tg.initDataUnsafe?.user;
  const location = useLocation();

  useTelegramWindow();

  // // тестовый анализ входящих данных пользователя
  let username = user?.username;
  let id = user?.id;
  let initInfo = tg.initDataUnsafe;
  // tg.showAlert(`Привет, ${username} \nID - ${id}`)
  // console.log(initInfo)

  return (
    <PageTransition>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tour/:slug" element={<TourPage />} />
        <Route path="/pay" element={<PayPage />} />
        <Route path="/thank" element={<ThankPage />} />
      </Routes>
    </PageTransition>
  );
}

export default App;
