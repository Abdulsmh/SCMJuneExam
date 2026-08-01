# Contact & Task Manager

A simple client-side web app for managing contacts and tasks, built as part of the SCM June Exam project.

## Features

- **Contacts:** add and delete contacts (name, email, phone), persisted in the browser via `localStorage`.
- **Tasks:** add tasks with a priority level (low/medium/high), mark them complete/incomplete, and delete them. Also persisted via `localStorage`.
- **Tabbed UI:** switch between the Contacts and Tasks views without page reload.

## Project structure

| File | Purpose |
|---|---|
| `index.html` | Page structure, tabs, and forms |
| `styles.css` | All styling |
| `contacts.js` | Contacts CRUD logic |
| `tasks.js` | Tasks CRUD logic |
| `script.js` | Tab-switching UI logic |

## Running locally

No build step required — just open `index.html` in a browser.

## Development workflow

This project was built using feature branches merged into `main` via pull requests:

1. `feature/html-structure` — page layout and forms
2. `feature/styling` — CSS
3. `feature/contacts-logic` — contacts CRUD + storage
4. `feature/tasks-logic` — tasks CRUD + storage, tab switching
5. `feature/readme-docs` — this document
