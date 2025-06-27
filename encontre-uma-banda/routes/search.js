const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const YT_API_KEY = process.env.YOUTUBE_API_KEY;

async function fetchArtistFromDeezer(artistName) {
  const url = `https://api.deezer.com/search/artist?q=${encodeURIComponent(artistName)}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.data && data.data.length > 0) {
    const artist = data.data[0];
    return {
      name: artist.name,
      picture: artist.picture_big,
      link: artist.link
    };
  }
  return null;
}

async function fetchVideosFromYouTube(artistName) {
  const maxResults = 3;
  const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(artistName + ' official music video')}&key=${YT_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.items) return [];

    return data.items
      .map(item => item.id.videoId)
      .filter(id => id)
      .map(id => `https://www.youtube.com/embed/${id}`);

  } catch (error) {
    console.error('Erro buscando vídeos no YouTube:', error);
    return [];
  }
}

async function fetchBioFromLastFm(artistName) {
  const LASTFM_API_KEY = process.env.LASTFM_API_KEY; // opcional
  if (!LASTFM_API_KEY) return null;

  const url = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${LASTFM_API_KEY}&format=json`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.artist && data.artist.bio && data.artist.bio.summary) {
      return data.artist.bio;
    }
    return null;
  } catch {
    return null;
  }
}

router.get('/results', async (req, res) => {
  const artistName = req.query.q;

  if (!artistName) {
    return res.render('results', { error: 'Por favor, informe o nome do artista.', artistInfo: null, artistImage: null, videos: [] });
  }

  try {
    // Busca artista Deezer
    const artistInfo = await fetchArtistFromDeezer(artistName);

    if (!artistInfo) {
      return res.render('results', { error: 'Artista não encontrado.', artistInfo: null, artistImage: null, videos: [] });
    }

    // Busca vídeos YouTube
    const videos = await fetchVideosFromYouTube(artistInfo.name);

    // Busca bio Last.fm (se tiver API key)
    const bio = await fetchBioFromLastFm(artistInfo.name);
    if (bio) artistInfo.bio = bio;

    res.render('results', {
      error: null,
      artistInfo,
      artistImage: artistInfo.picture,
      videos,
    });

  } catch (error) {
    console.error(error);
    res.render('results', { error: 'Erro ao buscar informações.', artistInfo: null, artistImage: null, videos: [] });
  }
});

module.exports = router;
