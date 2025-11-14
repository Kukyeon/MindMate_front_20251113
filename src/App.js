import { useEffect, useState } from "react";
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

//import StatsPage from './pages/StatsPage'; // ⬅️ [추가]

// 💫 기타 기능
import Fortune from "./components/Fortune";
import DailyTest from "./components/DailyTest";
import Home from "./pages/Home.js";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import ProfilePage from "./pages/ProfilePage.js";

import ProfileSetup from "./components/user/ProfileSet.js";
import { getUser, clearAuth } from "./api/authApi.js";
import KakaoCallback from "./pages/KaKaoCallBack.js";
import { div, small } from "framer-motion/client";

import ProfileSet from "./components/user/ProfileSet.js";
import NaverCallback from "./pages/NaverCallBack.js";
import GoogleCallback from "./pages/GoogleCallBack.js";
import DeleteCompletePage from "./pages/DeleteCompletePage.js";
import NaverDeleteCallback from "./pages/NaverDeleteCallBack.js";

export default function App() {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      const me = await getUser(); // user 객체 or null
      setUser(me);
      setInitialized(true);
    })();
  }, []);

  function PrivateRoute({ children }) {
    return user ? (
      user.nickname ? (
        children
      ) : (
        <Navigate to="/profile/set" replace />
      )
    ) : (
      <Navigate to="/login" replace />
    );
  }

  if (!initialized) {
    return <div>로딩 중...</div>;
  }

  const ClickOnLogout = () => {
    clearAuth();
    setUser(null);
  };
  return (
    <>
      <Header></Header>

      {user && (
        <>
          {/* 로그아웃 기능 임시로 넣은것 */}
          <div> {user.nickname}님 로그인중</div>{" "}
          <button onClick={ClickOnLogout}>로그아웃</button>
        </>
      )}
      {/* <BrowserRouter> */}
      <Routes>
        <Route path="/daily" element={<Daily />}></Route>
        <Route path="/graph" element={<Graph />}></Route>
        <Route path="/" element={<Home />}></Route>

        {/* 기본 루트 → 게시판 목록 */}
        {/* <Route path="/" element={<Navigate to="/boards" />} /> */}
        {/* <Route path="/" element={<Navigate to="/diary" />} /> */}

        {/* 기본 루트 로그인 여부(token체크)에 따라 분기 */}
        {/* <Route path="/" element={<RootRedirect />} /> */}
        {/* <Route path="/" element={<Navigate to="/boards" replace />} /> */}

        {/* 게시판 */}
        <Route path="/boards" element={<BoardListPage />} />
        <Route path="/board/write" element={<BoardWritePage user={user} />} />
        <Route path="/board/:id" element={<BoardDetailPage />} />
        <Route path="/board/edit/:id" element={<BoardEditPage />} />
        <Route path="/comment/edit/:id" element={<CommentEditForm />} />

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

        <Route
          path="/login"
          element={
            user ? (
              user.nickname ? (
                <Navigate to="/" />
              ) : (
                <Navigate to="/profile/set" />
              )
            ) : (
              <LoginPage setUser={setUser} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            user ? (
              user.nickname ? (
                <Navigate to="/" />
              ) : (
                <Navigate to="/profile/set" />
              )
            ) : (
              <SignupPage setUser={setUser} />
            )
          }
        />
        <Route
          path="/auth/kakao/callback"
          element={
            user ? (
              user.nickname ? (
                <Navigate to="/" />
              ) : (
                <Navigate to="/profile/set" />
              )
            ) : (
              <KakaoCallback setUser={setUser} />
            )
          }
        />
        <Route
          path="/auth/naver/callback"
          element={
            user ? (
              user.nickname ? (
                <Navigate to="/" />
              ) : (
                <Navigate to="/profile/set" />
              )
            ) : (
              <NaverCallback setUser={setUser} />
            )
          }
        />
        <Route
          path="/auth/google/callback"
          element={
            user ? (
              user.nickname ? (
                <Navigate to="/" />
              ) : (
                <Navigate to="/profile/set" />
              )
            ) : (
              <GoogleCallback setUser={setUser} />
            )
          }
        />
        <Route
          path="/auth/naver/delete-callback"
          element={<NaverDeleteCallback setUser={setUser} />}
        />
        <Route path="/delete-complete" element={<DeleteCompletePage />} />

        <Route
          path="/profile"
          element={<ProfilePage setUser={setUser} user={user} />}
        />
        <Route
          path="/profile/set"
          element={<ProfileSet setUser={setUser} user={user} />}
        />
        {/* 다이어리 */}
        <Route path="/diary" element={<Calendar />} />
        <Route path="/diary/calendar" element={<Calendar />} />

        <Route path="/diary/date/:date" element={<DiaryDetail />} />

        <Route path="/diary/edit/:date" element={<DiaryEditor />} />

        <Route path="/diary/write" element={<DiaryWrite />} />

        {/* 잘못된 경로시 보드로 이동 */}
        {/* <Route path="*" element={<Navigate to="/boards" replace />} /> */}
        {/* </BrowserRouter> */}
        {/* 잘못된 경로 처리 */}
        {/* <Route path="*" element={<Navigate to="/boards" replace />} /> */}
      </Routes>
      <Footer></Footer>
    </>
  );
}
