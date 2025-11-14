import { use, useEffect, useState } from "react";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

// 🧩 게시판 관련
import BoardListPage from "./pages/BoardListPage";
import BoardDetailPage from "./pages/BoardDetailPage";
import BoardEditPage from "./pages/BoardEditPage";
import BoardWritePage from "./pages/BoardWritePage";
import CommentEditForm from "./components/comment/CommentEditForm";
import MyBoards from "./pages/MyBoards";

// 📘 일기 / 캘린더 관련
import Calendar from "./pages/Calendar";
import DiaryDetail from "./pages/DiaryDetail";
import DiaryWrite from "./pages/DiaryWrite";
import DiaryEditor from "./pages/DiaryEditor";
import SignupPage from "./pages/SignupPage.js";
import Daily from "./pages/Daily.js";
import Graph2 from "./components/Graph2.js";

import LoginPage from "./pages/LoginPage.js";

//import StatsPage from './pages/StatsPage'; // ⬅️ [추가]

// 💫 기타 기능
import Fortune from "./components/Fortune";
import DailyTest from "./components/DailyTest";
import Home from "./pages/Home.js";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import ProfilePage from "./pages/ProfilePage.js";

import { getUser, clearAuth } from "./api/authApi.js";
import KakaoCallback from "./pages/KaKaoCallBack.js";

import ProfileSet from "./components/user/ProfileSet.js";
import NaverCallback from "./pages/NaverCallBack.js";
import GoogleCallback from "./pages/GoogleCallBack.js";
import DeleteCompletePage from "./pages/DeleteCompletePage.js";
import NaverDeleteCallback from "./pages/NaverDeleteCallBack.js";
import KakaoDeleteCallback from "./pages/KakaoDeleteCallBack.js";
import GoogleDeleteCallback from "./pages/GoogleDeleteCallBack.js";

export default function App() {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);
  console.log(user);

  useEffect(() => {
    (async () => {
      const me = await getUser(); // user 객체 or null
      setUser(me);
      setInitialized(true);
    })();
  }, []);

  function PrivateRoute({ children }) {
    return user ? children : <Navigate to="/" replace />;
  }

  if (!initialized) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
      <Header user={user} setUser={setUser} />

      {/* <BrowserRouter> */}
      <Routes>
        <Route path="/graph" element={<Graph2 user={user} />}></Route>
        {user ? (
          <Route path="/" element={<Calendar />}></Route>
        ) : (
          <Route path="/" element={<Home />}></Route>
        )}

        {/* 기본 루트 → 게시판 목록 */}
        {/* <Route path="/" element={<Navigate to="/boards" />} /> */}
        {/* <Route path="/" element={<Navigate to="/diary" />} /> */}

        {/* 기본 루트 로그인 여부(token체크)에 따라 분기 */}
        {/* <Route path="/" element={<RootRedirect />} /> */}
        {/* <Route path="/" element={<Navigate to="/boards" replace />} /> */}

        {/* 게시판 */}

        <Route path="/boards" element={<BoardListPage user={user} />} />
        <Route
          path="/board/write"
          element={
            user ? (
              <BoardWritePage user={user} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/my-boards" element={<MyBoards user={user} />} />
        <Route path="/board/:id" element={<BoardDetailPage user={user} />} />
        <Route path="/board/edit/:id" element={<BoardEditPage user={user} />} />
        <Route path="/comment/edit/:id" element={<CommentEditForm />} />

        {/* 기타 */}
        <Route path="/fortune" element={<Fortune user={user} />} />
        <Route path="/dailyTest" element={<DailyTest user={user} />} />
        <Route path="/daily" element={<Daily user={user} />} />

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
          element={
            <PrivateRoute>
              <NaverDeleteCallback setUser={setUser} />
            </PrivateRoute>
          }
        />
        <Route
          path="/auth/kakao/delete-callback"
          element={
            <PrivateRoute>
              <KakaoDeleteCallback setUser={setUser} />
            </PrivateRoute>
          }
        />
        <Route
          path="/auth/google/delete-callback"
          element={
            <PrivateRoute>
              <GoogleDeleteCallback setUser={setUser} />
            </PrivateRoute>
          }
        />
        <Route path="/delete-complete" element={<DeleteCompletePage />} />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage setUser={setUser} user={user} />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile/set"
          element={
            <PrivateRoute>
              <ProfileSet setUser={setUser} user={user} />
            </PrivateRoute>
          }
        />

        {/* 다이어리 */}
        <Route path="/diary" element={<Calendar user={user}/>} />
        <Route path="/diary/calendar" element={<Calendar user={user}/>} />

        <Route path="/diary/date/:date" element={<DiaryDetail user={user}/>} />

        <Route path="/diary/edit/:date" element={<DiaryEditor user={user}/>} />

        <Route path="/diary/write" element={<DiaryWrite user={user}/>} />

        {/* 잘못된 경로시 보드로 이동 */}
        {/* <Route path="*" element={<Navigate to="/boards" replace />} /> */}
        {/* </BrowserRouter> */}
        {/* 잘못된 경로 처리 */}
        {/* <Route path="*" element={<Navigate to="/boards" replace />} /> */}
      </Routes>
      <Footer user={user}></Footer>
    </>
  );
}
