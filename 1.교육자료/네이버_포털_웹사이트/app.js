/**
 * NAVER Portal Interactive Script
 * Search Autocomplete, AI Modal, Tab Switching, News Ticker, Theme Toggle
 */

document.addEventListener("DOMContentLoaded", () => {
  initSearch();
  initAiModal();
  initNewsTabs();
  initPressChannels();
  initNewsTicker();
  initThemeToggle();
  initScrollTop();
  initProfileInteractions();
});

/* ==========================================================================
   1. Search Box & Autocomplete Dropdown
   ========================================================================== */
function initSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchDropdown = document.getElementById("searchDropdown");
  const closeDropdown = document.getElementById("closeDropdown");
  const searchSubmitBtn = document.getElementById("searchSubmitBtn");
  const trendingItems = document.querySelectorAll(".trending-item");

  if (!searchInput || !searchDropdown) return;

  // Show dropdown on input focus/click
  searchInput.addEventListener("focus", () => {
    searchDropdown.classList.add("active");
  });

  // Close dropdown on click outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".header-center")) {
      searchDropdown.classList.remove("active");
    }
  });

  if (closeDropdown) {
    closeDropdown.addEventListener("click", () => {
      searchDropdown.classList.remove("active");
    });
  }

  // Clicking trending item fills search input
  trendingItems.forEach((item) => {
    item.addEventListener("click", () => {
      const keyword = item.querySelector("span:last-child").textContent;
      searchInput.value = keyword;
      searchDropdown.classList.remove("active");
      performSearch(keyword);
    });
  });

  // Enter key trigger
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      performSearch(searchInput.value.trim());
    }
  });

  if (searchSubmitBtn) {
    searchSubmitBtn.addEventListener("click", () => {
      performSearch(searchInput.value.trim());
    });
  }

  function performSearch(query) {
    if (!query) return;
    searchDropdown.classList.remove("active");
    // Open AI modal or search
    const aiModal = document.getElementById("aiModal");
    const aiModalInput = document.getElementById("aiModalInput");
    if (aiModal && aiModalInput) {
      aiModal.classList.add("active");
      aiModalInput.value = query;
      sendAiMessage(query);
    }
  }
}

/* ==========================================================================
   2. AI Search Assistant Modal (CLOVA X / Cue: Style)
   ========================================================================== */
function initAiModal() {
  const openAiBtn = document.getElementById("openAiModalBtn");
  const closeAiBtn = document.getElementById("closeAiModalBtn");
  const aiModal = document.getElementById("aiModal");
  const aiModalInput = document.getElementById("aiModalInput");
  const aiSendBtn = document.getElementById("aiSendBtn");
  const aiSuggestions = document.querySelectorAll(".ai-chip");

  if (!aiModal) return;

  if (openAiBtn) {
    openAiBtn.addEventListener("click", () => {
      aiModal.classList.add("active");
      if (aiModalInput) aiModalInput.focus();
    });
  }

  if (closeAiBtn) {
    closeAiBtn.addEventListener("click", () => {
      aiModal.classList.remove("active");
    });
  }

  aiModal.addEventListener("click", (e) => {
    if (e.target === aiModal) {
      aiModal.classList.remove("active");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && aiModal.classList.contains("active")) {
      aiModal.classList.remove("active");
    }
  });

  // Suggestions chip click
  aiSuggestions.forEach((chip) => {
    chip.addEventListener("click", () => {
      const query = chip.getAttribute("data-query");
      if (query) {
        sendAiMessage(query);
      }
    });
  });

  // Input Send
  function handleSend() {
    if (!aiModalInput) return;
    const text = aiModalInput.value.trim();
    if (text) {
      sendAiMessage(text);
      aiModalInput.value = "";
    }
  }

  if (aiSendBtn) {
    aiSendBtn.addEventListener("click", handleSend);
  }

  if (aiModalInput) {
    aiModalInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleSend();
      }
    });
  }
}

