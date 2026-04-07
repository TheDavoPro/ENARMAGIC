/* ============================================
   ENARMAGIC — DASHBOARD MODULE
   Progress tracking, KPIs, specialty rings,
   upcoming sessions, pending simulators
   ============================================ */

(function() {
  'use strict';

  const STORAGE_KEY = 'enarmagic_v3';
  const TOTAL_TOPICS = 119;
  const TOTAL_SECTIONS = 119 * 5; // 5 sections per topic
  const SECTION_PTS = { resumenes: 10, videoclase: 15, kahoot: 20, simulador: 25, anki: 30 };
  const MAX_SCORE = 119 * 100; // 11900 pts total

  // ── Storage helpers ──────────────────────────────────────
  function getData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      topicsViewed:     {},   // { spId: [num, num, ...] }
      sectionsComplete: {},   // { spId: { topicNum: [section, ...] } }
      quizScores:       [],
      totalScore:       0,
      scoreLog:         [],
      streakDays:       0,
      lastVisit:        null,
    };
  }

  function saveData(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
  }

  // ── Streak management ────────────────────────────────────
  function refreshStreak() {
    const data   = getData();
    const today  = new Date().toDateString();
    const yest   = new Date(Date.now() - 86400000).toDateString();

    if (data.lastVisit === today) return data; // already counted

    if (data.lastVisit === yest) {
      data.streakDays = (data.streakDays || 0) + 1;
    } else if (!data.lastVisit) {
      data.streakDays = 1;
    } else {
      data.streakDays = 1; // streak broken
    }
    data.lastVisit = today;
    saveData(data);
    return data;
  }

  // ── Public API: track topic view ─────────────────────────
  window.trackTopicView = function(spId, topicNum) {
    const data = getData();
    if (!data.topicsViewed[spId]) data.topicsViewed[spId] = [];
    if (!data.topicsViewed[spId].includes(topicNum)) {
      data.topicsViewed[spId].push(topicNum);
    }
    saveData(data);
  };

  // ── Public API: track quiz result ────────────────────────
  window.trackQuizResult = function(spId, topicNum, section, score, total) {
    const data = getData();
    data.quizScores = data.quizScores || [];
    data.quizScores.push({ spId, topicNum, section, score, total, date: Date.now() });
    if (data.quizScores.length > 100) data.quizScores = data.quizScores.slice(-100);
    saveData(data);
  };

  // ── Public API: track section completion ──────────────────
  window.trackSectionComplete = function(spId, topicNum, section) {
    const data = getData();
    if (!data.sectionsComplete[spId]) data.sectionsComplete[spId] = {};
    const key = String(topicNum);
    if (!data.sectionsComplete[spId][key]) data.sectionsComplete[spId][key] = [];
    if (!data.sectionsComplete[spId][key].includes(section)) {
      data.sectionsComplete[spId][key].push(section);
      const pts = SECTION_PTS[section] || 10;
      data.totalScore = (data.totalScore || 0) + pts;
      data.scoreLog = data.scoreLog || [];
      data.scoreLog.push({ date: Date.now(), spId, topicNum, section, pts });
      // Keep topicsViewed in sync
      if (!data.topicsViewed[spId]) data.topicsViewed[spId] = [];
      if (!data.topicsViewed[spId].includes(topicNum)) data.topicsViewed[spId].push(topicNum);
      saveData(data);
    }
  };

  // ── Public API: get total score ───────────────────────────
  window.getTotalScore = function() {
    return getData().totalScore || 0;
  };

  // ── Public API: get score for ranking ────────────────────
  window.getRankingData = function() {
    const d = getData();
    return {
      totalScore:  d.totalScore || 0,
      maxScore:    MAX_SCORE,
      pct:         MAX_SCORE > 0 ? Math.round(((d.totalScore || 0) / MAX_SCORE) * 100) : 0,
      topicsViewed: d.topicsViewed || {},
      scoreLog:    (d.scoreLog || []).slice(-20),
    };
  };

  // ── Clock + greeting ─────────────────────────────────────
  function updateClock() {
    const now   = new Date();
    const hh    = String(now.getHours()).padStart(2, '0');
    const mm    = String(now.getMinutes()).padStart(2, '0');
    const clockEl = document.getElementById('db-clock');
    if (clockEl) clockEl.textContent = `${hh}:${mm}`;
  }

  function setGreeting() {
    const hour = new Date().getHours();
    const greet =
      hour < 12 ? 'Buenos días' :
      hour < 18 ? 'Buenas tardes' :
                  'Buenas noches';
    const el = document.getElementById('db-greeting-time');
    if (el) el.textContent = greet;
  }

  function setDate() {
    const el = document.getElementById('db-date');
    if (!el) return;
    const now = new Date();
    el.textContent = now.toLocaleDateString('es-MX', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  // ── KPI rendering ─────────────────────────────────────────
  function renderKPIs(data) {
    const totalViewed = Object.values(data.topicsViewed || {})
      .reduce((s, arr) => s + arr.length, 0);

    // Count total sections completed
    let totalSectionsDone = 0;
    Object.values(data.sectionsComplete || {}).forEach(topicMap => {
      Object.values(topicMap).forEach(arr => { totalSectionsDone += arr.length; });
    });
    const viewedPct = Math.round((totalSectionsDone / TOTAL_SECTIONS) * 100);
    const totalScore = data.totalScore || 0;
    const scorePct   = MAX_SCORE > 0 ? Math.round((totalScore / MAX_SCORE) * 100) : 0;

    const badgeEl = document.getElementById('kpi-viewed-badge');
    if (badgeEl) badgeEl.textContent = viewedPct + '% COMPLETADO';

    // Update score display if present
    const scoreEl = document.getElementById('kpi-score');
    if (scoreEl) scoreEl.textContent = totalScore.toLocaleString('es-MX');
    const scorePctEl = document.getElementById('kpi-score-pct');
    if (scorePctEl) scorePctEl.textContent = scorePct + '% del máximo (' + MAX_SCORE.toLocaleString('es-MX') + ' pts)';

    // Temas (static)
    animateValue('kpi-temas', 0, TOTAL_TOPICS, 800);

    // Racha
    const streak = data.streakDays || 0;
    animateValue('kpi-streak', 0, streak, 600);
    const streakSub = document.getElementById('kpi-streak-sub');
    if (streakSub) {
      if (streak === 0)       streakSub.textContent = 'Empieza hoy';
      else if (streak === 1)  streakSub.textContent = '¡Primer día!';
      else if (streak < 7)    streakSub.textContent = `${streak} días seguidos`;
      else                    streakSub.textContent = `🔥 ¡Racha de ${streak} días!`;
    }

    // Secciones completadas
    animateValue('kpi-viewed', 0, totalSectionsDone, 700);
    const viewedPctEl = document.getElementById('kpi-viewed-pct');
    if (viewedPctEl) viewedPctEl.textContent = `${viewedPct}% del total · ${totalScore} pts`;

    // Quiz promedio
    const scores = data.quizScores || [];
    const kpiQuiz    = document.getElementById('kpi-quiz');
    const kpiQuizSub = document.getElementById('kpi-quiz-count');
    if (kpiQuiz) {
      if (scores.length > 0) {
        const avg = Math.round(
          scores.reduce((s, q) => s + (q.score / q.total) * 100, 0) / scores.length
        );
        kpiQuiz.textContent = avg + '%';
        if (kpiQuizSub) {
          kpiQuizSub.textContent = `${scores.length} quiz${scores.length === 1 ? '' : 'zes'} completados`;
        }
      } else {
        kpiQuiz.textContent = '—';
        if (kpiQuizSub) kpiQuizSub.textContent = 'sin actividad aún';
      }
    }
  }

  // Smooth number animation
  function animateValue(id, from, to, duration) {
    const el = document.getElementById(id);
    if (!el || to === from) { if (el) el.textContent = to; return; }
    const start  = performance.now();
    const range  = to - from;
    function step(ts) {
      const progress = Math.min((ts - start) / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(from + range * ease);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ── Specialty progress rings ──────────────────────────────
  function renderSpecialtyProgress(data) {
    const container = document.getElementById('db-sp-progress');
    if (!container) return;

    const spIds = ['cirugia', 'pediatria', 'gineco', 'medicina'];
    const SPECIALTY_LABELS = {
      cirugia:   { label: 'Cirugía',         icon: '🔪', accent: '#f04438', total: 36 },
      pediatria: { label: 'Pediatría',        icon: '👶', accent: '#3b82f6', total: 28 },
      gineco:    { label: 'Ginecobstetricia', icon: '🌸', accent: '#e9558d', total: 20 },
      medicina:  { label: 'Medicina Interna', icon: '🩺', accent: '#0ec98d', total: 35 },
    };

    const circumference = 2 * Math.PI * 21;

    container.innerHTML = spIds.map(spId => {
      const cfg     = SPECIALTY_LABELS[spId];
      const viewed  = (data.topicsViewed[spId] || []).length;
      const total   = cfg.total;
      const pct     = total > 0 ? Math.round((viewed / total) * 100) : 0;
      const offset  = circumference * (1 - pct / 100);

      return `
        <div class="db-sp-item" onclick="showView('${spId}')" role="button" tabindex="0"
             onkeydown="if(event.key==='Enter'||event.key===' ')showView('${spId}')">
          <div class="db-sp-ring">
            <svg width="52" height="52" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="21"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                stroke-width="4.5"/>
              <circle cx="26" cy="26" r="21"
                fill="none"
                stroke="${cfg.accent}"
                stroke-width="4.5"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${circumference}"
                stroke-linecap="round"
                transform="rotate(-90 26 26)"
                class="db-ring-arc"
                data-offset="${offset}"
                style="transition: stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)"/>
            </svg>
            <div class="db-sp-ring-pct" style="color:${cfg.accent}">${pct}%</div>
          </div>
          <div class="db-sp-info">
            <div class="db-sp-name">${cfg.icon} ${cfg.label}</div>
            <div class="db-sp-count">${viewed} de ${total} temas revisados</div>
            <div class="db-sp-bar">
              <div class="db-sp-bar-fill"
                   style="width:0%;background:${cfg.accent}"
                   data-target="${pct}%"></div>
            </div>
          </div>
          <div class="db-sp-arrow">→</div>
        </div>
      `;
    }).join('');

    // Animate rings + bars after paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        container.querySelectorAll('.db-ring-arc').forEach(arc => {
          arc.style.strokeDashoffset = arc.dataset.offset;
        });
        container.querySelectorAll('.db-sp-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.target;
        });
      });
    });
  }

  // ── Next sessions (first unviewed per specialty) ──────────
  function renderNextSessions(data) {
    const container = document.getElementById('db-next-list');
    if (!container) return;

    const CONFIGS = {
      cirugia:   { label: 'Cirugía',         icon: '🔪', accent: '#f04438' },
      pediatria: { label: 'Pediatría',        icon: '👶', accent: '#3b82f6' },
      gineco:    { label: 'Ginecobstetricia', icon: '🌸', accent: '#e9558d' },
      medicina:  { label: 'Medicina Interna', icon: '🩺', accent: '#0ec98d' },
    };

    const suggestions = [];

    Object.entries(CONFIGS).forEach(([spId, cfg]) => {
      const topics  = (window.CURRICULUM_DATA || {})[spId] || [];
      const viewed  = data.topicsViewed[spId] || [];
      const next    = topics.find(t => !viewed.includes(t.num));
      if (next) suggestions.push({ spId, cfg, topic: next });
    });

    if (suggestions.length === 0) {
      container.innerHTML = `
        <div class="db-empty-mini">
          <span style="font-size:24px">🎉</span>
          <span>¡Has revisado todos los temas!</span>
        </div>`;
      return;
    }

    container.innerHTML = suggestions.slice(0, 4).map(({ spId, cfg, topic }) => {
      const name = typeof titleCase === 'function' ? titleCase(topic.name) : topic.name;
      return `
        <div class="db-next-item"
             onclick="showView('${spId}')"
             style="--item-accent:${cfg.accent}"
             role="button" tabindex="0"
             onkeydown="if(event.key==='Enter'||event.key===' ')showView('${spId}')">
          <div class="db-next-icon">${cfg.icon}</div>
          <div class="db-next-body">
            <div class="db-next-name">${name}</div>
            <div class="db-next-meta">${cfg.label} · Tema ${topic.num}</div>
          </div>
          <div class="db-next-arrow">→</div>
        </div>
      `;
    }).join('');
  }

  // ── Pending simulators ────────────────────────────────────
  function renderPendingSimulators(data) {
    const container = document.getElementById('db-sims');
    if (!container) return;

    const QUIZ_DATA_REF = window.QUIZ_DATA || {};
    const CONFIGS = {
      cirugia:   { label: 'Cirugía',         icon: '🔪', accent: '#f04438' },
      pediatria: { label: 'Pediatría',        icon: '👶', accent: '#3b82f6' },
      gineco:    { label: 'Ginecobstetricia', icon: '🌸', accent: '#e9558d' },
      medicina:  { label: 'Medicina Interna', icon: '🩺', accent: '#0ec98d' },
    };

    // Build set of well-completed quizzes (score >= 80%)
    const passed = new Set(
      (data.quizScores || [])
        .filter(q => (q.score / q.total) >= 0.8)
        .map(q => `${q.spId}_${q.section}_${q.topicNum}`)
    );

    const pending = [];

    Object.entries(CONFIGS).forEach(([spId, cfg]) => {
      const spData = QUIZ_DATA_REF[spId] || {};
      ['kahoot', 'simulador'].forEach(section => {
        const topics = Object.values(spData[section] || {})
          .sort((a, b) => a.num - b.num)
          .slice(0, 4);

        topics.forEach(t => {
          const key = `${spId}_${section}_${t.num}`;
          if (!passed.has(key)) {
            pending.push({ spId, cfg, topic: t, section });
          }
        });
      });
    });

    if (pending.length === 0) {
      container.innerHTML = `
        <div class="db-empty-mini">
          <span style="font-size:22px">🏆</span>
          <span>¡Completaste todos los simuladores disponibles!</span>
        </div>`;
      return;
    }

    // Show up to 6 pending items
    container.innerHTML = pending.slice(0, 6).map(({ spId, cfg, topic, section }) => {
      const name     = typeof titleCase === 'function' ? titleCase(topic.name) : topic.name;
      const icon     = section === 'kahoot' ? '🎯' : '📝';
      const secLabel = section === 'kahoot'  ? 'Kahoot' : 'Simulador';
      const qCount   = topic.questions ? topic.questions.length : 0;
      return `
        <div class="db-sim-card"
             onclick="showView('${spId}');setTimeout(()=>renderSpecialtySection('${spId}','${section}'),120)"
             role="button" tabindex="0"
             onkeydown="if(event.key==='Enter'||event.key===' '){showView('${spId}');setTimeout(()=>renderSpecialtySection('${spId}','${section}'),120)}">
          <div class="db-sim-icon" style="color:${cfg.accent}">${icon}</div>
          <div class="db-sim-body">
            <div class="db-sim-name">${name}</div>
            <div class="db-sim-meta">${cfg.label} · ${secLabel}${qCount > 0 ? ` · ${qCount} preguntas` : ''}</div>
          </div>
          <div class="db-sim-action"
               style="background:${cfg.accent}22;color:${cfg.accent};border-color:${cfg.accent}44">
            Iniciar
          </div>
        </div>
      `;
    }).join('');
  }

  // ── Specialty cards in dashboard grid ────────────────────
  function renderSpecialtyCards(data) {
    const TOTALS = { cirugia: 36, pediatria: 28, gineco: 20, medicina: 35 };
    Object.entries(TOTALS).forEach(function([spId, total]) {
      const viewed = (data.topicsViewed[spId] || []).length;
      const pct    = total > 0 ? Math.round((viewed / total) * 100) : 0;

      const countEl = document.getElementById('sp-count-' + spId);
      if (countEl) countEl.textContent = viewed + ' / ' + total + ' Temas';

      const barEl = document.getElementById('sp-bar-' + spId);
      if (barEl) {
        barEl.style.transition = 'width 1s cubic-bezier(0.4,0,0.2,1)';
        requestAnimationFrame(() => requestAnimationFrame(() => {
          barEl.style.width = pct + '%';
        }));
      }
    });
  }

  // ── Suggestion banner: pick first accessible unviewed topic ─
  function renderSuggestion(data) {
    const titleEl = document.getElementById('db-next-topic');
    const descEl  = document.getElementById('db-suggest-desc');
    const btnEl   = document.getElementById('db-suggest-btn');
    if (!titleEl) return;

    const spOrder  = ['cirugia', 'pediatria', 'gineco', 'medicina'];
    const spLabels = {
      cirugia:   'Cirugía',
      pediatria: 'Pediatría',
      gineco:    'Ginecobstetricia',
      medicina:  'Medicina Interna',
    };

    let foundSpId  = null;
    let foundTopic = null;

    for (const spId of spOrder) {
      const topics = (window.CURRICULUM_DATA || {})[spId] || [];
      const viewed = data.topicsViewed[spId] || [];

      for (const topic of topics) {
        if (typeof window.isTopicAccessible === 'function' &&
            !window.isTopicAccessible(spId, topic.num)) continue;
        if (viewed.includes(topic.num)) continue;
        foundSpId  = spId;
        foundTopic = topic;
        break;
      }
      if (foundTopic) break;
    }

    if (!foundTopic || !foundSpId) {
      // All accessible topics viewed
      titleEl.textContent = '¡Sigue repasando tu material!';
      if (descEl) descEl.textContent = 'Has completado todos los temas accesibles. ¡Excelente trabajo!';
      if (btnEl)  btnEl.setAttribute('onclick', "showView('cirugia')");
      return;
    }

    const name = (typeof titleCase === 'function')
      ? titleCase(foundTopic.name)
      : foundTopic.name;

    titleEl.textContent = name;
    if (descEl) descEl.textContent = spLabels[foundSpId] + ' · Tema ' + foundTopic.num;
    if (btnEl)  btnEl.setAttribute('onclick',
      "navigateToTopicResumenes('" + foundSpId + "'," + foundTopic.num + ")");
  }

  // ── Update streak chip in hero ────────────────────────────
  function renderStreakChip(data) {
    const streak = data.streakDays || 0;
    const el     = document.getElementById('kpi-streak-display');
    if (!el) return;
    if (streak === 0)      el.textContent = '0 DÍAS';
    else if (streak === 1) el.textContent = '1 DÍA';
    else                   el.textContent = streak + ' DÍAS';
  }

  // ── Update main progress ring ────────────────────────────
  function renderProgressRing(data) {
    let totalSections = 0;
    Object.values(data.sectionsComplete || {}).forEach(topicMap => {
      Object.values(topicMap).forEach(arr => { totalSections += arr.length; });
    });
    const TOTAL = 119 * 5;
    const pct   = Math.round((totalSections / TOTAL) * 100);
    const circum = 2 * Math.PI * 88; // r=88 as in HTML
    const offset = circum * (1 - pct / 100);

    const ring = document.getElementById('dashRingFill');
    if (ring) {
      ring.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        ring.style.strokeDashoffset = offset;
      }));
    }

    // Update ring center hint if there's any progress
    if (totalSections > 0) {
      const hint = document.querySelector('.stitch-ring-hint');
      if (hint) hint.textContent = pct + '% completado';
      const icon = document.querySelector('.stitch-ring-icon');
      if (icon) icon.textContent = 'emoji_events';
    }

    // kpi-quiz-count in the progress card
    const quizCount = (data.quizScores || []).length;
    const qEl = document.getElementById('kpi-quiz-count-db');
    if (qEl) qEl.textContent = quizCount;
  }

  // ── Main render function ──────────────────────────────────
  function renderDashboard() {
    const data = refreshStreak();

    setGreeting();
    setDate();
    updateClock();
    renderKPIs(data);
    renderSpecialtyProgress(data);
    renderNextSessions(data);
    renderPendingSimulators(data);
    renderSpecialtyCards(data);
    renderSuggestion(data);
    renderStreakChip(data);
    renderProgressRing(data);
  }

  // ── Patch showView to trigger dashboard refresh ───────────
  (function patchShowView() {
    const _orig = window.showView;
    if (typeof _orig !== 'function') return;
    window.showView = function(viewId) {
      _orig(viewId);
      if (viewId === 'dashboard') renderDashboard();
    };
  })();

  // ── Patch showResults to save quiz scores ─────────────────
  (function patchShowResults() {
    const _orig = window.showResults;
    if (typeof _orig !== 'function') return;
    window.showResults = function(stateKey) {
      _orig(stateKey);
      const state = window.quizState && window.quizState[stateKey];
      if (state) {
        window.trackQuizResult(
          state.spId,
          state.topicNum,
          state.section,
          state.score,
          state.questions.length
        );
      }
    };
  })();

  // Auto-tracking removed: progress updates only via "Lección aprendida" button

  // ── Live clock tick ───────────────────────────────────────
  setInterval(updateClock, 30000);

  // ── Boot ─────────────────────────────────────────────────
  // Wait for app.js to finish setting up CURRICULUM_DATA, then render
  function boot() {
    if (typeof window.CURRICULUM_DATA === 'undefined') {
      // Not ready yet, retry shortly
      setTimeout(boot, 50);
      return;
    }
    renderDashboard();

    // Patch showView after it's defined
    patchShowView();
  }

  // Expose for hot-reload via browser console
  window.renderDashboard = renderDashboard;

  // Also re-define patchShowView so boot can call it
  function patchShowView() {
    const _orig = window.showView;
    if (typeof _orig !== 'function' || _orig.__dbPatched) return;
    const patched = function(viewId) {
      _orig(viewId);
      if (viewId === 'dashboard') renderDashboard();
    };
    patched.__dbPatched = true;
    window.showView = patched;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
