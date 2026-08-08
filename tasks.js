// Tasks module: add, render, complete, delete, persisted in localStorage

const TASKS_KEY = "scm_tasks";

function getTasks() {
    const raw = localStorage.getItem(TASKS_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveTasks(tasks) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function renderTasks(filterText) {
    const list = document.getElementById("task-list");
    list.innerHTML = "";
    let tasks = getTasks();

    if (filterText) {
        const term = filterText.toLowerCase();
        tasks = tasks.filter((t) => t.title.toLowerCase().includes(term));
    }

    tasks.forEach((task) => {
        const li = document.createElement("li");
        li.className = `priority-${task.priority}`;

        const info = document.createElement("span");
        info.textContent = task.title;
        if (task.completed) {
            info.style.textDecoration = "line-through";
            info.style.color = "#999";
        }

        const actions = document.createElement("span");
        actions.className = "item-actions";

        const completeBtn = document.createElement("button");
        completeBtn.textContent = task.completed ? "Undo" : "Done";
        completeBtn.addEventListener("click", () => toggleTask(task.id));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", () => deleteTask(task.id));

        actions.appendChild(completeBtn);
        actions.appendChild(deleteBtn);
        li.appendChild(info);
        li.appendChild(actions);
        list.appendChild(li);
    });
}

function addTask(title, priority) {
    const tasks = getTasks();
    tasks.push({
        id: Date.now().toString(),
        title,
        priority,
        completed: false
    });
    saveTasks(tasks);
    renderTasks();
}

function toggleTask(id) {
    const tasks = getTasks().map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
    );
    saveTasks(tasks);
    const searchInput = document.getElementById("task-search");
    renderTasks(searchInput ? searchInput.value.trim() : "");
}

function deleteTask(id) {
    const tasks = getTasks().filter((t) => t.id !== id);
    saveTasks(tasks);
    const searchInput = document.getElementById("task-search");
    renderTasks(searchInput ? searchInput.value.trim() : "");
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("task-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("task-title").value.trim();
        const priority = document.getElementById("task-priority").value;

        if (!title) return;

        addTask(title, priority);
        form.reset();
    });

    const searchInput = document.getElementById("task-search");
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            renderTasks(searchInput.value.trim());
        });
    }

    renderTasks();
});
