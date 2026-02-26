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
  chapter2Clues: 0,
  chapter2Actions: 0,
  choiceDone: false,
  quizDone: false,
  comboCorrect: 0,
  totalCorrect: 0
};

const chapter1Clues = [
  { name: '书简架', text: '你找到《论语》残卷：学而时习之，不亦说乎。' },
  { name: '学宫讲坛', text: '子路提醒：学习关键在“持续复习 + 实践”。' },
  { name: '弟子席位', text: '同窗说：我每天复盘错题 10 分钟，成绩更稳。' }
];

const chapter2Spots = [
  { name: '旧笔记册', key: 'true', text: '发现上周错题规律：同类题反复错在审题。' },
  { name: '热闹市集', key: 'false', text: '你被热闹吸引，却没有学到关键信息。' },
  { name: '辩论台', key: 'true', text: '听到“温故而知新”可通过讲给别人来检验掌握。' },
  { name: '捷径传单', key: 'false', text: '传单写着“7 天速成满分”，但缺乏长期方法。' },
  { name: '晨读角', key: 'true', text: '你记下“旧知 + 新题”配对练习法，效率提升。' }
];

const chapter2Quiz = [
  {
    q: '“温故而知新”最贴近哪种学习策略？',
    options: [
      { text: 'A. 只刷新题，不复盘', correct: false },
      { text: 'B. 定期回顾旧错题，再迁移到新题', correct: true },
      { text: 'C. 考前一晚突击', correct: false }
    ]
  },
  {
    q: '当你连续两次错在同一知识点，最佳做法是？',
    options: [
      { text: 'A. 先整理错因，再做 2 道同类题验证', correct: true },
      { text: 'B. 跳过它，等老师讲', correct: false },
      { text: 'C. 只看答案不动笔', correct: false }
    ]
  },
  {
    q: '以下哪项最能提高“可玩性 + 学习效果”？',
    options: [
      { text: 'A. 给自己设连击目标，完成后领取小奖励', correct: true },
      { text: 'B. 每天学习内容随机无计划', correct: false },
      { text: 'C. 只在心情好时学', correct: false }
    ]
  }
];

const stages = [
  renderChapter1Story,
  renderChapter1Explore,
  renderChapter1Choice,
  renderChapter1Quiz,
  renderChapter1Summary,
  renderChapter2Story,
  renderChapter2Explore,
  renderChapter2Choice,
  renderChapter2Quiz,
  renderFinalSummary
];

function updateScoreboard() {
  scoreEls.knowledge.textContent = state.knowledge;
  scoreEls.virtue.textContent = state.virtue;
  scoreEls.wisdom.textContent = state.wisdom;
}

function goStage(index) {
  state.stageIndex = index;
  nextBtn.hidden = true;
  restartBtn.hidden = true;
  stages[index]();
}

function renderChapter1Story() {
  screen.innerHTML = `
    <article class="stage">
      <h2>第一章：拜师入门 · 学而时习之</h2>
      <p>你刚进入鲁国学宫，孔子问你：“学习最重要的是什么？”</p>
      <p class="notice">本章目标：完成探索、做一次价值抉择、通过知识挑战。</p>
      <p class="progress">流程 1/10：剧情对话（约 2 分钟）</p>
    </article>
  `;
  nextBtn.hidden = false;
}

function renderChapter1Explore() {
  screen.innerHTML = `
    <article class="stage">
      <h2>探索与收集</h2>
      <p>点击 3 个地点，收集线索再继续。</p>
      <section id="map" class="map"></section>
      <div id="clueLog" class="notice">当前线索：0 / 3</div>
      <p class="progress">流程 2/10：探索与收集（约 3 分钟）</p>
    </article>
  `;

  const map = document.getElementById('map');
  const clueLog = document.getElementById('clueLog');

  chapter1Clues.forEach((clue) => {
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
      if (state.foundClues === chapter1Clues.length) {
        nextBtn.hidden = false;
      }
    });

    map.appendChild(wrapper);
  });
}

