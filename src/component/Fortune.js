import { useState } from "react";
import api from "../api/axiosConfig";

const Fortune = () => {
  const [fortune, setFortune] = useState("");
  const birth = "2월 22일";

  const todayLuck = async () => {
    try {
      const res = await api.post("/ai/fortune", { content: birth });
      if (res.data) {
        console.log(res.data);
        setFortune(res.data.aicomment);
      }
    } catch (error) {
      console.error("운세 가져오기 실패:", error);
    }
  };

  return (
    <div className="fortune-content">
      <div className="fortune-card">
        <h2 className="fortune-title">오늘의 운세</h2>
        <p className="fortune-birth">생년월일: {birth}</p>
        <button className="fortune-button" onClick={todayLuck}>
          확인하기!
        </button>
        {fortune && <p className="fortune-text">{fortune}</p>}
      </div>
    </div>
  );
};

export default Fortune;
