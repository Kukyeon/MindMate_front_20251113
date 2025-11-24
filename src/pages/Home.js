import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 769);
  const cards = [
    {
      img1: "/img/calendar.png",
      img2: "/img/m_calendar.png",
      title: "🗓️ 이모지 캘린더",
      text: "단순한 기록을 넘어, 매일의 감정을 이모지로 시각화하여 한 달의 정서적 흐름을 한눈에 파악하고 패턴을 이해할 수 있어요. \n나의 감정 지도를 그려보세요!",
    },
    {
      img1: "/img/diary.png",
      img2: "/img/m_diary.png",
      title: "📝 AI 감정 일기장",
      text: "가장 솔직한 감정의 기록을 시작해 보세요. AI가 당신의 글을 분석하고 깊은 위로의 메시지를 드립니다. \n털어놓는 것만으로도 치유가 시작돼요.",
    },
    {
      img1: "/img/graph.png",
      img2: "/img/m_graph.png",
      title: "📈 스마트 감정 통계",
      text: "막연했던 감정 변화를 정확한 그래프와 데이터로 시각화하세요. \n주간/월간 통계를 통해 감정의 기복을 확인하고, AI가 제공하는 맞춤 인사이트로 나를 더 깊이 이해할 수 있어요.",
    },
    {
      img1: "/img/character.png",
      img2: "/img/m_character.png",
      title: "💬 위로봇 AI 상담",
      text: "귀엽고 친근한 캐릭터 AI 챗봇과 언제든 대화하세요. \n심리 전문가처럼 깊이 있는 상담은 아니지만, 따뜻하고 편안한 대화로 지친 하루를 달래고 마음을 환기할 수 있습니다.",
    },
    {
      img1: "/img/board.png",
      img2: "/img/m_board.png",
      title: "💫 익명 커뮤니티 공간",
      text: "나와 비슷한 감정을 가진 사람들과 익명으로 소통하세요. \n공감과 위로를 나누는 안전한 공간에서, 당신의 글에 AI가 추천하는 맞춤 해시태그를 달아 더 많은 공감을 얻을 수 있습니다.",
    },
    {
      img1: "/img/test01.png",
      img2: "/img/m_test01.png",
      title: "🌈 데일리 MBTI 테스트",
      text: "매일 새롭게 업데이트되는 MBTI 맞춤형 심리 테스트를 통해 나의 성향을 탐색해 보세요. \n재미있고 유익한 결과를 통해 오늘의 나를 새롭게 발견할 수 있습니다.",
    },
    {
      img1: "/img/test02.png",
      img2: "/img/m_test02.png",
      title: "🔮 오늘의 별자리 운세",
      text: "매일 아침, 당신의 생일을 기반으로 한 오늘의 별자리 운세를 확인하고 하루를 준비하세요. \n마음의 재미와 기대감을 불어넣어 줄 긍정적인 메시지를 제공합니다.",
    },
  ];
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 769);
    };

    // 리사이즈 이벤트 리스너 등록
    window.addEventListener("resize", handleResize);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
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
          {cards.map((f, i) => {
            // isMobile 상태에 따라 이미지 소스를 선택
            const imageSrc = isMobile ? f.img2 : f.img1;

            return (
              <div className={`feature-card`} key={i}>
                <div className="device-frame">
                  <div className="device-screen">
                    {/* 선택된 이미지를 사용 */}
                    <img src={imageSrc} alt={f.title} />
                  </div>
                </div>
                <div className="card-text-content">
                  <h3 className="card-title">{f.title}</h3>
                  <p className="card-text">{f.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section className="cta-section">
        <h2 className="cta-title">지금 바로 당신의 감정을 들여다보세요!</h2>
        <p className="cta-subtitle">
          Mind Mate에서 나를 이해하고, 위로받는 여정을 시작하세요.
        </p>
        <div className="cta-buttons">
          <Link to="/login" className="btn cta-login-btn">
            로그인하고 시작하기!
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
