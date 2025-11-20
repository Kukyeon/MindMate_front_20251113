// Daily.jsx
import { useState } from "react";
import DailyTest from "../components/DailyTest";
import Fortune from "../components/Fortune";
import "./Daily.css"; // 통합 CSS 사용

export default function Daily({ user }) {
  const [activeTab, setActiveTab] = useState("MBTI 심리테스트");

  const tabs = [
    { name: "MBTI 심리테스트", icon: "📝" },
    { name: "오늘의 별자리 운세", icon: "🔮" },
  ];

  return (
    <div className="page-container">
      <h1 className="page-title">오늘의 테스트</h1>

      <div className="tabs-container tabs">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={
              activeTab === tab.name ? "tab-button active" : "tab-button"
            }
            onClick={() => setActiveTab(tab.name)}
          >
            <span className="tab-icon">{tab.icon}</span> {tab.name}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === "MBTI 심리테스트" && (
          <div className="card daily-test-card">
            <DailyTest user={user} />
          </div>
        )}
        {activeTab === "오늘의 별자리 운세" && (
          <div className="card fortune-card">
            <Fortune user={user} />
          </div>
        )}
      </div>
    </div>
  );
}
