<<<<<<< HEAD
import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom";
import "./App.css";
import BoardListPage from "./pages/BoardListPage";
import BoardDetailPage from "./pages/BoardDetailPage";
import BoardEditPage from "./pages/BoardEditPage";
import BoardWritePage from "./pages/BoardWritePage";
import CommentEditForm from "./components/comment/CommentEditForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 루트 → 게시판 목록 */}
        <Route path="/" element={<Navigate to="/boards" />} />

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
        <Route path="*" element={<Navigate to="/boards" />} />
      </Routes>
    </BrowserRouter>
=======
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Fortune from "./component/Fortune.js";
import DailyTest from "./component/DailyTest.js";
import Daily from "./pages/Daily.js";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/fortune" element={<Fortune />}></Route>
        <Route path="/dailyTest" element={<DailyTest />}></Route>
        <Route path="/daily" element={<Daily />}></Route>
      </Routes>
    </div>
>>>>>>> 311cd786618e3b1b0b2e57f0def8971ec00210c6
  );
}

export default App;
