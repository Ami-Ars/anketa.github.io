(() => {
  const cases = [
    {
      tab: 'Frontend-разработчик',
      query: 'Frontend, от 220 000 ₽, только удалёнка',
      report: 'Проверил 47 новых вакансий за сутки. Подошла 1 — остальные отсеял: 21 гибрид, 14 без дохода, 11 не по специальности.',
      title: 'Senior Frontend',
      match: '94% совпадение',
      meta: '260 000 – 310 000 ₽ · полностью удалённо · React, TS',
      tag1: 'зарплата указана',
      tag2: 'без тестового',
      why: 'Прислал, потому что уровень дохода выше вашего и удалёнка без оговорок в тексте.'
    },
    {
      tab: 'Менеджер по продажам',
      query: 'B2B-продажи, от 120 000 ₽ на руки, Москва',
      report: 'Проверил 82 вакансии за сутки. Подошли 2 — отсеял 34 «доход без ограничений», 26 без оклада, 20 не тот профиль.',
      title: 'Менеджер по продажам B2B',
      match: '89% совпадение',
      meta: 'оклад 90 000 ₽ + % · 130 000 – 180 000 ₽ на руки · гибрид',
      tag1: 'оклад в тексте',
      tag2: 'CRM, тёплая база',
      why: 'Прислал, потому что оклад указан цифрой, а не «доходом до 300 000».'
    },
    {
      tab: 'Кладовщик',
      query: 'Склад, от 70 000 ₽, смены 2/2, юг города',
      report: 'Проверил 61 вакансию за сутки. Подошли 3 — отсеял 22 с оплатой «сдельно», 19 без графика, 17 не тот район.',
      title: 'Кладовщик-комплектовщик',
      match: '91% совпадение',
      meta: '72 000 – 78 000 ₽ · смены 2/2 · 15 минут от метро',
      tag1: 'график в тексте',
      tag2: 'официально',
      why: 'Прислал, потому что смены и район совпали с вашими, а оплата — фиксированная.'
    }
  ];

  const tabs = Array.from(document.querySelectorAll('.role-tab'));
  const chatQuery = document.querySelector('[data-chat-query]');
  const chatReport = document.querySelector('[data-chat-report]');
  const chatWhy = document.querySelector('[data-chat-why]');
  const jobTitle = document.querySelector('[data-job-title]');
  const jobMatch = document.querySelector('[data-job-match]');
  const jobMeta = document.querySelector('[data-job-meta]');
  const jobTag1 = document.querySelector('[data-job-tag1]');
  const jobTag2 = document.querySelector('[data-job-tag2]');
  const typingEl = document.querySelector('[data-typing]');
  const answerEl = document.querySelector('[data-answer]');

  if (!tabs.length || !chatQuery) return;

  let activeRole = 0;
  let pending = null;

  function render(index) {
    const c = cases[index];
    chatQuery.textContent = c.query;
    chatReport.textContent = c.report;
    chatWhy.textContent = c.why;
    jobTitle.textContent = c.title;
    jobMatch.textContent = c.match;
    jobMeta.textContent = c.meta;
    jobTag1.textContent = c.tag1;
    jobTag2.textContent = c.tag2;
  }

  function pick(index) {
    if (index === activeRole) return;
    clearTimeout(pending);
    activeRole = index;
    tabs.forEach((t, i) => t.classList.toggle('is-active', i === index));

    answerEl.classList.remove('is-visible');
    typingEl.classList.add('is-visible');

    pending = setTimeout(() => {
      render(index);
      typingEl.classList.remove('is-visible');
      answerEl.classList.add('is-visible');
    }, 900);
  }

  tabs.forEach((tab, i) => tab.addEventListener('click', () => pick(i)));
  render(activeRole);

  const openBtns = Array.from(document.querySelectorAll('[data-open-survey]'));
  const closeBtn = document.querySelector('[data-close-survey]');
  const overlay = document.querySelector('[data-survey-modal]');
  const surveyIframe = document.querySelector('[data-survey-iframe]');
  const modalTitleEl = document.querySelector('[data-survey-modal-title]');
  let lastFocused = null;

  function openSurvey(url, title) {
    if (surveyIframe.dataset.loadedUrl !== url) {
      surveyIframe.src = url;
      surveyIframe.dataset.loadedUrl = url;
    }
    if (modalTitleEl && title) modalTitleEl.textContent = title;
    lastFocused = document.activeElement;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeSurvey() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  if (openBtns.length && overlay) {
    openBtns.forEach((btn) => {
      btn.addEventListener('click', () => openSurvey(btn.dataset.surveyUrl, btn.dataset.surveyTitle));
    });
    closeBtn.addEventListener('click', closeSurvey);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSurvey(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !overlay.hidden) closeSurvey();
    });
  }
})();
