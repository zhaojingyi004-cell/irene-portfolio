function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-lang]').forEach(el => {
    if (el.getAttribute('data-lang') === lang) {
      el.style.removeProperty('display');
    } else {
      el.style.display = 'none';
    }
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim() === (lang === 'en' ? 'EN' : '中'));
  });
  document.querySelectorAll('.js-lang-href').forEach(link => {
    const nextHref = link.getAttribute(`data-href-${lang}`);
    if (nextHref) link.setAttribute('href', nextHref);
  });
}

// init lang — hide zh on load
document.querySelectorAll('[data-lang="zh"]').forEach(el => el.style.display = 'none');
document.querySelectorAll('.js-lang-href').forEach(link => {
  const nextHref = link.getAttribute('data-href-en');
  if (nextHref) link.setAttribute('href', nextHref);
});



// ── CV DROPDOWN ──
function toggleCvDropdown(e) {
  e.stopPropagation();
  document.getElementById('cv-dropdown').classList.toggle('open');
}

document.addEventListener('click', () => {
  document.getElementById('cv-dropdown').classList.remove('open');
});

// ── FILTER CARDS ──
function filterCards(type, btn) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.exp-card').forEach(card => {
    if (type === 'all' || card.dataset.type === type) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

// ── DRAWER ──
function getGameLogicMapHtml(isEn) {
  return `
    <div class="game-logic-map">
      <div class="game-map-canvas">
        <div class="game-map-line l1"></div>
        <div class="game-map-line l2"></div>
        <div class="game-map-line l3"></div>
        <div class="game-map-line l4"></div>
        <div class="game-map-line l5"></div>
        <div class="game-map-line l6"></div>
        <div class="game-map-line l7"></div>
        <div class="game-map-line l8"></div>
        <div class="game-map-line l9"></div>
        <div class="game-map-line l10"></div>
        <div class="game-map-line l11"></div>
        <div class="game-map-line l12"></div>
        <div class="game-map-line l13"></div>
        <div class="game-map-line dashed" style="left:30px;top:255px;width:360px;transform:rotate(90deg);"></div>

        <div class="game-map-node setup">
          <strong>Game Setup</strong>
          <span>${isEn ? 'maze · state · assets' : '迷宫 · 状态 · 资源'}</span>
        </div>
        <div class="game-map-node small" style="left:70px;top:125px;">
          <strong>Maze Generation</strong>
          <span>${isEn ? 'walls · items · exit' : '墙体 · 道具 · 出口'}</span>
        </div>
        <div class="game-map-node small" style="left:345px;top:125px;">
          <strong>State Init</strong>
          <span>${isEn ? 'lives · steps · freeze' : '生命 · 步数 · 冻结'}</span>
        </div>
        <div class="game-map-node small" style="left:620px;top:125px;">
          <strong>Audio Load</strong>
          <span>${isEn ? 'collect · win · game over' : '收集 · 胜利 · 失败'}</span>
        </div>

        <div class="game-map-node player">
          <strong>Player Interaction</strong>
          <span>${isEn ? 'keyboard input · move request' : '键盘输入 · 移动请求'}</span>
        </div>
        <div class="game-map-node mechanics">
          <strong>Game Mechanics</strong>
          <span>${isEn ? 'items · lives · score · freeze timer' : '道具 · 生命 · 分数 · 冻结计时'}</span>
        </div>
        <div class="game-map-node enemy">
          <strong>Enemy Behaviour</strong>
          <span>${isEn ? 'reactive · turn-based · freeze-aware' : '响应式 · 回合制 · 可冻结'}</span>
        </div>

        <div class="game-map-node small wall">
          <strong>Wall Check</strong>
          <span>${isEn ? 'valid move?' : '移动是否合法'}</span>
        </div>
        <div class="game-map-node small" style="left:170px;top:300px;">
          <strong>Position Update</strong>
          <span>${isEn ? 'player grid state' : '玩家网格状态'}</span>
        </div>
        <div class="game-map-node small item">
          <strong>Item Collect</strong>
          <span>${isEn ? '+score · freeze trigger' : '+分数 · 冻结触发'}</span>
        </div>
        <div class="game-map-node small" style="left:465px;top:300px;border-color:#ffd05c;">
          <strong>Life Deduct</strong>
          <span>${isEn ? 'alien collision' : '碰撞惩罚'}</span>
        </div>
        <div class="game-map-node small move">
          <strong>Move Logic</strong>
          <span>${isEn ? 'pathfind / patrol' : '寻路 / 巡逻'}</span>
        </div>

        <div class="game-map-node state">
          <strong>State Management</strong>
          <span>${isEn ? 'playing · frozen · game-over · win' : '进行中 · 冻结 · 失败 · 胜利'}</span>
        </div>
        <div class="game-map-node win">
          <strong>Win</strong>
          <span>${isEn ? 'reach exit tile' : '到达出口'}</span>
        </div>
        <div class="game-map-node lose">
          <strong>Lose</strong>
          <span>${isEn ? 'lives = 0' : '生命耗尽'}</span>
        </div>
        <div class="game-map-node feedback">
          <strong>Feedback System</strong>
          <span>${isEn ? 'audio · visual · HUD · state triggers' : '音效 · 视觉 · HUD · 状态触发'}</span>
        </div>
        <div class="game-map-node small sfx">
          <strong>Collect SFX</strong>
          <span>${isEn ? 'item pickup' : '物品拾取'}</span>
        </div>
        <div class="game-map-node small" style="left:315px;top:570px;border-color:#ffd05c;">
          <strong>Win Sound</strong>
          <span>${isEn ? 'exit reached' : '到达出口'}</span>
        </div>
        <div class="game-map-node small" style="left:535px;top:570px;border-color:#ff6a72;">
          <strong>Game Over</strong>
          <span>${isEn ? 'lives exhausted' : '生命耗尽'}</span>
        </div>
        <div class="game-map-node small hud">
          <strong>HUD Update</strong>
          <span>${isEn ? 'lives · score · timer' : '生命 · 分数 · 计时'}</span>
        </div>
        <div class="game-map-legend">
          <span>${isEn ? 'solid = control flow' : '实线 = 控制流'}</span>
          <span>${isEn ? 'dashed = restart loop' : '虚线 = 重启循环'}</span>
        </div>
      </div>
    </div>
  `;
}

