import "./App.css";
import { Route, Routes } from "react-router-dom";
import Fortune from "./pages/Fortune.js";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/fortune" element={<Fortune />}></Route>
      </Routes>
    </div>
  );
}

export default App;
