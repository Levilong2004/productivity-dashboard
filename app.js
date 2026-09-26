// ===== 番茄钟 =====
const timerDisplay = document.getElementById("timerDisplay");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const modeBtns = document.querySelectorAll(".mode-btn");
const pomodoroCountEl = document.getElementById("pomodoroCount");

let totalSeconds = 25 * 60;
let remaining = totalSeconds;
let timerInterval = null;
let isRunning = false;
let currentMode = "work";
let pomodoroCount = parseInt(localStorage.getItem("pomodoroCount") || "0", 10);
const today = new Date().toDateString();
const savedDate = localStorage.getItem("pomodoroDate");
if (savedDate !== today) {
  pomodoroCount = 0;
  localStorage.setItem("pomodoroDate", today);
}
pomodoroCountEl.textContent = pomodoroCount;

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function updateDisplay() {
  timerDisplay.textContent = formatTime(remaining);
  document.title = `${formatTime(remaining)} - 生产力仪表盘`;
}

function startTimer() {
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.textContent = "继续";
    return;
  }
  isRunning = true;
  startBtn.textContent = "暂停";
  timerInterval = setInterval(() => {
    remaining--;
    updateDisplay();
    if (remaining <= 0) {
      clearInterval(timerInterval);
      isRunning = false;
      startBtn.textContent = "开始";
      if (currentMode === "work") {
        pomodoroCount++;
        localStorage.setItem("pomodoroCount", pomodoroCount);
        pomodoroCountEl.textContent = pomodoroCount;
      }
      alert(currentMode === "work" ? "专注时间结束，休息一下吧！" : "休息结束，继续加油！");
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  remaining = totalSeconds;
  startBtn.textContent = "开始";
  updateDisplay();
}

modeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    modeBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentMode = btn.dataset.mode;
    totalSeconds = parseInt(btn.dataset.minutes, 10) * 60;
    resetTimer();
  });
});

startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);
updateDisplay();

// ===== 任务清单 =====
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");

let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item" + (task.done ? " done" : "");
    li.innerHTML = `
      <input type="checkbox" ${task.done ? "checked" : ""} data-index="${index}" />
      <span class="task-text"></span>
      <button class="delete-btn" data-index="${index}" title="删除">×</button>
    `;
    li.querySelector(".task-text").textContent = task.text;
    taskList.appendChild(li);
  });
  updateStats();
}

function updateStats() {
  totalTasksEl.textContent = tasks.length;
  completedTasksEl.textContent = tasks.filter((t) => t.done).length;
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ text, done: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
}

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

taskList.addEventListener("click", (e) => {
  const index = e.target.dataset.index;
  if (index === undefined) return;
  if (e.target.type === "checkbox") {
    tasks[index].done = e.target.checked;
    saveTasks();
    renderTasks();
  } else if (e.target.classList.contains("delete-btn")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
});

renderTasks();