function openDrawer(id) {
  const data = drawerData[id];
  if (!data) return;
  const drawerEl = document.getElementById('drawer');
  drawerEl.classList.toggle('ev-dark', id === 'evcfd' || id === 'batterycooling');
  drawerEl.classList.toggle('dreamcore', id === 'gizmo');
  drawerEl.classList.toggle('circular-theme', id === 'circular');
  drawerEl.classList.toggle('maze-theme', id === 'maze');
  // Remove old particles if any
  drawerEl.querySelectorAll('.dreamcore-particles').forEach(el => el.remove());

  const lang = currentLang;
  const isEn = lang === 'en';

  const tagClass = data.type === 'internship' ? 'tag-internship' : 'tag-project';
  const tagLabel = isEn
    ? (data.type === 'internship' ? 'Internship' : 'Project')
    : (data.type === 'internship' ? '实习' : '项目');

  let mediaHtml = '';
  if (data.media === 'game') {
    mediaHtml = `<div class="drawer-media">
      <div class="drawer-media-placeholder">
        🎮 ${isEn ? 'Game embed coming soon — paste your deployed URL here' : '游戏嵌入即将上线'}
      </div>
    </div>`;
  } else if (data.media === 'video') {
    mediaHtml = `<div class="drawer-media">
      <div class="drawer-media-placeholder">
        🎬 ${isEn ? 'Video coming soon — replace with your video URL' : '视频即将上线'}
      </div>
    </div>`;
  } else if (data.media === 'none') {
    mediaHtml = '';
  } else if (data.media) {
    mediaHtml = `<div class="drawer-media">
      <img src="${data.media}" alt="${isEn ? data.titleEn : data.titleZh}" />
    </div>`;
  } else {
    mediaHtml = `<div class="drawer-media">
      <div class="drawer-media-placeholder">
        ${isEn ? '📁 Add images or media here' : '📁 在此添加图片或媒体'}
      </div>
    </div>`;
  }

  const bullets = isEn ? data.bulletsEn : data.bulletsZh;
  const bulletsHtml = bullets.length
    ? `<ul class="drawer-bullets">${bullets.map(b => `<li>${b}</li>`).join('')}</ul>`
    : '';

  const sections = isEn ? data.sectionsEn : data.sectionsZh;
  const sectionsHtml = sections?.length
    ? sections.map(section => {
        const sectionBullets = section.bullets?.length
          ? `<ul class="drawer-bullets">${section.bullets.map(b => `<li>${b}</li>`).join('')}</ul>`
          : '';
        const sectionPlaceholder = section.placeholder
          ? `<div class="drawer-section-placeholder">${section.placeholder}</div>`
          : '';
        const sectionLink = section.link
          ? `<a class="drawer-section-link" href="${section.link}" target="_blank" rel="noopener">${section.linkLabel}</a>`
          : '';
        const sectionImages = section.images?.length
          ? `<div class="drawer-image-grid">${section.images.map(src => `<img src="${src}" alt="${section.title}" />`).join('')}</div>`
          : '';
        const sectionFigma = section.figmaEmbed
          ? `<div class="drawer-figma-embed"><iframe src="${section.figmaEmbed}" allowfullscreen></iframe></div>`
          : '';
        const sectionGame = section.gameEmbed
          ? `<div class="drawer-game-embed"><iframe src="${section.gameEmbed}" title="${section.title}"></iframe></div>`
          : '';
        const sectionHtml = section.mapType === 'game'
          ? getGameLogicMapHtml(isEn)
          : (section.html || '');
        const sectionTitleHtml = section.title
          ? `<h3 class="drawer-section-title">${section.title}</h3>`
          : '';
        const sectionTextHtml = section.text
          ? `<p class="drawer-section-text">${section.text}</p>`
          : '';
        return `
          <div class="drawer-section">
            ${sectionTitleHtml}
            ${sectionTextHtml}
            ${sectionBullets}
            ${sectionHtml}
            ${sectionPlaceholder}
            ${sectionLink}
            ${sectionImages}
            ${sectionFigma}
            ${sectionGame}
          </div>
        `;
      }).join('')
    : '';

  const techList = (!isEn && data.techZh && data.techZh.length) ? data.techZh : data.tech;
  const techHtml = techList.length
    ? `<div class="drawer-tech">${techList.map(t => `<span class="drawer-tech-tag">${t}</span>`).join('')}</div>`
    : '';

  document.getElementById('drawer-content').innerHTML = `
    <span class="drawer-tag exp-card-tag ${tagClass}">${tagLabel}</span>
    <h2 class="drawer-title">${(isEn ? data.titleEn : data.titleZh).replace(/\n/g, '<br>')}</h2>
    <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:0.2rem;">${isEn ? data.roleEn : data.roleZh}</p>
    <p class="drawer-date">${data.date}</p>
    ${mediaHtml}
    <p class="drawer-desc">${isEn ? data.descEn : data.descZh}</p>
    ${sectionsHtml}
    ${bulletsHtml}
    ${techHtml}
    <button class="drawer-back-top" onclick="document.getElementById('drawer').scrollTo({top:0,behavior:'smooth'})">
      ↑ ${isEn ? 'Back to top' : '回到顶部'}
    </button>
  `;

  // Inject circular aviation elements
  if (id === 'circular') {
    drawerEl.querySelectorAll('.circular-flight-layer').forEach(el => el.remove());
    const flightLayer = document.createElement('div');
    flightLayer.className = 'circular-flight-layer';
    flightLayer.innerHTML = `
      <svg viewBox="0 0 900 90" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Route arc 1 -->
        <path d="M 0 70 Q 450 -20 900 70"
              fill="none" stroke="rgba(74,124,89,0.2)" stroke-width="1.5"
              class="circular-route-line"/>
        <!-- Route arc 2 (offset) -->
        <path d="M 0 85 Q 450 10 900 85"
              fill="none" stroke="rgba(74,124,89,0.12)" stroke-width="1"
              class="circular-route-line" style="animation-delay:-1s"/>
        <!-- Departure dot -->
        <circle cx="12" cy="70" r="4" fill="none" stroke="rgba(74,124,89,0.4)" stroke-width="1.5"/>
        <circle cx="12" cy="70" r="1.5" fill="rgba(74,124,89,0.6)"/>
        <!-- Arrival dot -->
        <circle cx="888" cy="70" r="4" fill="none" stroke="rgba(74,124,89,0.4)" stroke-width="1.5"/>
        <circle cx="888" cy="70" r="1.5" fill="rgba(74,124,89,0.6)"/>
        <!-- Altitude markers -->
        <text x="200" y="28" fill="rgba(74,124,89,0.3)" font-size="8" font-family="sans-serif" letter-spacing="0.08em">FL350</text>
        <text x="680" y="28" fill="rgba(74,124,89,0.3)" font-size="8" font-family="sans-serif" letter-spacing="0.08em">FL350</text>
      </svg>
      <span class="circular-plane">✈️</span>
      <span class="circular-cloud" style="--cdur:22s;--cdelay:0s;top:30px;--cy:-8px;font-size:22px;">☁️</span>
      <span class="circular-cloud" style="--cdur:30s;--cdelay:8s;top:55px;--cy:5px;font-size:14px;">☁️</span>
      <span class="circular-cloud" style="--cdur:25s;--cdelay:15s;top:20px;--cy:-4px;font-size:18px;">☁️</span>
    `;
    drawerEl.appendChild(flightLayer);

    // Insert banner
    const isEn = currentLang === 'en';
    const bannerMsg = isEn
      ? 'Short-haul aviation · Economy class · Circular recovery'
      : '短途航班 · 经济舱 · 循环回收系统';
    const banner = document.createElement('div');
    banner.style.cssText = 'display:flex;align-items:center;gap:1rem;padding:0.9rem 1.2rem;background:linear-gradient(135deg,#e8f4ee,#ddeee6);border:1px solid #c4d8c4;border-radius:12px;margin-bottom:1.8rem;font-size:0.82rem;color:#3a6645;font-weight:500;letter-spacing:0.02em;';
    banner.innerHTML = `<span style="font-size:1.4rem">✈️</span><span>${bannerMsg}</span>`;
    const drawerContent = document.getElementById('drawer-content');
    drawerContent.insertBefore(banner, drawerContent.firstChild);
  }

  // Inject dreamcore particles + banner
  if (id === 'gizmo') {
    const emojis = ['✦','♪','♫','✧','·','★','°','✿','♩','✦','♬'];
    const particles = document.createElement('div');
    particles.className = 'dreamcore-particles';
    emojis.forEach((e, i) => {
      const s = document.createElement('span');
      s.textContent = e;
      s.style.cssText = `left:${8 + Math.random()*84}%;bottom:${-5 + Math.random()*20}%;--dur:${6+Math.random()*8}s;--delay:${Math.random()*6}s;font-size:${10+Math.random()*10}px;`;
      particles.appendChild(s);
    });
    drawerEl.appendChild(particles);

    // Insert banner after drawer-tag
    const bannerMsg = isEn
      ? 'Shhh — it only dances when no one is watching…'
      : '嘘——只有没人看见的时候它才会跳舞……';
    const banner = document.createElement('div');
    banner.className = 'dreamcore-banner';
    banner.innerHTML = `<span class="dreamcore-char">🏠</span><span class="dreamcore-banner-text">${bannerMsg}</span>`;
    const drawerContent = document.getElementById('drawer-content');
    drawerContent.insertBefore(banner, drawerContent.firstChild);
  }

  drawerEl.classList.add('open');
  document.getElementById('drawer-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  const drawerEl = document.getElementById('drawer');
  drawerEl.classList.remove('open');
  drawerEl.classList.remove('ev-dark');
  drawerEl.classList.remove('dreamcore');
  drawerEl.classList.remove('circular-theme');
  drawerEl.classList.remove('maze-theme');
  drawerEl.querySelectorAll('.circular-flight-layer').forEach(el => el.remove());
  document.getElementById('drawer-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── TIMELINE JUMP ──
function jumpToExperience(id) {
  document.getElementById('experience').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => openDrawer(id), 600);
}

// ── SCROLL FADE IN ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ── KEYBOARD CLOSE ──
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeDrawer();
    closeFormModal();
  }
});

