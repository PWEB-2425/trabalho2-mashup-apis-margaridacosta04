require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/User');
const path = require('path');

const app = express();

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Erro ao conectar no MongoDB:', err));

// Configurações do Express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'segredo-super-secreto',
  resave: false,
  saveUninitialized: false,
}));

// Passport.js
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Variável global do user para as views
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Rotas
const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');

app.use('/auth', authRoutes);
app.use('/search', searchRoutes);

// Rota principal
app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

// Middleware de autenticação
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
}

// Rota protegida
app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.user, artistInfo: null });
});

// Start do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