function sendAiMessage(query) {
  const chatBody = document.getElementById("aiChatBody");
  if (!chatBody) return;

  // 1. User Bubble
  const userMsg = document.createElement("div");
  userMsg.className = "ai-msg";
  userMsg.style.justifyContent = "flex-end";
  userMsg.innerHTML = `
    <div class="ai-bubble" style="background: #1a64ea; color: #fff; max-width: 80%; border: none;">
      ${escapeHtml(query)}
    </div>
  `;
  chatBody.appendChild(userMsg);
  chatBody.scrollTop = chatBody.scrollHeight;

  // 2. AI Thinking indicator
  const aiThinking = document.createElement("div");
  aiThinking.className = "ai-msg";
  aiThinking.innerHTML = `
    <div class="ai-avatar-icon">N</div>
    <div class="ai-bubble" style="color: var(--text-muted);">
      답변을 생성하고 있습니다... ✨
    </div>
  `;
  chatBody.appendChild(aiThinking);
  chatBody.scrollTop = chatBody.scrollHeight;

  // 3. Simulated Response Delay
  setTimeout(() => {
    aiThinking.remove();
    const aiResponse = document.createElement("div");
    aiResponse.className = "ai-msg";
    
    let answerContent = "";
    if (query.includes("경제") || query.includes("뉴스")) {
      answerContent = `
        <strong>📊 오늘의 주요 경제 브리핑:</strong><br>
        1. <strong>코스피 상승 마감:</strong> 외국인 및 기관 순매수에 힘입어 2,650선 회복세<br>
        2. <strong>반도체 수출 호조:</strong> AI 메모리(HBM) 수요 증가로 전년 동기 대비 28% 상승<br>
        3. <strong>기준금리 동결 전망:</strong> 한국은행 금융통화위원회 시장 안정 유지 방침
      `;
    } else if (query.includes("나들이") || query.includes("서울")) {
      answerContent = `
        <strong>🍂 이번 주말 서울 추천 나들이 코스:</strong><br>
        1. <strong>국립현대미술관 서울관 & 삼청동:</strong> 가을 기획 전시 관람 후 감성 카페 투어<br>
        2. <strong>서울숲 피크닉:</strong> 단풍 시작과 함께하는 잔디마당 휴식 및 성수동 쇼핑<br>
        3. <strong>한강공원 달빛 분수:</strong> 반포 한강공원 야경과 함께하는 가벼운 산책
      `;
    } else if (query.includes("멤버십") || query.includes("혜택")) {
      answerContent = `
        <strong>✨ 네이버 플러스 멤버십 주요 혜택:</strong><br>
        - 쇼핑 시 최대 <strong>5% 네이버페이 포인트</strong> 강력 적립<br>
        - 티빙(TVING) 무제한 방송 시청권 or 네이버 웹툰 쿠키 49개 매월 제공<br>
        - MYBOX 80GB 클라우드 무료 제공 및 편의점/영화관 제휴 할인
      `;
    } else {
      answerContent = `
        <strong>"${escapeHtml(query)}"</strong> 에 대한 검색 결과입니다:<br>
        네이버의 최신 데이터베이스를 바탕으로 실시간 정보를 분석하여 가장 유용한 핵심 내용을 전달해 드립니다. 추가적인 세부 정보나 연관 문서가 필요하시면 언제든 말씀해 주세요!
      `;
    }

    aiResponse.innerHTML = `
      <div class="ai-avatar-icon">N</div>
      <div class="ai-bubble">
        ${answerContent}
      </div>
    `;
    chatBody.appendChild(aiResponse);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 700);
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ==========================================================================
   3. Newsstand Category Tabs (뉴스스탠드, 엔터, 스포츠 LIVE, 게임 등)
   ========================================================================== */
const categoryData = {
  newsstand: {
    press: "KBS WORLD",
    time: "09월 10일 10:36 직접 편집",
    leadImg: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80",
    leadTitle: "Lee Calls on OECD to Help Fundamentally Ease Polarized Structure...",
    bullets: [
      "Korea Disaster Relief Team Preparing to Return Home from ...",
      "Court Orders Record Divorce Settlement for Smilegate Fou...",
      "李在明：首脑外交为韩国经贸创造良好机遇",
      "北韩举行纪念建政76周年活动 金正恩强调“爱国之心和献身...",
      "政府が緊急援助隊の第2陣をネパールに派遣へ",
      "パク・ジンヒョン ルービンシュタイン国際ピアノコンクー..."
    ]
  },
  enter: {
    press: "디스패치 · 연예",
    time: "09월 10일 11:15 실시간 업데이트",
    leadImg: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80",
    leadTitle: "글로벌 K-POP 월드투어 피날레 성료... 10만 팬 열광의 도가니",
    bullets: [
      "새 드라마 첫 방송 시청률 12.8% 쾌조의 출발...",
      "칸 국제영화제 초청작 국내 개봉 확정, 예매율 압도적 1위",
      "인기 아이돌 그룹 신곡 뮤직비디오 유튜브 1억뷰 최단기 돌파",
      "예능 대세 스타들의 반전 토크, 주말 안방극장 사로잡았다",
      "올해의 베스트 앨범 후보 공개... 치열한 음원 차트 경쟁"
    ]
  },
  sports: {
    press: "스포츠조선 · LIVE",
    time: "09월 10일 11:20 속보",
    leadImg: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80",
    leadTitle: "손흥민 멀티골 폭발! 팀 승리 견인하며 경기 최우수 선수 선정",
    bullets: [
      "[프로야구] 가을야구 진출 경쟁 치열... 5위 싸움 단 0.5경기 차",
      "메이저리그 이정후, 4경기 연속 안타 행진 이어가",
      "배드민턴 안세영, 세계선수권 결승 진출 쾌거",
      "K리그 주말 빅매치 하이라이트 및 관전 포인트 분석",
      "2026 나고야 아시안게임 국가대표 1차 최종 선발전 개막"
    ]
  },
  game: {
    press: "인벤 · 게임포커스",
    time: "09월 10일 10:50 게이밍 리포트",
    leadImg: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=400&q=80",
    leadTitle: "하반기 최고 기대작 액션 RPG 정식 출시, 스팀 전세계 매출 1위",
    bullets: [
      "LoL 롤드컵 본선 진출팀 확정... LCK 4개 팀 동반 출격",
      "국산 콘솔 신작 글로벌 흥행 돌풍, 전 세계 누적 200만 장 돌파",
      "국제 게임쇼 지스타(G-STAR) 부스 신청 마감... 역대 최대 규모",
      "인기 모바일 게임 대규모 시즌 업데이트 및 기념 보상 공개"
    ]
  },
  economy: {
    press: "매일경제 · 증시분석",
    time: "09월 10일 11:05 시장 종합",
    leadImg: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=400&q=80",
    leadTitle: "코스피 외국인 대량 매수에 상승 출발... 반도체·배터리주 강세",
    bullets: [
      "미국 기준금리 인하 기대감 확산, 원·달러 환율 1,320원대 안착",
      "글로벌 AI 빅테크 시설 투자 확대에 국내 소부장 기업 실적 호조",
      "서울 아파트 주간 매매가 상승폭 둔화... 대출 규제 영향권",
      "청약 통장 가입자 혜택 확대 방안 금융위 발표 요약"
    ]
  },
  shopping: {
    press: "네이버 쇼핑 공식 피드",
    time: "09월 10일 11:30 특가 편성",
    leadImg: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=400&q=80",
    leadTitle: "쇼핑 라이브 단독 특별 혜택전! 최대 70% 할인 및 추가 적립",
    bullets: [
      "환절기 피부 보습 스킨케어 핫딜 릴레이",
      "스마트 홈 가전 가을맞이 클리어런스 세일",
      "프리미엄 원두 드립백 세트 한정 수량 무료배송",
      "트렌디 가을 아우터 & 니트 패션 기획전 오픈"
    ]
  }
};

function initNewsTabs() {
  const tabs = document.querySelectorAll(".cat-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const tabKey = tab.getAttribute("data-tab");
      renderNewsContent(tabKey);
    });
  });
}

