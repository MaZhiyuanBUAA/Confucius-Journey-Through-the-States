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
  totalCorrect: 0,
  chapter3Intel: 0,
  chapter3Actions: 0,
  chapter3Mistakes: 0,
  chapter4Pressure: 0,
  chapter5DeckPicked: 0,
  chapter5KnowledgeBoost: 0,
  chapter5WisdomShield: 0,
  chapter6Morale: 0,
  chapter6Risk: 0
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

const chapter3Spots = [
  { name: '齐国课堂记录', kind: 'core', text: '记录显示：先复盘错因再上新题，次日正确率提升 24%。' },
  { name: '名师速记秘籍', kind: 'trap', text: '宣称“只背模板就能通吃全部题型”，忽略理解。' },
  { name: '同伴互评单', kind: 'core', text: '互评能暴露“会做但讲不清”的薄弱点。' },
  { name: '热帖排行榜', kind: 'noise', text: '讨论很热闹，但几乎没有可迁移的方法。' },
  { name: '错题演算纸', kind: 'core', text: '你找到“审题-列式-验算”三段式自检流程。' },
  { name: '押题密卷', kind: 'trap', text: '只押最后 3 题，风险极高。' }
];

const chapter3DebateQuestions = [
  {
    q: '队友坚持“只做新题更快进步”，你如何回应？',
    options: [
      { text: 'A. 认同，时间都给新题', correct: false },
      { text: 'B. 先用错题定位漏洞，再做新题检验迁移', correct: true },
      { text: 'C. 全部交给学霸讲，自己不总结', correct: false }
    ]
  },
  {
    q: '面对团队分歧，最符合“三人行，必有我师”的做法是？',
    options: [
      { text: 'A. 谁声音大听谁', correct: false },
      { text: 'B. 给每人 1 分钟陈述证据，再汇总最佳策略', correct: true },
      { text: 'C. 直接按你自己的习惯执行', correct: false }
    ]
  },
  {
    q: '本轮冲刺只剩 8 分钟，应该优先做什么？',
    options: [
      { text: 'A. 随机刷题拼运气', correct: false },
      { text: 'B. 复盘本日高频错因，做 1 题针对训练', correct: true },
      { text: 'C. 看别人笔记，不动笔', correct: false }
    ]
  },
  {
    q: '若你连续答错两题，最佳补救策略是？',
    options: [
      { text: 'A. 保持原节奏继续蒙', correct: false },
      { text: 'B. 立刻暂停 90 秒，回看错因并重建步骤', correct: true },
      { text: 'C. 直接放弃本轮挑战', correct: false }
    ]
  }
];

const chapter4Boss = [
  {
    q: 'Boss 问：以下哪种学习闭环最稳？',
    options: [
      { text: 'A. 新题→新题→新题', score: 0 },
      { text: 'B. 错因复盘→针对训练→讲给同伴→再测', score: 2 },
      { text: 'C. 看答案→抄笔记→结束', score: 0 }
    ]
  },
  {
    q: 'Boss 问：团队中有人拖延，你应如何处理？',
    options: [
      { text: 'A. 指责并孤立他', score: 0 },
      { text: 'B. 与其共定最小目标并追踪完成', score: 2 },
      { text: 'C. 直接替他全部完成', score: 1 }
    ]
  },
  {
    q: 'Boss 问：考前最后 15 分钟，收益最高的是？',
    options: [
      { text: 'A. 复盘易错清单与关键步骤', score: 2 },
      { text: 'B. 刷社交媒体放松', score: 0 },
      { text: 'C. 随机翻新题答案', score: 1 }
    ]
  }
];

const chapter5Cards = [
  { name: '温故卡', type: 'knowledge', value: 6, text: '后续每次正确回答额外获得学识 +6。' },
  { name: '慎思卡', type: 'shield', value: 1, text: '后续答错时减少一次智值扣分。' },
  { name: '笃行卡', type: 'virtue', value: 8, text: '完成章节时额外获得德行 +8。' },
  { name: '互学卡', type: 'knowledge', value: 4, text: '后续每次正确回答额外获得学识 +4。' }
];

