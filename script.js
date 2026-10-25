/* ==========================================================================
   VINAY'S 20TH BIRTHDAY CELEBRATION - CORE JAVASCRIPT ENGINE
   Canvas 3D Particles, Web Audio Synthesizer, Confetti & Interactive Features
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCursorFollower();
  initAmbientCanvas();
  initFireworksCanvas();
  initAudioEngine();
  initChronometer();
  initMultiverseParallax();
  initCakeCeremony();
  initSoundboard();
  initWishesWall();
  initGateway();
  initHudControls();
});

/* ==========================================================================
   1. CUSTOM SPARKLE CURSOR
   ========================================================================== */
function initCursorFollower() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(renderRing);
  }
  requestAnimationFrame(renderRing);

  // Hover effect over interactive elements
  const hoverables = document.querySelectorAll('button, a, .persona-card, .sound-pad, input, textarea');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '54px';
      ring.style.height = '54px';
      ring.style.borderColor = '#ffd700';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '32px';
      ring.style.height = '32px';
      ring.style.borderColor = 'rgba(255, 215, 0, 0.6)';
    });
  });
}

/* ==========================================================================
   2. AMBIENT 3D STARFIELD & CYBER PARTICLES CANVAS
   ========================================================================== */
let ambientSpeedMultiplier = 1;
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = 140;
  const particles = [];
  const colors = ['#ffd700', '#ffb703', '#a855f7', '#c084fc', '#00f2fe', '#ffffff'];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.8,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5 - 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.7 + 0.3,
      pulse: Math.random() * 0.05 + 0.01,
      angle: Math.random() * Math.PI * 2
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let p of particles) {
      p.x += p.speedX * ambientSpeedMultiplier;
      p.y += p.speedY * ambientSpeedMultiplier;
      p.angle += p.pulse;
      const currentAlpha = Math.abs(Math.sin(p.angle)) * p.alpha;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = currentAlpha;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   3. FIREWORKS & CONFETTI PHYSICS ENGINE
   ========================================================================== */
let triggerFireworkBurst;
function initFireworksCanvas() {
  const canvas = document.getElementById('fireworks-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const palette = ['#ffd700', '#ff9100', '#ff0055', '#7928ca', '#00f2fe', '#fff', '#22c55e'];

  class Particle {
    constructor(x, y, color, isConfetti = false) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.isConfetti = isConfetti;
      const angle = Math.random() * Math.PI * 2;
      const speed = isConfetti ? Math.random() * 12 + 6 : Math.random() * 8 + 3;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - (isConfetti ? 4 : 0);
      this.alpha = 1;
      this.decay = Math.random() * 0.015 + 0.012;
      this.gravity = isConfetti ? 0.25 : 0.12;
      this.drag = 0.96;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.2;
      this.width = isConfetti ? Math.random() * 8 + 6 : Math.random() * 3 + 2;
      this.height = isConfetti ? Math.random() * 12 + 6 : this.width;
    }

    update() {
      this.vx *= this.drag;
      this.vy = this.vy * this.drag + this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotSpeed;
      this.alpha -= this.decay;
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = this.isConfetti ? 0 : 8;
      ctx.shadowColor = this.color;

      if (this.isConfetti) {
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function spawnBurst(x, y, count = 80, isConfetti = false) {
    for (let i = 0; i < count; i++) {
      const color = palette[Math.floor(Math.random() * palette.length)];
      particles.push(new Particle(x, y, color, isConfetti));
    }
  }

  triggerFireworkBurst = (x, y, count, isConfetti) => {
    spawnBurst(x || width / 2, y || height * 0.4, count, isConfetti);
  };

  // Click anywhere to burst fireworks (except clicking inputs)
  window.addEventListener('click', (e) => {
    if (e.target.closest('input, textarea, button, a')) return;
    spawnBurst(e.clientX, e.clientY, 60, false);
    if (window.soundFX) window.soundFX.pop();
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);
      if (p.alpha <= 0) {
        particles.splice(i, 1);
      }
    }
    requestAnimationFrame(render);
  }
  render();
}

/* ==========================================================================
   4. WEB AUDIO API SYNTHESIZER ENGINE (ZERO EXTERNAL DEPENDENCY)
   ========================================================================== */
let audioEngine = {
  ctx: null,
  isPlaying: false,
  isMuted: false,
  timerId: null
};

function initAudioEngine() {
  const musicToggle = document.getElementById('music-toggle');
  
  function getAudioContext() {
    if (!audioEngine.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioEngine.ctx = new AudioCtx();
    }
    if (audioEngine.ctx.state === 'suspended') {
      audioEngine.ctx.resume();
    }
    return audioEngine.ctx;
  }

  // Synthesized Sound Effects
  window.soundFX = {
    // 1. Party Horn
    horn: () => {
      const actx = getAudioContext();
      if (!actx || audioEngine.isMuted) return;
      const now = actx.currentTime;
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.4);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    },

    // 2. Champagne Cork Pop
    pop: () => {
      const actx = getAudioContext();
      if (!actx || audioEngine.isMuted) return;
      const now = actx.currentTime;
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    },

    // 3. 8-Bit Level Up Fanfare
    levelUp: () => {
      const actx = getAudioContext();
      if (!actx || audioEngine.isMuted) return;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, i) => {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        const start = actx.currentTime + i * 0.09;
        osc.type = 'square';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.12);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start(start);
        osc.stop(start + 0.12);
      });
    },

    // 4. Cheering Crowd Noise
    cheer: () => {
      const actx = getAudioContext();
      if (!actx || audioEngine.isMuted) return;
      const bufferSize = actx.sampleRate * 1.5;
      const buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = actx.createBufferSource();
      noise.buffer = buffer;
      const filter = actx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, actx.currentTime);
      filter.Q.value = 1.2;

      const gain = actx.createGain();
      gain.gain.setValueAtTime(0.01, actx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, actx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 1.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(actx.destination);
      noise.start();
    },

    // 5. Candle Blow Wind Puff
    blow: () => {
      const actx = getAudioContext();
      if (!actx || audioEngine.isMuted) return;
      const bufferSize = actx.sampleRate * 0.7;
      const buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = actx.createBufferSource();
      noise.buffer = buffer;
      const filter = actx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, actx.currentTime);
      const gain = actx.createGain();
      gain.gain.setValueAtTime(0.3, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 0.65);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(actx.destination);
      noise.start();
    },

    // 6. Laser Zap
    laser: () => {
      const actx = getAudioContext();
      if (!actx || audioEngine.isMuted) return;
      const now = actx.currentTime;
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  };

  // Continuous Procedural Upbeat Synthwave Celebration BGM
  // Happy Birthday Melodic Theme with Funky Bass & Sparkling Chords
  const notesMap = {
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00
  };

  const melodyScore = [
    { n: 'G4', d: 0.25 }, { n: 'G4', d: 0.25 }, { n: 'A4', d: 0.5 }, { n: 'G4', d: 0.5 }, { n: 'C5', d: 0.5 }, { n: 'B4', d: 0.9 },
    { n: 'G4', d: 0.25 }, { n: 'G4', d: 0.25 }, { n: 'A4', d: 0.5 }, { n: 'G4', d: 0.5 }, { n: 'D5', d: 0.5 }, { n: 'C5', d: 0.9 },
    { n: 'G4', d: 0.25 }, { n: 'G4', d: 0.25 }, { n: 'G5', d: 0.5 }, { n: 'E5', d: 0.5 }, { n: 'C5', d: 0.5 }, { n: 'B4', d: 0.5 }, { n: 'A4', d: 0.8 },
    { n: 'F5', d: 0.25 }, { n: 'F5', d: 0.25 }, { n: 'E5', d: 0.5 }, { n: 'C5', d: 0.5 }, { n: 'D5', d: 0.5 }, { n: 'C5', d: 1.2 }
  ];

  let noteIdx = 0;
  function playNextMelodyNote() {
    if (!audioEngine.isPlaying || audioEngine.isMuted) return;
    const actx = getAudioContext();
    const item = melodyScore[noteIdx];
    const freq = notesMap[item.n];

    const now = actx.currentTime;
    const osc = actx.createOscillator();
    const gain = actx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Warm soft synth envelope
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + item.d * 0.9);

    // Filter
    const filter = actx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1600;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(actx.destination);

    osc.start(now);
    osc.stop(now + item.d);

    // Play subtle sub-bass note
    if (noteIdx % 3 === 0) {
      const bassOsc = actx.createOscillator();
      const bassGain = actx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(freq / 4, now);
      bassGain.gain.setValueAtTime(0.06, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + item.d * 1.2);
      bassOsc.connect(bassGain);
      bassGain.connect(actx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + item.d * 1.2);
    }

    noteIdx = (noteIdx + 1) % melodyScore.length;
    audioEngine.timerId = setTimeout(playNextMelodyNote, item.d * 1000 + 40);
  }

  function startBGM() {
    if (audioEngine.isPlaying) return;
    audioEngine.isPlaying = true;
    noteIdx = 0;
    playNextMelodyNote();
    if (musicToggle) {
      musicToggle.classList.remove('music-paused');
      musicToggle.querySelector('.btn-text').textContent = 'AUDIO: ON';
    }
  }

  function stopBGM() {
    audioEngine.isPlaying = false;
    clearTimeout(audioEngine.timerId);
    if (musicToggle) {
      musicToggle.classList.add('music-paused');
      musicToggle.querySelector('.btn-text').textContent = 'AUDIO: OFF';
    }
  }

  window.startBirthdayMusic = startBGM;
  window.stopBirthdayMusic = stopBGM;

  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      if (audioEngine.isPlaying) {
        stopBGM();
      } else {
        startBGM();
      }
    });
  }
}

