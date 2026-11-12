
const form = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editId = null;

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStats() {
  document.getElementById("total").textContent = tasks.length;
  document.getElementById("completed").textContent =
    tasks.filter(t => t.completed).length;
  document.getElementById("pending").textContent =
    tasks.filter(t => !t.completed).length;
}

function renderTasks() {
  const search = document.getElementById("search").value.toLowerCase();
  const filter = document.getElementById("filter").value;
  const category = document.getElementById("categoryFilter").value;

  const filtered = tasks.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search);
    const matchesStatus = filter === "all" ||
      (filter === "completed" ? t.completed : !t.completed);
    const matchesCategory = category === "all" || t.category === category;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  taskList.innerHTML = "";

  if (!filtered.length) {
    taskList.innerHTML = '<p class="empty">No tasks found. Add a new task!</p>';
  }

  filtered.forEach(t => {
    const card = document.createElement("article");
    card.className = `task ${t.priority} ${t.completed ? "done" : ""}`;

    const title = document.createElement("h3");
    title.textContent = t.name;

    const details = document.createElement("p");
    details.textContent = `Category: ${t.category}`;

    const priority = document.createElement("p");
    priority.textContent = `Priority: ${t.priority.toUpperCase()}`;

    const date = document.createElement("p");
    date.textContent = `Due: ${t.dueDate}`;

    const status = document.createElement("p");
    status.textContent = t.completed ? "Completed" : "Pending";

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const toggle = document.createElement("button");
    toggle.className = "complete";
    toggle.textContent = t.completed ? "Undo" : "Done";
    toggle.addEventListener("click", () => toggleTask(t.id));

    const edit = document.createElement("button");
    edit.className = "edit";
    edit.textContent = "Edit";
    edit.addEventListener("click", () => editTask(t.id));

    const remove = document.createElement("button");
    remove.className = "delete";
    remove.textContent = "Delete";
    remove.addEventListener("click", () => deleteTask(t.id));

    actions.append(toggle, edit, remove);
    card.append(title, details, priority, date, status, actions);
    taskList.appendChild(card);
  });

  updateStats();
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const task = {
    id: editId || Date.now(),
    name: document.getElementById("taskName").value.trim(),
    category: document.getElementById("category").value,
    priority: document.getElementById("priority").value,
    dueDate: document.getElementById("dueDate").value,
    completed: editId
      ? tasks.find(t => t.id === editId).completed
      : false
  };

  if (!task.name || !task.dueDate) return;

  if (editId) {
    tasks = tasks.map(t => t.id === editId ? task : t);
    editId = null;
    document.getElementById("formTitle").textContent = "Add New Task";
    document.getElementById("submitBtn").textContent = "Add Task";
    document.getElementById("cancelEdit").hidden = true;
  } else {
    tasks.push(task);
  }

  saveTasks();
  form.reset();
  renderTasks();
});

function editTask(id) {
  const t = tasks.find(t => t.id === id);
  if (!t) return;

  editId = id;
  document.getElementById("taskName").value = t.name;
  document.getElementById("category").value = t.category;
  document.getElementById("priority").value = t.priority;
  document.getElementById("dueDate").value = t.dueDate;
  document.getElementById("formTitle").textContent = "Edit Task";
  document.getElementById("submitBtn").textContent = "Update Task";
  document.getElementById("cancelEdit").hidden = false;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteTask(id) {
  if (!confirm("Delete this task?")) return;
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks();
  renderTasks();
}

document.getElementById("cancelEdit").addEventListener("click", () => {
  editId = null;
  form.reset();
  document.getElementById("formTitle").textContent = "Add New Task";
  document.getElementById("submitBtn").textContent = "Add Task";
  document.getElementById("cancelEdit").hidden = true;
});

["search", "filter", "categoryFilter"].forEach(id => {
  document.getElementById(id).addEventListener("input", renderTasks);
});

renderTasks();