const chapter5RelayQuestions = [
  {
    q: '接力 1：队友说“时间不够，先跳过复盘”。你应如何调整？',
    options: [
      { text: 'A. 认同，直接进入新题海', correct: false },
      { text: 'B. 用 3 分钟锁定最高频错因，再进入新题', correct: true },
      { text: 'C. 完全停止训练', correct: false }
    ]
  },
  {
    q: '接力 2：小组成员水平差异大，最佳协作是？',
    options: [
      { text: 'A. 全体做同一难度，不分层', correct: false },
      { text: 'B. 基础组复盘，进阶组迁移，最后互讲', correct: true },
      { text: 'C. 学霸独自刷题', correct: false }
    ]
  },
  {
    q: '接力 3：如何验证“真的掌握”而不是“看懂了”？',
    options: [
      { text: 'A. 不看步骤，口头说会了', correct: false },
      { text: 'B. 闭卷重做并向同伴讲解关键步骤', correct: true },
      { text: 'C. 只抄一次标准答案', correct: false }
    ]
  }
];

const chapter6Summit = [
  {
    q: '会盟议题一：跨班协作时，怎样保持“和而不同”？',
    options: [
      { text: 'A. 强制统一所有方法', score: 0 },
      { text: 'B. 先统一目标，再允许方法差异并用证据复盘', score: 2 },
      { text: 'C. 谁都不需要沟通', score: 0 }
    ]
  },
  {
    q: '会盟议题二：当数据表现下滑，第一反应应是？',
    options: [
      { text: 'A. 指责执行不力', score: 0 },
      { text: 'B. 拆分问题来源：目标、方法、执行，再逐一修正', score: 2 },
      { text: 'C. 完全推翻原计划', score: 1 }
    ]
  },
  {
    q: '会盟议题三：如何让学习机制长期运转？',
    options: [
      { text: 'A. 只在考试周突击', score: 0 },
      { text: 'B. 固定“复盘-迁移-互讲-再测”周循环', score: 2 },
      { text: 'C. 每次都换全新流程', score: 1 }
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
  renderChapter3Story,
  renderChapter3Explore,
  renderChapter3Choice,
  renderChapter3Quiz,
  renderChapter4Boss,
  renderChapter5Story,
  renderChapter5Draft,
  renderChapter5Relay,
  renderChapter6Story,
  renderChapter6Summit,
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
      <p class="progress">流程 1/20：剧情对话（约 2 分钟）</p>
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
      <p class="progress">流程 2/20：探索与收集（约 3 分钟）</p>
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
      <p class="progress">流程 3/20：抉择挑战（约 2 分钟）</p>
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
      <p class="progress">流程 4/20：知识小战斗（约 3 分钟）</p>
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
      <p class="progress">流程 5/20：章节结算（约 1 分钟）</p>
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
      <p class="progress">流程 6/20：新章导入（约 2 分钟）</p>
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
      <p class="progress">流程 7/20：高难探索（约 3 分钟）</p>
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
      <p class="progress">流程 8/20：进阶抉择（约 2 分钟）</p>
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
      <p class="progress">流程 9/20：高难问答（约 4 分钟）</p>
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

function renderChapter3Story() {
  screen.innerHTML = `
    <article class="stage">
      <h2>第三章：三人行，必有我师</h2>
      <p>你带领学习小队进入魏国学坊，本章将引入“失误惩罚”和“团队协同”双重压力。</p>
      <p class="notice">新增难度：可行动次数更少、误判会累计失误值，失误过多将触发额外惩罚。</p>
      <p class="progress">流程 10/20：章节导入（约 2 分钟）</p>
    </article>
  `;
  nextBtn.hidden = false;
}

function renderChapter3Explore() {
  state.chapter3Intel = 0;
  state.chapter3Actions = 0;
  state.chapter3Mistakes = 0;

  screen.innerHTML = `
    <article class="stage">
      <h2>高压侦查：6 选 4</h2>
      <p>规则：6 个地点中仅 3 个核心情报。你只有 4 次行动机会，且误判 2 次会额外扣分。</p>
      <section id="chapter3Map" class="map"></section>
      <div id="chapter3Log" class="notice">核心情报：0 / 3 ｜ 行动：0 / 4 ｜ 失误：0 / 2</div>
      <div id="chapter3Feedback"></div>
      <p class="progress">流程 11/20：高压探索（约 3 分钟）</p>
    </article>
  `;

  const map = document.getElementById('chapter3Map');
  const log = document.getElementById('chapter3Log');
  const feedback = document.getElementById('chapter3Feedback');

  function updateLog() {
    log.textContent = `核心情报：${state.chapter3Intel} / 3 ｜ 行动：${state.chapter3Actions} / 4 ｜ 失误：${state.chapter3Mistakes} / 2`;
  }

  chapter3Spots.forEach((spot) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'spot';
    wrapper.innerHTML = `<button type="button">${spot.name}</button><p></p>`;
    const btn = wrapper.querySelector('button');
    const text = wrapper.querySelector('p');

    btn.addEventListener('click', () => {
      if (state.chapter3Actions >= 4 || state.chapter3Intel >= 3) return;

      btn.disabled = true;
      state.chapter3Actions += 1;
      text.textContent = spot.text;

      if (spot.kind === 'core') {
        state.chapter3Intel += 1;
        state.knowledge += 9;
        state.wisdom += 3;
        feedback.className = 'feedback good';
        feedback.textContent = '命中核心情报！你的小队决策可信度提升。';
      } else {
        state.chapter3Mistakes += 1;
        state.wisdom = Math.max(0, state.wisdom - 3);
        feedback.className = 'feedback warn';
        feedback.textContent = '误判！该信息无法形成有效策略，智值 -3。';
      }

      if (state.chapter3Mistakes >= 2) {
        state.virtue = Math.max(0, state.virtue - 2);
        feedback.textContent += ' 失误累计过高，团队士气下降，德行 -2。';
      }

      updateLog();
      updateScoreboard();

      if (state.chapter3Intel >= 3) {
        feedback.className = 'feedback good';
        feedback.textContent = '你在限制行动内完成侦查，成功锁定全部核心情报。';
        nextBtn.hidden = false;
      } else if (state.chapter3Actions >= 4) {
        feedback.className = 'feedback warn';
        feedback.textContent = '行动次数耗尽，本轮以残缺情报推进。';
        nextBtn.hidden = false;
      }
    });

    map.appendChild(wrapper);
  });
}

function renderChapter3Choice() {
  let done = false;
  screen.innerHTML = `
    <article class="stage">
      <h2>团队分歧抉择</h2>
      <p>队友出现争执：有人主张刷量，有人主张复盘。你作为队长怎么安排？</p>
      <section class="choice" id="chapter3ChoicePanel">
        <button data-type="bad">按投票多数决定，不做证据核验</button>
        <button data-type="mid">先做新题，再看时间是否复盘</button>
        <button data-type="good">先对齐错因证据，再分工练习并互讲</button>
      </section>
      <div id="chapter3ChoiceFeedback"></div>
      <p class="progress">流程 12/20：协作抉择（约 2 分钟）</p>
    </article>
  `;

  const panel = document.getElementById('chapter3ChoicePanel');
  const feedback = document.getElementById('chapter3ChoiceFeedback');

  panel.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement) || done) return;

    done = true;
    panel.querySelectorAll('button').forEach((btn) => (btn.disabled = true));

    if (target.dataset.type === 'good') {
      state.virtue += 16;
      state.wisdom += 14;
      feedback.className = 'feedback good';
      feedback.textContent = '完美决策！你让团队在证据与分工下高效协同。';
    } else if (target.dataset.type === 'mid') {
      state.virtue += 8;
      state.wisdom += 6;
      feedback.className = 'feedback warn';
      feedback.textContent = '方案可用，但复盘顺序偏后会降低稳定收益。';
    } else {
      state.virtue += 3;
      state.wisdom += 2;
      feedback.className = 'feedback warn';
      feedback.textContent = '决策过于粗放，团队容易在低效争论中消耗时间。';
    }

    updateScoreboard();
    nextBtn.hidden = false;
  });
}

