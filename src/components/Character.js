import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";

const Character = ({ user }) => {
  const userId = user?.userId;
  const [character, setCharacter] = useState(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [cheeredToday, setCheeredToday] = useState(false);
  console.log(user.userId);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { userId, name };
      const res = await api.post(`/ai/create?userId=${userId}`, payload);
      setCharacter(res.data);
      setName("");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const fetchCharacter = async () => {
    try {
      const res = await api.get(`/ai/${userId}`);
      setCharacter(res.data);
    } catch (err) {
      if (err.response?.data?.message) setMessage(err.response.data.message);
      console.error("캐릭터 불러오기 실패", err);
    }
  };

  useEffect(() => {
    fetchCharacter();
  }, []);

  const handleCheer = async () => {
    try {
      const res = await api.put("/ai/cheer", null, {
        params: { userId, addPoints: 2, moodChange: 5 },
      });
      setCharacter({ ...res.data });
      setCheeredToday(true);
      setMessage("응원 성공! 🌟");
    } catch (err) {
      const msg = err.response?.data?.message || "응원 중 오류가 발생했습니다.";
      setMessage(msg);
      if (msg.includes("오늘은 이미 응원")) setCheeredToday(true);
      console.error("업데이트 실패:", err);
    }
  };
  const handleMood = async () => {
    try {
      const res = await api.put("/ai/update", null, {
        params: { userId, addPoints: 4, moodChange: 5 },
      });
      setCharacter({ ...res.data });
      // setCheeredToday(true);
      setMessage("무드 업데이트 성공! 🌟");
    } catch (err) {
      const msg = err.response?.data?.message || "응원 중 오류가 발생했습니다.";
      setMessage(msg);
      if (msg.includes("오늘은 이미 응원")) setCheeredToday(true);
      console.error("업데이트 실패:", err);
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
            <h2 className="character-name">{character.name}</h2>

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
            <p className="character-points">Points: {character.points}</p>
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
          <button onClick={handleMood} className="character-cheer-btn">
            무드 업데이트하기 💖
          </button>

          {message && <p className="character-message">{message}</p>}
        </>
      ) : (
        <div className="character-create-wrapper">
          <p>캐릭터를 생성해주세요!</p>
          <form onSubmit={handleSubmit} className="character-create-form">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="캐릭터 이름 입력"
              required
              className="character-create-input"
            />
            <button type="submit" className="character-create-btn">
              생성
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Character;
