const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware pre spracovanie JSON dát
app.use(express.json());

// Nastavenie CORS
app.use(cors());

// Routes
app.use('/api/users', require('./routes/users'));
const charactersRouter = require('./routes/characters');
app.use('/api/characters', charactersRouter);


// Pripojenie k MongoDB
mongoose.connect('mongodb://localhost:27017/vail-dnd')
  .then(() => console.log('Pripojenie k MongoDB úspešné'))
  .catch(err => console.log('Chyba pri pripojení k MongoDB:', err));

// Spustenie servera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server beží na porte ${PORT}`));
