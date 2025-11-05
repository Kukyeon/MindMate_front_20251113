import { useState } from "react";
import DailyTest from "../component/DailyTest";
import Fortune from "../component/Fortune";
import "./Daily.css";

export default function Daily() {
  const [activeTab, setActiveTab] = useState("DailyTest");

  return (
    <div className="daily-page">
      <header className="daily-header">MindMate Daily</header>

      <div className="tabs">
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
        {activeTab === "DailyTest" && <DailyTest />}
        {activeTab === "Fortune" && <Fortune />}
      </div>
    </div>
  );
}
