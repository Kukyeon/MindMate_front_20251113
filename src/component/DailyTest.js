import { useState } from "react";
import api from "../api/axiosConfig";

function DailyTest() {
  const [testData, setTestData] = useState("");
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // 테스트 생성
  const generateTest = async (mbti) => {
    try {
      setLoading(true);
      const response = await api.post("/ai/test", {
        content: mbti,
      });

      const data = response.data;
      setTestData(data.aicomment);

      // 받은 텍스트를 줄 단위로 나누기
      const lines = data.aicomment.split("\n").map((l) => l.trim());
      setQuestion(lines.find((l) => l.startsWith("질문")));
      const choicesList = lines.filter((l) => /^[A-D]:/.test(l)); // 보기 4개
      setChoices(choicesList);
    } catch (error) {
      console.error("테스트 생성 실패:", error);
      alert("서버 연결에 문제가 있습니다. 백엔드를 확인해주세요!");
    } finally {
      setLoading(false);
    }
  };

  // 답변 전송
  const sendResult = async (mbti, question, selectedAnswer) => {
    const content = `
MBTI: ${mbti}
질문: ${question}
선택한 답변: ${selectedAnswer}
`;

    try {
      setLoading(true);
      const response = await api.post("/ai/result", {
        content,
      });

      const data = response.data;
      setResult(data.aicomment);
    } catch (error) {
      console.error("결과 전송 실패:", error);
      alert("결과 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🧠 오늘의 심리테스트</h2>
      {loading && <p>🤖 AI가 생각 중이에요... 잠시만요!</p>}
      {/* 테스트 시작 버튼 */}
      {!testData && (
        <button onClick={() => generateTest("ENFP")}>테스트 생성하기</button>
      )}

      {/* 질문 & 보기 표시 */}
      {question && (
        <div>
          <p>{question}</p>
          {choices.map((choice) => (
            <button
              key={choice}
              onClick={() => {
                setSelected(choice);
                sendResult("ENFP", question, choice);
              }}
              disabled={!!selected}
              style={{
                margin: "5px",
                backgroundColor: selected === choice ? "#ccc" : "lightblue",
              }}
            >
              {choice}
            </button>
          ))}
        </div>
      )}

      {/* 결과 표시 */}
      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>💬 오늘의 심리 결과</h3>
          <p style={{ whiteSpace: "pre-line" }}>{result}</p>
        </div>
      )}
    </div>
  );
}

export default DailyTest;
