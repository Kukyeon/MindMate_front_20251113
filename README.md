# 🐣 MindMate (마인드메이트)
> **나만의 감정 기록을 통해 스스로를 이해하고 위로하는 AI 감정 일기장 웹앱**


<a href="http://mindmate-front-end.s3-website.ap-northeast-2.amazonaws.com/">
  <img src="https://github.com/user-attachments/assets/adf0424a-4b9a-4236-9536-3d0470ddaee5" width="600px" alt="MindMate Banner">
</a>

## 🌟 프로젝트 소개
현대인들이 AI와 상호작용하며 마음을 정리하고, 캐릭터 성장과 커뮤니티를 통해 지속적인 심리 관리를 할 수 있도록 돕는 힐링 서비스입니다.

---

## 🛠 Tech Stack (기술 스택)

### Infrastructure & DB
<img src="https://img.shields.io/badge/java-007396?style=for-the-badge&logo=java&logoColor=white"> <img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"> <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">

### Frontend & Library
<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white">

### AI & Tools
<img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white"> <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">

---

## ✨ 주요 기능 (Key Features)

### 1. 📅 AI 감정 일기 & 캘린더
- **감정 시각화**: 15가지 이모지를 활용해 하루의 기분을 캘린더에 기록합니다.
- **AI 분석 답변**: 일기를 작성하면 AI가 내용을 분석해 따뜻한 위로의 피드백을 제공합니다.
<img src="https://github.com/user-attachments/assets/7f1869b2-36ac-48fc-932a-8950e47cef0b" width="600px">

### 2. 📊 감정 통계 데이터 (Visual Chart)
- **감정 분포 분석**: 작성된 일기 데이터를 5가지 주요 감정 카테고리로 분류하여 Chart.js 그래프로 시각화합니다.
- **월간 리포트**: 한 달간의 감정 변화 추이를 한눈에 확인할 수 있습니다.
<img src="https://github.com/user-attachments/assets/08279d1c-bffb-4199-9ddd-9252f438a0fd" width="600px">

### 3. 💬 AI 커뮤니티 게시판
- **자동 해시태그**: AI가 게시글 내용을 분석하여 관련 해시태그를 자동으로 생성하고 연결합니다.
- **공감 스티커**: 이모지 스티커를 통해 유저 간 따뜻한 소통과 공감을 나눕니다.
<img src="https://github.com/user-attachments/assets/9bc913ac-6ec2-456f-a12c-d5736bf106c9" width="600px">

### 4. 🐣 캐릭터 성장 시스템
- **성장형 위젯**: 일기 작성 및 활동에 따라 포인트를 얻고 캐릭터를 성장시킬 수 있습니다.
- **무드 반영**: 사용자의 오늘의 기분에 따라 캐릭터의 표정이 실시간으로 변화합니다.
<img src="https://github.com/user-attachments/assets/19ee91d5-4728-4d0b-a129-dbe607ab83f8" width="600px">

### 5. 🔮 AI 심리 테스트 및 운세
- **MBTI 맞춤형**: 사용자의 MBTI 정보를 바탕으로 매일 새로운 AI 심리 테스트를 제공합니다.
- **오늘의 별자리 운세**: 생년월일 기반의 행운의 컬러, 아이템, 시간 정보를 제공합니다.
<img src="https://github.com/user-attachments/assets/31dc6b5c-8832-495c-8550-f81f18398cc5" width="600px">

---

## 🧠 Troubleshooting (Community & Interaction)

### 1. AI 자동 해시태그 생성 시 데이터 정형화 문제
- **Problem**: OpenAI/Gemini API를 사용하여 게시글의 해시태그를 자동 생성할 때, AI가 문장 형태나 특수문자가 섞인 일관성 없는 결과를 반환하여 데이터베이스 저장 및 태그 기반 필터링에 오류가 발생함.
- **Analysis**: 프롬프트의 자유도가 너무 높아 AI의 응답 형식이 고정되지 않았으며, 이로 인해 백엔드에서 데이터를 파싱(Parsing)할 때 예외 상황이 자주 발생함.
- **Solution**: 
    - **Prompt Engineering**: AI에게 "단어 위주의 해시태그 3개를 JSON 배열 형식으로만 응답하라"는 구체적인 지침(System Instruction)을 부여함.
    - **Validation**: 백엔드에서 AI의 응답을 수신한 후 정규표현식을 통해 특수문자를 제거하고 태그 중복을 검사하는 유효성 검사 로직을 추가함.
- **Result**: 태그 데이터의 정형성을 확보하여 태그 클릭 시 동일 태그 게시글을 불러오는 필터링 기능의 신뢰도를 100%로 끌어올림.

### 2. 이모지 스티커 시스템의 중복 처리 및 정합성 확보
- **Problem**: 게시글과 댓글에 감정 표현을 위한 '이모지 스티커' 기능을 구현하던 중, 특정 사용자가 동일한 이모지를 무한정 클릭하여 데이터가 중복 생성되거나 전체 카운트가 실제 유저 수보다 많아지는 문제 발생.
- **Analysis**: 단순 카운트 방식의 컬럼 설계로는 '누가 어떤 이모지를 눌렀는지'를 식별할 수 없어 중복 클릭 방지 및 취소 로직 구현이 불가능함을 파악.
- **Solution**: 
    - **DB Normalization**: `Emoji_Reaction` 테이블을 독립적으로 생성하고 `(User_ID, Target_ID, Emoji_Type)`를 복합키(Composite Key)로 설정하여 DB 레벨에서 중복 생성을 원천 차단함.
    - **Stateful Interaction**: 프론트엔드에서 사용자의 기선택 여부를 체크하여, 이미 선택된 이모지 클릭 시 해당 데이터를 삭제하는 '토글(Toggle)' 방식의 인터랙션을 구현함.
- **Result**: 데이터 무결성을 보장하고, 유저 간의 직관적이고 안정적인 감정 교류 시스템을 구축함.

### 3. 실시간 인기 태그 집계 성능 및 검색 최적화
- **Problem**: 일주일간 가장 많이 사용된 해시태그를 메인 상단에 배치하기 위해 매 로딩 시마다 전체 게시글 데이터를 Join/Group By 연산하면서, 게시글 수 증가에 따른 메인 페이지 로딩 속도 저하 발생.
- **Analysis**: 전체 데이터셋을 대상으로 하는 집계 쿼리가 실행될 때마다 DB 부하가 가중되는 구조적 한계를 확인.
- **Solution**: 
    - **Query Optimization**: Spring Data JPA의 쿼리 메서드 대신 **Native Query**를 사용하여 최근 7일간의 데이터로 검색 범위를 한정하고 인덱스를 효율적으로 타도록 개선함.
    - **Search logic**: 제목, 내용, 작성자뿐만 아니라 AI가 생성한 해시태그 필드까지 포함하는 다중 조건 검색 기능을 구현하여 정보 접근성을 개선함.
- **Result**: 메인 화면의 인기 태그 로딩 시간을 초기 대비 약 45% 단축하였으며, 효율적인 커뮤니티 네비게이션을 제공함.

---

## 📐 System Design

### 🏗 구조도 (Structure Chart)

<img src="https://github.com/user-attachments/assets/af2189f5-5f34-4342-a66c-02e0838a0ec5" width="600px" title="Structure Chart">


### 💾 DB 설계 (ERD)

<img src="https://github.com/user-attachments/assets/4d25e29a-09bd-4193-90d3-6d812760c7f1" width="600px" title="ERD">


---

## 🧑‍💻 팀원 소개
- **김국연, 김윤섭, 이상명, 한수정**
