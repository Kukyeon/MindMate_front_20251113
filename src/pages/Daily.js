import { useState } from "react";
import DailyTest from "../components/DailyTest";
import Fortune from "../components/Fortune";
import "./Daily.css";
import Character from "../components/Character";

export default function Daily() {
  const [activeTab, setActiveTab] = useState("Character");

  return (
    <div className="daily-page">
      <header className="daily-header">MindMate Daily</header>

      <div className="tabs">
        <button
          className={activeTab === "Character" ? "tab active" : "tab"}
          onClick={() => setActiveTab("Character")}
        >
          Character
        </button>
        <button
          className={activeTab === "DailyTest" ? "tab active" : "tab"}
          onClick={() => setActiveTab("DailyTest")}
        >
          Daily Test
        </button>
        <button
          className={activeTab === "Fortune" ? "tab active" : "tab"}
          onClick={() => setActiveTab("Fortune")}
        >
          Fortune
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "Character" && <Character />}
        {activeTab === "DailyTest" && <DailyTest />}
        {activeTab === "Fortune" && <Fortune />}
      </div>
    </div>
  );
}
