const express = require('express');
const router = express.Router();
const axios = require('axios');

// Middleware para proteger rota (se usares autenticação)
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  res.redirect('/login');
}

// Rota: GET /search/results?q=nomeDaBanda
router.get('/results', isAuthenticated, async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.redirect('/dashboard');
  }

  try {
    // --- Consulta à API Last.fm ---
    const lastfmApiKey = process.env.LASTFM_API_KEY;
    const lastfmUrl = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(query)}&api_key=${lastfmApiKey}&format=json`;

    const lastfmResponse = await axios.get(lastfmUrl);
    const artistData = lastfmResponse.data.artist;

    // Extrai a imagem maior do artista
    const images = artistData.image || [];
    const artistImage = images.length ? images[images.length - 1]['#text'] : null;

    // --- Consulta à API YouTube ---
    const youtubeApiKey = process.env.YOUTUBE_API_KEY;
    const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${youtubeApiKey}&maxResults=5&type=video`;

    const youtubeResponse = await axios.get(youtubeUrl);
    const videos = youtubeResponse.data.items;

    // --- Renderiza a página de resultados ---
    res.render('results', {
      artist: artistData,
      artistImage,
      videos,
      error: null
    });

  } catch (error) {
    console.error('Erro na busca:', error.message);
    res.render('results', {
      artist: null,
      artistImage: null,
      videos: [],
      error: 'Erro ao buscar dados. Verifique o nome da banda ou tente novamente.'
    });
  }
});

module.exports = router;