/* ==========================================================================
   5. REAL-TIME 20-YEAR CHRONOMETER (DOB: 25 OCT 2006)
   ========================================================================== */
function initChronometer() {
  const dob = new Date('2006-10-25T00:00:00');

  function update() {
    const now = new Date();
    const diffMs = now - dob;

    // Precise Units
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalMonths = Math.floor(totalDays / 30.4375);
    const years = Math.floor(totalDays / 365.25);

    const yearsEl = document.getElementById('stat-years');
    const monthsEl = document.getElementById('stat-months');
    const daysEl = document.getElementById('stat-days');
    const hoursEl = document.getElementById('stat-hours');
    const minsEl = document.getElementById('stat-mins');
    const secsEl = document.getElementById('stat-secs');

    if (yearsEl) yearsEl.textContent = years;
    if (monthsEl) monthsEl.textContent = totalMonths.toLocaleString();
    if (daysEl) daysEl.textContent = totalDays.toLocaleString();
    if (hoursEl) hoursEl.textContent = totalHours.toLocaleString();
    if (minsEl) minsEl.textContent = totalMinutes.toLocaleString();
    if (secsEl) secsEl.textContent = totalSeconds.toLocaleString();
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   6. THE MULTIVERSE GALLERY & 3D PARALLAX TILT
   ========================================================================== */
function initMultiverseParallax() {
  const cards = document.querySelectorAll('.persona-card');
  const modal = document.getElementById('modal-viewer');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalClose = document.getElementById('modal-close');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
    });

    // Click to open modal
    card.addEventListener('click', () => {
      const img = card.querySelector('.persona-img');
      const title = card.querySelector('.persona-title');
      const tagline = card.querySelector('.persona-tagline');
      const quote = card.querySelector('.persona-quote');

      if (modal && img && modalImg) {
        modalImg.src = img.src;
        if (modalTitle) modalTitle.textContent = title ? title.textContent : 'Vinay Chapter 20';
        if (modalDesc) {
          modalDesc.innerHTML = `<strong>${tagline ? tagline.textContent : ''}</strong><br><br>${quote ? quote.textContent : ''}`;
        }
        modal.classList.add('active');
        if (window.soundFX) window.soundFX.pop();
        if (triggerFireworkBurst) triggerFireworkBurst(window.innerWidth / 2, window.innerHeight * 0.35, 40, false);
      }
    });
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
}

