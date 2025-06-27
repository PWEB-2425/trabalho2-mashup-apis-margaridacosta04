require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const User = require('./models/User');

const app = express();

// --- Conexão MongoDB ---
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));

// --- Configurações Express ---
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Pasta pública para CSS, JS, imagens

// --- Configuração de sessão ---
app.use(session({
  secret: process.env.SESSION_SECRET || 'segredo-super-secreto',
  resave: false,
  saveUninitialized: false,
}));

// --- Inicialização do Passport ---
app.use(passport.initialize());
app.use(passport.session());

// Configura Passport com LocalStrategy e User model
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware para deixar user disponível nas views
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Importa rotas
const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');

// **IMPORTANTE: rotas auth sem prefixo para acesso direto em /login, /register**
app.use('/', authRoutes);
app.use('/search', searchRoutes);

// Rota inicial
app.get('/', (req, res) => {
  res.render('index');
});

// Middleware para proteger rotas
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login'); // Ajustado para refletir rota sem prefixo
}

// Dashboard protegido
app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.user, artistInfo: null });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
