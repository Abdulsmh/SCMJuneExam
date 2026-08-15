// Contacts module: add, render, edit, delete, persisted in localStorage

const CONTACTS_KEY = "scm_contacts";
let editingContactId = null;

function getContacts() {
    const raw = localStorage.getItem(CONTACTS_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveContacts(contacts) {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
}

function renderContacts(filterText) {
    const list = document.getElementById("contact-list");
    list.innerHTML = "";
    let contacts = getContacts();

    if (filterText) {
        const term = filterText.toLowerCase();
        contacts = contacts.filter(
            (c) => c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term)
        );
    }

    contacts.forEach((contact) => {
        const li = document.createElement("li");

        if (editingContactId === contact.id) {
            li.appendChild(buildContactEditRow(contact));
            list.appendChild(li);
            return;
        }

        const info = document.createElement("span");
        info.textContent = `${contact.name} — ${contact.email}${contact.phone ? " — " + contact.phone : ""}`;

        const actions = document.createElement("span");
        actions.className = "item-actions";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => {
            editingContactId = contact.id;
            renderContacts(filterText);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", () => deleteContact(contact.id));

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        li.appendChild(info);
        li.appendChild(actions);
        list.appendChild(li);
    });
}

function buildContactEditRow(contact) {
    const wrapper = document.createElement("span");
    wrapper.className = "edit-row";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = contact.name;

    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.value = contact.email;

    const phoneInput = document.createElement("input");
    phoneInput.type = "tel";
    phoneInput.value = contact.phone || "";

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.addEventListener("click", () => {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        if (!name || !email) return;
        updateContact(contact.id, name, email, phone);
    });

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("click", () => {
        editingContactId = null;
        renderContacts();
    });

    wrapper.appendChild(nameInput);
    wrapper.appendChild(emailInput);
    wrapper.appendChild(phoneInput);
    wrapper.appendChild(saveBtn);
    wrapper.appendChild(cancelBtn);
    return wrapper;
}

function addContact(name, email, phone) {
    const contacts = getContacts();
    contacts.push({
        id: Date.now().toString(),
        name,
        email,
        phone
    });
    saveContacts(contacts);
    renderContacts();
}

function updateContact(id, name, email, phone) {
    const contacts = getContacts().map((c) =>
        c.id === id ? { ...c, name, email, phone } : c
    );
    saveContacts(contacts);
    editingContactId = null;
    renderContacts();
}

function deleteContact(id) {
    const contacts = getContacts().filter((c) => c.id !== id);
    saveContacts(contacts);
    const searchInput = document.getElementById("contact-search");
    renderContacts(searchInput ? searchInput.value.trim() : "");
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("contact-name").value.trim();
        const email = document.getElementById("contact-email").value.trim();
        const phone = document.getElementById("contact-phone").value.trim();

        if (!name || !email) return;

        addContact(name, email, phone);
        form.reset();
    });

    const searchInput = document.getElementById("contact-search");
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            renderContacts(searchInput.value.trim());
        });
    }

    renderContacts();
});
