// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const todoRoutes = require('./routes/todo');
const userRoutes = require('./routes/user');
const apiRoutes = require('./Back/api');

const app = express();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

app.use('/api', apiRoutes);
app.use('/todo', todoRoutes);
app.use('/user', userRoutes);

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'myWebPage.html'));
});
// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connecté !'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
