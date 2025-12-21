import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./PayPage.css";
import GradientText from "../../comp/Gradtext/GradientText";
import MyBackButton from "../../comp/BackButton/BackButton";

export default function PayPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tour, cart } = location.state || { tour: null, cart: [] };
  // console.log("Tour data:", tour);
  // console.log("Cart data:", cart);

  // Генерация 5-символьного буквенно-цифрового кода для Check ID
  const generateCheckId = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  // Сохраняем Check ID в состоянии компонента
  const [checkId] = useState(() => generateCheckId());

  // Состояния для других данных (количество пассажиров теперь всегда 1)
  const [passengerName, setPassengerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);

  // Функция валидации номера телефона
  const validatePhoneNumber = (phone) => {
    // Проверяем, что номер содержит только цифры (после удаления всех нецифровых символов)
    // И имеет длину 10 или 11 цифр (российский формат)
    // Также проверяем, что общая длина не превышает 14 символов
    if (phone.length > 14) return false;
    const digitsOnly = phone.replace(/\D/g, "");
    return digitsOnly.length === 10 || digitsOnly.length === 11;
  };

  // Функция валидации имени пассажира
  const validatePassengerName = (name) => {
    // Проверяем, что имя не пустое и содержит только буквы, пробелы и дефисы
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/;
    return (
      name.trim().length > 0 && nameRegex.test(name) && name.trim().length <= 50
    );
  };

  // Форматируем дату (опционально)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  };

  // Форматируем время (из поля date с timeOnly)
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Рассчитываем общую стоимость (количество пассажиров всегда 1)
  const calculateTotal = () => {
    if (!tour) return 0;
    const extrasTotal = cart.reduce((sum, item) => sum + item.price, 0);
    return tour.price + extrasTotal;
  };

  const handlePayment = async () => {
    // Проверяем валидность имени пассажира перед отправкой
    if (!validatePassengerName(passengerName)) {
      setNameError(
        "Пожалуйста, введите действительное имя (только буквы, пробелы и дефисы, максимум 50 символов)"
      );
      return;
    }

    // Проверяем валидность номера телефона перед отправкой
    if (!validatePhoneNumber(phoneNumber)) {
      setPhoneError(
        "Пожалуйста, введите действительный номер телефона (10-11 цифр, максимум 14 символов)"
      );
      return;
    }

    // Проверяем, что пользователь согласился с правилами тура
    if (!agreementChecked) {
      alert("Пожалуйста, подтвердите согласие с правилами тура.");
      return;
    }

    // Получаем tg-id из Telegram API или используем fallback
    let tgId = 0;
    try {
      const tg = await import("../../utils/telegram.jsx");
      if (tg.default?.initDataUnsafe?.user?.id) {
        tgId = tg.default.initDataUnsafe.user.id;
      } else {
        // Fallback значение для разработки
        tgId = Math.floor(Math.random() * 1000000000); // случайное число для тестирования
      }
    } catch (error) {
      console.warn("Не удалось получить tg-id, используем fallback", error);
      tgId = Math.floor(Math.random() * 100000000); // случайное число для тестирования
    }

    // Создаем объект платежа
    const paymentData = {
      passengerName: passengerName,
      totalAmount: calculateTotal(),
      phoneNumber: phoneNumber,
      tour: tour?.id || "", // Передаем ID тура вместо названия
      orderTime: new Date().toISOString(),
      paymentStatus: "ожидает оплаты",
      checkId: checkId,
      selectedServices: cart.map((item) => ({
        serviceName: item.name,
        servicePrice: item.price,
      })), // Передаем выбранные доп услуги с названием и ценой
      passengerCount: 1, // Устанавливаем количество пассажиров равным 1
      agreement: agreementChecked ? "Да" : "Нет", // Добавляем параметр соглашения
      tgId: tgId, // Добавляем tg-id
    };

    // Отправляем данные в коллекцию Payments
    try {
      const response = await fetch("https://abaxgeetudaf.beget.app/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        console.log(
          "Данные успешно отправлены в коллекцию Payments",
          paymentData
        );
        // Открываем ссылку оплаты в новой вкладке
        window.open(
          "https://qr.nspk.ru/BS1A007TDKPNCA548AKAURRC4P4P2GCQ?type=01&bank=100000000004&crc=9908",
          "_blank"
        );
        // Переходим на страницу благодарности
        navigate("/thank");
      } else {
        console.error("Ошибка при отправке данных в коллекцию Payments");
        console.log("Отправляемые данные:", paymentData);
      }
    } catch (error) {
      console.error("Ошибка при отправке данных в коллекцию Payments:", error);
    }
  };

  if (!tour) {
    return (
      <div className="pay-page">
        <MyBackButton>Back</MyBackButton>
        <div className="ticket">
          <div className="ticket-inner">
            <div className="ticket-header">
              <div className="agency-name">
                <GradientText
                  colors={["#2F3B69", "#a4add0ff", "#2F3B69", "#d4d5ceff"]}
                  animationSpeed={9}
                >
                  PULSE
                </GradientText>
                <GradientText
                  colors={["#2F3B69", "#a4add0ff", "#2F3B69", "#d4d5ceff"]}
                  animationSpeed={9}
                >
                  TOUR
                </GradientText>
              </div>
              <div className="icon">
                <svg
                  className="pulse-icon"
                  version="1.0"
                  xmlns="http://www.w3.org/2000/svg"
                  height="45px"
                  viewBox="0 0 472.000000 455.000000"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g
                    transform="translate(0.0000,455.0000) scale(0.100000,-0.10000)"
                    fill="#7779a0ff"
                    stroke="none"
                  >
                    <path
                      d="M0 2275 l0 -2275 2360 0 2360 0 0 275 0 2275 -2360 0 -2360 0 0
 -2275z m2940 1461 c109 -26 241 -79 308 -124 96 -66 185 -169 236 -274 52
 -108 70 -174 87 -318 23 -201 -6 -415 -77 -568 -76 -167 -212 -309 -367 -385
 -202 -98 -263 -107 -773 -107 l-404 0 0 -570 0 -570 -340 0 -340 0 1470 0
 1471 798 -4 c719 -3 804 -5 872 -21z"
                    />
                    <path
                      d="M2388 347 c-9 -12 -39 -31 -69 -42 -29 -11 -57 -21 -61 -23 -4 -2
 -17 13 -29 32 -29 50 -42 45 -19 -6 l19 -42 -42 -29 c-56 -39 -115 -112 -154
 -189 -18 -35 -32 -67 -32 -71 -4 27 -20 61 -35 l61 -28 -2 -75 c-1 -49 4
 -92 14 -124 20 -57 27 -48 -98 -123 -74 -45 -92 -71 -26 -38 18 9 33 16 33 16
 1 0 19 -25 41 -55 45 -62 123 -127 191 -157 l45 -19 -7 -45 c-8 -54 -56 33
 -5 22 38 23 39 60 30 21 -5 52 -9 69 -9 17 0 37 -7 44 -15 18 -22 43 -18 68
 10 12 14 30 25 41 25 10 0 52 17 92 37 93 46 183 134 228 225 l33 65 36 -8
 c32 -7 53 -5 41 4 -9 8 -176 67 -188 67 -9 0 -11 16 -6 68 6 60 2 93 -21 173
 -3 11 12 27 47 50 61 39 53 48 -17 19 l-49 -22 -25 34 c-37 48 -80 87 -122
 109 -41 21 -42 22 -29 122 9 73 -4 70 -47 -11 l-33 -62 -67 0 c-38 -1 -90 -9
 -119 -19 -59 -20 -65 -17 -97 45 -18 37 -13 44 47 65 29 10 44 11 69 1 38 -14
 68 -1 68 31 0 48 -56 65 -82 24z m-121 -154 l22 -47 -53 -50 c-28 -28 -62 -72
 -75 -98 -25 -53 -24 -53 -87 -37 -42 11 -45 14 -39 38 13 51 66 130 126 185
 33 31 66 56 72 56 7 -1 22 -22 34 -47z m283 -18 c0 -6 -62 -120 -90 -168 -13
 -21 -19 -25 -27 -15 -23 29 -93 151 -89 155 2 23 206 47 206 28z m157 -68
 c38 -27 102 -103 92 -110 -11 -8 -160 -67 -170 -67 -10 0 -8 56 7 178 6 46 4
 46 71 -1z m-378 -44 c40 -81 62 -135 51 -128 -5 3 -39 26 -77 50 -37 24 -70
 42 -73 39 -3 -4 24 -33 60 -65 35 -32 58 -59 50 -59 -22 1 -170 37 -176 43
 -16 16 100 177 128 177 4 0 21 -26 37 -57z m503 -130 c12 -31 17 -177 6 -188
 -3 -4 -49 8 -102 26 -91 32 -119 49 -77 49 36 0 120 23 115 32 -3 4 -33 8 -67
 8 l-62 0 37 25 c20 14 40 25 43 25 3 0 23 11 43 25 46 31 50 31 64 -2z m-611
 -57 c104 -39 121 -48 107 -58 -7 -4 -25 -8 -40 -8 -60 0 -63 -14 -25 l58
 -10 -82 -49 c-90 -53 -91 -53 -110 14 -16 56 -12 160 5 160 2 0 31 -11 66 -24z
 m307 -26 c12 -12 22 -29 22 -40 -24 -37 -60 -62 -60 -23 0 -58 35 -58 58 0
 28 29 62 54 62 12 0 32 -9 44 -20z m215 -136 c84 -19 89 -28 47 -81 l-18 -23
 -38 34 c-98 85 -109 98 -89 93 11 -3 55 -13 98 -23z m4 -125 c3 -14 -56 -65
 -72 -62 -7 2 -85 167 -85 180 0 11 155 -105 157 -118z m-403 19 c-3 -51 -8
 -95 -10 -97 -6 -6 -114 81 -125 100 -14 27 -14 27 54 58 92 43 90 46 81 -61z
 m569 66 c47 -8 47 -23 1 -100 -63 -105 -155 -180 -268 -218 -44 -15 -50 -15
 -66 -1 -23 21 -46 19 -64 -6 -13 -19 -20 -20 -75 -14 -34 -61 9 -61 12 0 3
 12 27 27 54 25 48 28 49 72 49 44 1 95 9 152 24 22 6 29 2 54 -34 35 -50 43
 -41 16 15 l-20 40 22 18 c12 9 33 27 46 38 17 14 32 19 50 14 24 -6 25 -5 9
 11 -15 16 -15 20 10 65 18 32 32 47 42 44 8 -2 32 -7 53 -11z m-318 -101 l45
 -68 -31 -13 c-37 -15 -159 -28 -159 -17 0 10 90 165 96 165 2 0 24 -30 49 -67z
 m-316 -53 l52 -35 -4 -52 c-2 -29 -7 -56 -11 -60 -23 -23 -197 111 -232 179
 l-15 28 53 23 53 23 26 -35 c14 -20 49 -52 78 -71z"
                    />
                  </g>
                </svg>
              </div>
              <div className="barcode"></div>
            </div>
            <div className="cut-lines"></div>
            <div className="ticket-bottom">
              <div className="ticket-time-details">
                <div className="to">
                  <span className="sub-text">TO</span>
                  <div className="dest-name">Тур не найден</div>
                </div>
                <div className="at ">
                  <span className="sub-text">AT</span>
                  <div className="tour-time">-</div>
                  <div className="tour-date">-</div>
                </div>
              </div>

              <div className="ticket-price-box">
                <div className="ticket-price-details">
                  <div className="check-id-box price-part">
                    <span className="sub-text">CHECK ID</span>
                    <div className="check-id price-numbers">-</div>
                  </div>
                  <div className="passenger price-part">
                    <span className="sub-text">NUMBER OF PASSENGERS</span>
                    <div className="passengers-number price-numbers">1</div>
                  </div>
                  <div className="seat price-part">
                    <span className="sub-text">SEAT</span>
                    <div className="seat-number price-numbers">-</div>
                  </div>
                  <div className="total-box">
                    <span className="total-text">TOTAL:</span>
                    <div className="total-price">0 RUB</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="select-button">Оплатить</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pay-page">
      <MyBackButton>Back</MyBackButton>
      <div className="ticket">
        <div className="ticket-inner">
          <div className="ticket-header">
            <div className="agency-name">
              <GradientText
                colors={["#2F3B69", "#a4add0ff", "#2F3B69", "#d4d5ceff"]}
                animationSpeed={9}
              >
                PULSE
              </GradientText>
              <GradientText
                colors={["#2F3B69", "#a4add0ff", "#2F3B69", "#d4d5ceff"]}
                animationSpeed={9}
              >
                TOUR
              </GradientText>
            </div>
            <div className="icon">
              {/* <svg
                className="pulse-icon"
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                height="45px"
                viewBox="0 0 0 0"
                preserveAspectRatio="xMidYMid meet"
              >
                <g
                  transform="translate(0.000000,455.00000) scale(0.10000,-0.100000)"
                  fill="#779a0ff"
                  stroke="none"
                >
                  <path
                    d="M0 2275 l0 -2275 2360 0 2360 0 0 2275 0 2275 -2360 0 -2360 0 0
 -2275z m2940 1461 c109 -26 241 -79 308 -124 96 -66 185 -169 236 -274 52
 -108 70 -174 87 -318 23 -201 -6 -415 -77 -568 -76 -167 -212 -309 -367 -385
 -202 -98 -263 -107 -773 -107 l-404 0 0 -570 0 -570 -340 0 -340 0 1470 0
 1471 798 -4 c719 -3 804 -5 872 -21z"
                  />
                  <path
                    d="M2388 3347 c-9 -12 -39 -31 -69 -42 -29 -11 -57 -21 -61 -23 -4 -2
 -17 13 -29 32 -29 50 -42 45 -19 -6 l19 -42 -42 -29 c-56 -39 -115 -112 -154
 -189 -18 -35 -32 -67 -32 -71 -1 -4 27 -20 61 -35 l61 -28 -2 -75 c-1 -49 4
 -92 14 -124 20 -57 27 -48 -98 -123 -74 -45 -92 -71 -26 -38 18 9 33 16 33 16
 1 0 19 -25 41 -55 45 -62 123 -127 191 -157 l45 -19 -7 -45 c-8 -54 -56 33
 -5 22 38 23 39 60 30 21 -5 52 -9 69 -9 17 0 37 -7 44 -15 18 -22 43 -18 68
 10 12 14 30 25 41 25 10 0 52 17 92 37 93 46 183 134 228 225 l33 65 36 -8
 c32 -7 53 -5 41 4 -9 8 -176 67 -188 67 -9 0 -11 16 -6 68 6 60 2 93 -21 173
 -3 11 12 27 47 50 61 39 53 48 -17 19 l-49 -22 -25 34 c-37 48 -80 87 -122
 109 -41 21 -42 22 -29 122 9 73 -4 70 -47 -11 l-3 -62 -67 0 c-38 -1 -90 -9
 -119 -19 -59 -20 -65 -17 -97 45 -18 37 -13 44 47 65 29 10 44 11 69 1 38 -14
 68 -1 68 31 0 48 -56 65 -82 24z m-121 -154 l22 -47 -53 -50 c-28 -28 -62 -72
 -75 -98 -25 -53 -24 -53 -87 -37 -42 11 -45 14 -39 38 13 51 66 130 126 185
 33 31 66 56 72 56 7 -1 22 -22 34 -47z m283 -18 c0 -6 -62 -120 -90 -168 -13
 -21 -19 -25 -27 -15 -23 29 -93 151 -89 155 22 23 206 47 206 28z m157 -68
 c38 -27 102 -103 92 -110 -11 -8 -160 -67 -170 -67 -10 -8 56 7 178 6 46 4
 46 71 -1z m-378 -44 c40 -81 62 -135 51 -128 -5 3 -39 26 -77 50 -37 24 -70
 42 -73 39 -3 -4 24 -33 60 -65 35 -32 58 -59 50 -59 -22 1 -170 37 -176 43
 -16 16 100 177 128 177 4 0 21 -26 37 -57z m503 -130 c12 -31 17 -177 6 -188
 -3 -4 -49 8 -102 26 -91 32 -119 49 -77 49 36 0 120 23 115 32 -3 4 -33 8 -67
 8 l-62 0 37 25 c20 14 40 25 43 25 3 0 23 11 43 25 46 31 50 31 64 -2z m-611
 -57 c104 -39 121 -48 107 -58 -7 -4 -25 -8 -40 -8 -60 0 -63 -14 -4 -25 l58
 -10 -82 -49 c-90 -53 -91 -53 -110 14 -16 56 -12 160 5 160 2 0 31 -11 66 -24z
 m307 -26 c12 -12 22 -29 22 -40 -24 -37 -60 -62 -60 -23 0 -58 35 -58 58 0
 28 29 62 54 62 12 0 32 -9 44 -20z m215 -136 c84 -19 89 -28 47 -81 l-18 -23
 -38 34 c-98 85 -109 98 -89 93 11 -3 55 -13 98 -23z m4 -125 c3 -14 -56 -65
 -72 -62 -7 2 -85 167 -85 180 0 11 155 -105 157 -118z m-403 19 c-3 -51 -8
 -95 -10 -97 -6 -6 -114 81 -125 100 -14 27 -14 27 54 58 92 43 90 46 81 -61z
 m569 6 c47 -8 47 -23 1 -100 -63 -105 -155 -180 -268 -218 -44 -15 -50 -15
 -66 -1 -23 21 -46 19 -64 -6 -13 -19 -20 -20 -75 -14 -34 4 -61 9 -61 12 0 3
 12 27 27 54 25 48 28 49 72 49 44 1 95 9 152 24 22 6 29 2 54 -34 35 -50 43
 -41 16 15 l-20 40 22 18 c12 9 33 27 46 38 17 14 32 19 50 14 24 -6 25 -5 9
 11 -15 16 -15 20 10 65 18 32 32 47 42 44 8 -2 32 -7 53 -11z m-318 -101 l45
 -68 -31 -13 c-37 -15 -159 -28 -159 -17 0 10 90 165 96 165 2 0 24 -30 49 -67z
 m-316 -53 l52 -35 -4 -52 c-2 -29 -7 -56 -11 -60 -23 -23 -197 111 -232 179
 l-15 28 53 23 53 23 26 -35 c14 -20 49 -52 78 -71z"
                  />
                </g>
              </svg> */}
            </div>
            <div className="barcode"></div>
          </div>
        </div>
        <div className="cut-lines"></div>
        <div className="ticket-bottom">
          <div className="ticket-time-details">
            <div className="to">
              <span className="sub-text">TO</span>
              <div className="dest-name">{tour.location}</div>
            </div>
            <div className="at ">
              <span className="sub-text">AT</span>
              <div className="tour-time">{formatTime(tour.time)}</div>
              <div className="tour-date">{formatDate(tour.date)}</div>
            </div>
          </div>

          <div className="ticket-price-box">
            <div className="ticket-price-details">
              <div className="check-id-box price-part">
                <span className="sub-text">CHECK ID</span>
                <div className="check-id price-numbers">{checkId}</div>
              </div>
              <div className="passenger">
                {/* Поле для ввода имени пассажира */}
                <div className="passenger-input-box">
                  <span className="sub-text">PASSENGER</span>
                  <input
                    name="passenger-name"
                    type="text"
                    className={`passenger-input ${nameError ? "error" : ""}`}
                    placeholder="Ваше имя"
                    value={passengerName}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Ограничиваем длину ввода 50 символами
                      if (value.length > 50) return;
                      // Разрешаем ввод только букв, пробелов и дефисов
                      const filteredValue = value.replace(
                        /[^a-zA-Zа-яА-ЯёЁ\s\-]/g,
                        ""
                      );
                      setPassengerName(filteredValue);
                      // Очищаем ошибку при изменении поля
                      if (nameError) setNameError("");
                    }}
                    onKeyDown={(e) => {
                      // Разрешаем только буквы, пробелы, дефисы и некоторые служебные клавиши
                      const validKeys = [
                        "Backspace",
                        "Delete",
                        "Tab",
                        "Enter",
                        "Escape",
                        "ArrowLeft",
                        "ArrowRight",
                        "ArrowUp",
                        "ArrowDown",
                        " ",
                      ];

                      const isLetter = /[a-zA-Zа-яА-ЯёЁ]/.test(e.key);
                      const isHyphen = e.key === "-";

                      if (
                        !isLetter &&
                        !isHyphen &&
                        !validKeys.includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {nameError && (
                    <div className="name-error-message">{nameError}</div>
                  )}
                </div>

                {/* Поле для ввода номера телефона */}
                <div className="phone-input-box">
                  <span className="sub-text">PHONE</span>
                  <input
                    name="passenger-phone"
                    type="tel"
                    className={`phone-input ${phoneError ? "error" : ""}`}
                    placeholder="Телефон"
                    value={phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Ограничиваем длину ввода 14 символами
                      if (value.length > 14) return;
                      // Разрешаем ввод только цифр и специальных символов для форматирования
                      const filteredValue = value.replace(
                        /[^\d\s\-\+\(\)]/g,
                        ""
                      );
                      setPhoneNumber(filteredValue);
                      // Очищаем ошибку при изменении поля
                      if (phoneError) setPhoneError("");
                    }}
                    onKeyDown={(e) => {
                      // Разрешаем только цифры и некоторые служебные клавиши
                      if (
                        !/[\d\s\-\+\(\)]/.test(e.key) &&
                        ![
                          "Backspace",
                          "Delete",
                          "Tab",
                          "Enter",
                          "Escape",
                          "ArrowLeft",
                          "ArrowRight",
                          "ArrowUp",
                          "ArrowDown",
                        ].includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {phoneError && (
                    <div className="phone-error-message">{phoneError}</div>
                  )}
                </div>

                {/* <span className="sub-text">NUMBER OF PASSENGERS</span>
                <div className="passengers-number price-numbers">1</div> */}
              </div>
              {/* <div className="seat price-part">
                <span className="sub-text">SEAT</span>
                <div className="seat-number price-numbers">-</div>
              </div> */}

              {/* Отображение выбранных доп услуг */}
              {cart && cart.length > 0 && (
                <div className="extras-list">
                  <h4 className="extras-title">Доп услуги</h4>
                  <ul>
                    {cart.map((item, index) => (
                      <li key={index} className="extra-item">
                        <span className="extra-name">{item.name}</span>
                        <span className="extra-price">{item.price} RUB</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="total-box">
                <span className="total-text">TOTAL:</span>
                <div className="total-price">{calculateTotal()} RUB</div>
              </div>
            </div>
          </div>
        </div>

        {/* Чекбокс "Согласен с правилами тура" */}
        <div className="agreement-checkbox">
          <label>
            <input
              type="checkbox"
              checked={agreementChecked}
              onChange={(e) => setAgreementChecked(e.target.checked)}
            />
            <span
              className="agreement-text"
              onClick={() => setShowAgreementModal(true)}
            >
              Согласен с правилами тура
            </span>
          </label>
        </div>

        {/* Модальное окно с соглашением */}
        {showAgreementModal && (
          <div
            className="agreement-modal-overlay"
            onClick={() => setShowAgreementModal(false)}
          >
            <div
              className="agreement-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Правила тура</h3>
                <button
                  className="close-modal"
                  onClick={() => setShowAgreementModal(false)}
                >
                  x
                </button>
              </div>
              <div className="modal-content">
                <h1>Соглашение о приобретении места в туристическом туре</h1>

                <p>
                  Настоящее соглашение (далее — «Соглашение») определяет условия
                  приобретения, участия, переноса, отмены и возврата денежных
                  средств за участие в туристическом туре (далее — «Тур»),
                  организуемом Исполнителем.
                  <br />
                  Оплата Тура означает полное и безоговорочное согласие
                  Заказчика со всеми условиями настоящего Соглашения.
                </p>

                <p>
                  <strong>1. Общие положения</strong>
                  <br />
                  1.1. Настоящее Соглашение является публичной офертой.
                  <br />
                  1.2. Заказчик — физическое лицо, приобретающее место в Туре.
                  <br />
                  1.3. Исполнитель — лицо, организующее и проводящее Тур.
                  <br />
                  1.4. Тур проводится в условиях повышенной физической
                  активности и зависит от погодных и природных факторов.
                  <br />
                  1.5. Заказчик подтверждает, что ознакомился с программой Тура
                  и оценивает свои физические возможности как достаточные для
                  участия.
                </p>

                <p>
                  <strong>2. Условия проведения тура</strong>
                  <br />
                  2.1. Тур проводится при наличии минимально необходимого
                  количества участников.
                  <br />
                  2.2. Исполнитель вправе отменить Тур при недоборе группы,
                  уведомив Заказчика не позднее чем за разумный срок.
                  <br />
                  2.3. В случае отмены Тура по причине недобора группы Заказчику
                  предлагается перенос участия на другие даты либо возврат
                  уплаченных денежных средств.
                </p>

                <p>
                  <strong>3. Перенос тура и погодные условия</strong>
                  <br />
                  3.1. Исполнитель вправе перенести даты Тура в случае
                  неблагоприятных погодных условий, стихийных бедствий, закрытия
                  маршрутов, ограничений со стороны государственных органов и
                  иных обстоятельств непреодолимой силы.
                  <br />
                  3.2. Перенос Тура по указанным причинам возможен на срок до 7
                  (семи) календарных дней.
                  <br />
                  3.3. Перенос Тура не является отменой и не влечет возврат
                  денежных средств.
                  <br />
                  3.4. Оплаченное место сохраняется за Заказчиком и может быть
                  использовано в новые даты Тура.
                </p>

                <p>
                  <strong>4. Изменение программы и маршрута</strong>
                  <br />
                  4.1. Исполнитель вправе вносить изменения в маршрут,
                  программу, тайминг и порядок прохождения Тура без ухудшения
                  общего уровня оказываемых услуг.
                  <br />
                  4.2. Изменения могут быть вызваны погодными условиями,
                  требованиями безопасности, состоянием маршрута или уровнем
                  подготовки группы.
                  <br />
                  4.3. Указанные изменения не являются основанием для возврата
                  денежных средств.
                </p>

                <p>
                  <strong>5. Условия оплаты</strong>
                  <br />
                  5.1. Тур оплачивается в полном объеме до начала Тура.
                  <br />
                  5.2. Моментом оплаты считается поступление денежных средств на
                  счет Исполнителя.
                  <br />
                  5.3. Комиссии банков и платежных систем оплачиваются
                  Заказчиком и возврату не подлежат.
                </p>

                <p>
                  <strong>
                    6. Отмена тура по инициативе Заказчика и возврат средств
                  </strong>
                  <br />
                  6.1. Отмена участия осуществляется путем письменного
                  уведомления Исполнителя.
                  <br />
                  6.2. При отмене участия менее чем за 9 (девять) календарных
                  суток до начала Тура денежные средства не возвращаются.
                  <br />
                  6.3. При отмене участия за 10 (десять) и более календарных
                  суток до начала Тура возврат осуществляется в размере до 80%
                  от уплаченной суммы.
                  <br />
                  6.4. Размер возврата определяется с учетом фактически
                  понесенных Исполнителем расходов.
                </p>

                <p>
                  <strong>7. Отмена тура по инициативе Исполнителя</strong>
                  <br />
                  7.1. В случае отмены Тура по инициативе Исполнителя, за
                  исключением форс-мажорных обстоятельств, Заказчику
                  предлагается:
                  <br />
                  перенос участия на другие даты, либо
                  <br />
                  возврат уплаченных денежных средств.
                  <br />
                  7.2. Исполнитель не компенсирует дополнительные расходы
                  Заказчика, понесенные вне рамок Тура.
                </p>

                <p>
                  <strong>8. Замена участника</strong>
                  <br />
                  8.1. Заказчик вправе передать оплаченное место другому лицу не
                  позднее чем за 2 (два) календарных дня до начала Тура.
                  <br />
                  8.2. Новый участник обязан соответствовать требованиям Тура и
                  состоянию здоровья, необходимым для участия.
                  <br />
                  8.3. Замена участника осуществляется только по согласованию с
                  Исполнителем.
                </p>

                <p>
                  <strong>
                    9. Ответственность Заказчика и медицинские требования
                  </strong>
                  <br />
                  9.1. Заказчик подтверждает отсутствие медицинских
                  противопоказаний для участия в Туре.
                  <br />
                  9.2. Заказчик самостоятельно несет ответственность за свое
                  здоровье и физическое состояние.
                  <br />
                  9.3. Исполнитель вправе отстранить Заказчика от участия в Туре
                  без возврата денежных средств при угрозе его здоровью или
                  безопасности других участников.
                </p>

                <p>
                  <strong>10. Опоздание и досрочное прекращение участия</strong>
                  <br />
                  10.1. В случае опоздания Заказчика к месту начала Тура
                  Исполнитель не несет ответственности за невозможность его
                  участия.
                  <br />
                  10.2. При досрочном прекращении участия по инициативе
                  Заказчика возврат денежных средств не производится.
                  <br />
                  10.3. Дополнительные расходы, связанные с досрочным
                  завершением участия, Заказчик несет самостоятельно.
                </p>

                <p>
                  <strong>11. Личные вещи и снаряжение</strong>
                  <br />
                  11.1. Заказчик несет ответственность за сохранность своих
                  личных вещей и снаряжения.
                  <br />
                  11.2. Исполнитель не несет ответственности за утрату или
                  повреждение личного имущества Заказчика.
                </p>

                <p>
                  <strong>12. Фото- и видеоматериалы</strong>
                  <br />
                  12.1. Заказчик дает согласие на фото- и видеосъемку во время
                  Тура.
                  <br />
                  12.2. Исполнитель вправе использовать полученные материалы в
                  информационных и рекламных целях без дополнительного
                  согласования и вознаграждения.
                </p>

                <p>
                  <strong>13. Форс-мажор</strong>
                  <br />
                  13.1. Стороны освобождаются от ответственности за неисполнение
                  обязательств вследствие обстоятельств непреодолимой силы.
                  <br />
                  13.2. К таким обстоятельствам относятся, в том числе, погодные
                  условия, стихийные бедствия, эпидемии, действия
                  государственных органов.
                </p>

                <p>
                  <strong>14. Заключительные положения</strong>
                  <br />
                  14.1. К настоящему Соглашению применяется законодательство
                  Российской Федерации.
                  <br />
                  14.2. Все споры подлежат разрешению путем переговоров, а при
                  недостижении согласия — в установленном законом порядке.
                  <br />
                  14.3. Оплата Тура подтверждает полное согласие Заказчика с
                  условиями настоящего Соглашения.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="select-button" onClick={handlePayment}>
          Оплатить
        </div>
      </div>
    </div>
  );
}
