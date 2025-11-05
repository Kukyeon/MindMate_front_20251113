import { useState } from "react";
import api from "../api/axiosConfig";
import "./Fortune.css"; // CSS 파일 임포트

const Fortune = () => {
  const [fortune, setFortune] = useState("");
  const birth = "2월 22일";

  const todayLuck = async () => {
    const res = await api.post("/ai/fortune", { content: birth });
    if (birth) {
      console.log(res.data);
      setFortune(res.data.aicomment);
    }
  };

  return (
    <div className="fortune-container">
      {" "}
      <div className="fortune-card">
        {" "}
        <h1>오늘의 운세</h1> <button onClick={todayLuck}>확인하기!</button>{" "}
        <p className="fortune-text">{fortune}</p>{" "}
      </div>{" "}
    </div>
  );
};

export default Fortune;
