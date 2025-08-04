// server.js
const express = require('express');
const path = require('path');
const apiRoutes = require('./api');
const app = express();

const PORT = process.env.PORT || 8080;

// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use('/api', apiRoutes);
// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'myWebPage.html'));
});





app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
