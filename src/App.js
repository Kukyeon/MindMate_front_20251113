import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// 🧩 게시판 관련
import BoardListPage from "./pages/BoardListPage";
import BoardDetailPage from "./pages/BoardDetailPage";
import BoardEditPage from "./pages/BoardEditPage";
import BoardWritePage from "./pages/BoardWritePage";
import CommentEditForm from "./components/comment/CommentEditForm";

// 📘 일기 / 캘린더 관련
import Calendar from "./pages/Calendar";
import DiaryDetail from "./pages/DiaryDetail";
import DiaryWrite from "./pages/DiaryWrite";
import DiaryEditor from "./pages/DiaryEditor";

// 💫 기타 기능
import FakeLogin from "./pages/FakeLogin";
import Fortune from "./component/Fortune";
import DailyTest from "./component/DailyTest";
import Daily from "./pages/Daily";

// ✅ 로그인 여부 확인용 PrivateRoute
function PrivateRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/boards" replace />} />
      <Route path="/login" element={<FakeLogin />} />

      {/* 게시판 */}
      <Route path="/boards" element={<BoardListPage />} />
      <Route path="/board/write" element={<BoardWritePage />} />
      <Route path="/board/:id" element={<BoardDetailPage />} />
      <Route path="/board/edit/:id" element={<BoardEditPage />} />
      <Route path="/comment/edit/:id" element={<CommentEditForm />} />

      {/* 다이어리 */}
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
      <Route
        path="/diary/edit/:id"
        element={
          <PrivateRoute>
            <DiaryEditor />
          </PrivateRoute>
        }
      />

      {/* 기타 */}
      <Route path="/fortune" element={<Fortune />} />
      <Route path="/dailyTest" element={<DailyTest />} />
      <Route path="/daily" element={<Daily />} />

      {/* 잘못된 경로 처리 */}
      <Route path="*" element={<Navigate to="/boards" replace />} />
    </Routes>
  );
}
