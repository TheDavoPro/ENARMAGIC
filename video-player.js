/**
 * ENARMAGIC — Premium Video Player
 * Version: 2.0
 *
 * Features:
 *  - Custom controls (play/pause, seek, volume, speed, fullscreen, skip ±10s)
 *  - Auto-hide controls on playback, reveal on interaction
 *  - Keyboard shortcuts
 *  - States: loading / playing / paused / error / ended
 *  - Content protection: no right-click, no native controls, no download attr,
 *    watermark overlay with user identifier, video URL served via signed token
 *  - Responsive + mobile-friendly
 *
 * Usage (called from app.js showVideoTopic()):
 *   const player = new ENARPlayer(containerEl, videoUrl, options);
 *   player.destroy(); // cleanup
 */

class ENARPlayer {
  constructor(container, src, options = {}) {
    this.container = container;
    this.src       = src;
    this.opts = Object.assign({
      title:     '',
      label:     '',
      watermark: '',   // email or username for watermark text
      autoplay:  false,
      accent:    '#0EA5E9',
    }, options);

    this._hideTimer   = null;
    this._seeking     = false;
    this._volDragging = false;
    this._destroyed   = false;

    this._build();
    this._bindEvents();
  }

  // ─────────────────────────────────────────────
  // DOM construction
  // ─────────────────────────────────────────────
  _build() {
    this.root = document.createElement('div');
    this.root.className = 'enp-root';

    this.root.innerHTML = `
      <!-- Actual video element (no controls, no download) -->
      <video class="enp-video"
             playsinline
             preload="metadata"
             controlslist="nodownload nofullscreen"
             disablepictureinpicture
             disableremoteplayback>
      </video>

      <!-- Loading spinner -->
      <div class="enp-state enp-loading" style="display:none">
        <div class="enp-spinner"></div>
        <span>Cargando…</span>
      </div>

      <!-- Error state -->
      <div class="enp-state enp-error" style="display:none">
        <div class="enp-state-icon">⚠️</div>
        <span class="enp-error-msg">Error al cargar el video</span>
        <button class="enp-retry-btn">Reintentar</button>
      </div>

      <!-- Ended overlay -->
      <div class="enp-state enp-ended" style="display:none">
        <div class="enp-state-icon">✅</div>
        <span>Video completado</span>
        <button class="enp-replay-btn">Reproducir de nuevo</button>
      </div>

      <!-- Watermark -->
      <div class="enp-watermark" aria-hidden="true"></div>

      <!-- Skip feedback overlays -->
      <div class="enp-skip-hint enp-skip-back" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
        <span>−10s</span>
      </div>
      <div class="enp-skip-hint enp-skip-fwd" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/></svg>
        <span>+10s</span>
      </div>

      <!-- Controls bar -->
      <div class="enp-controls" role="toolbar" aria-label="Controles de video">

        <!-- Progress row -->
        <div class="enp-progress-row">
          <div class="enp-progress-bar" role="slider" aria-label="Progreso" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0">
            <div class="enp-progress-bg">
              <div class="enp-progress-buf"></div>
              <div class="enp-progress-fill"></div>
              <div class="enp-progress-thumb"></div>
            </div>
          </div>
        </div>

        <!-- Buttons row -->
        <div class="enp-btn-row">
          <!-- Left group -->
          <div class="enp-btn-group enp-btn-left">
            <button class="enp-btn enp-play-btn" aria-label="Reproducir / Pausar" title="Espacio">
              <svg class="enp-icon-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              <svg class="enp-icon-pause" viewBox="0 0 24 24" style="display:none"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            </button>
            <button class="enp-btn enp-skip-back-btn" aria-label="Retroceder 10 segundos" title="← o J">
              <svg viewBox="0 0 24 24"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" style="display:none"/><text x="3" y="17" font-size="8" font-weight="800" font-family="sans-serif" fill="currentColor">-10</text><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
            </button>
            <button class="enp-btn enp-skip-fwd-btn" aria-label="Adelantar 10 segundos" title="→ o L">
              <svg viewBox="0 0 24 24"><text x="3" y="17" font-size="8" font-weight="800" font-family="sans-serif" fill="currentColor">+10</text><path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/></svg>
            </button>
            <!-- Volume -->
            <div class="enp-volume-wrap">
              <button class="enp-btn enp-vol-btn" aria-label="Silenciar / Activar volumen" title="M">
                <svg class="enp-icon-vol" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                <svg class="enp-icon-mute" viewBox="0 0 24 24" style="display:none"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
              </button>
              <div class="enp-vol-slider-wrap">
                <div class="enp-vol-bar" role="slider" aria-label="Volumen" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100" tabindex="0">
                  <div class="enp-vol-bg">
                    <div class="enp-vol-fill"></div>
                    <div class="enp-vol-thumb"></div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Time -->
            <span class="enp-time"><span class="enp-cur">0:00</span> / <span class="enp-dur">0:00</span></span>
          </div>

          <!-- Right group -->
          <div class="enp-btn-group enp-btn-right">
            <!-- Speed -->
            <div class="enp-speed-wrap">
              <button class="enp-btn enp-speed-btn" aria-label="Velocidad de reproducción" title="Velocidad">
                <span class="enp-speed-label">1×</span>
              </button>
              <div class="enp-speed-menu" role="menu" aria-label="Velocidad">
                <button class="enp-speed-opt" data-speed="0.75" role="menuitem">0.75×</button>
                <button class="enp-speed-opt enp-speed-opt--active" data-speed="1" role="menuitem">1×</button>
                <button class="enp-speed-opt" data-speed="1.25" role="menuitem">1.25×</button>
                <button class="enp-speed-opt" data-speed="1.5" role="menuitem">1.5×</button>
                <button class="enp-speed-opt" data-speed="1.75" role="menuitem">1.75×</button>
                <button class="enp-speed-opt" data-speed="2" role="menuitem">2×</button>
              </div>
            </div>
            <!-- Fullscreen -->
            <button class="enp-btn enp-fs-btn" aria-label="Pantalla completa" title="F">
              <svg class="enp-icon-fs" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
              <svg class="enp-icon-exit-fs" viewBox="0 0 24 24" style="display:none"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;

    // Set accent color CSS var
    this.root.style.setProperty('--enp-accent', this.opts.accent);

    this.container.appendChild(this.root);

    // Cache element refs
    this.video      = this.root.querySelector('.enp-video');
    this.loading    = this.root.querySelector('.enp-loading');
    this.errorEl    = this.root.querySelector('.enp-error');
    this.errorMsg   = this.root.querySelector('.enp-error-msg');
    this.endedEl    = this.root.querySelector('.enp-ended');
    this.controls   = this.root.querySelector('.enp-controls');
    this.watermark  = this.root.querySelector('.enp-watermark');

    this.progressBar   = this.root.querySelector('.enp-progress-bar');
    this.progressFill  = this.root.querySelector('.enp-progress-fill');
    this.progressBuf   = this.root.querySelector('.enp-progress-buf');
    this.progressThumb = this.root.querySelector('.enp-progress-thumb');

    this.playBtn    = this.root.querySelector('.enp-play-btn');
    this.iconPlay   = this.root.querySelector('.enp-icon-play');
    this.iconPause  = this.root.querySelector('.enp-icon-pause');

    this.skipBackBtn = this.root.querySelector('.enp-skip-back-btn');
    this.skipFwdBtn  = this.root.querySelector('.enp-skip-fwd-btn');
    this.skipBackHint = this.root.querySelector('.enp-skip-back');
    this.skipFwdHint  = this.root.querySelector('.enp-skip-fwd');

    this.volBtn     = this.root.querySelector('.enp-vol-btn');
    this.iconVol    = this.root.querySelector('.enp-icon-vol');
    this.iconMute   = this.root.querySelector('.enp-icon-mute');
    this.volBar     = this.root.querySelector('.enp-vol-bar');
    this.volFill    = this.root.querySelector('.enp-vol-fill');
    this.volThumb   = this.root.querySelector('.enp-vol-thumb');

    this.timeCur    = this.root.querySelector('.enp-cur');
    this.timeDur    = this.root.querySelector('.enp-dur');

    this.speedBtn   = this.root.querySelector('.enp-speed-btn');
    this.speedLabel = this.root.querySelector('.enp-speed-label');
    this.speedMenu  = this.root.querySelector('.enp-speed-menu');

    this.fsBtn      = this.root.querySelector('.enp-fs-btn');
    this.iconFs     = this.root.querySelector('.enp-icon-fs');
    this.iconExitFs = this.root.querySelector('.enp-icon-exit-fs');

    this.retryBtn  = this.root.querySelector('.enp-retry-btn');
    this.replayBtn = this.root.querySelector('.enp-replay-btn');

    // Watermark
    if (this.opts.watermark) {
      this.watermark.textContent = this.opts.watermark;
    }

    // Load source
    this._loadSrc(this.src);
  }

  _loadSrc(src) {
    this._showState('loading');
    this.video.src = src;
    this.video.load();
  }

  // ─────────────────────────────────────────────
  // Event binding
  // ─────────────────────────────────────────────
  _bindEvents() {
    const v = this.video;

    // ── Video element events ──
    v.addEventListener('loadedmetadata', () => {
      this._hideState();
      this._updateDuration();
    });
    v.addEventListener('waiting',  () => this._showState('loading'));
    v.addEventListener('canplay',  () => this._hideState());
    v.addEventListener('playing',  () => { this._hideState(); this._updatePlayIcon(true); this._scheduleHide(); });
    v.addEventListener('pause',    () => { this._updatePlayIcon(false); this._revealControls(); });
    v.addEventListener('ended',    () => { this._showState('ended'); this._updatePlayIcon(false); });
    v.addEventListener('error',    () => this._onError());
    v.addEventListener('timeupdate', () => this._onTimeUpdate());
    v.addEventListener('progress',   () => this._onProgress());
    v.addEventListener('volumechange', () => this._onVolumeChange());

    // ── Click on video area → play/pause + show/hide controls ──
    this.root.addEventListener('click', (e) => {
      // Don't intercept control buttons
      if (e.target.closest('.enp-controls')) return;
      if (e.target.closest('.enp-state'))    return;
      this._togglePlay();
      this._revealControls();
    });

    // ── Double-click on sides → skip ──
    this.root.addEventListener('dblclick', (e) => {
      if (e.target.closest('.enp-controls')) return;
      const rect = this.root.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      if (x < rect.width * 0.4) this._skip(-10);
      else                       this._skip(10);
    });

    // ── Mouse move → reveal controls ──
    this.root.addEventListener('mousemove', () => this._revealControls());

    // ── Controls hover → keep visible ──
    this.controls.addEventListener('mouseenter', () => {
      clearTimeout(this._hideTimer);
      this.controls.classList.add('enp-controls--visible');
    });
    this.controls.addEventListener('mouseleave', () => {
      if (!v.paused) this._scheduleHide();
    });

    // ── Prevent right-click context menu on video ──
    v.addEventListener('contextmenu', e => e.preventDefault());
    this.root.addEventListener('contextmenu', e => e.preventDefault());

    // ── Play button ──
    this.playBtn.addEventListener('click', () => this._togglePlay());

    // ── Skip buttons ──
    this.skipBackBtn.addEventListener('click', () => this._skip(-10));
    this.skipFwdBtn.addEventListener('click',  () => this._skip(10));

    // ── Volume button ──
    this.volBtn.addEventListener('click', () => this._toggleMute());

    // ── Volume slider (mouse + touch) ──
    this._bindSlider(this.volBar, (ratio) => {
      v.volume = Math.max(0, Math.min(1, ratio));
      v.muted  = false;
      this._updateVolume();
    });

    // ── Progress bar (mouse + touch) ──
    this._bindSlider(this.progressBar, (ratio) => {
      if (v.duration && isFinite(v.duration)) {
        v.currentTime = ratio * v.duration;
      }
    });

    // ── Speed menu ──
    this.speedBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = this.speedMenu.classList.toggle('enp-speed-menu--open');
      this.speedBtn.setAttribute('aria-expanded', open);
    });
    this.speedMenu.querySelectorAll('.enp-speed-opt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const spd = parseFloat(btn.dataset.speed);
        this._setSpeed(spd);
        this.speedMenu.classList.remove('enp-speed-menu--open');
      });
    });
    document.addEventListener('click', () => this.speedMenu.classList.remove('enp-speed-menu--open'));

    // ── Fullscreen ──
    this.fsBtn.addEventListener('click', () => this._toggleFullscreen());
    document.addEventListener('fullscreenchange', () => this._onFullscreenChange());
    document.addEventListener('webkitfullscreenchange', () => this._onFullscreenChange());

    // ── Retry / Replay ──
    this.retryBtn.addEventListener('click',  () => this._loadSrc(this.src));
    this.replayBtn.addEventListener('click', () => { v.currentTime = 0; v.play(); });

    // ── Keyboard shortcuts ──
    this._keyHandler = (e) => {
      // Only handle if player is focused or in fullscreen
      if (!this.root.contains(document.activeElement) && !this._isFullscreen()) return;
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          this._togglePlay();
          this._revealControls();
          break;
        case 'ArrowLeft':
        case 'j':
          e.preventDefault();
          this._skip(-10);
          break;
        case 'ArrowRight':
        case 'l':
          e.preventDefault();
          this._skip(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          v.volume = Math.min(1, v.volume + 0.1);
          this._updateVolume();
          break;
        case 'ArrowDown':
          e.preventDefault();
          v.volume = Math.max(0, v.volume - 0.1);
          this._updateVolume();
          break;
        case 'm':
          e.preventDefault();
          this._toggleMute();
          break;
        case 'f':
          e.preventDefault();
          this._toggleFullscreen();
          break;
      }
    };
    document.addEventListener('keydown', this._keyHandler);

    // Make root focusable for keyboard
    this.root.setAttribute('tabindex', '0');
    this.root.addEventListener('focus', () => {}, { passive: true });
  }

  // ─────────────────────────────────────────────
  // Slider helper (works for both mouse + touch)
  // ─────────────────────────────────────────────
  _bindSlider(el, callback) {
    let active = false;
    const getR = (e) => {
      const rect = el.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    };
    const start = (e) => {
      e.preventDefault();
      active = true;
      callback(getR(e));
    };
    const move = (e) => {
      if (!active) return;
      e.preventDefault();
      callback(getR(e));
    };
    const end = () => { active = false; };
    el.addEventListener('mousedown',  start);
    el.addEventListener('touchstart', start, { passive: false });
    document.addEventListener('mousemove', move);
    document.addEventListener('touchmove', move, { passive: false });
    document.addEventListener('mouseup',  end);
    document.addEventListener('touchend', end);
    // Click on bar itself
    el.addEventListener('click', (e) => callback(getR(e)));
    // Keyboard support
    el.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); callback(Math.min(1, this._getRatio(el) + 0.05)); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); callback(Math.max(0, this._getRatio(el) - 0.05)); }
    });
  }

  _getRatio(el) {
    // Get current fill ratio from style
    const fill = el.querySelector('[class*="-fill"]');
    return fill ? parseFloat(fill.style.width) / 100 || 0 : 0;
  }

  // ─────────────────────────────────────────────
  // State helpers
  // ─────────────────────────────────────────────
  _showState(state) {
    this.loading.style.display = state === 'loading' ? 'flex' : 'none';
    this.errorEl.style.display = state === 'error'   ? 'flex' : 'none';
    this.endedEl.style.display = state === 'ended'   ? 'flex' : 'none';
  }
  _hideState() {
    this.loading.style.display = 'none';
    this.errorEl.style.display = 'none';
    this.endedEl.style.display = 'none';
  }
  _onError() {
    this.errorMsg.textContent = 'Error al cargar el video. Verifica tu conexión e inicia sesión nuevamente.';
    this._showState('error');
  }

  // ─────────────────────────────────────────────
  // Controls visibility
  // ─────────────────────────────────────────────
  _revealControls() {
    this.controls.classList.add('enp-controls--visible');
    clearTimeout(this._hideTimer);
    if (!this.video.paused && !this.video.ended) this._scheduleHide();
  }
  _scheduleHide() {
    clearTimeout(this._hideTimer);
    this._hideTimer = setTimeout(() => {
      if (!this.video.paused) {
        this.controls.classList.remove('enp-controls--visible');
      }
    }, 3000);
  }

  // ─────────────────────────────────────────────
  // Playback helpers
  // ─────────────────────────────────────────────
  _togglePlay() {
    if (this.video.paused || this.video.ended) {
      this.video.play().catch(() => {});
    } else {
      this.video.pause();
    }
  }
  _updatePlayIcon(playing) {
    this.iconPlay.style.display  = playing ? 'none' : '';
    this.iconPause.style.display = playing ? '' : 'none';
  }
  _skip(secs) {
    const v = this.video;
    if (!v.duration) return;
    v.currentTime = Math.max(0, Math.min(v.duration, v.currentTime + secs));
    this._flashSkipHint(secs < 0 ? this.skipBackHint : this.skipFwdHint);
    this._revealControls();
  }
  _flashSkipHint(el) {
    el.classList.remove('enp-skip-hint--show');
    void el.offsetWidth; // reflow
    el.classList.add('enp-skip-hint--show');
    setTimeout(() => el.classList.remove('enp-skip-hint--show'), 700);
  }

  // ─────────────────────────────────────────────
  // Time / progress
  // ─────────────────────────────────────────────
  _onTimeUpdate() {
    const v = this.video;
    if (!v.duration || !isFinite(v.duration)) return;
    const pct = (v.currentTime / v.duration) * 100;
    this.progressFill.style.width = pct + '%';
    this.progressThumb.style.left = pct + '%';
    this.progressBar.setAttribute('aria-valuenow', Math.round(pct));
    this.timeCur.textContent = this._fmtTime(v.currentTime);
  }
  _onProgress() {
    const v = this.video;
    if (!v.duration) return;
    try {
      const buf = v.buffered;
      if (buf.length > 0) {
        const pct = (buf.end(buf.length - 1) / v.duration) * 100;
        this.progressBuf.style.width = pct + '%';
      }
    } catch(e) {}
  }
  _updateDuration() {
    const d = this.video.duration;
    this.timeDur.textContent = isFinite(d) ? this._fmtTime(d) : '--:--';
  }
  _fmtTime(sec) {
    if (!isFinite(sec) || isNaN(sec)) return '0:00';
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    return `${m}:${String(s).padStart(2,'0')}`;
  }

  // ─────────────────────────────────────────────
  // Volume
  // ─────────────────────────────────────────────
  _toggleMute() {
    this.video.muted = !this.video.muted;
    this._updateVolume();
  }
  _onVolumeChange() { this._updateVolume(); }
  _updateVolume() {
    const muted = this.video.muted || this.video.volume === 0;
    const vol   = muted ? 0 : this.video.volume;
    const pct   = vol * 100;
    this.volFill.style.width  = pct + '%';
    this.volThumb.style.left  = pct + '%';
    this.volBar.setAttribute('aria-valuenow', Math.round(pct));
    this.iconVol.style.display  = muted ? 'none' : '';
    this.iconMute.style.display = muted ? '' : 'none';
  }

  // ─────────────────────────────────────────────
  // Speed
  // ─────────────────────────────────────────────
  _setSpeed(spd) {
    this.video.playbackRate = spd;
    this.speedLabel.textContent = spd === 1 ? '1×' : spd + '×';
    this.speedMenu.querySelectorAll('.enp-speed-opt').forEach(b => {
      b.classList.toggle('enp-speed-opt--active', parseFloat(b.dataset.speed) === spd);
    });
  }

  // ─────────────────────────────────────────────
  // Fullscreen
  // ─────────────────────────────────────────────
  _toggleFullscreen() {
    if (this._isFullscreen()) {
      (document.exitFullscreen || document.webkitExitFullscreen || (() => {})).call(document);
    } else {
      const el = this.root;
      (el.requestFullscreen || el.webkitRequestFullscreen || (() => {})).call(el);
    }
  }
  _isFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  }
  _onFullscreenChange() {
    const fs = this._isFullscreen();
    this.root.classList.toggle('enp-fullscreen', fs);
    this.iconFs.style.display     = fs ? 'none' : '';
    this.iconExitFs.style.display = fs ? '' : 'none';
  }

  // ─────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────
  setSrc(src) {
    this.src = src;
    this._loadSrc(src);
  }
  play()  { return this.video.play(); }
  pause() { this.video.pause(); }

  destroy() {
    this._destroyed = true;
    clearTimeout(this._hideTimer);
    if (this._keyHandler) document.removeEventListener('keydown', this._keyHandler);
    this.pause();
    this.video.src = '';
    this.root.remove();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ENARPlayer factory helpers used from app.js
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch a signed video token from the server and return a blob URL.
 * Falls back to original path if token API not available.
 * @param {string} videoPath - the raw video file path
 * @returns {Promise<string>} resolved URL to pass to ENARPlayer
 */
async function getSecureVideoUrl(videoPath) {
  try {
    const resp = await fetch('/api/video-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ path: videoPath })
    });
    if (!resp.ok) throw new Error('token_error');
    const { token } = await resp.json();
    return `/api/video-stream?token=${encodeURIComponent(token)}`;
  } catch(e) {
    // Fallback: URL-encode and use direct path (still protected by requireAuthStatic middleware)
    console.warn('[ENARPlayer] Token API unavailable, using direct path');
    return videoPath.split('/').map(seg => encodeURIComponent(seg)).join('/');
  }
}