// ── CONTACT FORM ──
const contactForm = document.querySelector('.contact-form');
const formModalOverlay = document.getElementById('form-modal-overlay');
const formModalIcon = document.getElementById('form-modal-icon');
const formModalTitle = document.getElementById('form-modal-title');
const formModalText = document.getElementById('form-modal-text');

function showFormModal(type) {
  const isEn = currentLang === 'en';
  const isSuccess = type === 'success';
  formModalIcon.textContent = isSuccess ? '✓' : '!';
  formModalTitle.textContent = isSuccess
    ? (isEn ? 'Message sent' : '发送成功')
    : (isEn ? 'Message not sent' : '发送失败');
  formModalText.textContent = isSuccess
    ? (isEn ? 'Thank you for reaching out. I will get back to you soon.' : '谢谢你的留言，我会尽快回复。')
    : (isEn ? 'Something went wrong. Please try again or email me directly.' : '提交时出了点问题，请稍后再试，或直接发邮件给我。');
  formModalOverlay.classList.add('open');
}

function closeFormModal() {
  formModalOverlay.classList.remove('open');
}

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector('.btn-submit');
    const originalHtml = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.textContent = currentLang === 'en' ? 'Sending...' : '发送中...';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) throw new Error('Form submission failed');
      contactForm.reset();
      showFormModal('success');
    } catch (error) {
      showFormModal('error');
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalHtml;
      setLang(currentLang);
    }
  });
}

