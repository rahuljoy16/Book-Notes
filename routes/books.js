const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

router.get('/filter', async (req, res) => {
    try {
        const { search, rating } = req.query;
        let query = 'SELECT * FROM books WHERE 1=1';
        const values = [];
  
        if (search) {
            query += ` AND (LOWER(title) LIKE $${values.length + 1} OR LOWER(author) LIKE $${values.length + 1})`;
            values.push(`%${search.toLowerCase()}%`);
        }
  
        if (rating) {
            query += ` AND rating >= $${values.length + 1}`;
            values.push(Number(rating));
        }
  
        query += ' ORDER BY title';
  
        const result = await pool.query(query, values);
  
        res.render('index', {
            books: result.rows,
            topBooks: [],
            recentBooks: [],
            search,
            rating
        });
    } catch (err) {
        console.error('Error filtering books:', err);
        res.status(500).send('Something went wrong!');
    }
});

// GET /add - Show form to add a new book
router.get('/add', (req, res) => {
    res.render('add', { book: null });
});

// POST /add - Save new book to the database
router.post('/add', async (req, res) => {
    try {
        const { title, author, rating, date_read, isbn, notes, pages, would_read_again } = req.body;
        const readAgain = would_read_again === 'true'; // convert to true/false
  
        // Optional: Fetch cover from Open Library API
        const cover_url = isbn
            ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
            : null;
  
        const query = `
            INSERT INTO books (title, author, rating, date_read, notes, isbn, cover_url, pages, would_read_again)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;
        const values = [title, author, rating, date_read, notes, isbn, cover_url, pages, readAgain];
  
        await pool.query(query, values);
        res.redirect('/');
    } catch (err) {
        console.error('Error inserting book:', err);
        res.status(500).send('Something went wrong!');
    }
});

// POST /delete/:id - Delete a book
router.post('/delete/:id', async (req, res) => {
    try {
        const bookId = req.params.id;
        await pool.query('DELETE FROM books WHERE id = $1', [bookId]);
        res.redirect('/');
    } catch (err) {
        console.error('Error deleting book:', err);
        res.status(500).send('Error deleting book');
    }
});

// GET /edit/:id - Show form with existing data
router.get('/edit/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).send('Book not found');
        res.render('edit', { book: result.rows[0] });
    } catch (err) {
        console.error('Error fetching book for edit:', err);
        res.status(500).send('Error fetching book');
    }
});
  
// POST /edit/:id - Update book in the database
router.post('/edit/:id', async (req, res) => {
    try {
        const { title, author, rating, date_read, isbn, notes, pages, would_read_again } = req.body;
        const readAgain = would_read_again === 'true';
        const cover_url = isbn
            ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
            : null;
  
        const query = `
            UPDATE books
            SET title = $1, author = $2, rating = $3, date_read = $4, isbn = $5, notes = $6, cover_url = $7, pages = $8, would_read_again = $9
            WHERE id = $10
        `;
        const values = [title, author, rating, date_read, isbn, notes, cover_url, pages, readAgain, req.params.id];

        await pool.query(query, values);
        res.redirect('/');
    } catch (err) {
        console.error('Error updating book:', err);
        res.status(500).send('Error updating book');
    }
});

router.get('/books/:id/notes', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
        const book = result.rows[0];
  
        if (!book) return res.send('<p>Book not found.</p>');
  
        res.send(`
            <h2>${book.title}</h2>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Rating:</strong> ${book.rating}/10</p>
            <p><strong>Date Read:</strong> ${book.date_read}</p>
            <p><strong>Would Read Again:</strong> ${book.would_read_again ? '✔️' : '❌'}</p>
            <p><strong>Notes:</strong></p>
            <p>${book.notes || 'No notes yet.'}</p>
        `);
    } catch (err) {
        console.error('Modal fetch error:', err);
        res.status(500).send('<p>Oops! Something went wrong.</p>');
    }
});  

router.get('/about', (req, res) => {
    res.render('about');
});  

module.exports = router;