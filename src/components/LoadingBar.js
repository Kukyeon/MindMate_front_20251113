import React, { useEffect, useState } from "react";
import "./LoadingBar.css";

const LoadingBar = ({
  loading = false,
  message = "로딩 중...",
  speed = 100,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!loading) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev; // 끝에서 천천히 멈춤
        return prev + (95 - prev) * 0.05; // 남은 만큼 5%씩 증가
      });
    }, speed);

    return () => clearInterval(interval);
  }, [loading, speed]);

  return (
    <div className="daily-test-loading fade-in">
      <div className="loading-image"></div>
      <div className="loading-bar-container">
        <div
          className="loading-bar-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingBar;
