import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const sliderRef = useRef(null);
  const [index, setIndex] = useState(0);

  const cards = [
    {
      img1: "/img/calendar.png",
      img2: "/img/graph.png",
      title: "📖 일기 작성 & 📊 감정 통계",
      text: "오늘 느낀 감정을 기록하고 AI가 하루를 위로해줘요, \n 그리고 한 주/한 달 감정 변화를 시각적으로 확인하고 AI가 한 주의 통계를 알려줘요",
    },
    {
      img1: "/img/chat.png",
      img2: "/img/board.png",
      title: "🤖 AI 상담 & 📌 커뮤니티",
      text: "캐릭터 AI와 대화하며 하루를 위로받고, 커뮤니티에서 다른 사용자와 소통하고 AI가 맞춤 해시태그를 추천해줘요.",
    },
    {
      img1: "/img/test02.png",
      img2: "/img/test01.png",
      title: "🧠 별자리 운세 & MBTI 심리 테스트",
      text: "오늘의 별자리 운세를 확인하고, 매일 달라지는 사용자의 MBTI별 맞춤 심리테스트 결과를 확인할 수 있어요.",
    },
  ];

  // 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => moveSlide("next"), 3000);
    return () => clearInterval(timer);
  });

  const moveSlide = (dir) => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.children[0].offsetWidth + 20; // gap 포함
    let nextIndex = index;

    if (dir === "next") nextIndex = (index + 1) % cards.length;
    if (dir === "prev") nextIndex = (index - 1 + cards.length) % cards.length;

    sliderRef.current.scrollTo({
      left: cardWidth * nextIndex,
      behavior: "smooth",
    });

    setIndex(nextIndex);
  };

  return (
    <main className="about-page">
      {/* 히어로 섹션 */}
      <section className="hero">
        <h1>Mind Mate에 오신 것을 환영합니다!</h1>
        <p>당신의 감정을 기록하고 스스로를 이해하는 감정 일기장 앱입니다.</p>
        <p>
          지금{" "}
          <Link to="/login" className="login-link">
            로그인
          </Link>{" "}
          하고 이용해 보세요!
        </p>
      </section>

      {/* 사진 중심 캐러셀 */}
      <section className="carousel-section">
        <button className="nav-btn left" onClick={() => moveSlide("prev")}>
          ❮
        </button>

        <div className="carousel" ref={sliderRef}>
          {cards.map((c, i) => (
            <div className="carousel-card" key={i}>
              <div className="double-img">
                <img src={c.img1} alt="" />
                <img src={c.img2} alt="" />
              </div>
              <div className="card-text">
                <h2>{c.title}</h2>
                <p>{c.text}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="nav-btn right" onClick={() => moveSlide("next")}>
          ❯
        </button>
      </section>
    </main>
  );
};

export default Home;
