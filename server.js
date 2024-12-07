// server.js

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/.well-known/apple-app-site-association', (req, res) => {
    res.type('application/json');
    res.sendFile(path.join(__dirname, 'public', '.well-known', 'apple-app-site-association'));
  });  

// For any other routes, serve the index.html
app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Set the port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});