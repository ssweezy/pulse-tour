import React from "react";
import { useNavigate } from "react-router-dom";
import "./ThankPage.css";
import GradientText from "../../comp/Gradtext/GradientText";
import MyBackButton from "../../comp/BackButton/BackButton";

export default function ThankPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="thank-page">
      <MyBackButton>Back</MyBackButton>
      <div className="thank-content">
        <div className="thank-header">
          <GradientText
            colors={["#2F3B69", "#a4add0ff", "#2F3B69", "#d4d5ceff"]}
            animationSpeed={9}
          >
            СПАСИБО
          </GradientText>
          <GradientText
            colors={["#2F3B69", "#a4add0ff", "#2F3B69", "#d4d5ceff"]}
            animationSpeed={9}
          >
            ЧТО ВЫБРАЛИ НАС!
          </GradientText>
        </div>

        <div className="thank-message">
          <p>
            Ваш заказ принят! Мы рады, что вы выбрали нас для своего
            путешествия.
          </p>
        </div>

        <button className="home-button" onClick={handleGoHome}>
          На главную
        </button>
      </div>
    </div>
  );
}