function renderNewsContent(tabKey) {
  const data = categoryData[tabKey] || categoryData.newsstand;
  const articlesContainer = document.getElementById("articlesContainer");
  if (!articlesContainer) return;

  const bulletsHtml = data.bullets
    .map((b) => `<li class="bullet-item">${b}</li>`)
    .join("");

  articlesContainer.innerHTML = `
    <div class="feed-header-info">
      <div class="press-tag-badge">
        <span>${data.press}</span>
      </div>
      <div class="feed-meta-time">
        ${data.time}
        <button style="margin-left: 8px; color: var(--text-muted); cursor: pointer;">✕</button>
      </div>
    </div>

    <div class="news-articles-grid">
      <article class="main-lead-article">
        <div class="lead-thumbnail-box">
          <img src="${data.leadImg}" alt="Headline Photo">
        </div>
        <h3 class="lead-title">
          ${data.leadTitle}
        </h3>
      </article>

      <ul class="article-bullet-list">
        ${bulletsHtml}
      </ul>
    </div>
  `;
}

/* ==========================================================================
   4. Subscribed Press Channel Selector
   ========================================================================== */
function initPressChannels() {
  const pressItems = document.querySelectorAll(".press-item");
  pressItems.forEach((item) => {
    item.addEventListener("click", () => {
      pressItems.forEach((p) => p.classList.remove("active"));
      item.classList.add("active");

      const pressName = item.querySelector("span").textContent;
      const badge = document.querySelector(".press-tag-badge span");
      if (badge) {
        badge.textContent = pressName.toUpperCase();
      }
    });
  });
}

