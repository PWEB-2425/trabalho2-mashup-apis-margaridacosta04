const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  searches: [
    {
      term: String,
      date: { type: Date, default: Date.now }
    }
  ]
});

// Adiciona métodos e campos para autenticação (senha hash, salt, etc)
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
