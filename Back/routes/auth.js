const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../public/Javascript/models/User');

const router = express.Router();

// POST /register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Utilisateur déjà existant' });

    const hashedPwd = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, email, password: hashedPwd });
    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email incorrect' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user._id, email: user.email }, "TestChaineSecrete", {
      expiresIn: '1h',
    });

    // Stocker le token dans un cookie httpOnly
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // cookie sécurisé en prod
      sameSite: 'none',  // pour la plupart des cas, tu peux ajuster selon ton front et back
      maxAge: 3600000, // 1 heure en ms, doit matcher l'expiration du token
    });

    // Tu peux aussi retourner l'utilisateur si besoin (sans token ici)
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

router.get('/me', (req, res) => {
  const token = req.cookies?.token; // nécessite cookie-parser middleware
  if (!token) {
    console.log('Pas de token trouvé');
    return res.status(401).json({ authenticated: false, message: 'Pas de token' });
  }

  try {
    const decoded = jwt.verify(token, "TestChaineSecrete");
    // Tu peux aussi renvoyer les infos utilisateur ici si besoin
    console.log('Token vérifié avec succès', decoded);
    res.json({
      authenticated: true,
      user: { id: decoded.id, email: decoded.email }
    });
  } catch (err) {
    res.status(401).json({ authenticated: false, message: 'Token invalide ou expiré' });
  }
});

module.exports = router;
