// Shared JavaScript for all six portfolio pages
document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  // Dark/light theme: preference is saved in localStorage
  const themeButton = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'dark') document.body.classList.add('dark');
  if (themeButton) themeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('portfolio-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });

  // Mobile navigation
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (menuButton && nav) menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.textContent = isOpen ? '✕' : '☰';
  });

  // Typing effect on home page
  const typing = document.querySelector('.typing');
  if (typing) {
    const words = (typing.dataset.words || 'Web Developer').split(',');
    let wordIndex = 0, charIndex = 0, deleting = false;
    const type = () => {
      const word = words[wordIndex];
      typing.textContent = word.slice(0, charIndex);
      if (!deleting && charIndex < word.length) charIndex++;
      else if (deleting && charIndex > 0) charIndex--;
      else if (!deleting) { deleting = true; setTimeout(type, 950); return; }
      else { deleting = false; wordIndex = (wordIndex + 1) % words.length; }
      setTimeout(type, deleting ? 55 : 105);
    };
    type();
  }

  // Animate skill bars when they enter the viewport
  const skills = document.querySelectorAll('.skill');
  if (skills.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target.querySelector('.track span');
          bar.style.width = entry.target.dataset.level + '%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    skills.forEach(skill => observer.observe(skill));
  }

  // Project category filter
  const filterButtons = document.querySelectorAll('.filter');
  const projectCards = document.querySelectorAll('.project-card');
  const emptyState = document.querySelector('.empty-state');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    filterButtons.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    let visible = 0;
    projectCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.hidden = !show;
      if (show) visible++;
    });
    if (emptyState) emptyState.hidden = visible !== 0;
  }));

  // Contact form validation (demo only; no backend submission)
  const form = document.querySelector('#contactForm');
  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const fields = [...form.querySelectorAll('input, textarea')];
      let valid = true;
      fields.forEach(field => {
        const error = field.nextElementSibling;
        let message = '';
        if (!field.value.trim()) message = 'This field is required.';
        else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) message = 'Enter a valid email address.';
        else if (field.minLength > 0 && field.value.trim().length < field.minLength) message = `Please enter at least ${field.minLength} characters.`;
        error.textContent = message;
        if (message) valid = false;
      });
      const status = form.querySelector('.form-status');
      if (valid) {
        status.textContent = 'Thanks! Your form is valid. (Demo only — no message was sent.)';
        form.reset();
      } else status.textContent = 'Please correct the highlighted fields.';
    });
  }
});
