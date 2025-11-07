import { useEffect, useState } from "react";

const BoardSearchBar = ({ keyword = "", onSearch }) => {
  const [input, setInput] = useState(keyword);

  useEffect(() => {
    setInput(keyword);
  }, [keyword]);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(input.trim());
  };

  return (
    <form onSubmit={handleSearch}>
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
