# 📚 Book Notes

A minimalist, read-only personal archive of books I've read — inspired by [Derek Sivers' book notes](https://sive.rs/book).

This project allows me to store, organize, and display book titles, ratings, notes, and covers in a clean, professional UI.

---

## 🔍 Features

- ✍️ Notes on every book I've read
- ⭐ Rating system
- 📆 Sort by rating, title, or recency
- 🖼️ Book covers via Open Library API
- ✅ Read-only public mode (no add/edit/delete on live version)
- 🎨 Polished Sivers-style minimalist design
- 📱 Responsive & mobile friendly
- 🧠 Built with Node.js, Express, PostgreSQL, EJS

---

## 🛠️ Tech Stack

- Node.js + Express.js
- PostgreSQL
- EJS Templating
- Open Library API (for book covers)
- HTML, CSS, JS

---

## 📦 Installation

> Clone and run locally if you'd like to see the full editable version.

```bash
git clone https://github.com/YOUR_USERNAME/book-notes.git
cd book-notes
npm install

Create a new .env file:
DATABASE_URL=your_postgres_connection_string

Then run:
nodemon index.js
