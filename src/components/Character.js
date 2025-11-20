import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";
import { authHeader as getAuthHeader } from "../api/authApi";
import CharacterChat from "./CharacterChat";

const Character = ({ user }) => {
  const [character, setCharacter] = useState(null);
  const [message, setMessage] = useState("");
  const [cheeredToday, setCheeredToday] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [pointChange, setPointChange] = useState(null);

  const fetchCharacter = async () => {
    const headers = user ? await getAuthHeader() : {};
    try {
      const res = await api.get(`/ai/me`, { headers });
      setCharacter({ ...res.data });
      setMessage("");
      setNameInput(res.data?.name || "이름을 지어주세요");
    } catch (err) {
      if (err.response?.data?.message) setMessage(err.response.data.message);
      console.error("캐릭터 불러오기 실패", err);
    }
  };

  useEffect(() => {
    fetchCharacter();
  }, []);

  const handleCheer = async () => {
    const headers = user ? await getAuthHeader() : {};
    try {
      const res = await api.put("/ai/cheer", null, {
        params: { addPoints: 2, moodChange: 5 },
        headers,
      });
      const oldPoints = character.points;
      const newPoints = res.data.points;
      setCharacter({ ...res.data });
      setPointChange(newPoints - oldPoints); // +2 표시
      setCheeredToday(true);
      setMessage("응원 성공! 🌟");
      setTimeout(() => setPointChange(null), 1000);
    } catch (err) {
      const msg = err.response?.data?.message || "응원 중 오류가 발생했습니다.";
      setMessage(msg);
      if (msg.includes("오늘은 이미 응원")) setCheeredToday(true);
      console.error("업데이트 실패:", err);
    }
  };

  const handleNameSave = async () => {
    try {
      const headers = user ? await getAuthHeader() : {};
      console.log(headers);
      const res = await api.put("/ai/setName", null, {
        params: { name: nameInput },
        headers,
      });
      setCharacter(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const getForMood = (moodscore, level) => {
    if (level >= 10) {
      if (moodscore <= 20) return "/character/sad10.png";
      else if (moodscore <= 35) return "/character/worried10.png";
      else if (moodscore <= 50) return "/character/natural10.png";
      else if (moodscore <= 75) return "/character/glad10.png";
      else return "/character/happy10.png";
    } else {
      if (moodscore <= 20) return "/character/sad.png";
      else if (moodscore <= 35) return "/character/worried.png";
      else if (moodscore <= 50) return "/character/natural.png";
      else if (moodscore <= 75) return "/character/glad.png";
      else return "/character/happy.png";
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      {character ? (
        <>
          <motion.div
            key={character.id}
            className="character-card"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* 이름 영역 */}
            {isEditing ? (
              <div className="name-edit-wrapper">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="name-input"
                />
                <button onClick={handleNameSave} className="name-save-btn">
                  저장
                </button>
              </div>
            ) : (
              <div className="name-display-wrapper">
                <h2 className="character-name">
                  {character.name || "이름을 지어주세요"}
                </h2>
                <span
                  className="edit-emoji"
                  onClick={() => setIsEditing(true)}
                  style={{ cursor: "pointer", marginLeft: "6px" }}
                >
                  ✏️
                </span>
              </div>
            )}

            {/* 캐릭터 이미지 */}
            <div className="character-image-wrapper">
              <AnimatePresence mode="wait">
                <motion.img
                  key={character.moodscore}
                  src={getForMood(character.moodscore, character.level)}
                  alt="캐릭터 상태"
                  className="character-image"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>
            </div>

            <p className="character-level">Lv. {character.level}</p>
            <p className="character-points">
              Points: {character.points}
              {pointChange && (
                <motion.span
                  initial={{ opacity: 1, y: -10 }}
                  animate={{ opacity: 0, y: -30 }}
                  transition={{ duration: 1 }}
                  style={{
                    color: "gray",
                    marginLeft: "5px",
                    fontWeight: "bold",
                  }}
                >
                  +{pointChange}
                </motion.span>
              )}
            </p>
            <p className="character-mood">Mood: {character.moodscore}/100</p>

            <div className="character-mood-bar">
              <motion.div
                className="character-mood-fill"
                style={{ width: `${character.moodscore}%` }}
                animate={{ width: `${character.moodscore}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
          </motion.div>

          <button
            disabled={cheeredToday}
            onClick={handleCheer}
            className="character-cheer-btn"
          >
            응원하기 💖
          </button>

          {message && <p className="character-message">{message}</p>}
          <CharacterChat
            user={user}
            character={character}
            setCharacter={setCharacter}
            onPointChange={(diff) => {
              setPointChange(diff);
              setCharacter((prev) => ({
                ...prev,
                points: prev.points + diff,
              }));
              setTimeout(() => setPointChange(null), 1000);
            }}
          />
        </>
      ) : (
        <div className="character-create-wrapper">
          <p>캐릭터를 생성해주세요!</p>
          {/* 캐릭터 생성 폼 */}
        </div>
      )}
    </div>
  );
};

export default Character;
