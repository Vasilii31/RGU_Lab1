// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./Back/api');
const app = express();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';
const PORT = process.env.PORT || 8080;

app.use(express.json());
//app.use(cors());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use('/api', apiRoutes);
// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'myWebPage.html'));
});
// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connecté !'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));


const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
});
const User = mongoose.model('User', UserSchema);

app.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // récupère tous les users en base
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/users', async (req, res) => {
  const user = new User(req.body); // on crée avec les données envoyées
  try {
    await user.save();
    res.status(201).json(user);
    console.log("user créé");
  } catch (err) {
    res.status(400).send(err);
  }
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
