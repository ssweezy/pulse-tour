import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('enter');
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      // Начинаем анимацию выхода
      setTransitionStage('exit');

      // Очищаем предыдущий таймаут
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // После завершения анимации выхода, меняем страницу и начинаем анимацию входа
      timeoutRef.current = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('enter');
      }, 300);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [location, displayLocation]);

  return (
    <div className={`page-transition page-transition-${transitionStage}`}>
      {children}
    </div>
  );
}
