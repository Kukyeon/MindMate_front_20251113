// import { useRef, useState } from "react";
// import api from "../api/axiosConfig";
// import html2canvas from "html2canvas";

// function DailyTest() {
//   const [testData, setTestData] = useState("");
//   const [question, setQuestion] = useState("");
//   const [choices, setChoices] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [result, setResult] = useState("");
//   const resultRef = useRef(null);
//   const [loading, setLoading] = useState(false);

//   // 테스트 생성
//   const generateTest = async (mbti) => {
//     try {
//       setLoading(true);
//       const response = await api.post("/ai/test", { content: mbti });
//       const data = response.data;
//       setTestData(data.aicomment);

//       const lines = data.aicomment.split("\n").map((l) => l.trim());
//       setQuestion(lines.find((l) => l.startsWith("질문")));
//       setChoices(lines.filter((l) => /^[A-D]:/.test(l)));
//     } catch (error) {
//       console.error("테스트 생성 실패:", error);
//       alert("서버 연결에 문제가 있습니다. 백엔드를 확인해주세요!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 답변 전송
//   const sendResult = async (mbti, question, selectedAnswer) => {
//     const content = `MBTI: ${mbti}\n질문: ${question}\n선택한 답변: ${selectedAnswer}`;
//     try {
//       setLoading(true);
//       const response = await api.post("/ai/result", { content });
//       setResult(response.data.aicomment);
//     } catch (error) {
//       console.error("결과 전송 실패:", error);
//       alert("결과 생성 중 오류가 발생했습니다.");
//     } finally {
//       setLoading(false);
//     }
//   };
//   const copyToClipboard = () => {
//     navigator.clipboard
//       .writeText(result + "\n" + "localhost:3000/daily")
//       .then(() => alert("결과가 복사되었습니다!"))
//       .catch(() => alert("복사 실패"));
//   };
//   const shareKakao = () => {
//     const text = encodeURIComponent(result);
//     const url = encodeURIComponent(window.location.href);
//     window.open(
//       `https://sharer.kakao.com/talk/friends/picker/link?text=${text}&url=${url}`,
//       "_blank"
//     );
//   };
//   const saveAsImage = async () => {
//     const canvas = await html2canvas(resultRef.current);
//     const image = canvas.toDataURL("image/png");

//     const link = document.createElement("a");
//     link.href = image;
//     link.download = "심리결과.png";
//     link.click();
//   };
//   return (
//     <div className="daily-test-content">
//       <div className="daily-test-card">
//         <h2 className="daily-test-title">🧠 오늘의 심리테스트</h2>

//         {loading && (
//           <p className="daily-test-status">
//             🤖 AI가 생각 중이에요... 잠시만요!
//           </p>
//         )}

//         {!testData && (
//           <button
//             className="daily-test-button"
//             onClick={() => generateTest("ENFP")}
//           >
//             테스트 생성하기
//           </button>
//         )}

//         {question && (
//           <div className="daily-test-question-section">
//             <p className="daily-test-question">{question}</p>
//             <div className="daily-test-choices">
//               {choices.map((choice) => (
//                 <button
//                   key={choice}
//                   onClick={() => {
//                     setSelected(choice);
//                     sendResult("ENFP", question, choice);
//                   }}
//                   disabled={!!selected}
//                   className={`daily-test-choice ${
//                     selected === choice ? "selected" : ""
//                   }`}
//                 >
//                   {choice}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         {result && (
//           <div ref={resultRef} className="daily-test-result-section">
//             <h3 className="daily-test-result-title">💬 오늘의 심리 결과</h3>
//             <p className="daily-test-result-text">{result}</p>
//             <div className="share-buttons" style={{ marginTop: "10px" }}>
//               <button onClick={copyToClipboard}>📋 복사</button>
//               <button onClick={shareKakao}>💬 카카오톡</button>
//               <button onClick={saveAsImage}>🖼 이미지 저장</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default DailyTest;
