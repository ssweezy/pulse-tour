import TourPage from "./pages/TourPage/TourPage.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import { useTelegramWindow } from './hooks/useTelegramWindow';
import { Routes, Route} from "react-router";


function App() {
  useTelegramWindow()
  alert("BOOO")
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