// ── HUMAN SECTION VIDEO PREVIEW ──
const humanSection = document.getElementById('human');
const humanVideos = document.querySelectorAll('#human .photo-card video');

function setHumanVideosPlaying(shouldPlay) {
  humanVideos.forEach(video => {
    if (shouldPlay) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}

if (humanSection && humanVideos.length) {
  const humanVideoObserver = new IntersectionObserver((entries) => {
    const isVisible = entries.some(entry => entry.isIntersecting);
    setHumanVideosPlaying(isVisible);
  }, { threshold: 0.35 });

  humanVideoObserver.observe(humanSection);
}
// ── HIGHLIGHT SECTION ──
const highlightData = [
  {
    tagEn: 'Award', tagZh: '荣誉',
    titleEn: 'DE1 Electronics Grand Prix · 1st Place',
    titleZh: 'DE1 电子学 Grand Prix · 冠军',
    descEn: 'Designed and programmed an ESP32-controlled electric racing car as part of Imperial\'s DE1 Electronics module. Competed against multiple teams in the Grand Prix finals and won 1st place.',
    descZh: '在帝国理工 DE1 电子模块中，设计并用 MicroPython 编程控制 ESP32 电动赛车，参加 Grand Prix 决赛并从多支队伍中赢得冠军。',
    meta: 'Imperial College London · 2024–2025',
    img: null, emoji: '🏎️'
  },
  {
    tagEn: 'Exhibition', tagZh: '展览',
    titleEn: 'Smart Pointe Shoe · Library Exhibition',
    titleZh: '智能足尖鞋 · 图书馆展览',
    descEn: 'Designed a pressure-sensitive pointe shoe for ballet dancers with plantar fasciitis, combining color-changing sensors with adjustable arch support. Selected for exhibition in the Imperial College Library.',
    descZh: '为患有足底筋膜炎的芭蕾舞者设计压感变色足尖鞋，结合可调节足弓支撑与传感系统，被选中在帝国理工图书馆展览。',
    meta: 'Imperial College London · 2024–2025',
    img: null, emoji: '🩰'
  }
];

let highlightCurrent = 0;

function highlightUpdateContent(index) {
  const d = highlightData[index];
  const isEn = currentLang === 'en';
  const content = document.getElementById('highlightContent');
  const total = highlightData.length;

  content.classList.add('transitioning');
  setTimeout(() => {
    document.getElementById('highlightCounter').textContent =
      String(index + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
    document.getElementById('highlightTag').textContent = isEn ? d.tagEn : d.tagZh;
    document.getElementById('highlightTitle').innerHTML =
      `<span data-lang="en"${isEn ? '' : ' style="display:none"'}>${d.titleEn}</span><span data-lang="zh"${isEn ? ' style="display:none"' : ''}>${d.titleZh}</span>`;
    document.getElementById('highlightDesc').innerHTML =
      `<span data-lang="en"${isEn ? '' : ' style="display:none"'}>${d.descEn}</span><span data-lang="zh"${isEn ? ' style="display:none"' : ''}>${d.descZh}</span>`;
    document.getElementById('highlightMeta').textContent = d.meta;
    document.querySelectorAll('.highlight-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    content.classList.remove('transitioning');
  }, 300);
}

function highlightUpdateStack(newIndex) {
  const cards = document.querySelectorAll('.highlight-card');
  const topCard = document.querySelector('.highlight-card[data-pos="0"]');
  if (!topCard) return;

  topCard.classList.add('animating-out');
  setTimeout(() => {
    topCard.classList.remove('animating-out');
    // Reassign positions: shift everyone up, put old top at bottom
    const posArr = Array.from(cards).map(c => parseInt(c.getAttribute('data-pos')));
    const maxPos = cards.length - 1;
    cards.forEach(card => {
      let pos = parseInt(card.getAttribute('data-pos'));
      if (pos === 0) {
        card.setAttribute('data-pos', maxPos);
      } else {
        card.setAttribute('data-pos', pos - 1);
      }
    });
  }, 440);
}

function highlightNext() {
  const next = (highlightCurrent + 1) % highlightData.length;
  highlightUpdateStack(next);
  highlightCurrent = next;
  highlightUpdateContent(next);
}

function highlightGoTo(index, e) {
  if (e) e.stopPropagation();
  if (index === highlightCurrent) return;
  const steps = (index - highlightCurrent + highlightData.length) % highlightData.length;
  let i = 0;
  const interval = setInterval(() => {
    highlightUpdateStack(highlightCurrent);
    highlightCurrent = (highlightCurrent + 1) % highlightData.length;
    i++;
    if (i >= steps) {
      clearInterval(interval);
      highlightUpdateContent(highlightCurrent);
    }
  }, 100);
}

// Scroll wheel support
const stackEl = document.getElementById('highlightStack');
if (stackEl) {
  let wheelCooldown = false;
  stackEl.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (wheelCooldown) return;
    wheelCooldown = true;
    highlightNext();
    setTimeout(() => { wheelCooldown = false; }, 700);
  }, { passive: false });
}

// Init highlight content on load
(function initHighlight() {
  const d = highlightData[0];
  const isEn = currentLang === 'en';
  document.getElementById('highlightCounter').textContent = '01 / 0' + highlightData.length;
  document.getElementById('highlightTag').textContent = isEn ? d.tagEn : d.tagZh;
  document.getElementById('highlightTitle').innerHTML =
    `<span data-lang="en">${d.titleEn}</span><span data-lang="zh" style="display:none">${d.titleZh}</span>`;
  document.getElementById('highlightDesc').innerHTML =
    `<span data-lang="en">${d.descEn}</span><span data-lang="zh" style="display:none">${d.descZh}</span>`;
  document.getElementById('highlightMeta').textContent = d.meta;
})();
