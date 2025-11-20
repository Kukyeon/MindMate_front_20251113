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
import "./Graph.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const emotionGroups = [
  { name: "긍정/기쁨", types: ["happy", "joy", "laugh", "calm"] },
  { name: "사랑/호감", types: ["love", "heart"] },
  { name: "슬픔/우울", types: ["sad", "cry", "down"] },
  {
    name: "분노/스트레스/놀람",
    types: ["anger", "sick", "confused", "gasp", "surprised", "dizzy"],
  },
];

const emotionColors = {
  happy: "#c9a414ff",
  joy: "#c9a414ff",
  laugh: "#c9a414ff",
  calm: "#c9a414ff",
  love: "#FF6B81",
  heart: "#FF6B81",
  sad: "#6C8CD5",
  cry: "#6C8CD5",
  down: "#6C8CD5",
  anger: "#b14343ff",
  sick: "#b14343ff",
  confused: "#b14343ff",
  gasp: "#b14343ff",
  surprised: "#b14343ff",
  dizzy: "#b14343ff",
};

const Graph = () => {
  const [weeklyCounts, setWeeklyCounts] = useState({});
  const [weeklyPercent, setWeeklyPercent] = useState({});
  const [aiComment, setAiComment] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fetchTrigger, setFetchTrigger] = useState(false);

  // 초기값 세팅 (이번 주)
  useEffect(() => {
    if (!startDate && !endDate) {
      const now = new Date();
      const day = now.getDay();
      const diffToSunday = day === 0 ? 0 : day;
      const lastSunday = new Date(now);
      lastSunday.setDate(now.getDate() - diffToSunday);
      const lastMonday = new Date(lastSunday);
      lastMonday.setDate(lastSunday.getDate() - 6);

      setStartDate(lastMonday.toISOString().slice(0, 10));
      setEndDate(lastSunday.toISOString().slice(0, 10));
      setFetchTrigger(true); // 초기값도 바로 조회
    }
  }, []);

  // fetchTrigger가 true일 때만 데이터 가져오기
  useEffect(() => {
    if (!startDate || !endDate || !fetchTrigger) return;

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
      } finally {
        setFetchTrigger(false);
      }
    };

    fetchWeeklyData();
  }, [startDate, endDate, fetchTrigger]);

  const handleDateChange = (type, value) => {
    if (type === "start") setStartDate(value);
    else setEndDate(value);
  };

  const handleFetch = () => {
    if (startDate && endDate) {
      setFetchTrigger(true);
    } else {
      alert("시작일과 종료일을 모두 선택해주세요.");
    }
  };

  const handleQuickSelect = (period) => {
    const now = new Date();
    let monday, sunday;

    if (period === "thisWeek") {
      const day = now.getDay(); // 일(0)~토(6)
      const diffToMonday = day === 0 ? 6 : day - 1;
      monday = new Date(now);
      monday.setDate(now.getDate() - diffToMonday);
      sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
    } else if (period === "lastWeek") {
      monday = new Date();
      monday.setDate(now.getDate() - now.getDay() - 6);
      sunday = new Date();
      sunday.setDate(now.getDate() - now.getDay());
    }

    setStartDate(monday.toISOString().slice(0, 10));
    setEndDate(sunday.toISOString().slice(0, 10));
    setFetchTrigger(true); // 바로 조회
  };

  const emotions = emojiList.map((e) => e.type);

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
      x: { offset: true, grid: { display: true }, ticks: { display: false } },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, font: { size: 12 } },
        grid: { drawBorder: false },
      },
    },
    plugins: { legend: { display: false } },
  };

  const sortedEmotions = emotionGroups.flatMap((group) =>
    group.types.filter((type) => weeklyPercent[type] > 0)
  );

  return (
    <div className="graph-container">
      <div className="date-select-container">
        <label>
          시작일:{" "}
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleDateChange("start", e.target.value)}
          />
        </label>
        <span> ~ </span>
        <label>
          종료일:{" "}
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleDateChange("end", e.target.value)}
          />
        </label>
        <button onClick={handleFetch}>조회</button>
        <div className="quick-select">
          <button onClick={() => handleQuickSelect("thisWeek")}>이번 주</button>
          <button onClick={() => handleQuickSelect("lastWeek")}>지난 주</button>
        </div>
      </div>

      <h2 className="graph-title">
        {startDate} ~ {endDate} 주간 감정 요약
      </h2>

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
                src={e.image}
                alt={e.type}
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

      <h3 className="graph-subtitle">감정 비율</h3>
      <div className="emotion-bar-wrapper">
        {sortedEmotions.map((emotion) => {
          const percent = weeklyPercent[emotion];
          const emo = emojiList.find((e) => e.type === emotion);
          if (!emo) return null;
          const gradient = emotionColors[emotion] || "#ccc";

          return (
            <div
              key={emotion}
              className="emotion-segment"
              style={{
                width: `${percent}%`,
                background: gradient,
                position: "relative",
              }}
            >
              <img src={emo.image} alt={emo.type} className="emotion-icon" />
              <span className="emotion-percent">{percent.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>

      <div className="ai-comment-card">{aiComment}</div>
    </div>
  );
};

export default Graph;
