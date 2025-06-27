const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

// Página de registro
router.get('/register', (req, res) => {
  res.render('register');
});

// Registro do usuário
router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username });
    const registeredUser = await User.register(user, password);

    // Loga o usuário automaticamente após registro
    req.login(registeredUser, err => {
      if (err) return next(err);
      res.redirect('/dashboard');
    });
  } catch (e) {
    // Pode ser melhor renderizar a página com erro, mas isso já ajuda
    res.send('Erro no registro: ' + e.message);
  }
});

// Página de login
router.get('/login', (req, res) => {
  res.render('login');
});

// Login (autenticação local)
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  })
);

// Logout (atualizado para async)
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports = router;

