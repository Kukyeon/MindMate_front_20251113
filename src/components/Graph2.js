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
import { useModal } from "../context/ModalContext";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import LoadingBar from "./LoadingBar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const emotionGroups = [
  { name: "긍정/기쁨", types: ["happy", "joy", "smile", "relax"] },
  { name: "사랑/호감", types: ["love", "heart"] },
  { name: "슬픔/우울", types: ["sad", "tears", "meh"] },
  {
    name: "분노/스트레스/놀람",
    types: ["angry", "unwell", "unsure", "shock", "wow", "spin"],
  },
];

const emotionColors = {
  happy: "#c9a414ff",
  joy: "#c9a414ff",
  smile: "#c9a414ff",
  relax: "#c9a414ff",
  love: "#FF6B81",
  heart: "#FF6B81",
  sad: "#6C8CD5",
  tears: "#6C8CD5",
  meh: "#6C8CD5",
  angry: "#b14343ff",
  unwell: "#b14343ff",
  unsure: "#b14343ff",
  shock: "#b14343ff",
  wow: "#b14343ff",
  spin: "#b14343ff",
};

const Graph = ({ user }) => {
  const { showModal } = useModal();
  const [dailyData, setDailyData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [aiComment, setAiComment] = useState("");
  const [weeklyCounts, setWeeklyCounts] = useState({});
  const [weeklyPercent, setWeeklyPercent] = useState({});
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [loading, setLoading] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState("");
  const getWeekLabel = (weekOffset = 0) => {
    if (weekOffset === -1) return "이번주"; // 이번주
    if (weekOffset === 0) return "지난주"; // 기본값
    return `${weekOffset + 1}주 전`; // 그 이상
  };
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
      setLoading(true);
      const headers = user ? await getAuthHeader() : {};
      try {
        const res = await api.get("/api/diary/week/test", {
          params: { start: startDate, end: endDate },
          headers,
        });

        setDailyData(res.data.dailyEmotions || []);

        const counts = res.data.weeklyCounts || [];
        const filteredCounts = counts.filter((cur) => cur.emojiName !== "unknown");
        const total = filteredCounts.reduce((sum, cur) => sum + cur.count, 0);
        setWeeklyCounts(
          filteredCounts.reduce((acc, cur) => {
            acc[cur.emojiName] = cur.count;
            return acc;
          }, {})
        );
        
        const percent = {};
        filteredCounts.forEach((cur) => {
          percent[cur.emojiName] =
            total > 0 ? (cur.count / total) * 100 : 0;
        });
        setWeeklyPercent(percent);

        setAiComment(res.data.aiComment || "");
      } catch (err) {
        console.error("데이터 불러오기 실패", err);
        showModal("데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
        setFetchTrigger(false);
      }
    };

    fetchWeeklyData();
  }, [startDate, endDate, fetchTrigger]);

  const handleThisWeek = () => {
    setWeekOffset(-1);
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = day === 0 ? 6 : day - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    setStartDate(monday.toISOString().slice(0, 10));
    setEndDate(sunday.toISOString().slice(0, 10));
    setSelectedMonth(""); // 월 선택 초기화
    setFetchTrigger(true);
  };

  const handleLastWeek = () => {
    const currentStart = new Date(startDate);
    const prevSunday = new Date(currentStart);
    prevSunday.setDate(currentStart.getDate() - 1);
    const prevMonday = new Date(prevSunday);
    prevMonday.setDate(prevSunday.getDate() - 6);

    setStartDate(prevMonday.toISOString().slice(0, 10));
    setEndDate(prevSunday.toISOString().slice(0, 10));
    setWeekOffset((prev) => (prev === -1 ? 0 : prev + 1));
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
  const exportXLS = async () => {
    if (!startDate || !endDate) {
      showModal("조회할 기간을 먼저 선택해주세요.");
      return;
    }

    const headers = user ? await getAuthHeader() : {};
    if (!headers.Authorization) {
      showModal("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await api.get("/api/diary/week/csv", {
        params: { start: startDate, end: endDate },
        headers,
      });

      const data = res.data;
      if (!data || data.length === 0) {
        showModal("내보낼 데이터가 없습니다.");
        return;
      }

      // 워크시트용 데이터 생성
      const worksheetData = data.map((d) => ({
        Date: d.date,
        Nickname: d.nickname,
        Title: d.title,
        Content: d.content,
        EmojiType: d.emojiType,
        AIComment: d.aiComment,
      }));

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);

      // 열 너비 자동 맞춤 (Excel 열 너비)
      const colWidths = Object.keys(worksheetData[0]).map((key) => ({
        wch: Math.max(
          key.length,
          ...worksheetData.map((row) =>
            row[key] ? row[key].toString().length : 0
          )
        ),
      }));
      worksheet["!cols"] = colWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Diary");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      saveAs(blob, `diary_${startDate}_to_${endDate}.xlsx`);
    } catch (err) {
      console.error(err);
      showModal("XLS 다운로드 중 오류가 발생했습니다.");
    }
  };

  const yValues = labels.map((date) => {
    const entry = dailyData.find((d) => d.date === date);
    if (!entry) return null;

  const emoji = emojiList.find((e) => e.id === entry.emojiId);

  // unknown → 그래프에서 제거 (점 없음)
  if (!emoji || emoji.type === "unknown") return null;

  return entry.emojiId;
  });
  const days = labels.length;
  const isMobile = window.innerWidth <= 480;
  let emojiSize = isMobile ? 25 : 35;
  if (days > 14) {
    emojiSize = Math.max(15, 35 - (days - 14));
  }

  const pointStyles = labels.map((date) => {
    const entry = dailyData.find((d) => d.date === date);
    if (!entry) return null;
    const emoji = emojiList.find((e) => e.id === entry.emojiId);
     if (!emoji || emoji.type === "unknown") return null;
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
        spanGaps: true,
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
        {/* 월 선택 */}
        <div className="top-row">
          <div className="month-select-box">
            <select
              value={selectedMonth}
              onChange={(e) => {
                const month = Number(e.target.value);
                if (!month) return;

                const today = new Date();
                const year = today.getFullYear();
                const start = new Date(year, month - 1, 1);
                const end = new Date(year, month, 0);

                const startStr = start.toLocaleDateString("sv-SE"); // YYYY-MM-DD 형식, KST 기준
                const endStr = end.toLocaleDateString("sv-SE");

                setStartDate(startStr);
                setEndDate(endStr);
                setSelectedMonth(month);
                setWeekOffset(0);
                setFetchTrigger(true);
              }}
            >
              <option value="" disabled>
                월별
              </option>
              {[...Array(12)].map((_, idx) => {
                const month = idx + 1;
                const today = new Date();
                const currentMonth = today.getMonth() + 1;
                return (
                  <option
                    key={month}
                    value={month}
                    disabled={month > currentMonth}
                  >
                    {month}월
                  </option>
                );
              })}
            </select>
          </div>

          {/* 날짜 지정 */}
          <div className="date-inputs">
            <label>
              시작일:
              <input
                type="date"
                max={new Date().toISOString().slice(0, 10)}
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setSelectedMonth(""); // 월 선택 초기화
                }}
              />
            </label>
            <span> ~ </span>
            <label>
              종료일:
              <input
                type="date"
                max={new Date().toISOString().slice(0, 10)}
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setSelectedMonth(""); // 월 선택 초기화
                }}
              />
            </label>

            <button onClick={() => setFetchTrigger(true)}>조회</button>
            <div className="graph-actions">
              <button onClick={exportXLS}>Excel</button>
            </div>
          </div>
        </div>

        {/* 이번주 / 지난주 */}
        <div className="quick-select">
          <button onClick={handleThisWeek}>이번 주</button>
          <button onClick={handleLastWeek}>지난 주</button>
        </div>
      </div>

      <h2 className="graph-title">
        {getWeekLabel(weekOffset)} ({startDate} ~ {endDate}) 감정 통계
      </h2>

      {/* ✅ 그래프 영역 조건부 렌더링 */}
      <div style={{ position: "relative", height: "500px", width: "100%" }}>
        {loading ? (
          <div className="graph-loading-overlay">
            <LoadingBar
              loading={loading}
              message="🤖 AI가 통계를 생성하고 있어요..."
            />
          </div>
        ) : dailyData.length > 0 ? (
          <Line data={lineData} options={options} />
        ) : (
          <div className="no-data-graph">일기 기록이 없습니다.</div>
        )}
      </div>

      <h3 className="graph-subtitle">감정 비율</h3>
      <div className="emotion-bar-wrapper">
        {sortedEmotions.map((emotion) => {
          const percent = weeklyPercent[emotion];
          const emo = emojiList.find((e) => e.type === emotion);
          if (!emo || emo.type === "unknown") return null;
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

      <div className="ai-comment-card">
        {loading ? (
          <span>
            AI가 통계를 생성 중
            <span className="loading-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </span>
        ) : aiComment ? (
          aiComment
        ) : (
          "일기를 작성하면 AI가 감정을 분석해 코멘트를 남겨줍니다."
        )}
      </div>
    </div>
  );
};

export default Graph;
