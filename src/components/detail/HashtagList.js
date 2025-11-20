const HashtagList = ({ hashtags }) => {
  if (!hashtags) return null;

  const tagArray = Array.isArray(hashtags)
    ? hashtags
    : hashtags.split(/[\s,]+/).filter((tag) => tag.startsWith("#"));

  if (tagArray.length === 0) return null;

  return (
    <div>
      {tagArray.map((tag, idx) => (
        <span key={idx}>{tag}</span>
      ))}
    </div>
  );
};

export default HashtagList;
