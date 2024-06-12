const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3003;

const validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const validCharsLength = validChars.length;

// Path to SQLite database file
const dbPath = path.resolve(__dirname, 'shurlten.db');

// Initialize SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS urls (
      short TEXT PRIMARY KEY,
      full TEXT NOT NULL
    )`, (err) => {
      if (err) {
        console.error('Error creating table', err.message);
      }
    });
  }
});

app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));
app.use('/js', express.static(path.join(__dirname, 'js'))); // Serve JavaScript files if using a js directory

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Helper function to generate a random 3-character string
function generateShortURL() {
  let result = '';
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * validCharsLength);
    result += validChars[randomIndex];
  }
  return result;
}

// Endpoint to create a shortened URL
app.post('/shorten', (req, res) => {
  const fullURL = req.body.url;
  if (!fullURL) {
    return res.status(400).send('Full URL is required');
  }

  // Generate a unique short URL
  function generateUniqueShortURL() {
    const shortURL = generateShortURL();
    db.get('SELECT short FROM urls WHERE short = ?', shortURL, (err, row) => {
      if (err) {
        return res.status(500).send('Database error');
      }
      if (row) {
        return generateUniqueShortURL(); // Recursively find a unique short URL
      } else {
        // Insert into the database
        db.run('INSERT INTO urls (short, full) VALUES (?, ?)', [shortURL, fullURL], (err) => {
          if (err) {
            return res.status(500).send('Database error');
          }
          return res.send({ shortURL });
        });
      }
    });
  }

  generateUniqueShortURL();
});


// Endpoint to get all URL mappings
app.get('/mappings', (req, res) => {
  db.all('SELECT short, full FROM urls', (err, rows) => {
    if (err) {
      return res.status(500).send('Database error');
    }
    res.send({ mappings: rows });
  });
});


/* PUT THIS LAST OR CATCH ALL ENDPOINT WILL BREAK OTHER ENDPOINTS
 * Alternatively, change from root to /shorts/:short or whatever */
// Endpoint to redirect to the full URL
app.get('/:short', (req, res) => {
  const shortURL = req.params.short;

  db.get('SELECT full FROM urls WHERE short = ?', shortURL, (err, row) => {
    if (err) {
      return res.status(500).send('Database error');
    }
    if (row) {
      return res.redirect(row.full);
    } else {
      return res.status(404).send('Short URL not found');
    }
  });
});


app.listen(port, () => {
  console.log(`URL shortener app listening at http://localhost:${port}`);
});
