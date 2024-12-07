const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route spécifique pour apple-app-site-association
app.get('/apple-app-site-association', (req, res) => {
  const filePath = path.join(__dirname, 'apple-app-site-association');
  
  // Vérifiez si le fichier existe
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('Fichier AASA non trouvé:', err);
      return res.status(404).send('Not Found');
    }
    console.log('Fichier AASA trouvé');
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(filePath);
  });
});

// For any other routes, serve the index.html
app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Set the port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});