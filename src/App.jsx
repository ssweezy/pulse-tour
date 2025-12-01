import TourPage from "./pages/TourPage/TourPage.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import PayPage from "./pages/PayPage/PayPage.jsx";
import useTelegramWindow from "./hooks/useTelegramWindow";
import { Routes, Route } from "react-router";
import tg from "./utils/telegram.jsx";

function App() {
  let user = tg.initDataUnsafe?.user

  useTelegramWindow()

  // // тестовый вызов входящих данных пользователя
  let username = user.username
  let id = user.id
  let initInfo = tg.initDataUnsafe
  tg.showAlert(`Привет, ${username} \nID - ${id} \n\n ${initInfo}`)
  console.log(initInfo)



  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/tour" element={<TourPage />}></Route>
        <Route path="/pay" element={<PayPage />}></Route>
      </Routes>
      {/* <PayPage/> */}
    </>
  );
}

export default App;
