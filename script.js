const STUDENT_DATA = {
    "Harper A.": "Ymx1M2NhdDE5",
    "Lucas S.": "c3VuN2RheTQy",
    "Braxton M.": "cGVuQ2lsODg=",
    "Neil V.": "dDFnZXJIb21lNg==",
    "Jaxon S.": "bWFwbDN3b29kOQ==",
    "Tiergan I.": "c29jYzNyQmFsbDQ=",
    "Landon C.": "d2ludDNyRm94Nw==",
    "Tyler G.": "aGFwcFljb2RlMzE=",
    "Robbie S.": "cml2M3JMYW5lOA==",
};

const GAMES_JSON = 'games.json';

// ── safe element grabs ─────────────────────────────
const authWrapper = document.getElementById('auth-wrapper');
const authCard = document.getElementById('auth-card');
const selectTrigger = document.querySelector('select-trigger');
const optionsContainer = document.getElementById('options-container');
const namesList = document.getElementById('names-list');
const selectedDisplay = document.getElementById('selected-name-display');
const passInput = document.getElementById('password-input');
const errorMsg = document.getElementById('error-msg');
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');

const gamesPage = document.getElementById('games-page');
const gameOverlay = document.getElementById('game-overlay');
const gameIframe = document.getElementById('game-iframe');
const overlayTitle = document.getElementById('overlay-game-title');

const loginBtn = document.getElementById('login-btn');
const grid = document.getElementById('games-grid');
const themeSelector = document.getElementById('theme-selector');
const overlayClose = document.getElementById('overlay-close');
const overlayFull = document.getElementById('overlay-fullscreen');

let studentMap = STUDENT_DATA;
let selectedName = '';
let currentGameUrl = '';

// ── auth init ──────────────────────────────────────
function init() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        showGameContent(localStorage.getItem('studentName'));
        return;
    }

    // Populate name list from hardcoded data
    Object.keys(studentMap).forEach(name => {
        const div = document.createElement('div');
        div.className = 'option-item';
        div.textContent = name;

        div.onclick = () => {
            selectedName = name;

            if (selectedDisplay)
                selectedDisplay.textContent = name;

            const greeting = document.getElementById('personal-greeting');
            if (greeting) greeting.textContent = `Hello, ${name}!`;

            optionsContainer?.classList.remove('open');
            switchStep(step1, step2);
        };

        namesList?.appendChild(div);
    });
}

// ── login ─────────────────────────────────────────
loginBtn?.addEventListener('click', () => {
    if (!selectedName) {
        if (errorMsg) errorMsg.textContent = 'pick a name first';
        return;
    }

    const userInput = passInput?.value || '';
    const correctEncrypted = studentMap[selectedName];

    // Comparing Base64 of input to hardcoded Base64
    if (btoa(userInput) === correctEncrypted) {
        authCard?.classList.add('success-exit');

        setTimeout(() => {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('studentName', selectedName);
            showGameContent(selectedName);
        }, 450);

    } else {
        authCard?.classList.remove('shake');
        void authCard?.offsetWidth;
        authCard?.classList.add('shake');

        if (errorMsg) errorMsg.textContent = 'invalid password';
        if (passInput) passInput.value = '';
    }
});

function switchStep(from, to) {
    if (!from || !to) return;

    from.classList.remove('active');

    setTimeout(() => {
        from.style.display = 'none';
        to.style.display = 'block';
        setTimeout(() => to.classList.add('active'), 10);
    }, 300);
}

// ── games page ────────────────────────────────────
async function showGameContent(name) {
    authWrapper?.classList.add('hidden');
    gamesPage?.classList.remove('hidden');

    document.body.classList.add('games-active');

    const headerUser = document.getElementById('header-username');
    if (headerUser) headerUser.textContent = name;

    try {
        const res = await fetch(GAMES_JSON);
        const games = await res.json();
        renderGames(games);
    } catch (e) {
        if (grid) {
            grid.innerHTML =
                '<p style="color:#fb7185;padding:2rem;">could not load games.json</p>';
        }
    }
}

function renderGames(games) {
    if (!grid) return;

    grid.innerHTML = '';

    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';

        card.onclick = () => openGame(game);

        const img = document.createElement('img');
        img.className = 'game-logo';
        img.alt = game.name;
        img.src = game.logo;

        const label = document.createElement('span');
        label.className = 'game-name';
        label.textContent = game.name;

        card.appendChild(img);
        card.appendChild(label);

        grid.appendChild(card);
    });
}

// ── overlay ───────────────────────────────────────
function openGame(game) {
    currentGameUrl = `/games/${game.file}`;

    if (overlayTitle) overlayTitle.textContent = game.name;
    if (gameIframe) gameIframe.src = currentGameUrl;

    gameOverlay?.classList.remove('hidden');
    document.body.classList.add('overlay-active');
}

function closeGame() {
    gameOverlay?.classList.add('hidden');
    document.body.classList.remove('overlay-active');

    if (gameIframe) gameIframe.src = '';
}

overlayClose?.addEventListener('click', closeGame);

overlayFull?.addEventListener('click', () => {
    if (!currentGameUrl) return;
    window.open(currentGameUrl, '_blank', 'noopener,noreferrer');
});

// ── theme system ─────────────────────────────────
const themes = [
    { id: 'dark', label: 'dark', swatch: '#6366f1' },
    { id: 'neon', label: 'neon', swatch: '#06d6a0' },
    { id: 'sunset', label: 'sunset', swatch: '#f97316' },
    { id: 'ocean', label: 'ocean', swatch: '#22d3ee' },
    { id: 'forest', label: 'forest', swatch: '#4ade80' },
    { id: 'crimson', label: 'crimson', swatch: '#f43f5e' },
    { id: 'lavender', label: 'lavender', swatch: '#c084fc' },
];

function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const t = themes.find(t => t.id === theme);
    const display = document.getElementById('theme-display');
    if (display && t) display.textContent = t.label;
}

const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

// Build theme dropdown list
const themeList = document.getElementById('theme-list');
const themeOptions = document.getElementById('theme-options');
const themeTrigger = document.getElementById('theme-trigger');

themes.forEach(t => {
    const div = document.createElement('div');
    div.className = 'option-item';

    const swatch = document.createElement('span');
    swatch.className = 'theme-swatch';
    swatch.style.background = t.swatch;

    const label = document.createElement('span');
    label.textContent = t.label;

    div.appendChild(swatch);
    div.appendChild(label);

    div.onclick = (e) => {
        e.stopPropagation();
        setTheme(t.id);
        themeOptions?.classList.remove('open');
    };

    themeList?.appendChild(div);
});

themeTrigger?.addEventListener('click', (e) => {
    e.stopPropagation();
    themeOptions?.classList.toggle('open');
});

// ── dropdown ──────────────────────────────────────
const mainSelectTrigger = document.getElementById('select-trigger');
if (mainSelectTrigger) {
    mainSelectTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        optionsContainer?.classList.toggle('open');
    });
}

window.addEventListener('click', () => {
    optionsContainer?.classList.remove('open');
    themeOptions?.classList.remove('open');
});

// ── logout ────────────────────────────────────────
function logout() {
    localStorage.clear();
    location.reload();
}

init();
