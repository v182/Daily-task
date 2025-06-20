const taskForm = document.getElementById("task-form");
const pendingList = document.getElementById("pending-tasks");
const completedList = document.getElementById("completed-tasks");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

taskForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("task-title").value.trim();
  const desc = document.getElementById("task-desc").value.trim();
  if (!title || !desc) return;

  const newTask = {
    id: Date.now(),
    title,
    desc,
    status: "pending",
    createdAt: new Date().toLocaleString()
  };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskForm.reset();
});

function renderTasks() {
  pendingList.innerHTML = "";
  completedList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task";
    li.innerHTML = `
      <strong>${task.title}</strong><br>
      ${task.desc}
      <small>🕒 ${task.createdAt}</small>
      <div class="actions">
        <button onclick="toggleStatus(${task.id})">
          ${task.status === "pending" ? "Mark Complete" : "Mark Pending"}
        </button>
        <button onclick="editTask(${task.id})">Edit</button>
        <button onclick="deleteTask(${task.id})">X</button>
      </div>
    `;
    if (task.status === "pending") {
      pendingList.appendChild(li);
    } else {
      completedList.appendChild(li);
    }
  });
}

function toggleStatus(id) {
  tasks = tasks.map(task =>
    task.id === id
      ? {
          ...task,
          status: task.status === "pending" ? "completed" : "pending",
          createdAt: new Date().toLocaleString()
        }
      : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newTitle = prompt("Edit Title", task.title);
  const newDesc = prompt("Edit Description", task.desc);
  if (newTitle && newDesc) {
    task.title = newTitle;
    task.desc = newDesc;
    task.createdAt = new Date().toLocaleString();
    saveTasks();
    renderTasks();
  }
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Initial render on load
renderTasks();
