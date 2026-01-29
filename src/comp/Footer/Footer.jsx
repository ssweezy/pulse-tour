import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
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
