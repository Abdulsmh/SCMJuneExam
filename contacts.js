// Contacts module: add, render, delete, persisted in localStorage

const CONTACTS_KEY = "scm_contacts";

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

        const info = document.createElement("span");
        info.textContent = `${contact.name} — ${contact.email}${contact.phone ? " — " + contact.phone : ""}`;

        const actions = document.createElement("span");
        actions.className = "item-actions";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", () => deleteContact(contact.id));

        actions.appendChild(deleteBtn);
        li.appendChild(info);
        li.appendChild(actions);
        list.appendChild(li);
    });
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
