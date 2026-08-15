// Tasks module: add, render, edit, complete, delete, persisted in localStorage

const TASKS_KEY = "scm_tasks";
let editingTaskId = null;

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

        if (editingTaskId === task.id) {
            li.appendChild(buildTaskEditRow(task));
            list.appendChild(li);
            return;
        }

        const info = document.createElement("span");
        info.textContent = task.title;
        if (task.completed) {
            info.style.textDecoration = "line-through";
            info.style.color = "#999";
        }

        const actions = document.createElement("span");
        actions.className = "item-actions";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => {
            editingTaskId = task.id;
            renderTasks(filterText);
        });

        const completeBtn = document.createElement("button");
        completeBtn.textContent = task.completed ? "Undo" : "Done";
        completeBtn.addEventListener("click", () => toggleTask(task.id));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", () => deleteTask(task.id));

        actions.appendChild(editBtn);
        actions.appendChild(completeBtn);
        actions.appendChild(deleteBtn);
        li.appendChild(info);
        li.appendChild(actions);
        list.appendChild(li);
    });
}

function buildTaskEditRow(task) {
    const wrapper = document.createElement("span");
    wrapper.className = "edit-row";

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.value = task.title;

    const prioritySelect = document.createElement("select");
    ["low", "medium", "high"].forEach((level) => {
        const opt = document.createElement("option");
        opt.value = level;
        opt.textContent = level.charAt(0).toUpperCase() + level.slice(1);
        if (level === task.priority) opt.selected = true;
        prioritySelect.appendChild(opt);
    });

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.addEventListener("click", () => {
        const title = titleInput.value.trim();
        if (!title) return;
        updateTask(task.id, title, prioritySelect.value);
    });

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("click", () => {
        editingTaskId = null;
        renderTasks();
    });

    wrapper.appendChild(titleInput);
    wrapper.appendChild(prioritySelect);
    wrapper.appendChild(saveBtn);
    wrapper.appendChild(cancelBtn);
    return wrapper;
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

function updateTask(id, title, priority) {
    const tasks = getTasks().map((t) =>
        t.id === id ? { ...t, title, priority } : t
    );
    saveTasks(tasks);
    editingTaskId = null;
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
