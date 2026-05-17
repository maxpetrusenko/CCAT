const LETTERS = ["A", "B", "C", "D", "E"];
const TEST_MINUTES = 15;
const stateKey = "ccat-combined-state-v1";
const responseKey = "ccat-combined-responses-v1";
const keyOverrideKey = "ccat-combined-key-overrides-v1";
const noteOverrideKey = "ccat-combined-note-overrides-v1";

const textBank = window.CCAT_TEXT_BANK || {};
const savedState = JSON.parse(localStorage.getItem(stateKey) || "{}");
const responses = JSON.parse(localStorage.getItem(responseKey) || "{}");
const keyOverrides = JSON.parse(localStorage.getItem(keyOverrideKey) || "{}");
const noteOverrides = JSON.parse(localStorage.getItem(noteOverrideKey) || "{}");

let activeSet = savedState.activeSet || "ccat-1";
let activeCategory = savedState.activeCategory || "All";
let mode = savedState.mode || "test";
let currentIndex = savedState.currentIndex || 0;
let reviewMode = "incorrect";
let deadline = savedState.deadline || Date.now() + TEST_MINUTES * 60 * 1000;
let finished = Boolean(savedState.finished);

const setSelect = document.getElementById("setSelect");
const categorySelect = document.getElementById("categorySelect");
const modeTest = document.getElementById("modeTest");
const modeAll = document.getElementById("modeAll");
const metaLine = document.getElementById("metaLine");
const progress = document.getElementById("progress");
const timer = document.getElementById("timer");
const stage = document.getElementById("stage");
const answerBar = document.getElementById("answerBar");
const chips = document.getElementById("chips");
const scorePanel = document.getElementById("scorePanel");
const scoreTitle = document.getElementById("scoreTitle");
const scoreMeta = document.getElementById("scoreMeta");
const reviewGrid = document.getElementById("reviewGrid");

function saveState() {
  localStorage.setItem(stateKey, JSON.stringify({ activeSet, activeCategory, mode, currentIndex, deadline, finished }));
}

function saveResponses() {
  localStorage.setItem(responseKey, JSON.stringify(responses));
}

function saveKeyOverrides() {
  localStorage.setItem(keyOverrideKey, JSON.stringify(keyOverrides));
}

function normalizeQuestion(set, q) {
  const merged = { ...q, ...(textBank[q.id] || {}) };
  const category = merged.category || (merged.type === "image" ? "Image" : "Other");
  const answer = keyOverrides[merged.id] || merged.answer || "";
  return {
    ...merged,
    setId: set.id,
    setTitle: set.title,
    category,
    answer,
    explanation: noteOverrides[merged.id] || merged.explanation || "",
    imagePath: merged.image ? `${set.sourcePath}/${merged.image}` : "",
    needsReview: !merged.prompt || !answer || merged.missing || (!merged.choices && merged.type === "text")
  };
}

function allQuestions() {
  return (window.CCAT_SETS || []).flatMap((set) => set.questions.map((q) => normalizeQuestion(set, q)));
}

function sourceQuestions() {
  const pool = activeSet === "all"
    ? allQuestions()
    : allQuestions().filter((q) => q.setId === activeSet);
  return activeCategory === "All" ? pool : pool.filter((q) => q.category === activeCategory);
}

function visibleQuestions() {
  const pool = sourceQuestions();
  return mode === "test" ? pool.slice(0, 50) : pool;
}

function currentQuestion() {
  const qs = visibleQuestions();
  currentIndex = Math.max(0, Math.min(currentIndex, Math.max(0, qs.length - 1)));
  return qs[currentIndex];
}

function selectedFor(q) {
  return q ? responses[q.id] || "" : "";
}

function answerValue(q, letter) {
  if (!letter) return "No reply";
  return q.choices && q.choices[letter] ? `${letter}. ${q.choices[letter]}` : letter;
}

function resultFor(q) {
  const selected = selectedFor(q);
  if (!q.answer) return selected ? "missing-key" : "needs-review";
  if (!selected) return "blank";
  return selected === q.answer ? "correct" : "wrong";
}

function renderSelectors() {
  const sets = [{ id: "all", title: "All folders" }, ...(window.CCAT_SETS || [])];
  setSelect.innerHTML = sets.map((set) => `<option value="${set.id}">${set.title}</option>`).join("");
  setSelect.value = activeSet;

  const categories = ["All", ...Array.from(new Set(sourceQuestions().map((q) => q.category))).sort()];
  categorySelect.innerHTML = categories.map((category) => `<option value="${category}">${category}</option>`).join("");
  if (!categories.includes(activeCategory)) activeCategory = "All";
  categorySelect.value = activeCategory;
}