/* ==========================================================================
   5. Breaking News Rolling Ticker
   ========================================================================== */
function initNewsTicker() {
  const tickerElement = document.getElementById("newsTicker");
  if (!tickerElement) return;

  const headlines = [
    { press: "연합뉴스", title: "[2보] 성착취집단 '자경단' 총책 김녹완, 대법서 무기징역 확정" },
    { press: "YTN", title: "가을 장마 소강상태... 낮 기온 평년 수준 웃돌아" },
    { press: "한국경제", title: "코스피, 기관 순매수에 2,650선 재탈환 시도" },
    { press: "SBS", title: "추석 연휴 고속도로 통행료 면제 확정 발표" }
  ];

  let currentIndex = 0;

  setInterval(() => {
    currentIndex = (currentIndex + 1) % headlines.length;
    tickerElement.style.opacity = "0";
    tickerElement.style.transform = "translateY(-6px)";

    setTimeout(() => {
      tickerElement.innerHTML = `
        <span class="ticker-press">${headlines[currentIndex].press}</span> · 
        <span class="ticker-text">${headlines[currentIndex].title}</span>
      `;
      tickerElement.style.opacity = "1";
      tickerElement.style.transform = "translateY(0)";
    }, 200);
  }, 4000);
}

/* ==========================================================================
   6. Dark Mode / Light Mode Toggle
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  if (!themeToggleBtn) return;

  const savedTheme = localStorage.getItem("portal_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  themeToggleBtn.textContent = savedTheme === "dark" ? "☀️" : "🌙";

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("portal_theme", nextTheme);
    themeToggleBtn.textContent = nextTheme === "dark" ? "☀️" : "🌙";
  });
}

/* ==========================================================================
   7. Scroll to Top Button
   ========================================================================== */
function initScrollTop() {
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (!scrollTopBtn) return;

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY > 150) {
      scrollTopBtn.style.opacity = "1";
      scrollTopBtn.style.pointerEvents = "auto";
    } else {
      scrollTopBtn.style.opacity = "0.7";
    }
  });
}

/* ==========================================================================
   8. Profile Card Interactions
   ========================================================================== */
function initProfileInteractions() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", () => {
    const isLoggedOut = logoutBtn.getAttribute("data-logged-out") === "true";
    if (!isLoggedOut) {
      alert("로그아웃 되었습니다. (체험용 토글)");
      logoutBtn.setAttribute("data-logged-out", "true");
      logoutBtn.textContent = "로그인";
      document.querySelector(".user-nickname").textContent = "게스트";
      document.querySelector(".user-email-id").textContent = "로그인이 필요합니다";
    } else {
      logoutBtn.setAttribute("data-logged-out", "false");
      logoutBtn.textContent = "로그아웃 ⇥";
      document.querySelector(".user-nickname").textContent = "탕후루님";
      document.querySelector(".user-email-id").textContent = "bakal39@naver.com";
    }
  });
}