function renderChapter1Choice() {
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
      <p class="progress">流程 3/10：抉择挑战（约 2 分钟）</p>
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

function renderChapter1Quiz() {
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
      <p class="progress">流程 4/10：知识小战斗（约 3 分钟）</p>
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

function renderChapter1Summary() {
  screen.innerHTML = `
    <article class="stage">
      <h2>第一章结算</h2>
      <p>你完成了“学而时习之”章节！</p>
      <ul>
        <li>学识值：${state.knowledge}</li>
        <li>德行值：${state.virtue}</li>
        <li>智：${state.wisdom}</li>
      </ul>
      <p class="notice">解锁新章：<strong>温故而知新</strong>。挑战升级：真假线索、三连问答、连击加成。</p>
      <p class="progress">流程 5/10：章节结算（约 1 分钟）</p>
    </article>
  `;
  nextBtn.hidden = false;
}

function renderChapter2Story() {
  screen.innerHTML = `
    <article class="stage">
      <h2>第二章：温故而知新</h2>
      <p>你被派往齐国学舍做助教，需要在有限行动中找出真正有效的学习方法。</p>
      <p class="notice">本章新增机制：误选干扰项会扣减智值，答题连击可获得额外奖励。</p>
      <p class="progress">流程 6/10：新章导入（约 2 分钟）</p>
    </article>
  `;
  nextBtn.hidden = false;
}

function renderChapter2Explore() {
  screen.innerHTML = `
    <article class="stage">
      <h2>真假线索挑战</h2>
      <p>规则：5 个地点中有 3 个有效线索。你最多可行动 4 次，找到 3 条即可通关。</p>
      <section id="hardMap" class="map"></section>
      <div id="hardLog" class="notice">已获有效线索：0 / 3 ｜ 已行动：0 / 4</div>
      <div id="hardFeedback"></div>
      <p class="progress">流程 7/10：高难探索（约 3 分钟）</p>
    </article>
  `;

  const map = document.getElementById('hardMap');
  const hardLog = document.getElementById('hardLog');
  const feedback = document.getElementById('hardFeedback');

  chapter2Spots.forEach((spot) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'spot';
    wrapper.innerHTML = `<button type="button">${spot.name}</button><p></p>`;
    const btn = wrapper.querySelector('button');
    const text = wrapper.querySelector('p');

    btn.addEventListener('click', () => {
      if (state.chapter2Actions >= 4 || state.chapter2Clues >= 3) return;

      btn.disabled = true;
      state.chapter2Actions += 1;
      text.textContent = spot.text;

      if (spot.key === 'true') {
        state.chapter2Clues += 1;
        state.knowledge += 7;
        feedback.className = 'feedback good';
        feedback.textContent = '有效线索 +1：你正在形成“旧知迁移”路径。';
      } else {
        state.wisdom = Math.max(0, state.wisdom - 2);
        feedback.className = 'feedback warn';
        feedback.textContent = '这是干扰信息，智值 -2。注意甄别“速成陷阱”。';
      }

      hardLog.textContent = `已获有效线索：${state.chapter2Clues} / 3 ｜ 已行动：${state.chapter2Actions} / 4`;
      updateScoreboard();

      if (state.chapter2Clues >= 3) {
        feedback.className = 'feedback good';
        feedback.textContent = '挑战成功！你精准找到了 3 条有效学习线索。';
        nextBtn.hidden = false;
      } else if (state.chapter2Actions >= 4) {
        state.knowledge += 5;
        feedback.className = 'feedback warn';
        feedback.textContent = '行动已用尽，你勉强完成调研。下次可更快识别有效信息。';
        updateScoreboard();
        nextBtn.hidden = false;
      }
    });

    map.appendChild(wrapper);
  });
}

function renderChapter2Choice() {
  screen.innerHTML = `
    <article class="stage">
      <h2>师友协作抉择</h2>
      <p>你要带 2 位同学做晚自习复盘，时间只有 20 分钟，如何安排最有效？</p>
      <section class="choice" id="choicePanel2">
        <button data-type="mid">只讲新题，错题以后再看</button>
        <button data-type="good">10 分钟复盘错题 + 10 分钟迁移新题</button>
        <button data-type="bad">大家各学各的，不做复盘</button>
      </section>
      <div id="choiceFeedback2"></div>
      <p class="progress">流程 8/10：进阶抉择（约 2 分钟）</p>
    </article>
  `;

  const panel = document.getElementById('choicePanel2');
  const feedback = document.getElementById('choiceFeedback2');
  let done = false;

  panel.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement) || done) return;

    done = true;
    panel.querySelectorAll('button').forEach((btn) => (btn.disabled = true));

    if (target.dataset.type === 'good') {
      state.virtue += 14;
      state.wisdom += 12;
      feedback.className = 'feedback good';
      feedback.textContent = '优秀指挥！你兼顾了复盘与迁移，团队学习效率最高。';
    } else if (target.dataset.type === 'mid') {
      state.virtue += 7;
      state.wisdom += 5;
      feedback.className = 'feedback warn';
      feedback.textContent = '有进步，但忽略错因复盘会让同类错误重复出现。';
    } else {
      state.virtue += 3;
      state.wisdom += 1;
      feedback.className = 'feedback warn';
      feedback.textContent = '协作效率较低。共学时需要明确节奏与目标。';
    }

    updateScoreboard();
    nextBtn.hidden = false;
  });
}

