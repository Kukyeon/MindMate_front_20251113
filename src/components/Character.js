import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";

const Character = () => {
  const profileId = 1;
  const [character, setCharacter] = useState(null);
  const [name, setName] = useState("");

  const [message, setMessage] = useState("");
  const [cheeredToday, setCheeredToday] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { profileId, name };
      const res = await api.post("/ai/create", payload);
      setCharacter(res.data);
      setName("");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const fetchCharacter = async () => {
    try {
      const res = await api.get(`/ai/${profileId}`);
      setCharacter(res.data);
      console.log(res.data);
    } catch (err) {
      if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      }
      console.error("캐릭터 불러오기 실패", err);
    }
  };

  useEffect(() => {
    fetchCharacter();
  }, []);
  const handleCheer = async () => {
    try {
      const res = await api.put("/ai/cheer", null, {
        params: { profileId, addPoints: 2, moodChange: 5 },
      });
      setCharacter({ ...res.data });
      setCheeredToday(true);
      setMessage("응원 성공 ! 🌟");
    } catch (err) {
      if (err.response?.data?.message) {
        setMessage(err.response.data.message);
        // 서버에서 이미 응원했다고 하면 UI도 비활성화
        if (err.response.data.message.includes("오늘은 이미 응원")) {
          setCheeredToday(true);
        }
      } else {
        setMessage("응원 중 오류가 발생했습니다.");
      }
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
            className="bg-white shadow-md rounded-2xl p-6 w-80 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-2">{character.name}</h2>

            <div className="w-28 h-28 mx-auto mb-3 flex items-center justify-center bg-gray-50 rounded-full">
              <AnimatePresence mode="wait">
                <motion.img
                  key={character.moodscore} // 이미지 변경 시 애니메이션
                  src={getForMood(character.moodscore, character.level)}
                  alt="캐릭터 상태"
                  className="max-w-full max-h-full object-contain"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                />
              </AnimatePresence>
            </div>

            <motion.p
              key={character.level}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              Lv. {character.level}
            </motion.p>

            <p>Points: {character.points}</p>
            <p>Mood: {character.moodscore}/100</p>

            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
              <motion.div
                className="bg-pink-400 h-3 rounded-full"
                style={{ width: `${character.moodscore}%` }}
                animate={{ width: `${character.moodscore}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
          </motion.div>

          {/* 응원하기 버튼 */}
          <button
            disabled={cheeredToday}
            onClick={handleCheer}
            className="bg-pink-500 text-white px-4 py-2 rounded mt-4 hover:bg-pink-600 transition"
            type="button"
          >
            응원하기 💖
          </button>

          {message && <p style={{ color: "purple" }}>{message}</p>}
        </>
      ) : (
        <div>
          <p>캐릭터를 생성해주세요!</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="캐릭터 이름 입력"
              required
            />
            <button type="submit">캐릭터 생성</button>
          </form>
        </div>
      )}
    </div>
  );
};
export default Character;