function renderChapter3Quiz() {
  let qIndex = 0;
  let correctStreak = 0;
  let correctTotal = 0;

  screen.innerHTML = `
    <article class="stage">
      <h2>四连辩论：限时校验</h2>
      <div id="chapter3QuizWrap"></div>
      <div id="chapter3QuizFeedback"></div>
      <p class="notice">规则：共 4 题。连续答对 3 题可触发“师者连携”奖励（学识 +8，智值 +6）。</p>
      <p class="progress">流程 13/20：极限问答（约 4 分钟）</p>
    </article>
  `;

  const wrap = document.getElementById('chapter3QuizWrap');
  const feedback = document.getElementById('chapter3QuizFeedback');

  function renderQuestion() {
    const current = chapter3DebateQuestions[qIndex];
    wrap.innerHTML = `
      <p><strong>第 ${qIndex + 1} 题：</strong>${current.q}</p>
      <section class="quiz-options" id="chapter3QuizPanel">
        ${current.options.map((opt) => `<button data-correct="${opt.correct}">${opt.text}</button>`).join('')}
      </section>
      <p class="progress">总正确：${correctTotal} / ${chapter3DebateQuestions.length} ｜ 连续正确：${correctStreak}</p>
    `;

    const panel = document.getElementById('chapter3QuizPanel');
    panel.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) return;

      panel.querySelectorAll('button').forEach((btn) => (btn.disabled = true));

      if (target.dataset.correct === 'true') {
        correctTotal += 1;
        correctStreak += 1;
        state.knowledge += 11;
        feedback.className = 'feedback good';
        feedback.textContent = '论证成立，队友认可你的判断。';
      } else {
        correctStreak = 0;
        state.knowledge += 5;
        state.wisdom = Math.max(0, state.wisdom - 2);
        feedback.className = 'feedback warn';
        feedback.textContent = '论证证据不足，智值 -2。';
      }

      updateScoreboard();

      setTimeout(() => {
        qIndex += 1;
        if (qIndex < chapter3DebateQuestions.length) {
          renderQuestion();
        } else {
          if (correctTotal >= 3) {
            state.virtue += 9;
            feedback.className = 'feedback good';
            feedback.textContent = '你通过了辩论校验，小队进入最终试炼。';
          } else {
            state.virtue += 4;
            feedback.className = 'feedback warn';
            feedback.textContent = '你勉强完成辩论，建议补做一次错因梳理。';
          }

          if (correctStreak >= 3) {
            state.knowledge += 8;
            state.wisdom += 6;
            feedback.textContent += ' 师者连携触发，学识 +8，智值 +6！';
          }

          updateScoreboard();
          wrap.innerHTML = '<p>四连辩论结束，准备迎战最终 Boss。</p>';
          nextBtn.hidden = false;
        }
      }, 450);
    });
  }

  renderQuestion();
}

