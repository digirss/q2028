// ========================================
// game.js - Quiz Game Logic
// ========================================

// ---- Unit Data ----
const UNITS = [
    { id: 1, icon: '🔒', title: '密碼三大地雷', desc: '你的密碼安全嗎？' },
    { id: 2, icon: '🏦', title: '帳號分流策略', desc: '帳號分層管理' },
    { id: 3, icon: '🤖', title: 'AI 幻覺真實案例', desc: 'AI 說的話能信嗎？' },
    { id: 4, icon: '🚀', title: 'AI 發展四階段', desc: '從顧問到協同團隊' },
    { id: 5, icon: '📅', title: '30天行動方案', desc: '今天就開始行動' },
];

// ---- Game 1: 密碼三大地雷 ----
const GAME1_QUESTIONS = [
    {
        q: '你朋友的 FB 被盜了，駭客正在嘗試登入其他帳號。以下哪兩個帳號最危險？',
        options: ['LINE', 'Gmail', '統一超商會員'],
        correct: [0, 1],
        multi: true,
        explanation: 'LINE 有 LINE Pay 和認證功能，Gmail 是所有帳號的核心。統一超商會員風險較低。'
    },
    {
        q: '以下哪種密碼最危險？',
        options: ['P@ssw0rd!2024', 'iloveyou', '我的生日+身份證後四碼'],
        correct: [2],
        multi: true,
        explanation: '用個資當密碼最危險，因為個資容易被查到。password 和 iloveyou 雖然常見，但至少不會直接連結到你本人。'
    },
    {
        q: '你的信用卡被一個沒用過的網站試刷，客服建議換卡。你應該？',
        options: ['嫌麻煩不換', '立刻換卡', '等下個月再說'],
        correct: [1],
        multi: false,
        explanation: '換卡零成本，被刷才是真的麻煩。現在換卡很方便，被盜刷後處理才麻煩。'
    }
];

// ---- Game 2: 帳號分流 ----
const GAME2_ITEMS = [
    { name: '銀行 App', tier: 0 },
    { name: 'Google 帳號', tier: 1 },
    { name: '蝦皮購物', tier: 2 },
    { name: 'LINE', tier: 1 },
    { name: '券商 App', tier: 0 },
    { name: 'Netflix', tier: 2 },
    { name: 'Apple ID', tier: 1 },
    { name: '統一超商會員', tier: 2 },
];
const GAME2_TIERS = ['🔴 金融（最高）', '🟡 主力帳號', '🟢 購物雜項'];

// ---- Game 3: AI 幻覺 ----
const GAME3_QUESTIONS = [
    {
        q: '律師用 ChatGPT 寫狀紙，結果 AI 造了 6 個假案例，律師被罰 5000 美元。',
        answer: true,
        explanation: '這是真實案例。2023 年紐約 Mata v. Avianca 案件。'
    },
    {
        q: '三星工程師把機密代碼貼進 ChatGPT，導致資料外洩。',
        answer: true,
        explanation: '2023 年 5 月，三星半導體部門三次洩漏機密。'
    },
    {
        q: 'AI 幻覺只有便宜模型才會發生，付費版不會。',
        answer: false,
        explanation: 'AI 幻覺不是只有便宜模型才會發生，任何模型都可能產生幻覺。'
    },
    {
        q: 'Human-in-the-loop (HITL) 是指：凡是涉及關鍵業務、法律、醫療或核心數據，必定要經由專業人員二次查核。',
        answer: true,
        explanation: '這是 AI 安全使用的基本原則。'
    }
];

// ---- Game 4: AI 發展四階段 ----
const GAME4_STAGES = [
    { text: 'App / 網頁版 — 你問，它答（顧問）', order: 1 },
    { text: 'Coding CLI — 你給目標，它寫程式（幫手）', order: 2 },
    { text: 'Agent — 你給目標，它執行到底，直到完成任務並回報（員工）', order: 3 },
    { text: 'Multi-Agents — Agent 團隊分工合作（協同團隊）', order: 4 },
];

