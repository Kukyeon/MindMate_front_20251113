import { useEffect, useRef, useState } from "react";
import api from "../api/axiosConfig";
import html2canvas from "html2canvas";
import { authHeader as getAuthHeader } from "../api/authApi";
import { useModal } from "../context/ModalContext";
import LoadingBar from "./LoadingBar";

function DailyTest({ user }) {
  const [testData, setTestData] = useState("");
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState("");
  const resultRef = useRef(null);
  const { showModal } = useModal();
  const [loading, setLoading] = useState(false);
  const mbti = user?.mbti;

  // // 테스트 생성
  // useEffect(() => {
  //   const fetchTodayResult = async () => {
  //     if (!user) return;
  //     try {
  //       const headers = user ? await getAuthHeader() : {};
  //       console.log("Authorization headers:", headers);
  //       const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  //       const res = await api.get("/api/result", {
  //         params: { date: today },
  //         headers,
  //       });
  //       console.log(headers);

  //       if (res.data) {
  //         setResult(res.data.result_text);
  //         setSelected(res.data.selected_choice);
  //       }
  //     } catch (err) {
  //       console.log("오늘 결과 없음", err);
  //       setResult("");
  //     }
  //   };

  //   fetchTodayResult();
  // }, [user]);
  const generateTest = async (mbti) => {
    const headers = user ? await getAuthHeader() : {};
    try {
      setLoading(true);
      const response = await api.post(
        "/api/user/test",
        { content: mbti },
        { headers }
      );

      const data = response.data;

      if (!data || !data.aicomment) {
        throw new Error("서버 응답에 aicomment가 없습니다.");
      }

      setTestData(data.aicomment);

      const lines = data.aicomment.split("\n").map((l) => l.trim());
      setQuestion(lines.find((l) => l.startsWith("질문")));
      setChoices(lines.filter((l) => /^[A-D]:/.test(l)));
    } catch (error) {
      console.error("테스트 생성 실패:", error);
      showModal("서버 연결에 문제가 있거나, 데이터가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 답변 전송
  const sendResult = async (mbti, question, selectedAnswer) => {
    const headers = user ? await getAuthHeader() : {};
    const content = `MBTI: ${mbti}\n질문: ${question}\n선택한 답변: ${selectedAnswer}`;
    try {
      setLoading(true);
      const response = await api.post(
        "/api/user/result",
        { content },
        { headers }
      );
      setResult(response.data.aicomment);
      setSelected(selectedAnswer);
    } catch (error) {
      console.error("결과 전송 실패:", error);
      showModal("결과 생성 중 오류가 발생했습니다.");
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
      .then(() => showModal("결과가 복사되었습니다!"))
      .catch(() => showModal("복사 실패"));
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
          <LoadingBar
            loading={loading}
            message="🤖 AI가 테스트를 생성중이에요..."
          />
        )}

        {!loading ? (
          <button
            className="daily-test-button"
            onClick={() => generateTest(mbti)}
          >
            테스트 생성하기
          </button>
        ) : (
          <button className="daily-test-button loading" disabled>
            <div className="dot-loader">
              <span></span>
              <span></span>
              <span></span>
            </div>
            생성 중
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
        {result && (
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
        )}
      </div>
    </div>
  );
}

export default DailyTest;
