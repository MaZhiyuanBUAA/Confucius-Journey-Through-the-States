const screen = document.getElementById('screen');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');

const scoreEls = {
  knowledge: document.getElementById('knowledgeScore'),
  virtue: document.getElementById('virtueScore'),
  wisdom: document.getElementById('wisdomScore')
};

const state = {
  stageIndex: 0,
  knowledge: 0,
  virtue: 0,
  wisdom: 0,
  foundClues: 0,
  choiceDone: false,
  quizDone: false
};

const clues = [
  { name: '书简架', text: '你找到《论语》残卷：学而时习之，不亦说乎。' },
  { name: '学宫讲坛', text: '子路提醒：学习关键在“持续复习 + 实践”。' },
  { name: '弟子席位', text: '同窗说：我每天复盘错题 10 分钟，成绩更稳。' }
];

const stages = [
  renderStory,
  renderExplore,
  renderChoice,
  renderQuiz,
  renderReflection
];

function updateScoreboard() {
  scoreEls.knowledge.textContent = state.knowledge;
  scoreEls.virtue.textContent = state.virtue;
  scoreEls.wisdom.textContent = state.wisdom;
}

function goStage(index) {
  state.stageIndex = index;
  nextBtn.hidden = true;
  stages[index]();
}

function renderStory() {
  screen.innerHTML = `
    <article class="stage">
      <h2>拜师入门：学而时习之</h2>
      <p>你刚进入鲁国学宫，孔子问你：“学习最重要的是什么？”</p>
      <p class="notice">本关目标：完成探索、做一次价值抉择、通过知识挑战。</p>
      <p class="progress">流程 1/5：剧情对话（约 2 分钟）</p>
    </article>
  `;
  nextBtn.hidden = false;
}

function renderExplore() {
  screen.innerHTML = `
    <article class="stage">
      <h2>探索与收集</h2>
      <p>点击 3 个地点，收集线索再继续。</p>
      <section id="map" class="map"></section>
      <div id="clueLog" class="notice">当前线索：0 / 3</div>
      <p class="progress">流程 2/5：探索与收集（约 3 分钟）</p>
    </article>
  `;

  const map = document.getElementById('map');
  const clueLog = document.getElementById('clueLog');

  clues.forEach((clue) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'spot';
    wrapper.innerHTML = `<button type="button">${clue.name}</button><p></p>`;
    const btn = wrapper.querySelector('button');
    const text = wrapper.querySelector('p');

    btn.addEventListener('click', () => {
      btn.disabled = true;
      text.textContent = clue.text;
      state.foundClues += 1;
      state.knowledge += 5;
      clueLog.textContent = `当前线索：${state.foundClues} / 3`;
      updateScoreboard();
      if (state.foundClues === clues.length) {
        nextBtn.hidden = false;
      }
    });

    map.appendChild(wrapper);
  });
}

function renderChoice() {
  state.choiceDone = false;
  screen.innerHTML = `
    <article class="stage">
      <h2>列国事件：如何面对挫折？</h2>
      <p>场景：你数学考差后，接下来你会怎么做？</p>
      <section class="choice" id="choicePanel">
        <button data-type="bad">放弃努力，等下次再说</button>
        <button data-type="good">每天复盘错题 10 分钟并请教同学</button>
      </section>
      <div id="choiceFeedback"></div>
      <p class="progress">流程 3/5：抉择挑战（约 2 分钟）</p>
    </article>
  `;

  const panel = document.getElementById('choicePanel');
  const feedback = document.getElementById('choiceFeedback');

  panel.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement) || state.choiceDone) return;

    state.choiceDone = true;
    panel.querySelectorAll('button').forEach((btn) => (btn.disabled = true));

    if (target.dataset.type === 'good') {
      state.virtue += 12;
      state.wisdom += 10;
      feedback.className = 'feedback good';
      feedback.textContent = '不错！这更符合“学而时习之”的精神：持续复盘和实践。';
    } else {
      state.virtue += 4;
      state.wisdom += 2;
      feedback.className = 'feedback warn';
      feedback.textContent = '你仍可改进：遇到挫折时，坚持反思和练习会更接近“智”。';
    }

    updateScoreboard();
    nextBtn.hidden = false;
  });
}

function renderQuiz() {
  state.quizDone = false;
  screen.innerHTML = `
    <article class="stage">
      <h2>学宫问答</h2>
      <p>题目：<strong>“学而时习之，不亦说乎”更强调什么？</strong></p>
      <section class="quiz-options" id="quizPanel">
        <button data-correct="false">A. 临时抱佛脚</button>
        <button data-correct="true">B. 持续复习与实践</button>
        <button data-correct="false">C. 只要考试高分</button>
      </section>
      <div id="quizFeedback"></div>
      <p class="progress">流程 4/5：知识小战斗（约 3 分钟）</p>
    </article>
  `;

  const panel = document.getElementById('quizPanel');
  const feedback = document.getElementById('quizFeedback');

  panel.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement) || state.quizDone) return;

    state.quizDone = true;
    panel.querySelectorAll('button').forEach((btn) => (btn.disabled = true));

    if (target.dataset.correct === 'true') {
      state.knowledge += 15;
      feedback.className = 'feedback good';
      feedback.textContent = '回答正确！现实类比：每天复盘错题就是“时习”的实践。';
    } else {
      state.knowledge += 8;
      feedback.className = 'feedback warn';
      feedback.textContent = '本题可再思考：高分是结果，持续学习才是方法。';
    }

    updateScoreboard();
    nextBtn.hidden = false;
  });
}

function renderReflection() {
  screen.innerHTML = `
    <article class="stage">
      <h2>反思结算</h2>
      <p>你完成了“学而时习之”章节！</p>
      <ul>
        <li>学识值：${state.knowledge}</li>
        <li>德行值：${state.virtue}</li>
        <li>智：${state.wisdom}</li>
      </ul>
      <p class="notice">行动建议：今晚花 10 分钟复盘今天最容易做错的一题，并写下“错因 + 改法”。</p>
      <p>解锁语录卡：<strong>学而不思则罔，思而不学则殆。</strong></p>
      <p class="progress">流程 5/5：反思结算（约 1 分钟）</p>
    </article>
  `;

  restartBtn.hidden = false;
}

nextBtn.addEventListener('click', () => {
  if (state.stageIndex < stages.length - 1) {
    goStage(state.stageIndex + 1);
  }
  if (state.stageIndex === stages.length - 1) {
    nextBtn.hidden = true;
  }
});

restartBtn.addEventListener('click', () => {
  Object.assign(state, {
    stageIndex: 0,
    knowledge: 0,
    virtue: 0,
    wisdom: 0,
    foundClues: 0,
    choiceDone: false,
    quizDone: false
  });
  restartBtn.hidden = true;
  updateScoreboard();
  goStage(0);
});

updateScoreboard();
goStage(0);
