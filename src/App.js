import "./App.css";
import { Route, Routes } from "react-router-dom";
import Fortune from "./component/Fortune.js";
import DailyTest from "./component/DailyTest.js";
import Daily from "./pages/Daily.js";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/fortune" element={<Fortune />}></Route>
        <Route path="/dailyTest" element={<DailyTest />}></Route>
        <Route path="/daily" element={<Daily />}></Route>
      </Routes>
    </div>
  );
}

export default App;
