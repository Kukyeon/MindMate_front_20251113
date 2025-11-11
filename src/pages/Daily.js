import { useState } from "react";
import DailyTest from "../components/DailyTest";
import Fortune from "../components/Fortune";
import Character from "../components/Character";
import "./Daily.css";

export default function Daily() {
  const [activeTab, setActiveTab] = useState("Character");

  const tabs = [
    { name: "Character", icon: "🧸" },
    { name: "MBTI 심리테스트", icon: "📝" },
    { name: "오늘의 별자리 운세", icon: "🔮" },
  ];

  return (
    <div className="daily-page">
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={activeTab === tab.name ? "tab active" : "tab"}
            onClick={() => setActiveTab(tab.name)}
          >
            <span className="tab-icon">{tab.icon}</span> {tab.name}
          </button>
        ))}
      </div>

      <div className={`tab-content fade-in`}>
        {activeTab === "Character" && <Character />}
        {activeTab === "MBTI 심리테스트" && <DailyTest />}
        {activeTab === "오늘의 별자리 운세" && <Fortune />}
      </div>
    </div>
  );
}
