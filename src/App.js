import { useEffect } from "react";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";

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
import SignupPage from "./pages/SignupPage.js";
import Daily from "./pages/Daily.js";
import Graph from "./components/Graph.js";

import LoginPage from "./pages/LoginPage.js";

import { usePingOnNavigate, checkAuth } from "./api/pingApi.js";

//import StatsPage from './pages/StatsPage'; // ⬅️ [추가]

// 💫 기타 기능
import FakeLogin from "./pages/FakeLogin";
import Fortune from "./components/Fortune";
import DailyTest from "./components/DailyTest";

// ✅ 로그인 여부 확인용 PrivateRoute
function PrivateRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  return token ? children : <Navigate to="/login" replace />;
}

// function RootRedirect() {
//   // 시작시 로그인 여부에 따라 이동하는 페이지
//   const token = localStorage.getItem("accessToken");
//   return token ? (
//     <Navigate to="/boards" replace />
//   ) : (
//     <Navigate to="/login" replace />
//   );
// }

export default function App() {
  usePingOnNavigate(); // 경로가 바뀔떄 실행 (page 이동) // 사용자 체크
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth(window.location.pathname, navigate); // 앱 처음 로드(새로고침) 시 1회 실행
  }, [navigate]);

  return (
    <>
      {/* <BrowserRouter> */}
      <Routes>
        <Route path="/daily" element={<Daily />}></Route>
        <Route path="/graph" element={<Graph />}></Route>

        {/* 기본 루트 → 게시판 목록 */}
        <Route path="/" element={<Navigate to="/boards" />} />
        {/* <Route path="/" element={<Navigate to="/diary" />} /> */}

        {/* 기본 루트 로그인 여부(token체크)에 따라 분기 */}
        {/* <Route path="/" element={<RootRedirect />} /> */}
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

        {/* 게시글 수정 */}
        <Route path="/board/edit/:id" element={<BoardEditPage />} />

        {/* 댓글 수정 (분리된 수정 페이지) */}
        <Route path="/comment/edit/:id" element={<CommentEditForm />} />

        {/* 잘못된 경로 → 목록으로 리다이렉트 */}
        {/* RootRedirect 작동시 삭제 가능 path *은 마지막에 배치 */}
        {/* <Route path="*" element={<Navigate to="/boards" />} />
          <Route path="/" element={<Navigate to="/login" />} /> */}

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/diary"
          element={
            
              <Calendar />
            
          }
        />

        <Route
          path="/diary/calendar"
          element={
           
              <Calendar />
            
          }
        />

        <Route
          path="/diary/date/:date"
          element={
            
              <DiaryDetail />
          
          }
        />

        <Route
          path="/diary/edit/:date"
          element={
            
              <DiaryEditor />
           
          }
        />

        <Route
          path="/diary/write"
          element={
           
              <DiaryWrite />
           
          }
        />
        <Route
          path="/diary/write"
          element={
           
              <DiaryWrite />
           
          }
        />
        {/* 잘못된 경로시 보드로 이동 */}
        <Route path="*" element={<Navigate to="/boards" replace />} />
        {/* </BrowserRouter> */}
        {/* 잘못된 경로 처리 */}
        <Route path="*" element={<Navigate to="/boards" replace />} />
      </Routes>
    </>
  );
}