/* ==========================================================================
   7. INTERACTIVE BIRTHDAY CAKE & CANDLE CEREMONY
   ========================================================================== */
function initCakeCeremony() {
  const blowBtn = document.getElementById('blow-candles-btn');
  const relightBtn = document.getElementById('relight-candles-btn');
  const flames = document.querySelectorAll('.flame');
  const smokes = document.querySelectorAll('.smoke');
  const wishReveal = document.getElementById('wish-reveal');
  const randomWishText = document.getElementById('random-wish-text');

  const secretWishes = [
    "🔥 Vinay's 20s will bring multi-million dollar tech breakthroughs, peak drip, and lifelong glory!",
    "🚀 May every line of code compile on the first try and your gym gains double this year!",
    "👑 Chapter 20 Unlocked: Unlimited charisma, legendary road trips, and eternal brotherhood!",
    "✨ Here's to crushing every goal, securing the dream bag, and living life on GOD MODE!"
  ];

  if (blowBtn) {
    blowBtn.addEventListener('click', () => {
      if (window.soundFX) {
        window.soundFX.blow();
        setTimeout(() => {
          window.soundFX.cheer();
          window.soundFX.levelUp();
        }, 500);
      }

      // Extinguish flames
      flames.forEach(f => f.classList.add('blown'));
      smokes.forEach(s => {
        s.classList.remove('active');
        void s.offsetWidth; // trigger reflow
        s.classList.add('active');
      });

      // Confetti & Fireworks Celebration!
      if (triggerFireworkBurst) {
        triggerFireworkBurst(window.innerWidth * 0.3, window.innerHeight * 0.5, 90, true);
        triggerFireworkBurst(window.innerWidth * 0.7, window.innerHeight * 0.5, 90, true);
        setTimeout(() => {
          triggerFireworkBurst(window.innerWidth * 0.5, window.innerHeight * 0.35, 120, false);
        }, 300);
      }

      // Reveal wish
      if (wishReveal && randomWishText) {
        const randomWish = secretWishes[Math.floor(Math.random() * secretWishes.length)];
        randomWishText.textContent = randomWish;
        wishReveal.classList.add('active');
      }

      blowBtn.style.display = 'none';
      if (relightBtn) relightBtn.classList.add('visible');
    });
  }

  if (relightBtn) {
    relightBtn.addEventListener('click', () => {
      flames.forEach(f => f.classList.remove('blown'));
      smokes.forEach(s => s.classList.remove('active'));
      if (wishReveal) wishReveal.classList.remove('active');
      blowBtn.style.display = 'flex';
      relightBtn.classList.remove('visible');
      if (window.soundFX) window.soundFX.pop();
    });
  }
}