function renderChapter4Boss() {
  let qIndex = 0;
  let bossScore = 0;
  state.chapter4Pressure = 0;

  screen.innerHTML = `
    <article class="stage">
      <h2>终章试炼：杏坛大辩</h2>
      <div id="bossWrap"></div>
      <div id="bossFeedback"></div>
      <p class="notice">规则：Boss 会连续施压。若连续低分回答 2 次，将触发压力惩罚（德行 -3）。</p>
      <p class="progress">流程 14/20：Boss 关（约 4 分钟）</p>
    </article>
  `;

  const wrap = document.getElementById('bossWrap');
  const feedback = document.getElementById('bossFeedback');

  function renderBossQuestion() {
    const current = chapter4Boss[qIndex];
    wrap.innerHTML = `
      <p><strong>Boss 题 ${qIndex + 1}：</strong>${current.q}</p>
      <section class="quiz-options" id="bossPanel">
        ${current.options.map((opt) => `<button data-score="${opt.score}">${opt.text}</button>`).join('')}
      </section>
      <p class="progress">Boss 评分：${bossScore} / 6 ｜ 压力值：${state.chapter4Pressure}</p>
    `;

    const panel = document.getElementById('bossPanel');
    panel.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) return;

      panel.querySelectorAll('button').forEach((btn) => (btn.disabled = true));
      const score = Number(target.dataset.score);
      bossScore += score;

      if (score >= 2) {
        state.chapter4Pressure = 0;
        state.knowledge += 12;
        state.wisdom += 6;
        feedback.className = 'feedback good';
        feedback.textContent = '高质量回应！Boss 的追问被你稳住了。';
      } else {
        state.chapter4Pressure += 1;
        state.knowledge += 4;
        feedback.className = 'feedback warn';
        feedback.textContent = '回应偏弱，Boss 继续施压。';
      }

      if (state.chapter4Pressure >= 2) {
        state.virtue = Math.max(0, state.virtue - 3);
        state.chapter4Pressure = 0;
        feedback.textContent += ' 连续失守触发压力惩罚：德行 -3。';
      }

      updateScoreboard();

      setTimeout(() => {
        qIndex += 1;
        if (qIndex < chapter4Boss.length) {
          renderBossQuestion();
        } else {
          if (bossScore >= 5) {
            state.virtue += 14;
            state.wisdom += 10;
            feedback.className = 'feedback good';
            feedback.textContent = 'Boss 被你说服！你完成了最高难度试炼。';
          } else if (bossScore >= 3) {
            state.virtue += 8;
            feedback.className = 'feedback good';
            feedback.textContent = '你成功守住主线论证，顺利通关。';
          } else {
            state.virtue += 3;
            feedback.className = 'feedback warn';
            feedback.textContent = '你勉强通过试炼，建议回看前三章策略链。';
          }

          updateScoreboard();
          wrap.innerHTML = '<p>终章试炼结束，正在生成你的杏坛评定...</p>';
          nextBtn.hidden = false;
        }
      }, 450);
    });
  }

  renderBossQuestion();
}