// ---- Game 5: 30天行動 ----
const GAME5_ACTIONS = [
    { text: '盤點你最重要的 3 個帳號密碼', week: 1 },
    { text: '開啟二階段驗證（App > Email > 簡訊）', week: 1 },
    { text: '試用一種 AI 工具（推薦 ChatGPT 免費版）', week: 1 },
    { text: '設定不同密碼：金融 / 主力 / 購物 分三組', week: 2 },
    { text: '選一個你每天的痛點，丟給 AI 試試', week: 2 },
    { text: '把密碼交給信任的人（家人 / 夥伴）', week: 3 },
    { text: '建立一個 AI 工作流（例：AI 摘要 Email）', week: 3 },
    { text: '檢視這 30 天的使用效果', week: 4 },
];

// ---- State ----
let scores = JSON.parse(localStorage.getItem('quiz-scores') || '{}');
let completed = JSON.parse(localStorage.getItem('quiz-completed') || '[]');

// ---- Init ----
function init() {
    renderUnitGrid();
    updateScoreBar();
}

// ---- Render Unit Grid ----
function renderUnitGrid() {
    const grid = document.getElementById('unit-grid');
    grid.innerHTML = UNITS.map(u => {
        const done = completed.includes(u.id);
        const status = done ? '✅ 完成' : '開始 →';
        return `
            <div class="unit-card ${done ? 'completed' : ''}" onclick="openGame(${u.id})">
                <div class="unit-icon">${u.icon}</div>
                <div class="unit-info">
                    <h3>${u.title}</h3>
                    <p>${u.desc}</p>
                </div>
                <div class="unit-status">${status}</div>
            </div>
        `;
    }).join('');
}

// ---- Update Score Bar ----
function updateScoreBar() {
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    document.getElementById('total-score').textContent = total;

    const maxScore = GAME1_QUESTIONS.length + GAME2_ITEMS.length + GAME3_QUESTIONS.length + GAME4_STAGES.length;
    document.getElementById('total-max').textContent = maxScore;

    const dots = document.getElementById('progress-dots');
    dots.innerHTML = UNITS.map(u =>
        `<div class="dot ${completed.includes(u.id) ? 'done' : ''}"></div>`
    ).join('');
}

// ---- Reset ----
function resetAll() {
    if (!confirm('確定要重來嗎？分數和進度都會歸零。')) return;
    scores = {};
    completed = [];
    localStorage.removeItem('quiz-scores');
    localStorage.removeItem('quiz-completed');
    goHome();
}

// ---- Navigation ----
function openGame(id) {
    document.getElementById('home-page').style.display = 'none';
    document.querySelectorAll('.game-page').forEach(p => p.classList.remove('active'));
    document.getElementById(`game-${id}`).classList.add('active');
    renderGame(id);
}

function goHome() {
    document.querySelectorAll('.game-page').forEach(p => p.classList.remove('active'));
    document.getElementById('home-page').style.display = 'block';
    renderUnitGrid();
    updateScoreBar();
}

// ---- Render Games ----
function renderGame(id) {
    switch(id) {
        case 1: renderGame1(); break;
        case 2: renderGame2(); break;
        case 3: renderGame3(); break;
        case 4: renderGame4(); break;
        case 5: renderGame5(); break;
    }
}

// ===== Game 1: 密碼三大地雷 =====
let game1Score = 0;
let game1Answered = 0;

function renderGame1() {
    game1Score = 0;
    game1Answered = 0;
    const container = document.getElementById('game-1-content');
    container.innerHTML = GAME1_QUESTIONS.map((q, i) => `
        <div class="question-card" id="q1-${i}">
            <h3>Q${i+1}. ${q.q}</h3>
            <div class="options">
                ${q.options.map((opt, j) => `
                    <div class="option" onclick="selectGame1(${i}, ${j})">${opt}</div>
                `).join('')}
            </div>
            <div class="explanation" id="exp1-${i}">${q.explanation}</div>
        </div>
    `).join('') + `
        <div class="game-actions">
            <button class="btn-primary" onclick="finishGame(1, game1Score, ${GAME1_QUESTIONS.length})">看結果</button>
        </div>
    `;
}