/* ==========================================================================
   8. PARTY SOUNDBOARD DRUM PADS
   ========================================================================== */
function initSoundboard() {
  const pads = document.querySelectorAll('.sound-pad');
  pads.forEach(pad => {
    pad.addEventListener('click', () => {
      const soundType = pad.getAttribute('data-sound');
      if (window.soundFX && window.soundFX[soundType]) {
        window.soundFX[soundType]();
      }
      const rect = pad.getBoundingClientRect();
      if (triggerFireworkBurst) {
        triggerFireworkBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35, false);
      }
    });
  });
}

/* ==========================================================================
   9. TRIBUTES & WISHES WALL (WITH LOCALSTORAGE)
   ========================================================================== */
function initWishesWall() {
  const defaultWishes = [
    {
      author: "Shashwat & The Squad",
      time: "Today • 12:00 AM",
      text: "Happy 20th Birthday, Vinay bhai! Welcome to Chapter 20! From late night coding grinds to endless banter, you are an absolute legend. Let's make this decade unforgettable! 🔥👑"
    },
    {
      author: "Developer Wishes & Tech Crew",
      time: "Today • 12:05 AM",
      text: "Happy Birthday to the tech wizard! May your coffee be strong, your bugs be zero, your servers never crash, and your aura stay untouchable. Keep shining King! 💻⚡"
    }
  ];

  const wishesFeed = document.getElementById('wishes-feed');
  const wishForm = document.getElementById('wish-form');
  const authorInput = document.getElementById('wish-author-input');
  const msgInput = document.getElementById('wish-msg-input');

  let savedWishes = [];
  try {
    const raw = localStorage.getItem('vinay_birthday_wishes');
    if (raw) {
      savedWishes = JSON.parse(raw);
      // Ensure no fake/placeholder names exist in saved wishes
      savedWishes = savedWishes.filter(w => !w.author.includes('Aryan'));
    }
  } catch (e) {
    savedWishes = [];
  }

  const allWishes = [...defaultWishes, ...savedWishes];

  function renderWishes() {
    if (!wishesFeed) return;
    wishesFeed.innerHTML = '';
    allWishes.slice().reverse().forEach(w => {
      const card = document.createElement('div');
      card.className = 'wish-card';
      card.innerHTML = `
        <div class="wish-card-header">
          <span class="wish-author">${escapeHTML(w.author)}</span>
          <span class="wish-time">${escapeHTML(w.time)}</span>
        </div>
        <p class="wish-body">${escapeHTML(w.text)}</p>
      `;
      wishesFeed.appendChild(card);
    });
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  renderWishes();

  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = (authorInput && authorInput.value.trim()) || 'A True Friend';
      const text = msgInput && msgInput.value.trim();

      if (!text) return;

      const newWish = {
        author,
        time: 'Just now',
        text
      };

      savedWishes.push(newWish);
      allWishes.push(newWish);
      try {
        localStorage.setItem('vinay_birthday_wishes', JSON.stringify(savedWishes));
      } catch (err) {}

      renderWishes();
      if (authorInput) authorInput.value = '';
      if (msgInput) msgInput.value = '';

      if (window.soundFX) {
        window.soundFX.cheer();
        window.soundFX.levelUp();
      }
      if (triggerFireworkBurst) {
        triggerFireworkBurst(window.innerWidth / 2, window.innerHeight * 0.4, 90, true);
      }
    });
  }
}

