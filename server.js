// server.js
const fs = require('fs');
const https = require('https');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const authRoutes = require('./Back/routes/auth');
const todoRoutes = require('./Back/routes/todo');
const userRoutes = require('./Back/routes/user');
//const apiRoutes = require('./Back/api');

const app = express();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', // ton front Next.js
  credentials: true,                // autorise l'envoi des cookies avec les requêtes cross-origin
}));

//app.use('/api', apiRoutes);
app.use('/todo', todoRoutes);
app.use('/user', userRoutes);
app.use('/api/auth', authRoutes);

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'myWebPage.html'));
});
// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, 'public')));

const options = {
  key: fs.readFileSync('/etc/ssl/certs/server.key'),  // correspond à 10.42.12.43-key.pem monté via Docker
  cert: fs.readFileSync('/etc/ssl/certs/server.crt'), // correspond à 10.42.12.43.pem monté via Docker
};


mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connecté !'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));


// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });
https.createServer(options, app).listen(8080, () => {
  console.log('Serveur HTTPS démarré sur le port 8080');
});