function renderChapter5Story() {
  screen.innerHTML = `
    <article class="stage">
      <h2>第五章：因材施教 · 策略构筑</h2>
      <p>你来到陈国学营，需要先选择策略卡组，再完成接力问答。</p>
      <p class="notice">新增玩法：开局选卡（增益构筑），不同卡组会改变后续得分表现。</p>
      <p class="progress">流程 15/20：章节导入（约 2 分钟）</p>
    </article>
  `;
  nextBtn.hidden = false;
}

function renderChapter5Draft() {
  state.chapter5DeckPicked = 0;
  state.chapter5KnowledgeBoost = 0;
  state.chapter5WisdomShield = 0;
  let virtueBonus = 0;

  screen.innerHTML = `
    <article class="stage">
      <h2>策略构筑：从 4 张中选 2 张</h2>
      <p>规则：不同卡牌提供不同增益。请根据你的短板构筑本章打法。</p>
      <section id="deckPanel" class="map"></section>
      <div id="deckLog" class="notice">已选择：0 / 2</div>
      <div id="deckFeedback"></div>
      <p class="progress">流程 16/20：卡组构筑（约 3 分钟）</p>
    </article>
  `;

  const panel = document.getElementById('deckPanel');
  const log = document.getElementById('deckLog');
  const feedback = document.getElementById('deckFeedback');

  chapter5Cards.forEach((card) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'spot';
    wrapper.innerHTML = `<button type="button">${card.name}</button><p>${card.text}</p>`;
    const btn = wrapper.querySelector('button');

    btn.addEventListener('click', () => {
      if (state.chapter5DeckPicked >= 2 || btn.disabled) return;

      btn.disabled = true;
      state.chapter5DeckPicked += 1;

      if (card.type === 'knowledge') {
        state.chapter5KnowledgeBoost += card.value;
        feedback.className = 'feedback good';
        feedback.textContent = `已激活学识增益：每次答对额外 +${state.chapter5KnowledgeBoost}。`;
      } else if (card.type === 'shield') {
        state.chapter5WisdomShield += card.value;
        feedback.className = 'feedback good';
        feedback.textContent = '已激活慎思护盾：可抵消一次答错惩罚。';
      } else {
        virtueBonus += card.value;
        feedback.className = 'feedback good';
        feedback.textContent = `已存储章末德行奖励 +${virtueBonus}。`;
      }

      log.textContent = `已选择：${state.chapter5DeckPicked} / 2`;

      if (state.chapter5DeckPicked >= 2) {
        state.virtue += virtueBonus;
        updateScoreboard();
        feedback.textContent += ' 构筑完成，准备进入接力试炼。';
        nextBtn.hidden = false;
      }
    });

    panel.appendChild(wrapper);
  });
}

