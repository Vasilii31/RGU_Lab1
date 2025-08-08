const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // référence un ObjectId
    ref: 'User',                          // le modèle référencé
    required: true,                      // chaque todo doit avoir un user
  },
});

module.exports = mongoose.model('Todo', todoSchema);