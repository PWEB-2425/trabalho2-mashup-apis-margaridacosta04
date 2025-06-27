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

// Integra passport-local-mongoose para criar automaticamente
// campos de hash e salt, além de métodos auxiliares para autenticação
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