function renderChapter5Relay() {
  let qIndex = 0;
  let correct = 0;

  screen.innerHTML = `
    <article class="stage">
      <h2>三段接力：动态增益试炼</h2>
      <div id="relayWrap"></div>
      <div id="relayFeedback"></div>
      <p class="notice">规则：答对可获得学识基础 +10，再叠加你的卡组增益；答错可能扣智值。</p>
      <p class="progress">流程 17/20：接力挑战（约 4 分钟）</p>
    </article>
  `;

  const wrap = document.getElementById('relayWrap');
  const feedback = document.getElementById('relayFeedback');

  function renderQuestion() {
    const current = chapter5RelayQuestions[qIndex];
    wrap.innerHTML = `
      <p><strong>接力题 ${qIndex + 1}：</strong>${current.q}</p>
      <section class="quiz-options" id="relayPanel">
        ${current.options.map((opt) => `<button data-correct="${opt.correct}">${opt.text}</button>`).join('')}
      </section>
      <p class="progress">正确数：${correct} / ${chapter5RelayQuestions.length} ｜ 慎思护盾：${state.chapter5WisdomShield}</p>
    `;

    const panel = document.getElementById('relayPanel');
    panel.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) return;

      panel.querySelectorAll('button').forEach((btn) => (btn.disabled = true));

      if (target.dataset.correct === 'true') {
        correct += 1;
        const gain = 10 + state.chapter5KnowledgeBoost;
        state.knowledge += gain;
        feedback.className = 'feedback good';
        feedback.textContent = `回答正确！学识 +${gain}。`;
      } else if (state.chapter5WisdomShield > 0) {
        state.chapter5WisdomShield -= 1;
        feedback.className = 'feedback warn';
        feedback.textContent = '答错，但慎思护盾生效，本次不扣智值。';
      } else {
        state.wisdom = Math.max(0, state.wisdom - 4);
        feedback.className = 'feedback warn';
        feedback.textContent = '答错且无护盾，智值 -4。';
      }

      updateScoreboard();

      setTimeout(() => {
        qIndex += 1;
        if (qIndex < chapter5RelayQuestions.length) {
          renderQuestion();
        } else {
          if (correct >= 2) {
            state.virtue += 10;
            feedback.className = 'feedback good';
            feedback.textContent = '接力成功！你的构筑策略通过实战验证。';
          } else {
            state.virtue += 4;
            feedback.className = 'feedback warn';
            feedback.textContent = '接力完成，但建议优化卡组选择逻辑。';
          }

          updateScoreboard();
          wrap.innerHTML = '<p>第五章结束，下一章将进入跨国会盟终局。</p>';
          nextBtn.hidden = false;
        }
      }, 400);
    });
  }

  renderQuestion();
}

function renderChapter6Story() {
  state.chapter6Morale = 2;
  state.chapter6Risk = 0;

  screen.innerHTML = `
    <article class="stage">
      <h2>第六章：列国会盟 · 终局共治</h2>
      <p>你代表学宫参加会盟，需要在高压议题中守住团队士气并完成总论证。</p>
      <p class="notice">新增玩法：士气值系统。低质量回应会累积风险，风险过高将降低士气。</p>
      <p class="progress">流程 18/20：终章导入（约 2 分钟）</p>
    </article>
  `;
  nextBtn.hidden = false;
}

