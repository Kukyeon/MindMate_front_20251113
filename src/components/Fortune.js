import { useState } from "react";
import api from "../api/axiosConfig";
import { authHeader, authHeader as getAuthHeader } from "../api/authApi";

const Fortune = ({ user }) => {
  const [fortune, setFortune] = useState("");
  const birth = user.birth_date;
  console.log(user);
  const [loading, setLoading] = useState(false);

  const todayLuck = async () => {
    const headers = user ? await getAuthHeader() : {};
    try {
      setLoading(true);
      const res = await api.post(
        "/api/user/fortune",
        { content: birth },
        { headers }
      );
      if (res.data) {
        console.log(res.data);
        setFortune(res.data.aicomment);
      }
    } catch (error) {
      console.error("운세 가져오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };
  // 텍스트 줄바꿈 + 강조 처리
  const renderFortune = (text) => {
    return text.split("\n").map((line, idx) => {
      if (!line.trim()) return null; // 빈 줄 무시

      // "오늘의 운세" 강조
      if (line.includes("오늘의 운세")) {
        return (
          <div key={idx} className="fortune-line highlight">
            ⭐ {line.replace("오늘의 운세", "오늘의 운세")}
          </div>
        );
      }

      // "행운의 시간", "행운의 물건", "행운의 색상" 강조 + 아이콘
      if (line.includes("행운의 시간")) {
        return (
          <div key={idx} className="fortune-line">
            ⏰{" "}
            {line.split(":")[1]
              ? `오늘은 ${line.split(":")[1].trim()}에 행운이 있어요!`
              : line}
          </div>
        );
      }
      if (line.includes("행운의 물건")) {
        return (
          <div key={idx} className="fortune-line">
            🎁{" "}
            {line.split(":")[1]
              ? `${line.split(":")[1].trim()}를 챙겨보세요.`
              : line}
          </div>
        );
      }
      if (line.includes("행운의 색상")) {
        const color = line.split(":")[1]?.trim() || "검정";
        return (
          <div key={idx} className="fortune-line">
            🎨 오늘의 색상은{" "}
            <span style={{ color: color.toLowerCase(), fontWeight: "bold" }}>
              {color}
            </span>{" "}
            입니다.
          </div>
        );
      }

      // 기본 텍스트
      return (
        <div key={idx} className="fortune-line">
          {line}
        </div>
      );
    });
  };

  return (
    <div className="fortune-content">
      <div className="fortune-card">
        <h2 className="fortune-title">오늘의 운세</h2>
        <p className="fortune-birth">생년월일: {birth}</p>
        <button
          className="fortune-button"
          onClick={todayLuck}
          disabled={loading}
        >
          {loading
            ? "🤖 AI가 운세를 준비 중..."
            : fortune
            ? "한 번 더 확인!"
            : "확인하기!"}
        </button>

        {fortune && (
          <div className="fortune-text">{renderFortune(fortune)}</div>
        )}
      </div>
    </div>
  );
};

export default Fortune;
