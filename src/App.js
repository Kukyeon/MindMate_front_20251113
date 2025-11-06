import "./App.css";
import { Route, Routes } from "react-router-dom";
import Daily from "./pages/Daily.js";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/daily" element={<Daily />}></Route>
      </Routes>
    </div>
  );
}

export default App;