function selectGame1(qi, oi) {
    const q = GAME1_QUESTIONS[qi];
    const card = document.getElementById(`q1-${qi}`);
    const options = card.querySelectorAll('.option');
    const exp = document.getElementById(`exp1-${qi}`);

    if (options[oi].classList.contains('disabled')) return;

    const isCorrect = q.correct.includes(oi);

    if (q.multi) {
        options[oi].classList.toggle('selected');
        options[oi].classList.add(isCorrect ? 'correct' : 'wrong');
        game1Score += isCorrect ? 1 : -0.5;
    } else {
        options.forEach((opt, j) => {
            opt.classList.add('disabled');
            if (q.correct.includes(j)) opt.classList.add('correct');
            if (j === oi && !isCorrect) opt.classList.add('wrong');
        });
        if (isCorrect) game1Score++;
    }

    game1Answered++;
    exp.classList.add('show');
    scores[1] = Math.max(0, game1Score);
    localStorage.setItem('quiz-scores', JSON.stringify(scores));
}

// ===== Game 2: 帳號分流配對 =====
let game2Score = 0;
let game2Answered = 0;

function renderGame2() {
    game2Score = 0;
    game2Answered = 0;

    const shuffled = [...GAME2_ITEMS].sort(() => Math.random() - 0.5);

    const container = document.getElementById('game-2-content');
    container.innerHTML = `
        <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:4px;">
            點擊帳號旁邊的正確風險層級
        </p>
        <p style="color:var(--accent-yellow);font-size:0.85rem;margin-bottom:16px;">
            💡 這邊只是舉三種類別讓你測試、讓你練習，實際上你可以自己衍生其他組合。
        </p>
        <div class="match-container">
            ${shuffled.map((item, i) => `
                <div class="match-item" id="match-${i}" data-tier="${item.tier}">
                    <div style="flex:1;font-weight:500;">${item.name}</div>
                    <div class="match-status" id="match-status-${i}"></div>
                    <div class="match-tier-btns">
                        ${GAME2_TIERS.map((t, j) => `
                            <button class="tier-btn" onclick="pickTier(${i}, ${j}, this)">${t}</button>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="game-actions">
            <button class="btn-primary" onclick="finishGame(2, game2Score, ${GAME2_ITEMS.length})">看結果</button>
        </div>
    `;
}

function pickTier(idx, tier, btn) {
    const item = document.getElementById(`match-${idx}`);
    const status = document.getElementById(`match-status-${idx}`);
    const correctTier = parseInt(item.dataset.tier);

    // Already answered correctly
    if (item.querySelector('.tier-btn.correct')) return;

    if (tier === correctTier) {
        btn.classList.add('correct');
        item.classList.add('correct');
        status.textContent = '✅';
        game2Score++;
        game2Answered++;
    } else {
        btn.classList.add('wrong');
        status.textContent = '❌';
        setTimeout(() => {
            btn.classList.remove('wrong');
            status.textContent = '';
        }, 600);
    }

    scores[2] = game2Score;
    localStorage.setItem('quiz-scores', JSON.stringify(scores));
}

// ===== Game 3: AI 幻覺是非題 =====
let game3Score = 0;
let game3Answered = 0;

function renderGame3() {
    game3Score = 0;
    game3Answered = 0;
    const container = document.getElementById('game-3-content');
    container.innerHTML = GAME3_QUESTIONS.map((q, i) => `
        <div class="question-card" id="q3-${i}">
            <h3>Q${i+1}. ${q.q}</h3>
            <div class="options">
                <div class="option" onclick="selectGame3(${i}, true)">⭕ 正確</div>
                <div class="option" onclick="selectGame3(${i}, false)">❌ 錯誤</div>
            </div>
            <div class="explanation" id="exp3-${i}">${q.explanation}</div>
        </div>
    `).join('') + `
        <div class="game-actions">
            <button class="btn-primary" onclick="finishGame(3, game3Score, ${GAME3_QUESTIONS.length})">看結果</button>
        </div>
    `;
}

function selectGame3(qi, answer) {
    const q = GAME3_QUESTIONS[qi];
    const card = document.getElementById(`q3-${qi}`);
    const options = card.querySelectorAll('.option');
    const exp = document.getElementById(`exp3-${qi}`);

    if (options[0].classList.contains('disabled')) return;

    const isCorrect = answer === q.answer;

    options.forEach(opt => opt.classList.add('disabled'));
    if (isCorrect) {
        options[answer ? 0 : 1].classList.add('correct');
        game3Score++;
    } else {
        options[answer ? 0 : 1].classList.add('wrong');
    }

    game3Answered++;
    exp.classList.add('show');
    scores[3] = game3Score;
    localStorage.setItem('quiz-scores', JSON.stringify(scores));
}

// ===== Game 4: AI 發展四階段 =====
let game4Picks = {};

function renderGame4() {
    game4Picks = {};

    const shuffled = [...GAME4_STAGES].sort(() => Math.random() - 0.5);

    const container = document.getElementById('game-4-content');
    container.innerHTML = `
        <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:16px;">
            以下是 AI 發展的四個不同階段，請為每個階段選擇正確的等級（L1 = 最早 → L4 = 最新）
        </p>
        <div class="ordering-container" id="order-list">
            ${shuffled.map((item, i) => `
                <div class="order-item" id="order-item-${i}" data-order="${item.order}">
                    <div class="order-text">${item.text}</div>
                    <div class="order-arrows">
                        ${[1,2,3,4].map(n => `
                            <button class="arrow-btn" 
                                    onclick="pickOrder(event, ${i}, ${n})">L${n}</button>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="game-actions">
            <button class="btn-secondary" onclick="renderGame4()">🔄 Reset</button>
            <button class="btn-primary" onclick="checkOrder()">送出確認</button>
        </div>
    `;
}

function pickOrder(e, itemIdx, num) {
    e.stopPropagation();
    e.preventDefault();
    game4Picks[itemIdx] = num;

    const item = document.getElementById(`order-item-${itemIdx}`);
    const btns = item.querySelectorAll('.arrow-btn');
    btns.forEach(btn => {
        btn.classList.remove('picked');
        const btnNum = parseInt(btn.textContent.replace('L', ''));
        if (btnNum === num) {
            btn.classList.add('picked');
        }
    });
}

function checkOrder() {
    // Check all picked
    if (Object.keys(game4Picks).length < GAME4_STAGES.length) {
        alert('請為每個階段都選一個順序！');
        return;
    }

    const items = document.querySelectorAll('#order-list .order-item');
    let correct = 0;

    items.forEach((item, i) => {
        const realOrder = parseInt(item.dataset.order);
        const picked = game4Picks[i];
        const numDiv = item.querySelector('.order-num');

        if (picked === realOrder) {
            item.classList.add('correct');
            // Remove order-num if exists, or add ✅
            const existing = item.querySelector('.order-num');
            if (!existing) {
                const div = document.createElement('div');
                div.className = 'order-num';
                div.textContent = '✅';
                item.insertBefore(div, item.firstChild);
            }
            correct++;
        } else {
            item.classList.remove('correct');
            const existing = item.querySelector('.order-num');
            if (!existing) {
                const div = document.createElement('div');
                div.className = 'order-num';
                div.style.background = 'var(--accent-red)';
                div.style.color = '#fff';
                div.textContent = `✗ 應為 ${realOrder}`;
                item.insertBefore(div, item.firstChild);
            }
        }
    });

    scores[4] = correct;
    localStorage.setItem('quiz-scores', JSON.stringify(scores));

    if (correct === 4) {
        if (!completed.includes(4)) {
            completed.push(4);
            localStorage.setItem('quiz-completed', JSON.stringify(completed));
        }
    }
}

// ===== Game 5: 30天行動 =====
let game5Checked = new Set();

function renderGame5() {
    const container = document.getElementById('game-5-content');
    container.innerHTML = `
        <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:16px;">
            勾選你今天就要開始做的事
        </p>
        <div class="checklist-container">
            ${GAME5_ACTIONS.map((item, i) => `
                <div class="check-item" onclick="toggleCheck(${i})">
                    <div class="check-box">${game5Checked.has(i) ? '✓' : ''}</div>
                    <div>
                        <div>${item.text}</div>
                        <div style="font-size:0.8rem;color:var(--text-muted);">第 ${item.week} 週</div>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="game-actions">
            <button class="btn-primary" onclick="finishGame5()">看結果</button>
        </div>
    `;
}

function toggleCheck(idx) {
    if (game5Checked.has(idx)) {
        game5Checked.delete(idx);
    } else {
        game5Checked.add(idx);
    }
    renderGame5();
}

function finishGame5() {
    // 不管選了什麼，都鼓勵！
    if (game5Checked.size > 0) {
        completed.push(5);
        localStorage.setItem('quiz-completed', JSON.stringify(completed));
    }

    const container = document.getElementById('game-5-content');
    container.innerHTML = `
        <div class="result-screen">
            <div class="result-emoji">🏄</div>
            <div class="result-msg" style="font-size:1.2rem;margin-top:12px;">
                很棒，繼續往前<br>
                一起在 AI 世界衝浪！
            </div>
        </div>
        <div class="game-actions">
            <button class="btn-secondary" onclick="goHome()">回首頁</button>
        </div>
    `;
}

// ===== Finish Game =====
function finishGame(unitId, score, total) {
    if (score > total * 0.5) {
        if (!completed.includes(unitId)) {
            completed.push(unitId);
            localStorage.setItem('quiz-completed', JSON.stringify(completed));
        }
    }
    showResult(unitId, score, total);
}

function showResult(unitId, score, total) {
    const container = document.getElementById(`game-${unitId}-content`);
    const percentage = Math.round((score / total) * 100);
    let emoji, msg;

    if (percentage >= 80) {
        emoji = '🎉';
        msg = '太棒了！你已經掌握這個概念！';
    } else if (percentage >= 50) {
        emoji = '👍';
        msg = '不錯！再複習一下會更好。';
    } else {
        emoji = '💪';
        msg = '繼續加油！回去聽 Leon 講解會更有幫助。';
    }

    container.innerHTML = `
        <div class="result-screen">
            <div class="result-emoji">${emoji}</div>
            <div class="result-score">${score} / ${total}</div>
            <div class="result-msg">${msg}</div>
            <button class="btn-primary" onclick="goHome()">回到主頁</button>
        </div>
    `;
}

// ===== Feedback =====
const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxWu4fkmUzo0Cnc9A4hNZB2xLpJUGKzJxU2a36A6y_b37Z5mLq-e4XnKqWek2NeoL8RWQ/exec';

async function submitFeedback() {
    const name = document.getElementById('fb-name').value.trim();
    const email = document.getElementById('fb-email').value.trim();
    const contact = document.getElementById('fb-contact').value.trim();
    const message = document.getElementById('fb-message').value.trim();
    const resultDiv = document.getElementById('feedback-result');

    if (!name && !message) {
        alert('請填寫名字或留言內容');
        return;
    }

    const btn = document.querySelector('.btn-submit');
    btn.textContent = '送出中...';
    btn.disabled = true;

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

    try {
        await new Promise((resolve, reject) => {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = WEBHOOK_URL;
            form.style.display = 'none';
            const fields = { name, email, contact, message, score: String(totalScore) };
            for (const [key, val] of Object.entries(fields)) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = val;
                form.appendChild(input);
            }
            const iframe = document.createElement('iframe');
            iframe.name = 'submit_target';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            form.target = 'submit_target';
            document.body.appendChild(form);
            form.submit();
            setTimeout(() => {
                document.body.removeChild(form);
                document.body.removeChild(iframe);
                resolve();
            }, 3000);
        });
        resultDiv.textContent = '✅ 留言已送出！謝謝你！';
        resultDiv.className = 'feedback-result show';
        document.getElementById('fb-name').value = '';
        document.getElementById('fb-email').value = '';
        document.getElementById('fb-contact').value = '';
        document.getElementById('fb-message').value = '';
    } catch (err) {
        resultDiv.textContent = '❌ 送出失敗，請再試一次（檢查網路）';
        resultDiv.className = 'feedback-result show error';
    }

    btn.textContent = '送出留言';
    btn.disabled = false;
}

// ---- Init ----
init();
