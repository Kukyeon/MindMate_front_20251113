const Home = () => {
  return (
    <main className="about-page">
      {/* 히어로 섹션 */}
      <section className="hero">
        <h1>Mind Mate에 오신 것을 환영합니다!</h1>
        <p>
          당신의 감정을 기록하고, 스스로를 이해하는 따뜻한 감정 일기장 앱입니다.
        </p>
      </section>

      {/* 기능 소개 섹션 */}
      <section className="features">
        <div className="feature">
          <img src="/images/diary.png" alt="일기 작성" />
          <h2>📖 일기 작성</h2>
          <p>
            오늘 느낀 감정을 간단히 기록하고, 마음속 이야기를 정리할 수 있어요.
            텍스트, 이미지, 감정 아이콘까지 함께 첨부할 수 있습니다.
          </p>
        </div>
        <div className="feature">
          <img src="/images/statistics.png" alt="감정 통계" />
          <h2>📊 감정 통계</h2>
          <p>
            일주일, 한 달 단위로 감정 변화를 시각화하여 확인할 수 있어요. 나의
            기분 패턴을 쉽게 분석할 수 있습니다.
          </p>
        </div>
        <div className="feature">
          <img src="/images/ai_chat.png" alt="AI 상담" />
          <h2>🤖 AI 상담</h2>
          <p>
            AI 캐릭터와 대화를 나누며 감정을 정리하고, 조언을 받을 수 있어요.
            혼자 고민하지 않아도 됩니다.
          </p>
        </div>
      </section>

      {/* 추가 정보 섹션 */}
      <section className="additional-info">
        <h2>왜 Mind Mate일까요?</h2>
        <p>
          우리의 감정은 하루하루 변화합니다. Mind Mate는 당신이 느낀 감정을
          안전하게 기록하고, 스스로를 이해할 수 있는 도구를 제공합니다. 언제든
          돌아와서 나의 감정 패턴을 확인하세요.
        </p>
        <img src="/images/why.png" alt="Mind Mate 소개 이미지" />
      </section>
    </main>
  );
};
export default Home;
