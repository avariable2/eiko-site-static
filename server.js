const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour servir les fichiers statiques - configuration simplifiée
app.use(express.static(path.join(__dirname, 'public')));

// Middleware pour détecter la langue à partir de l'en-tête 'Accept-Language'
function detectLanguage(req) {
    const acceptLanguage = req.headers['accept-language'];
    if (!acceptLanguage) return 'en'; // Langue par défaut : anglais

    const languages = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim().toLowerCase());

    // Liste des langues supportées
    const supportedLanguages = ['fr', 'en'];

    for (let lang of languages) {
        if (supportedLanguages.includes(lang)) {
            return lang;
        }
        // Vérifie si la langue commence par un code supporté (e.g., 'fr-CA' -> 'fr')
        for (let supportedLang of supportedLanguages) {
            if (lang.startsWith(supportedLang)) {
                return supportedLang;
            }
        }
    }

    return 'en'; // Langue par défaut si aucune langue supportée n'est trouvée
}

// Route spécifique pour apple-app-site-association
app.get('/apple-app-site-association', (req, res) => {
    const filePath = path.join(__dirname, 'apple-app-site-association');
    
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

// Route pour .well-known/assetlinks.json
app.get('/.well-known/assetlinks.json', (req, res) => {
    const filePath = path.join(__dirname, '.well-known', 'assetlinks.json');

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('Fichier assetlinks non trouvé:', err);
            return res.status(404).send('Not Found');
        }
        console.log('Fichier assetlinks trouvé');
        res.setHeader('Content-Type', 'application/json');
        res.sendFile(filePath);
    });
});

// Routes pour les segments spécifiques (referral, user)
app.get(['/referral/:code', '/user/:id'], (req, res) => {
    const lang = detectLanguage(req);
    
    // Au lieu de rediriger, servir directement le fichier index.html approprié
    res.sendFile(path.join(__dirname, 'public', lang, 'index.html'));
});

// Route pour les pages de langue racine
app.get('/fr', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'fr', 'index.html'));
});

app.get('/en', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'en', 'index.html'));
});

// Routes pour les sous-chemins de langue
app.get('/fr/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'fr', 'index.html'));
});

app.get('/en/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'en', 'index.html'));
});

// Route catch-all pour les autres chemins
app.get('*', (req, res) => {
    const lang = detectLanguage(req);
    res.sendFile(path.join(__dirname, 'public', lang, 'index.html'));
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});