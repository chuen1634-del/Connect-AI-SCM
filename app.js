const menus = [
  { name: '탄탄멘', emoji: '🍜', tag: '면요리 · 뜨끈한 국물', desc: '고소한 땅콩 소스와 얼큰한 육수의 완벽한 밸런스.', price: '11,000', time: '15분', filter: 'noodle' },
  { name: '제육볶음', emoji: '🥘', tag: '한식 · 매콤한 한 끼', desc: '달큰하고 매콤한 양념에 볶아낸 오늘의 밥도둑.', price: '10,000', time: '12분', filter: 'korean' },
  { name: '치킨 샐러드', emoji: '🥗', tag: '가볍게 · 산뜻한 한 끼', desc: '바삭한 닭고기와 신선한 채소로 오후까지 가볍게.', price: '9,500', time: '10분', filter: 'light' },
  { name: '토마토 파스타', emoji: '🍝', tag: '양식 · 기분 전환', desc: '진한 토마토 소스와 바질 향이 기분까지 환기해줘요.', price: '12,000', time: '18분', filter: 'western' },
  { name: '초밥 모둠', emoji: '🍣', tag: '일식 · 깔끔한 맛', desc: '오늘은 다양한 한 점으로 산뜻하게 시작해보세요.', price: '14,000', time: '20분', filter: 'light' }
];
const miniMenus = [{ name: '소불고기 덮밥', emoji: '🍛', meta: '든든하게 · ₩10,000' }, { name: '김치찌개', emoji: '🍲', meta: '한식 · ₩9,000' }, { name: '타코 플래터', emoji: '🌮', meta: '새로운 맛 · ₩12,000' }];
const $ = (selector) => document.querySelector(selector);
function renderMini() { $('#mini-grid').innerHTML = miniMenus.map((m) => `<article class="mini-card"><div class="mini-emoji">${m.emoji}</div><b>${m.name}</b><small>${m.meta}</small></article>`).join(''); }
function pick(menu) { $('#menu-emoji').textContent = menu.emoji; $('#menu-name').textContent = menu.name; $('#menu-tag').textContent = menu.tag; $('#menu-desc').textContent = menu.desc; $('.menu-stats span').innerHTML = `₩ ${menu.price} <small>예상 가격</small>`; $('.menu-stats span:nth-child(3)').innerHTML = `⚡ ${menu.time} <small>추천 소요시간</small>`; }
function randomPick() { const filter = document.querySelector('.pill.active')?.dataset.filter || 'all'; const pool = filter === 'all' ? menus : menus.filter((m) => m.filter === filter); pick(pool[Math.floor(Math.random() * pool.length)]); }
function setTab(tab) { document.querySelectorAll('.tab').forEach((item) => item.classList.toggle('active', item === tab)); document.querySelector('.tab-line').style.left = tab.textContent.includes('인기') ? '98px' : '0'; if (tab.textContent.includes('인기')) pick(menus[1]); }
document.querySelectorAll('.tab').forEach((tab) => tab.addEventListener('click', () => setTab(tab)));
document.querySelectorAll('.pill').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('.pill').forEach((item) => item.classList.remove('active')); button.classList.add('active'); randomPick(); }));
document.querySelectorAll('.mood-option').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('.mood-option').forEach((item) => item.classList.remove('selected')); button.classList.add('selected'); $('#mood-face').textContent = button.dataset.mood === '가볍게' ? '🌿' : button.dataset.mood === '스트레스 해소' ? '🌶️' : '🙂'; }));
$('#randomize').addEventListener('click', () => { randomPick(); const card = document.querySelector('.recommend-card'); card.classList.remove('is-changing'); requestAnimationFrame(() => card.classList.add('is-changing')); }); $('#shuffle-mini').addEventListener('click', () => { miniMenus.push(miniMenus.shift()); renderMini(); }); $('.save-btn').addEventListener('click', (event) => { const isSaved = event.currentTarget.textContent === '♡'; event.currentTarget.textContent = isSaved ? '♥' : '♡'; event.currentTarget.style.color = isSaved ? 'var(--orange)' : ''; event.currentTarget.setAttribute('aria-pressed', String(isSaved)); }); renderMini();