function renderStage(q) {
  stage.innerHTML = "";
  if (!q) {
    stage.innerHTML = '<div class="missing">No questions for this selection.</div>';
    return;
  }

  if (q.type === "text") {
    const card = document.createElement("div");
    card.className = "text-card";
    const prompt = document.createElement("p");
    prompt.className = "prompt";
    prompt.textContent = q.prompt || "Prompt needs review.";
    const list = document.createElement("div");
    list.className = "choice-list";
    LETTERS.filter((letter) => q.choices && q.choices[letter]).forEach((letter) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = `choice-row selectable${selectedFor(q) === letter ? " selected" : ""}`;
      row.innerHTML = `<span class="letter">${letter}</span><span class="choice-value"></span>`;
      row.querySelector(".choice-value").textContent = q.choices[letter];
      row.addEventListener("click", () => {
        if (responses[q.id] === letter) delete responses[q.id];
        else responses[q.id] = letter;
        saveResponses();
        if (currentIndex === visibleQuestions().length - 1 && responses[q.id]) {
          finished = true;
          reviewMode = "all";
          scorePanel.classList.add("visible");
          document.querySelectorAll("[data-review]").forEach((item) => item.classList.toggle("active", item.dataset.review === "all"));
        }
        render();
        if (finished && currentIndex === visibleQuestions().length - 1) {
          scorePanel.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
      list.appendChild(row);
    });
    card.append(prompt, list);
    stage.appendChild(card);
    return;
  }

  const img = document.createElement("img");
  img.alt = `${q.setTitle} question ${q.number}`;
  img.src = q.imagePath;
  img.addEventListener("error", () => {
    stage.innerHTML = `<div class="missing">Image needs review.<br>Expected: ${q.imagePath}</div>`;
  });
  stage.appendChild(img);
}

function renderAnswerBar(q) {
  answerBar.innerHTML = "";
  answerBar.classList.toggle("empty", Boolean(q && q.type === "text"));
  if (q && q.type === "text") return;
  LETTERS.forEach((letter) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `choice${selectedFor(q) === letter ? " selected" : ""}`;
    button.textContent = q && q.type === "text" && q.choices && q.choices[letter]
      ? `${letter} ${q.choices[letter]}`
      : letter;
    button.disabled = !q;
    button.title = q && q.choices && q.choices[letter] ? q.choices[letter] : `Answer ${letter}`;
    button.addEventListener("click", () => {
      if (!q) return;
      if (responses[q.id] === letter) delete responses[q.id];
      else responses[q.id] = letter;
      saveResponses();
      if (currentIndex === visibleQuestions().length - 1 && responses[q.id]) {
        finished = true;
        reviewMode = "all";
        scorePanel.classList.add("visible");
        document.querySelectorAll("[data-review]").forEach((item) => item.classList.toggle("active", item.dataset.review === "all"));
      }
      render();
      if (finished && currentIndex === visibleQuestions().length - 1) {
        scorePanel.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    answerBar.appendChild(button);
  });
}

function renderChips(qs) {
  chips.innerHTML = "";
  qs.forEach((q, index) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `chip${index === currentIndex ? " active" : ""}${selectedFor(q) ? " answered" : ""}${q.needsReview ? " needs-review" : ""}`;
    chip.textContent = index + 1;
    chip.title = `${q.setTitle} Q${q.number} · ${q.category}`;
    chip.addEventListener("click", () => {
      currentIndex = index;
      saveState();
      render();
    });
    chips.appendChild(chip);
  });
}

function renderReview() {
  const qs = visibleQuestions();
  const keyed = qs.filter((q) => q.answer);
  const answered = qs.filter((q) => selectedFor(q));
  const correct = qs.filter((q) => resultFor(q) === "correct");
  const wrong = qs.filter((q) => resultFor(q) === "wrong");
  const noKey = qs.filter((q) => !q.answer);
  const needs = qs.filter((q) => q.needsReview);
  const percent = keyed.length ? Math.round((correct.length / keyed.length) * 100) : 0;
  const needsList = needs.slice(0, 12).map((q) => `${q.setTitle} Q${q.number}`).join(", ");
  const needsMore = needs.length > 12 ? ` + ${needs.length - 12} more` : "";

  scoreTitle.textContent = keyed.length ? `${correct.length} / ${keyed.length} correct (${percent}%)` : "No answer keys yet";
  scoreMeta.textContent = `${answered.length} replied · ${wrong.length} incorrect · ${noKey.length} no key · ${needs.length} needs review${needs.length ? `: ${needsList}${needsMore}` : ""}`;

  let list = wrong;
  if (reviewMode === "all") list = qs;
  if (reviewMode === "needs") list = needs;
  if (reviewMode === "missing") list = noKey;

  reviewGrid.innerHTML = "";
  if (!list.length) {
    reviewGrid.innerHTML = '<div class="review-card"><div class="review-title">Nothing here</div><p class="review-line">Switch review tabs or answer more questions.</p></div>';
    return;
  }

  list.forEach((q) => {
    const selected = selectedFor(q);
    const state = resultFor(q);
    const card = document.createElement("button");
    card.type = "button";
    card.className = `review-card ${state}`;
    card.innerHTML = `
      <div class="review-title"><span>${q.setTitle} Q${q.number}</span><span>${q.category}</span></div>
      <p class="review-line">Your reply: ${answerValue(q, selected)}</p>
      <p class="review-line">Correct: ${q.answer ? answerValue(q, q.answer) : "No key"}</p>
      <p class="review-line">${q.explanation || "No explanation saved."}</p>
    `;
    card.addEventListener("click", () => {
      currentIndex = qs.findIndex((item) => item.id === q.id);
      saveState();
      render();
      scorePanel.scrollIntoView({ behavior: "smooth", block: "end" });
    });
    if (!q.answer && selected) {
      const save = document.createElement("button");
      save.type = "button";
      save.className = "save-key";
      save.textContent = "Save my reply as key";
      save.addEventListener("click", (event) => {
        event.stopPropagation();
        keyOverrides[q.id] = selected;
        saveKeyOverrides();
        render();
      });
      card.appendChild(save);
    }
    reviewGrid.appendChild(card);
  });
}

function render() {
  renderSelectors();
  modeTest.classList.toggle("active", mode === "test");
  modeAll.classList.toggle("active", mode === "all");
  const qs = visibleQuestions();
  const q = currentQuestion();
  const count = qs.length;
  progress.style.width = count ? `${((currentIndex + 1) / count) * 100}%` : "0%";
  metaLine.innerHTML = q
    ? `<span>${currentIndex + 1} / ${count}</span><span class="pill">${q.setTitle}</span><span class="pill">${q.category}</span><span class="pill">${q.type === "text" ? "Text" : "Image"}</span>${q.needsReview ? '<span class="pill">Needs review</span>' : ""}`
    : "<span>No questions</span>";
  renderStage(q);
  renderAnswerBar(q);
  renderChips(qs);
  saveState();
  if (finished || scorePanel.classList.contains("visible")) {
    scorePanel.classList.add("visible");
    renderReview();
  }
}

function go(offset) {
  const qs = visibleQuestions();
  currentIndex = Math.max(0, Math.min(currentIndex + offset, qs.length - 1));
  saveState();
  render();
}

function resetTimer() {
  deadline = Date.now() + TEST_MINUTES * 60 * 1000;
  finished = false;
  scorePanel.classList.remove("visible");
  saveState();
}

function tick() {
  const remaining = Math.max(0, deadline - Date.now());
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  timer.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  timer.classList.toggle("low", remaining > 0 && remaining <= 60000);
  timer.classList.toggle("done", remaining === 0);
  if (remaining === 0 && !finished && mode === "test") {
    finished = true;
    scorePanel.classList.add("visible");
    saveState();
    renderReview();
  }
}

setSelect.addEventListener("change", () => {
  activeSet = setSelect.value;
  activeCategory = "All";
  currentIndex = 0;
  resetTimer();
  render();
});
categorySelect.addEventListener("change", () => {
  activeCategory = categorySelect.value;
  currentIndex = 0;
  resetTimer();
  render();
});
modeTest.addEventListener("click", () => {
  mode = "test";
  currentIndex = 0;
  resetTimer();
  render();
});
modeAll.addEventListener("click", () => {
  mode = "all";
  currentIndex = 0;
  resetTimer();
  render();
});
document.getElementById("prev").addEventListener("click", () => go(-1));
document.getElementById("next").addEventListener("click", () => go(1));
document.getElementById("finish").addEventListener("click", () => {
  finished = true;
  scorePanel.classList.add("visible");
  saveState();
  renderReview();
  scorePanel.scrollIntoView({ behavior: "smooth", block: "start" });
});
document.getElementById("reset").addEventListener("click", () => {
  visibleQuestions().forEach((q) => delete responses[q.id]);
  currentIndex = 0;
  resetTimer();
  saveResponses();
  render();
});
document.getElementById("hideScore").addEventListener("click", () => scorePanel.classList.remove("visible"));
document.querySelectorAll("[data-review]").forEach((button) => {
  button.addEventListener("click", () => {
    reviewMode = button.dataset.review;
    document.querySelectorAll("[data-review]").forEach((item) => item.classList.toggle("active", item === button));
    renderReview();
  });
});
document.addEventListener("keydown", (event) => {
  const key = event.key.toUpperCase();
  if (event.key === "ArrowLeft") go(-1);
  if (event.key === "ArrowRight") go(1);
      if (LETTERS.includes(key)) {
        const q = currentQuestion();
        if (!q) return;
        responses[q.id] = key;
        saveResponses();
        if (currentIndex === visibleQuestions().length - 1) {
          finished = true;
          reviewMode = "all";
          scorePanel.classList.add("visible");
          document.querySelectorAll("[data-review]").forEach((item) => item.classList.toggle("active", item.dataset.review === "all"));
        }
        render();
        if (finished && currentIndex === visibleQuestions().length - 1) {
          scorePanel.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });

render();
tick();
setInterval(tick, 1000);
