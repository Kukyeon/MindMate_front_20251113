import { useEffect, useState } from "react";

const BoardSearchBar = ({ keyword = "", condition = "title", onSearch }) => {
  const [input, setInput] = useState(keyword);
  const [field, setField] = useState(condition);

  useEffect(() => {
    setInput(keyword);
    setField(condition);
  }, [keyword, condition]);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ field, keyword: input.trim() });
  };

  return (
    <form onSubmit={handleSearch} style={{ marginBottom: "12px" }}>
      <select value={field} onChange={(e) => setField(e.target.value)}>
        <option value="title">제목</option>
        <option value="content">내용</option>
        <option value="writer">작성자</option>
      </select>
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit">검색</button>
    </form>
  );
};

export default BoardSearchBar;
