import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../api/axiosConfig";
import { emojiList } from "../api/emojiApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const emotionColors = {
  happy: "#FFD93D",
  sad: "#6C8CD5",
  anger: "#FF6B6B",
  joy: "#FFB74D",
  cry: "#8ABAD3",
};

const Graph = ({ startDate, endDate }) => {
  const [weeklyCounts, setWeeklyCounts] = useState({});
  const [weeklyPercent, setWeeklyPercent] = useState({});
  const [aiComment, setAiComment] = useState("");

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const res = await api.get(`/api/diary/week`, {
          params: { start: startDate, end: endDate },
        });
        const { weeklyCounts: counts, aiComment } = res.data;

        setWeeklyCounts(
          counts.reduce((acc, cur) => {
            acc[cur.emojiName] = cur.count;
            return acc;
          }, {})
        );

        const total = counts.reduce((sum, cur) => sum + cur.count, 0);
        const percent = {};
        counts.forEach((cur) => {
          percent[cur.emojiName] = total > 0 ? (cur.count / total) * 100 : 0;
        });
        setWeeklyPercent(percent);
        setAiComment(aiComment);
      } catch (err) {
        console.error("데이터 불러오기 실패", err);
      }
    };

    fetchWeeklyData();
  }, [startDate, endDate]);

  const emotions = emojiList.map((e) => e.name);

  // Line 차트용 데이터
  const lineData = {
    labels: emotions,
    datasets: [
      {
        label: "감정 빈도",
        data: emotions.map((e) => weeklyCounts[e] || 0),
        borderColor: "#a8d8ff",
        backgroundColor: "#a8d8ff",
        tension: 0.3,
        fill: false,
        pointRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        offset: true,
        grid: { display: true },
        ticks: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, font: { size: 12 } },
        grid: { drawBorder: false },
      },
    },
    plugins: { legend: { display: false } },
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 600,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h2>
        {startDate} ~ {endDate} 주간 감정 요약
      </h2>

      {/* 그래프 영역 */}
      <div
        style={{
          position: "relative",
          height: "clamp(300px, 45vh, 500px)",
          minHeight: 280,
          width: "100%",
          margin: "0 auto",
        }}
      >
        <Line data={lineData} options={options} />

        {/* 이모지를 그래프 하단에 겹쳐 배치 */}
        <div
          style={{
            position: "absolute",
            marginLeft: "20px",
            bottom: "-2.2rem",
            left: 0,
            right: 0,
            display: "grid",
            gridTemplateColumns: `repeat(${emotions.length}, 1fr)`,
            alignItems: "center",
          }}
        >
          {emojiList.map((e) => (
            <div
              key={e.id}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={e.Image}
                alt={e.name}
                style={{
                  width: "min(7vw, 32px)",
                  height: "auto",
                  aspectRatio: "1 / 1",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 감정 비율 표시 */}
      <h3 style={{ marginTop: "3rem" }}>감정 비율</h3>
      <div
        style={{
          display: "flex",
          height: 36,
          background: "#eee",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        {Object.entries(weeklyPercent).map(([emotion, percent]) => {
          const emo = emojiList.find((e) => e.name === emotion);
          if (!emo) return null;
          return (
            <div
              key={emotion}
              style={{
                width: `${percent}%`,
                background: emotionColors[emotion] || "#a8d8ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: 14,
              }}
            >
              <img
                src={emo.Image}
                alt={emo.name}
                style={{ width: 20, height: 20, marginRight: 5 }}
              />
              {percent.toFixed(1)}%
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: "1rem", fontStyle: "italic" }}>{aiComment}</div>
    </div>
  );
};

export default function App() {
  return <Graph startDate="2025-10-27" endDate="2025-11-02" />;
}
