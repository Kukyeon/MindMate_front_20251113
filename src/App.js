import "./App.css";
import { Route, Routes } from "react-router-dom";
import Daily from "./pages/Daily.js";
import Graph from "./components/Graph.js";

function App() {
  const startDate = "2025-10-27";
  const endDate = "2025-11-02";
  return (
    <div className="App">
      {/* <Graph startDate={startDate} endDate={endDate} /> */}
      <Routes>
        <Route path="/daily" element={<Daily />}></Route>
      </Routes>
    </div>
  );
}

export default App;
