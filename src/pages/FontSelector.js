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
