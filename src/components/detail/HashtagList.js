const HashtagList = ({ hashtags }) => {
  const tagArray =
    typeof hashtags === "string" ? hashtags.split(" ") : hashtags;
  return (
    <div>
      {tagArray.map((tag, idx) => (
        <span key={idx}>{tag.trim()}</span>
      ))}
    </div>
  );
};
export default HashtagList;
