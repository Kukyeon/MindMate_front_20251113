import { useEffect, useRef, useState } from "react";
import api from "../api/axiosConfig";
import html2canvas from "html2canvas";

function DailyTest({ user }) {
  const [testData, setTestData] = useState("");
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState("");
  const resultRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const mbti = user?.mbti;
  console.log(mbti);
  // 테스트 생성
  useEffect(() => {
    const fetchTodayResult = async () => {
      if (!user) return;
      try {
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const res = await api.get("/api/daily-result", {
          params: { userId: user.id, date: today },
        });

        if (res.data) {
          setResult(res.data.result_text);
          setSelected(res.data.selected_choice);
        }
      } catch (err) {
        console.log("오늘 결과 없음", err);
      }
    };

    fetchTodayResult();
  }, [user]);
  const generateTest = async (mbti) => {
    try {
      setLoading(true);
      const response = await api.post("/ai/test", { content: mbti });
      const data = response.data;
      setTestData(data.aicomment);

      const lines = data.aicomment.split("\n").map((l) => l.trim());
      setQuestion(lines.find((l) => l.startsWith("질문")));
      setChoices(lines.filter((l) => /^[A-D]:/.test(l)));
    } catch (error) {
      console.error("테스트 생성 실패:", error);
      alert("서버 연결에 문제가 있습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 답변 전송
  const sendResult = async (mbti, question, selectedAnswer) => {
    const content = `MBTI: ${mbti}\n질문: ${question}\n선택한 답변: ${selectedAnswer}`;
    console.log(mbti);
    try {
      setLoading(true);
      const response = await api.post("/ai/result", { content });
      setResult(response.data.aicomment);
      setSelected(selectedAnswer);
    } catch (error) {
      console.error("결과 전송 실패:", error);
      alert("결과 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(
        `💬 오늘의 심리 결과
      ${result}
      MindMate - 감정 일기
      http://localhost:3000/daily`
      )
      .then(() => alert("결과가 복사되었습니다!"))
      .catch(() => alert("복사 실패"));
  };
  const shareKakao = () => {
    const text = encodeURIComponent(result);
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://sharer.kakao.com/talk/friends/picker/link?text=${text}&url=${url}`,
      "_blank"
    );
  };
  const saveAsImage = async () => {
    const canvas = await html2canvas(resultRef.current);
    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = "심리결과.png";
    link.click();
  };
  const highlightWords = [
    "영감",
    "설레",
    "가능성",
    "열정",
    "아이디어",
    "즐거운",
    "상상",
    "기회",
  ];

  const renderHighlightedText = (text) => {
    const words = text.split(/(\s|,|\.|!|\?)/);
    return words.map((word, idx) =>
      highlightWords.some((hw) => word.includes(hw)) ? (
        <span key={idx} className="highlight">
          {word}
        </span>
      ) : (
        word
      )
    );
  };
  return (
    <div className="daily-test-content">
      <div ref={resultRef} className="daily-test-card">
        <h2 className="daily-test-title">🧠 오늘의 심리테스트</h2>
        <h4 className="daily-test-user-info">
          {user?.nickname} 님의 MBTI는 :{" "}
          <span className="mbti">{user?.mbti}</span>
        </h4>

        {loading && (
          <p className="daily-test-status">
            🤖 AI가 생각 중이에요... 잠시만요!
          </p>
        )}

        {result ? (
          <div className="daily-test-result-section">
            <h3 className="daily-test-result-title">💬 오늘의 심리 결과</h3>
            <p className="daily-test-result-text">
              {renderHighlightedText(
                result.split("\n")[0].replace("오늘의 심리 결과:", "")
              )}
            </p>
            <p className="daily-test-advice-text">
              {renderHighlightedText(
                result.split("\n")[1].replace("짧은 조언:", "")
              )}
            </p>
            <div className="share-buttons" style={{ marginTop: "10px" }}>
              <button onClick={copyToClipboard}>📋 복사</button>
              <button onClick={shareKakao}>💬 카카오톡</button>
              <button onClick={saveAsImage}>🖼 이미지 저장</button>
            </div>
          </div>
        ) : (
          <>
            {!testData && (
              <button
                className="daily-test-button"
                onClick={() => generateTest(mbti)}
              >
                테스트 생성하기
              </button>
            )}
            {question && (
              <div className="daily-test-question-section">
                <p className="daily-test-question">{question}</p>
                <div className="daily-test-choices">
                  {choices.map((choice) => (
                    <button
                      key={choice}
                      onClick={() => {
                        setSelected(choice);
                        sendResult(mbti, question, choice);
                      }}
                      disabled={!!selected}
                      className={`daily-test-choice ${
                        selected === choice ? "selected" : ""
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DailyTest;
