// Set Life Entertainment — shared site behavior

document.addEventListener('DOMContentLoaded', () => {
  // Hero video: three separate controls — restart, pause, mute
  const heroVideo = document.getElementById('heroVideo');
  const heroRestartBtn = document.getElementById('heroRestartBtn');
  const heroPauseBtn = document.getElementById('heroPauseBtn');
  const heroMuteToggle = document.getElementById('heroMuteToggle');

  if (heroVideo && heroRestartBtn) {
    // Restart always plays from the beginning, regardless of current state.
    heroRestartBtn.addEventListener('click', () => {
      heroVideo.currentTime = 0;
      heroVideo.play().catch(() => {});
    });
  }

  if (heroVideo && heroPauseBtn) {
    // Pause simply pauses wherever playback currently is.
    heroPauseBtn.addEventListener('click', () => {
      heroVideo.pause();
    });
  }

  if (heroVideo && heroMuteToggle) {
    heroMuteToggle.addEventListener('click', () => {
      heroVideo.muted = !heroVideo.muted;
      if (!heroVideo.muted) {
        heroVideo.play().catch(() => {});
      }
      heroMuteToggle.setAttribute('aria-pressed', String(!heroVideo.muted));
      heroMuteToggle.setAttribute('aria-label', heroVideo.muted ? 'Unmute video' : 'Mute video');
    });
  }

  // Nav links: visible click "pulse" animation in addition to the color change
  document.querySelectorAll('.top-nav a').forEach(link => {
    link.addEventListener('click', () => {
      link.classList.remove('nav-pulse');
      // eslint-disable-next-line no-unused-expressions
      link.offsetWidth; // restart animation if clicked twice quickly
      link.classList.add('nav-pulse');
    });
  });

  // Issues page: category filter + search
  const pills = document.querySelectorAll('.pill[data-filter]');
  const searchInput = document.querySelector('.search-box input');
  const cards = document.querySelectorAll('.cover-card[data-category]');

  function applyFilters() {
    const activePill = document.querySelector('.pill.active[data-filter]');
    const category = activePill ? activePill.dataset.filter : 'all';
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

    cards.forEach(card => {
      const matchesCategory = category === 'all' || card.dataset.category === category;
      const name = card.dataset.name ? card.dataset.name.toLowerCase() : '';
      const matchesSearch = !query || name.includes(query);
      card.style.display = matchesCategory && matchesSearch ? '' : 'none';
    });
  }

  if (pills.length) {
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        applyFilters();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  // Simple form submit feedback (no backend wired up)
  const forms = document.querySelectorAll('form[data-demo-form]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Sent ✓';
      btn.disabled = true;
      form.reset();
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
      }, 2500);
    });
  });
});
