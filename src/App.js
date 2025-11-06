import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DiaryDetail from "./pages/DiaryDetail";
import DiaryWrite from "./pages/DiaryWrite";
import Calendar from "./pages/Calendar";
import DiaryEditor from "./pages/DiaryEditor";
import FakeLogin from "./pages/FakeLogin";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<FakeLogin />} />
        <Route
          path="/diary"
          element={
            <PrivateRoute>
              <Calendar />
            </PrivateRoute>
          }
        />

        <Route
          path="/diary/calendar"
          element={
            <PrivateRoute>
              <Calendar />
            </PrivateRoute>
          }
        />

        <Route
          path="/diary/:id"
          element={
            <PrivateRoute>
              <DiaryDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/diary/write"
          element={
            <PrivateRoute>
              <DiaryWrite />
            </PrivateRoute>
          }
        />
        <Route path="/diary/edit/:id" element={<DiaryEditor />} />
      </Routes>
    </BrowserRouter>
  );
}
