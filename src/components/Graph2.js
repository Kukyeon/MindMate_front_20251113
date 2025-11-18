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
import { authHeader as getAuthHeader } from "../api/authApi";

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

const Graph = ({ user }) => {
  const [dailyData, setDailyData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [aiComment, setAiComment] = useState("");
  const [weeklyCounts, setWeeklyCounts] = useState({});
  const [weeklyPercent, setWeeklyPercent] = useState({});
  const [fetchTrigger, setFetchTrigger] = useState(false);

  // 초기값: 지난 주
  useEffect(() => {
    if (!startDate && !endDate) {
      const now = new Date();
      const day = now.getDay();
      const lastSunday = new Date(now);
      lastSunday.setDate(now.getDate() - day);
      const lastMonday = new Date(lastSunday);
      lastMonday.setDate(lastSunday.getDate() - 6);

      setStartDate(lastMonday.toISOString().slice(0, 10));
      setEndDate(lastSunday.toISOString().slice(0, 10));
      setFetchTrigger(true);
    }
  }, []);

  // 데이터 가져오기
  useEffect(() => {
    if (!startDate || !endDate || !fetchTrigger) return;

    const fetchWeeklyData = async () => {
      const headers = user ? await getAuthHeader() : {};
      try {
        const res = await api.get("/api/diary/week/test", {
          params: { start: startDate, end: endDate },
          headers,
        });

        // 1️⃣ 일별 데이터
        setDailyData(res.data.dailyEmotions || []);

        // 2️⃣ 주간 통계
        const counts = res.data.weeklyCounts || [];
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

        // 3️⃣ AI 코멘트
        setAiComment(res.data.aiComment || "");
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
    if (startDate && endDate) setFetchTrigger(true);
    else alert("시작일과 종료일을 모두 선택해주세요.");
  };

  const handleQuickSelect = (period) => {
    const now = new Date();
    let monday, sunday;

    if (period === "thisWeek") {
      const day = now.getDay();
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
    setFetchTrigger(true);
  };

  // X축 날짜
  const labels = [];
  if (startDate && endDate) {
    let curr = new Date(startDate);
    const last = new Date(endDate);
    while (curr <= last) {
      labels.push(curr.toISOString().slice(0, 10));
      curr.setDate(curr.getDate() + 1);
    }
  }

  // Y값 생성
  const yValues = labels.map((date) => {
    const entry = dailyData.find((d) => d.date === date);
    return entry ? entry.emojiId : null;
  });

  const isMobile = window.innerWidth <= 480; // 모바일 판단
  const emojiSize = isMobile ? 25 : 35; // 모바일이면 20px, 아니면 35px

  const pointStyles = labels.map((date) => {
    const entry = dailyData.find((d) => d.date === date);
    if (!entry) return null;
    const emoji = emojiList.find((e) => e.id === entry.emojiId);
    if (!emoji) return null;
    const img = new Image();
    img.src = emoji.image;
    img.width = emojiSize;
    img.height = emojiSize;
    return img;
  });

  const lineData = {
    labels,
    datasets: [
      {
        label: "주간 기분",
        data: yValues,
        borderColor: "#a8d8ff",
        backgroundColor: "#a8d8ff",
        tension: 0.3,
        fill: false,
        pointRadius: 10,
        pointHoverRadius: 14,
        pointStyle: pointStyles,
        spanGaps: true, // 이거 추가
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: "날짜" } },
      y: {
        min: 0.5,
        max: 15.5,
        reverse: true,
        grace: "20%",
        ticks: {
          stepSize: 1,
          callback: (value) => {
            if (value >= 1 && value <= 5) return "좋음";
            if (value >= 6 && value <= 10) return "보통";
            if (value >= 11 && value <= 15) return "나쁨";
            return "";
          },
        },
        title: { display: true, text: "기분" },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const date = context.label;
            const entry = dailyData.find((d) => d.date === date);
            if (!entry) return "";
            const emoji = emojiList.find((e) => e.id === entry.emojiId);
            return emoji ? emoji.type : "";
          },
        },
      },
    },
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

      <div style={{ position: "relative", height: "500px", width: "100%" }}>
        <Line data={lineData} options={options} />
      </div>

      <h3 className="graph-subtitle">감정 비율</h3>
      <div className="emotion-bar-wrapper">
        {sortedEmotions.map((emotion) => {
          const percent = weeklyPercent[emotion];
          const emo = emojiList.find((e) => e.type === emotion);
          if (!emo) return null;
          return (
            <div
              key={emotion}
              className="emotion-segment"
              style={{
                width: `${percent}%`,
                background: emotionColors[emotion] || "#ccc",
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