/* ==========================================================================
   10. VIP GATEWAY UNLOCK
   ========================================================================== */
function initGateway() {
  const gateway = document.getElementById('vip-gateway');
  const unlockBtn = document.getElementById('unlock-experience-btn');

  if (unlockBtn && gateway) {
    unlockBtn.addEventListener('click', () => {
      gateway.classList.add('unlocked');
      if (window.soundFX) {
        window.soundFX.levelUp();
        setTimeout(() => {
          if (window.startBirthdayMusic) window.startBirthdayMusic();
        }, 400);
      }
      if (triggerFireworkBurst) {
        triggerFireworkBurst(window.innerWidth * 0.5, window.innerHeight * 0.4, 120, true);
        setTimeout(() => {
          triggerFireworkBurst(window.innerWidth * 0.25, window.innerHeight * 0.3, 80, false);
          triggerFireworkBurst(window.innerWidth * 0.75, window.innerHeight * 0.3, 80, false);
        }, 400);
      }
    });
  }
}

/* ==========================================================================
   11. HUD FLOATING CONTROLS
   ========================================================================== */
function initHudControls() {
  const blastBtn = document.getElementById('hud-confetti-btn');
  const partyModeBtn = document.getElementById('hud-party-mode');

  if (blastBtn) {
    blastBtn.addEventListener('click', () => {
      if (triggerFireworkBurst) {
        triggerFireworkBurst(window.innerWidth * 0.2, window.innerHeight * 0.6, 70, true);
        triggerFireworkBurst(window.innerWidth * 0.8, window.innerHeight * 0.6, 70, true);
        triggerFireworkBurst(window.innerWidth * 0.5, window.innerHeight * 0.4, 100, false);
      }
      if (window.soundFX) window.soundFX.horn();
    });
  }

  let isPartyMode = false;
  if (partyModeBtn) {
    partyModeBtn.addEventListener('click', () => {
      isPartyMode = !isPartyMode;
      if (isPartyMode) {
        partyModeBtn.classList.add('active');
        ambientSpeedMultiplier = 4;
        document.body.style.filter = 'saturate(1.4) contrast(1.1)';
        if (window.soundFX) window.soundFX.laser();
        if (triggerFireworkBurst) triggerFireworkBurst(window.innerWidth / 2, window.innerHeight / 2, 100, true);
      } else {
        partyModeBtn.classList.remove('active');
        ambientSpeedMultiplier = 1;
        document.body.style.filter = 'none';
      }
    });
  }
}
