/* ═══════════════════════════════════════════════ */
/*  FOR HER — Main Script                         */
/* ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const music = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  const scrollBtn = document.getElementById('scrollBtn');
  const replayBtn = document.getElementById('replayBtn');
  const restartBtn = document.getElementById('restartBtn');

  let musicStarted = false;
  let musicPlaying = false;

  /* ─── Music Controls ──────────────────────── */

  function startMusic() {
    music.volume = 0;
    const playPromise = music.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        musicStarted = true;
        musicPlaying = true;
        musicToggle.classList.add('playing');
        fadeVolume(0, 0.5, 2000);
      }).catch(() => {
        // autoplay blocked — wait for interaction
      });
    }
  }

  function fadeVolume(from, to, duration) {
    const steps = 30;
    const stepTime = duration / steps;
    const stepValue = (to - from) / steps;
    let current = from;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      current += stepValue;
      music.volume = Math.max(0, Math.min(1, current));
      if (step >= steps) {
        music.volume = Math.max(0, Math.min(1, to));
        clearInterval(interval);
      }
    }, stepTime);
  }

  musicToggle.addEventListener('click', () => {
    if (!musicStarted) {
      startMusic();
      return;
    }

    if (musicPlaying) {
      fadeVolume(music.volume, 0, 500);
      setTimeout(() => {
        music.pause();
        musicPlaying = false;
        musicToggle.classList.remove('playing');
      }, 550);
    } else {
      music.play();
      musicPlaying = true;
      musicToggle.classList.add('playing');
      fadeVolume(0, 0.5, 800);
    }
  });

  // Start music on first user interaction
  function tryStartMusic() {
    if (!musicStarted) {
      startMusic();
    }
    document.removeEventListener('click', tryStartMusic);
    document.removeEventListener('scroll', tryStartMusic);
    document.removeEventListener('touchstart', tryStartMusic);
  }

  document.addEventListener('click', tryStartMusic);
  document.addEventListener('scroll', tryStartMusic, { once: true });
  document.addEventListener('touchstart', tryStartMusic, { once: true });


  /* ─── Scroll Button ───────────────────────── */

  scrollBtn.addEventListener('click', () => {
    document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
    if (!musicStarted) startMusic();
  });


  /* ─── Photo Cards — Scroll Reveal ─────────── */

  const photoCards = document.querySelectorAll('.photo-card');

  const photoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        photoObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  photoCards.forEach(card => photoObserver.observe(card));


  /* ─── Letter Lines — Scroll Reveal ────────── */

  const letterLines = document.querySelectorAll('.letter-line[data-reveal]');

  const letterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the reveal slightly
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, 120);
        letterObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -40px 0px'
  });

  letterLines.forEach(line => letterObserver.observe(line));


  /* ─── Floating Hearts (ambient) ────────────── */

  const floatingContainer = document.getElementById('floatingHearts');
  const heartChars = ['♡', '♥', '❤', '✿', '❀', '✦'];

  function spawnFloatingHeart() {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (10 + Math.random() * 14) + 'px';
    heart.style.animationDuration = (8 + Math.random() * 10) + 's';
    heart.style.color = [
      '#e8a0bf', '#d4789c', '#f5d5e0', '#d4b8e0', '#f0c4a8', '#e8c9a0'
    ][Math.floor(Math.random() * 6)];

    floatingContainer.appendChild(heart);

    heart.addEventListener('animationend', () => heart.remove());
  }

  // Spawn hearts at intervals
  setInterval(spawnFloatingHeart, 2500);
  // Initial batch
  for (let i = 0; i < 4; i++) {
    setTimeout(spawnFloatingHeart, i * 600);
  }


  /* ─── Entrance Petals ──────────────────────── */

  const petalsContainer = document.getElementById('entrancePetals');

  function spawnPetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.left = Math.random() * 100 + '%';
    petal.style.animationDuration = (5 + Math.random() * 7) + 's';
    petal.style.animationDelay = Math.random() * 2 + 's';
    petal.style.opacity = 0;

    const colors = ['#e8a0bf', '#f5d5e0', '#d4b8e0', '#f0c4a8'];
    petal.style.background = colors[Math.floor(Math.random() * colors.length)];

    const size = 8 + Math.random() * 10;
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';

    petalsContainer.appendChild(petal);
    petal.addEventListener('animationend', () => petal.remove());
  }

  setInterval(spawnPetal, 1800);
  for (let i = 0; i < 6; i++) {
    setTimeout(spawnPetal, i * 400);
  }


  /* ─── Ending Section Hearts ────────────────── */

  const endingHeartsContainer = document.getElementById('endingHearts');

  const endingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startEndingHearts();
        endingObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  endingObserver.observe(document.getElementById('ending'));

  let endingHeartsInterval;

  function startEndingHearts() {
    if (endingHeartsInterval) return;

    function spawnEndHeart() {
      const heart = document.createElement('span');
      heart.className = 'ending-heart';
      heart.textContent = ['♡', '♥', '❤', '✿'][Math.floor(Math.random() * 4)];
      heart.style.left = Math.random() * 100 + '%';
      heart.style.fontSize = (14 + Math.random() * 24) + 'px';
      heart.style.animationDuration = (4 + Math.random() * 6) + 's';
      heart.style.animationDelay = Math.random() * 1 + 's';

      const colors = ['#e8a0bf', '#f5d5e0', '#d4b8e0', '#d4a574'];
      heart.style.color = colors[Math.floor(Math.random() * colors.length)];

      endingHeartsContainer.appendChild(heart);
      heart.addEventListener('animationend', () => heart.remove());
    }

    // Initial burst
    for (let i = 0; i < 15; i++) {
      setTimeout(spawnEndHeart, i * 200);
    }

    endingHeartsInterval = setInterval(spawnEndHeart, 600);
  }


  /* ─── Replay & Restart Buttons ─────────────── */

  replayBtn.addEventListener('click', () => {
    music.currentTime = 0;
    if (!musicPlaying) {
      music.play();
      musicPlaying = true;
      musicStarted = true;
      musicToggle.classList.add('playing');
    }
    fadeVolume(music.volume, 0.6, 1000);

    // Little visual feedback
    replayBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      replayBtn.style.transform = '';
    }, 200);
  });

  restartBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    music.currentTime = 0;
  });


  /* ─── Cursor Sparkles ──────────────────────── */

  const canvas = document.getElementById('sparkleCanvas');
  const ctx = canvas.getContext('2d');
  let sparkles = [];
  let mouseX = 0, mouseY = 0;
  let lastSparkle = 0;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const now = Date.now();
    if (now - lastSparkle > 50) {
      createSparkle(mouseX, mouseY);
      lastSparkle = now;
    }
  });

  function createSparkle(x, y) {
    const count = 2;
    for (let i = 0; i < count; i++) {
      sparkles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        size: Math.random() * 3 + 1,
        life: 1,
        decay: 0.02 + Math.random() * 0.02,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 + 0.5,
        color: [
          '#e8a0bf', '#f5d5e0', '#d4a574', '#d4b8e0', '#f0c4a8'
        ][Math.floor(Math.random() * 5)]
      });
    }
  }

  function updateSparkles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sparkles = sparkles.filter(s => s.life > 0);

    sparkles.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;

      ctx.save();
      ctx.globalAlpha = s.life;
      ctx.fillStyle = s.color;
      ctx.beginPath();

      // Draw a tiny star
      const size = s.size * s.life;
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(
          s.x + Math.cos(angle) * size,
          s.y + Math.sin(angle) * size
        );
      }
      ctx.arc(s.x, s.y, size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(updateSparkles);
  }

  updateSparkles();


  /* ─── Gallery intro reveal ─────────────────── */

  const galleryIntro = document.querySelector('.gallery-intro');
  if (galleryIntro) {
    galleryIntro.style.opacity = '0';
    galleryIntro.style.transform = 'translateY(30px)';
    galleryIntro.style.transition = 'all 1s ease';

    const introObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          galleryIntro.style.opacity = '1';
          galleryIntro.style.transform = 'translateY(0)';
          introObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    introObserver.observe(galleryIntro);
  }


  /* ─── Parallax-ish subtle movement on photos ── */

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    photoCards.forEach(card => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const offset = (progress - 0.5) * 20;
        const frame = card.querySelector('.photo-frame');
        if (frame) {
          frame.style.transform = `translateY(${offset}px) rotate(${card.dataset.index % 2 === 0 ? -1.5 : 1.5}deg)`;
        }
      }
    });
  }, { passive: true });

});
