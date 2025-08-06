// api.js
const express = require('express');
const router = express.Router();

router.post('/calculate', (req, res) => {

  
  const { salary, days } = req.body;
  console.log("salary : " + salary);  
  console.log("days : " + days); 
  const dailyRate = parseFloat(salary) / 365;
  const finalPrice = Math.round(dailyRate * parseFloat(days));

  console.log("dailyRate : " + dailyRate); 
  console.log("finalPrice : " + finalPrice); 
  res.json({ finalPrice });
});

//routeur.get('users/create')

module.exports = router;
