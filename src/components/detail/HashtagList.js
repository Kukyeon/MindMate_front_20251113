import { useNavigate } from "react-router-dom";

const HashtagList = ({ hashtags }) => {
  const navigate = useNavigate();
  if (!hashtags) return null;

  const tagArray = Array.isArray(hashtags)
    ? hashtags
    : (hashtags || "")
        .trim()
        .split(/\s+/)
        .filter((tag) => tag.startsWith("#") && tag.length > 1);
  //hashtags.split(/[\s,]+/).filter((tag) => tag.startsWith("#"));

  if (!tagArray || tagArray.length === 0) return null;

  const handleclick = (tag) => {
    const cleanTag = tag.startsWith("#") ? tag.slice(1) : tag;
    navigate(`/boards/hashtag/${encodeURIComponent(cleanTag)}`);
  };

  return (
    <div className="hashtag-list">
      {tagArray.map((tag, idx) => (
        <span
          key={idx}
          style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}
          onClick={() => handleclick(tag)}
          className="hashtag"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

export default HashtagList;
