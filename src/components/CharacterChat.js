import { useState, useRef, useEffect } from "react";
import api from "../api/axiosConfig";
import { authHeader as getAuthHeader } from "../api/authApi";

const CharacterChat = ({ character, user }) => {
  const [messages, setMessages] = useState([]); // { sender: 'user'|'ai', text: '...' }
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // 스크롤 항상 맨 아래
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { sender: "user", text: input };
    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const headers = user ? await getAuthHeader() : {};
      const res = await api.post("/ai/chat", { message: input }, { headers });

      const aiResponseText = res.data.aiResponse || "AI가 답변하지 못했어요 😢";
      const updatedCharacter = res.data.character || character;

      const aiMessage = { sender: "ai", text: aiResponseText };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage = { sender: "ai", text: "응답 중 오류 발생 😢" };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="character-chat-container">
      <div className="character-chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`character-chat-message ${msg.sender}`}>
            <span>{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="character-chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="캐릭터에게 메시지 보내기..."
          disabled={loading}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} disabled={loading}>
          전송
        </button>
      </div>
    </div>
  );
};

export default CharacterChat;
