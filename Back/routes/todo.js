const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const Todo = require('../../public/Javascript/models/Todo');

router.use(authMiddleware);
// POST /todo - créer une todo
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'Le titre est obligatoire' });

    // req.user sera rempli par ton middleware d'auth (décodé du token)
    const todo = new Todo({ title, user: req.user.id });
    await todo.save();

    res.status(201).json(todo);
    console.log('tentative de creation de todo du user:', req.user.id);
    console.log('Todo créée:', todo);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

// GET /todo - récupérer toutes les todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

// PUT /todo/:id - mettre à jour une todo (ex: completed)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const todo = await Todo.findByIdAndUpdate(id, updateData, { new: true });

    if (!todo) return res.status(404).json({ message: 'Todo non trouvée' });

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

// DELETE /todo/:id - supprimer une todo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) return res.status(404).json({ message: 'Todo non trouvée' });

    res.json({ message: 'Todo supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

module.exports = router;
