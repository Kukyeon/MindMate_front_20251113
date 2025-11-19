import { Link } from "react-router-dom";

const Home = () => {
  const cards = [
    // ... cards 데이터 유지 (type 속성은 이제 필요 없습니다) ...
    {
      img: "/img/calendar.png",
      title: "📝 감정 일기 작성",
      text: "오늘 느낀 감정을 기록하고 AI가 하루를 위로해줘요.",
    },
    {
      img: "/img/graph.png",
      title: "📈 감정 변화 통계",
      text: "한 주/한 달 감정 변화를 시각적으로 확인하고 AI가 한 주의 통계를 알려줘요.",
    },
    // ... 나머지 카드 데이터 ...
    {
      img: "/img/chat.png",
      title: "💬 캐릭터 AI 상담",
      text: "귀여운 캐릭터 AI와 대화하며 하루를 위로받아요.",
    },
    {
      img: "/img/board.png",
      title: "💫 커뮤니티 공간",
      text: "다른 사용자와 소통하고 AI가 맞춤 해시태그를 추천해줘요.",
    },
    {
      img: "/img/test01.png",
      title: "🌈 MBTI 심리 테스트",
      text: "매일 달라지는 MBTI별 맞춤 심리테스트 결과 확인 가능.",
    },
    {
      img: "/img/test02.png",
      title: "🔮 오늘의 별자리 운세",
      text: "사용자 생일 기반 오늘의 별자리 운세 확인.",
    },
  ];

  return (
    <main className="home-page-scroll">
      <section className="hero">
        <h1 className="hero-title">
          <span className="emoji-deco">✨</span> Mind Mate{" "}
          <span className="emoji-deco">✨</span>
          <br />
          당신의 감정에 귀 기울여 드립니다
        </h1>
        <p className="hero-subtitle">
          나만의 감정 기록을 통해 스스로를 이해하고 위로하는 감정 일기장 웹앱
        </p>
        <div className="hero-cta">
          <Link to="/login" className="btn login-btn">
            로그인
          </Link>
          <Link to="/signup" className="btn signup-btn">
            회원가입
          </Link>
        </div>
      </section>

      <section className="feature-grid-section">
        <h2 className="section-title">주요 기능</h2>

        <div className="feature-grid">
          {cards.map((f, i) => (
            // 클래스에 프레임 타입 지정 없이, 'feature-card'만 사용
            <div className={`feature-card`} key={i}>
              <div className="device-frame">
                <div className="device-screen">
                  <img src={f.img} alt={f.title} />
                </div>
              </div>
              <div className="card-text-content">
                <h3 className="card-title">{f.title}</h3>
                <p className="card-text">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
