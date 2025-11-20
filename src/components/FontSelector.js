//버전1
// import React from "react";
// import "./FontSelector.css";

// const fonts = [
//   { name: "Noto Sans KR", family: "'Noto Sans KR', sans-serif" },
//   { name: "Roboto", family: "'Roboto', sans-serif" },
//   { name: "Nanum Pen Script", family: "'Nanum Pen Script', cursive" },
//   { name: "Pretendard", family: "'Pretendard', sans-serif" },
// ];

// const FontSelector = ({ selectedFont, onSelect }) => {
//   return (
//     <ul className="font-selector">
//       {fonts.map((font) => (
//         <li
//           key={font.name}
//           className={selectedFont === font.family ? "selected" : ""}
//           style={{ fontFamily: font.family }}
//           onClick={() => onSelect(font.family)}
//         >
//           {font.name}
//         </li>
//       ))}
//     </ul>
//   );
// };

// export default FontSelector;

//버전 2
// import React from "react";

// const fonts = [
//   { name: "Noto Sans KR", family: "'Noto Sans KR', sans-serif" },
//   { name: "Roboto", family: "'Roboto', sans-serif" },
//   { name: "Nanum Pen Script", family: "'Nanum Pen Script', cursive" },
//   { name: "Pretendard", family: "'Pretendard', sans-serif" },
// ];

// const FontSelector = ({ selectedFont, onSelect }) => {
//   return (
//     <select
//       value={selectedFont}
//       onChange={(e) => onSelect(e.target.value)}
//       style={{ fontFamily: selectedFont, padding: "5px 10px" }}
//     >
//       {fonts.map((font) => (
//         <option
//           key={font.name}
//           value={font.family}
//           style={{ fontFamily: font.family }}
//         >
//           {font.name}
//         </option>
//       ))}
//     </select>
//   );
// };

// export default FontSelector;
import "./FontSelector.css";

const fontOptions = [
  { name: "Noto Sans KR", value: "'Noto Sans KR', sans-serif" },
  { name: "Roboto", value: "'Roboto', sans-serif" },
  { name: "Nanum Pen Script", value: "'Nanum Pen Script', cursive" },
  { name: "Pretendard", value: "'Pretendard', sans-serif" },
  { name: "Karla", value: "'Karla', sans-serif" },
  { name: "Montserrat", value: "'Montserrat', sans-serif" },
  { name: "Lobster", value: "'Lobster', cursive" },
  { name: "Gugi", value: "'Gugi', cursive" },
  { name: "Jua", value: "'Jua', sans-serif" },
  { name: "Nanum Gothic", value: "'Nanum Gothic', sans-serif" },
  { name: "Poor Story", value: "'Poor Story', system-ui" },
  { name: "Dongle", value: "'Dongle', sans-serif" },
];

export default function FontSelector({ close }) {
  const currentFont =
    localStorage.getItem("appFont") || "'Noto Sans KR', sans-serif";

  const applyFont = (fontValue) => {
    document.documentElement.style.setProperty("--app-font", fontValue);
    localStorage.setItem("appFont", fontValue); // 재접속 시 유지
    close();
  };

  return (
    <div className="font-popup-backdrop">
      <div className="font-popup">
        <h3>폰트 선택</h3>
        <ul className="font-list">
          {fontOptions.map((f) => {
            const isSelected = f.value === currentFont; // 현재 적용된 폰트 체크
            return (
              <li key={f.name}>
                <button
                  className={`font-item ${isSelected ? "selected-font" : ""}`}
                  onClick={() => applyFont(f.value)}
                  style={{ fontFamily: f.value }}
                >
                  {f.name} {isSelected && "✓"} {/* 체크 표시 */}
                </button>
              </li>
            );
          })}
        </ul>
        <button className="close-btn" onClick={close}>
          닫기
        </button>
      </div>
    </div>
  );
}
