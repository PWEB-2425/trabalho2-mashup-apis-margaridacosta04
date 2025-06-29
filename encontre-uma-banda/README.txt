# 🎵 Music Info App

Este projeto, realizado pelo grupo constituido pelos membros: Leandro Costa 26618 e Margarida Costa 32425, consistiu na criação de uma aplicação web com sistema de **login/registo de utilizadores**, que permite ao utilizador pesquisar um **artista ou banda** e obter:
- Imagem de perfil (via API do **Deezer**)
- Descrição do artista (via API do **Last.fm**)
- Um exemplo de música (via API do **YouTube**)

---

## 📦 Tecnologias Utilizadas

- **Node.js / Express**
- **MongoDB (Mongoose)**
- **APIs externas**:
  - [YouTube Data API](https://developers.google.com/youtube)
  - [Deezer API](https://developers.deezer.com/)
  - [Last.fm API](https://www.last.fm/api)
- **Render** para alojamento da aplicação

---

## 🔧 Configuração do Projeto

### Configurar variáveis de ambiente

Cria um ficheiro `.env` com as seguintes chaves:

```
MONGO_URI=ligação_à_base_de_dados_mongodb
YOUTUBE_API_KEY=chave_api_youtube
LASTFM_API_KEY=chave_api_lastfm
DEEZER_API_URL=https://api.deezer.com
JWT_SECRET=uma_chave_secreta_segura
```

---

## 📁 Estrutura de Ficheiros

```
.
├── server.js                 # Ficheiro principal de arranque
├── public                     
│   ├── style.css             
├── routes/
│   └── auth.js 
    └── search.js               
├── views/
│   └── dashboard.ejs              
    └── index.ejs 
    └── login.ejs 
    └── register.ejs 
    └── results.ejs 

└── .env    
└── package-lock.json
└── package.json
└── server.js

└── README.md                
```


## 🔐 Autenticação

A aplicação permite:
- **Registo de utilizadores** (armazenados em MongoDB com password encriptada via bcrypt)
- **Login** com geração de token JWT

Exemplo de JSON para registo:

```json
{
  "username": "utilizador123",
  "email": "email@exemplo.com",
  "password": "senhaSegura123"
}
```


## 🔍 Funcionalidade Principal: Pesquisa de Artista

Após o login, o utilizador pode pesquisar pelo nome de um artista ou banda. O backend irá:

- Consultar a **Deezer API** para obter a **imagem do artista**
- Consultar a **Last.fm API** para obter uma **descrição textual**
- Consultar a **YouTube API** para obter **um vídeo musical**

Resposta típica da API:

```json
{
  "name": "Coldplay",
  "image": "https://api.deezer.com/artist/892/images",
  "bio": "Coldplay é uma banda britânica de rock alternativo...",
  "video": "https://www.youtube.com/watch?v=dvgZkm1xWPE"
}
```


## 🚀 Alojamento

O projeto foi colocado online utilizando a plataforma **[Render](https://render.com/)**:

- O backend está alojado como Web Service no Render
- Variáveis de ambiente configuradas através do painel de controlo do Render


## 📌 Notas Finais

- Garante que existe chaves de API válidas para YouTube, Deezer (sem necessidade de autenticação) e Last.fm.
- O projeto tem estrutura modular e pode ser facilmente expandido com novas funcionalidades (ex: favoritos, playlists, etc.)