function renderChapter6Summit() {
  let qIndex = 0;
  let summitScore = 0;

  screen.innerHTML = `
    <article class="stage">
      <h2>会盟辩论：风险与士气管理</h2>
      <div id="summitWrap"></div>
      <div id="summitFeedback"></div>
      <p class="notice">规则：每次低分回答会累计风险。风险达到 2 时触发士气 -1 并清空风险。</p>
      <p class="progress">流程 19/20：会盟终试（约 4 分钟）</p>
    </article>
  `;

  const wrap = document.getElementById('summitWrap');
  const feedback = document.getElementById('summitFeedback');

  function renderQuestion() {
    const current = chapter6Summit[qIndex];
    wrap.innerHTML = `
      <p><strong>会盟题 ${qIndex + 1}：</strong>${current.q}</p>
      <section class="quiz-options" id="summitPanel">
        ${current.options.map((opt) => `<button data-score="${opt.score}">${opt.text}</button>`).join('')}
      </section>
      <p class="progress">会盟分：${summitScore} / 6 ｜ 士气：${state.chapter6Morale} ｜ 风险：${state.chapter6Risk}</p>
    `;

    const panel = document.getElementById('summitPanel');
    panel.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) return;

      panel.querySelectorAll('button').forEach((btn) => (btn.disabled = true));
      const score = Number(target.dataset.score);
      summitScore += score;

      if (score >= 2) {
        state.chapter6Risk = 0;
        state.knowledge += 12;
        state.wisdom += 8;
        feedback.className = 'feedback good';
        feedback.textContent = '回应扎实，成功稳定会盟节奏。';
      } else {
        state.chapter6Risk += 1;
        state.knowledge += 4;
        feedback.className = 'feedback warn';
        feedback.textContent = '回应偏弱，风险值上升。';
      }

      if (state.chapter6Risk >= 2) {
        state.chapter6Morale = Math.max(0, state.chapter6Morale - 1);
        state.virtue = Math.max(0, state.virtue - 2);
        state.chapter6Risk = 0;
        feedback.textContent += ' 风险爆发：士气 -1，德行 -2。';
      }

      updateScoreboard();

      setTimeout(() => {
        qIndex += 1;
        if (qIndex < chapter6Summit.length) {
          renderQuestion();
        } else {
          if (summitScore >= 5 && state.chapter6Morale >= 1) {
            state.virtue += 16;
            state.wisdom += 10;
            feedback.className = 'feedback good';
            feedback.textContent = '会盟大捷！你以稳定策略完成终局治理。';
          } else if (summitScore >= 3) {
            state.virtue += 9;
            feedback.className = 'feedback good';
            feedback.textContent = '会盟通过，你守住了核心议题。';
          } else {
            state.virtue += 4;
            feedback.className = 'feedback warn';
            feedback.textContent = '会盟惊险过关，建议回看卡组构筑与风险控制。';
          }

          updateScoreboard();
          wrap.innerHTML = '<p>会盟终试结束，正在汇总你的六章成长档案...</p>';
          nextBtn.hidden = false;
        }
      }, 400);
    });
  }

  renderQuestion();
}

function renderFinalSummary() {
  const total = state.knowledge + state.virtue + state.wisdom;
  let rank = '杏坛进阶生';
  if (total >= 220) {
    rank = '杏坛宗师';
  } else if (total >= 150) {
    rank = '杏坛优等生';
  }

  screen.innerHTML = `
    <article class="stage">
      <h2>六章通关结算</h2>
      <p>恭喜！你已完成从入门到会盟试炼的完整修学之路。</p>
      <ul>
        <li>学识值：${state.knowledge}</li>
        <li>德行值：${state.virtue}</li>
        <li>智：${state.wisdom}</li>
        <li>总评：${total}</li>
        <li>称号：<strong>${rank}</strong></li>
      </ul>
      <p class="notice">终局建议：把“复盘-迁移-互讲-再测”写进你的每日学习流程。</p>
      <p class="progress">流程 20/20：最终结算（约 1 分钟）</p>
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
    totalCorrect: 0,
    chapter3Intel: 0,
    chapter3Actions: 0,
    chapter3Mistakes: 0,
    chapter4Pressure: 0,
    chapter5DeckPicked: 0,
    chapter5KnowledgeBoost: 0,
    chapter5WisdomShield: 0,
    chapter6Morale: 0,
    chapter6Risk: 0
  });
  restartBtn.hidden = true;
  updateScoreboard();
  goStage(0);
});

updateScoreboard();
goStage(0);
