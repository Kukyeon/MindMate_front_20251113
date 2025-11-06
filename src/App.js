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
  );
}

export default App;
