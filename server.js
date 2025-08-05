// server.js
const express = require('express');
const path = require('path');
const apiRoutes = require('./Back/api');
const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use('/api', apiRoutes);
// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'myWebPage.html'));
});
// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, 'public')));




app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
