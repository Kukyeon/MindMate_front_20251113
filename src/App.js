import "./App.css";
import { Route, Routes } from "react-router-dom";
import Fortune from "./component/Fortune.js";
import DailyTest from "./component/DailyTest.js";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/fortune" element={<Fortune />}></Route>
        <Route path="/daily" element={<DailyTest />}></Route>
      </Routes>
    </div>
  );
}

export default App;
