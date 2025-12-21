import TourPage from "./pages/TourPage/TourPage.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import PayPage from "./pages/PayPage/PayPage.jsx";
import ThankPage from "./pages/ThankPage/ThankPage.jsx";
import useTelegramWindow from "./hooks/useTelegramWindow";
import { Routes, Route } from "react-router";
import tg from "./utils/telegram.jsx";

function App() {
  let user = tg.initDataUnsafe?.user;

  useTelegramWindow();

  // // тестовый анализ входящих данных пользователя
  let username = user.username;
  let id = user.id;
  let initInfo = tg.initDataUnsafe;
  // tg.showAlert(`Привет, ${username} \nID - ${id}`)
  // console.log(initInfo)

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/tour/:slug" element={<TourPage />}></Route>
        <Route path="/pay" element={<PayPage />}></Route>
        <Route path="/thank" element={<ThankPage />}></Route>
      </Routes>
      {/* <PayPage/> */}
    </>
  );
}

export default App;
