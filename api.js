// api.js
const express = require('express');
const router = express.Router();

router.post('/calculate', (req, res) => {
  const { salary, days } = req.body;

  const dailyRate = parseFloat(salary) / 365;
  const finalPrice = Math.round(dailyRate * parseFloat(days));

  res.json({ finalPrice });
});

module.exports = router;
