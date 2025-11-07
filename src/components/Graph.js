import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../api/axiosConfig";
import { emojiList } from "../api/emojiApi";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const sampleDiaries = [
  { date: "2025-10-27", emotion: "happy" },
  { date: "2025-10-28", emotion: "sad" },
  { date: "2025-10-29", emotion: "anger" },
  { date: "2025-10-30", emotion: "happy" },
  { date: "2025-10-31", emotion: "happy" },
  { date: "2025-11-01", emotion: "sad" },
  { date: "2025-11-02", emotion: "happy" },
];

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

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const res = await api.get(`/api/diary/week`, {
          params: { start: startDate, end: endDate },
        });
        const serverData = res.data;

        if (serverData && serverData.length > 0) {
          processData(serverData);
        } else {
          console.warn("서버 데이터 없음 → 샘플 데이터 사용");
          processData(sampleDiaries);
        }
      } catch (err) {
        console.error("데이터 불러오기 실패 ", err);
        processData(sampleDiaries);
      }
    };

    const processData = (data) => {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const filtered = data.filter((d) => {
        const day = new Date(d.date);
        return day >= start && day <= end;
      });

      const counts = {};
      filtered.forEach((d) => {
        counts[d.emotion] = (counts[d.emotion] || 0) + 1;
      });
      setWeeklyCounts(counts);

      const total = filtered.length;
      const percent = {};
      Object.entries(counts).forEach(([emo, count]) => {
        percent[emo] = total > 0 ? (count / total) * 100 : 0;
      });
      setWeeklyPercent(percent);
      console.log(weeklyPercent);
    };

    fetchWeeklyData();
  }, [startDate, endDate]);

  const emotions = emojiList.map((e) => e.name);

  const barData = {
    labels: emotions,
    datasets: [
      {
        label: "감정 빈도",
        data: emotions.map((e) => weeklyCounts[e] || 0),
        backgroundColor: "#a8d8ff",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        offset: true, // ✅ 막대 중심 정렬
        grid: { display: false },
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

      {/* ✅ 그래프 영역 */}
      <div
        style={{
          position: "relative",
          height: "clamp(300px, 45vh, 500px)",
          minHeight: 280,
          width: "100%",
          margin: "0 auto",
        }}
      >
        <Bar data={barData} options={options} />

        {/* ✅ 이모지를 그래프 하단에 겹쳐 배치 */}
        <div
          style={{
            position: "absolute",
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

      {/* ✅ 감정 비율 표시 */}
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
    </div>
  );
};

// ✅ 샘플 실행
export default function App() {
  return <Graph startDate="2025-10-27" endDate="2025-11-02" />;
}
