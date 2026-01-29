import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      {/* Черкесский орнамент фон (SVG паттерн) */}
      <svg className="footer-pattern" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <pattern id="circassian-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            {/* Центральный элемент */}
            <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(212, 175, 55, 0.08)" strokeWidth="1.5"/>
            <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(212, 175, 55, 0.06)" strokeWidth="1"/>

            {/* Угловые элементы */}
            <path d="M 0 0 Q 10 10 0 20" fill="none" stroke="rgba(212, 175, 55, 0.05)" strokeWidth="1"/>
            <path d="M 100 0 Q 90 10 100 20" fill="none" stroke="rgba(212, 175, 55, 0.05)" strokeWidth="1"/>
            <path d="M 0 100 Q 10 90 0 80" fill="none" stroke="rgba(212, 175, 55, 0.05)" strokeWidth="1"/>
            <path d="M 100 100 Q 90 90 100 80" fill="none" stroke="rgba(212, 175, 55, 0.05)" strokeWidth="1"/>

            {/* Дополнительные геометрические элементы */}
            <line x1="50" y1="30" x2="50" y2="20" stroke="rgba(212, 175, 55, 0.07)" strokeWidth="1.5"/>
            <line x1="50" y1="70" x2="50" y2="80" stroke="rgba(212, 175, 55, 0.07)" strokeWidth="1.5"/>
            <line x1="30" y1="50" x2="20" y2="50" stroke="rgba(212, 175, 55, 0.07)" strokeWidth="1.5"/>
            <line x1="70" y1="50" x2="80" y2="50" stroke="rgba(212, 175, 55, 0.07)" strokeWidth="1.5"/>

            {/* Абстрактные детали */}
            <circle cx="30" cy="30" r="3" fill="rgba(212, 175, 55, 0.06)"/>
            <circle cx="70" cy="30" r="3" fill="rgba(212, 175, 55, 0.06)"/>
            <circle cx="30" cy="70" r="3" fill="rgba(212, 175, 55, 0.06)"/>
            <circle cx="70" cy="70" r="3" fill="rgba(212, 175, 55, 0.06)"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circassian-pattern)"/>
      </svg>

      {/* Основной контент */}
      <a
        href="https://t.me/boombaxbaby"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-link"
      >
        <span className="footer-text">made by</span>
        <span className="footer-author">KARAF</span>
      </a>
    </footer>
  );
}
