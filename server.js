const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Connect to the SQLite database
const db = new sqlite3.Database('users.db');

// Middleware to parse JSON
app.use(bodyParser.json());

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Default route for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Loginform.html'));
});

// Handle form submissions
app.post('/submit', (req, res) => {
    // Extract form data from the request body
    const { name, email, age, dob } = req.body;

    console.log('Received form data:', req.body);

    // Check if the 'name' field is present and not empty
    if (!name || name.trim() === '') {
        console.error('Error: Name field is missing or empty');
        return res.status(400).send('Name is required');
    }

    // Insert data into the database
    const sql = 'INSERT INTO users (name, email, age, dateOfBirth) VALUES (?, ?, ?, ?)';
    db.run(sql, [name, email, age, dob], (err) => {
        if (err) {
            console.error('Error inserting data into database:', err.message);
            return res.status(500).send('Error inserting data into database');
        }

        console.log('Data inserted into the database');
        res.status(200).send('Data inserted into the database');
    });
});
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to retrieve data and display it in an HTML table
app.get('/users', (req, res) => {
    // Fetch data from the database
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            console.error('Error fetching data from the database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Render HTML table
        const htmlTable = generateHTMLTable(rows);

        // Send the HTML response
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>User Data</title>
                <style>
            
                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }

                    th, td {
                        border: 1px solid #dddddd;
                        text-align: left;
                        padding: 8px;
                    }

                    th {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <h1>User Data</h1>
                ${htmlTable}
            </body>
            </html>
        `);
    });
});

// Helper function to generate HTML table from data
function generateHTMLTable(data) {
    if (data.length === 0) {
        return '<p>No data available.</p>';
    }

    const headers = Object.keys(data[0]);
    const headerRow = headers.map(header => `<th>${header}</th>`).join('');
    const rows = data.map(row => {
        const cells = headers.map(header => `<td>${row[header]}</td>`).join('');
        return `<tr>${cells}</tr>`;
    }).join('');

    return `
        <table>
            <thead>
                <tr>${headerRow}</tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    `;
}
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
