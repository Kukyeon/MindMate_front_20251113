import { useEffect } from "react";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import BoardListPage from "./pages/BoardListPage";
import BoardDetailPage from "./pages/BoardDetailPage";
import BoardEditPage from "./pages/BoardEditPage";
import BoardWritePage from "./pages/BoardWritePage";
import CommentEditForm from "./components/comment/CommentEditForm";

import DiaryDetail from "./pages/DiaryDetail";
import DiaryWrite from "./pages/DiaryWrite";
import Calendar from "./pages/Calendar";
import DiaryEditor from "./pages/DiaryEditor";

import SignupPage from "./pages/SignupPage.js";
import Daily from "./pages/Daily.js";
import Graph from "./components/Graph.js";

import LoginPage from "./pages/LoginPage.js";

import { usePingOnNavigate, checkAuth } from "./api/pingApi.js";

//import StatsPage from './pages/StatsPage'; // ⬅️ [추가]

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

        {/* 게시판 목록 */}
        <Route path="/boards" element={<BoardListPage />} />

        {/* 게시글 작성 */}
        <Route path="/board/write" element={<BoardWritePage />} />

        {/* 게시글 상세 */}
        <Route path="/board/:id" element={<BoardDetailPage />} />

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
      </Routes>
      {/* </BrowserRouter> */}
    </>
  );
}
