// Dependencies
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();

const { Pool } = require('pg');
const bookRoutes = require('./routes/books');

// PostgreSQL pool config
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use('/', bookRoutes);

// Home Route
app.get('/', async (req, res) => {
    try {
        // All books (for the full list)
        const allBooksResult = await pool.query('SELECT * FROM books ORDER BY title');
    
        // Top-rated books (rating 9 or 10)
        const topRatedResult = await pool.query(
          'SELECT * FROM books WHERE rating >= 9 ORDER BY rating DESC LIMIT 5'
        );
    
        // Recently read books (sorted by date)
        const recentResult = await pool.query(
          'SELECT * FROM books ORDER BY date_read DESC LIMIT 5'
        );
    
        res.render('index', {
            books: allBooksResult.rows,
            topBooks: topRatedResult.rows,
            recentBooks: recentResult.rows
        });
      } catch (err) {
            console.error('Error fetching books:', err);
            res.status(500).send('Something went wrong!');
      }
});

//GET route
// app.get('/add', (req, res) => {
//     res.send('Add Book Page Working');
// });  

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