function renderChapter2Quiz() {
  state.totalCorrect = 0;
  state.comboCorrect = 0;
  let qIndex = 0;

  screen.innerHTML = `
    <article class="stage">
      <h2>三连问答：连击试炼</h2>
      <div id="quizHard"></div>
      <div id="quizHardFeedback"></div>
      <p class="notice">规则：连续答对可触发连击奖励（+5 智值），共 3 题。</p>
      <p class="progress">流程 9/10：高难问答（约 4 分钟）</p>
    </article>
  `;

  const quizWrap = document.getElementById('quizHard');
  const feedback = document.getElementById('quizHardFeedback');

  function renderQuestion() {
    const current = chapter2Quiz[qIndex];
    quizWrap.innerHTML = `
      <p><strong>第 ${qIndex + 1} 题：</strong>${current.q}</p>
      <section class="quiz-options" id="hardQuizPanel">
        ${current.options
          .map((opt) => `<button data-correct="${opt.correct}">${opt.text}</button>`)
          .join('')}
      </section>
      <p class="progress">当前正确：${state.totalCorrect} / ${chapter2Quiz.length} ｜ 连击：${state.comboCorrect}</p>
    `;

    const panel = document.getElementById('hardQuizPanel');
    panel.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) return;

      panel.querySelectorAll('button').forEach((btn) => (btn.disabled = true));

      if (target.dataset.correct === 'true') {
        state.totalCorrect += 1;
        state.comboCorrect += 1;
        state.knowledge += 10;
        feedback.className = 'feedback good';
        feedback.textContent = '回答正确！';

        if (state.comboCorrect >= 2) {
          state.wisdom += 5;
          feedback.textContent += ' 连击达成，额外智值 +5！';
        }
      } else {
        state.comboCorrect = 0;
        state.knowledge += 4;
        feedback.className = 'feedback warn';
        feedback.textContent = '答错了，本题已记录到复盘清单。';
      }

      updateScoreboard();

      setTimeout(() => {
        qIndex += 1;
        if (qIndex < chapter2Quiz.length) {
          renderQuestion();
        } else {
          finishQuiz();
        }
      }, 450);
    });
  }

  function finishQuiz() {
    let resultText = '你完成了三连问答。';
    if (state.totalCorrect === 3) {
      resultText = '满分通关！你真正掌握了“温故而知新”的方法链。';
      state.virtue += 8;
      state.wisdom += 8;
      feedback.className = 'feedback good';
    } else if (state.totalCorrect >= 2) {
      resultText = '表现优秀！你已具备稳定迁移能力。';
      state.virtue += 5;
      feedback.className = 'feedback good';
    } else {
      resultText = '挑战通过，但建议回到错题本做一次复盘。';
      state.virtue += 2;
      feedback.className = 'feedback warn';
    }

    updateScoreboard();
    quizWrap.innerHTML = `<p>${resultText}</p>`;
    nextBtn.hidden = false;
  }

  renderQuestion();
}

function renderFinalSummary() {
  const rank = state.knowledge + state.virtue + state.wisdom >= 110 ? '杏坛优等生' : '杏坛进阶生';

  screen.innerHTML = `
    <article class="stage">
      <h2>两章通关结算</h2>
      <p>恭喜！你已完成前两章核心修学。</p>
      <ul>
        <li>学识值：${state.knowledge}</li>
        <li>德行值：${state.virtue}</li>
        <li>智：${state.wisdom}</li>
        <li>称号：<strong>${rank}</strong></li>
      </ul>
      <p class="notice">后续章节预告：<strong>第三章《三人行，必有我师》</strong>（协作博弈 + 角色互补）。</p>
      <p class="progress">流程 10/10：最终结算（约 1 分钟）</p>
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
    chapter2Clues: 0,
    chapter2Actions: 0,
    choiceDone: false,
    quizDone: false,
    comboCorrect: 0,
    totalCorrect: 0
  });
  restartBtn.hidden = true;
  updateScoreboard();
  goStage(0);
});

updateScoreboard();
goStage(0);
