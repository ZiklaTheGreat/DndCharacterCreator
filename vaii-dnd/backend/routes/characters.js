// routes/characters.js

console.log("characters.js loaded");

const express = require('express');
const router = express.Router();
const Character = require('../models/Character');
const multer = require('multer');
const path = require('path');

// Nastavenie úložiska pre Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Zložka, kam sa ukladajú súbory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Vygenerované meno súboru
  },
});

// Filter pre povolené typy súborov
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Nepovolený typ súboru'), false);
  }
};

// Middleware Multer
const upload = multer({ storage, fileFilter });

// Endpoint pre nahrávanie obrázkov
router.post('/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Súbor nebol nahraný' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ msg: 'Obrázok bol úspešne nahraný', imageUrl });
  } catch (err) {
    console.error('Chyba pri nahrávaní obrázka:', err);
    res.status(500).json({ msg: 'Serverová chyba' });
  }
});


// CREATE (POST) - Vytvorenie novej postavy
router.post('/', async (req, res) => {
    console.log("Reached POST / in characters.js");

  try {

  const { ownerName, picture, name, race, charClass, level, hitpoints, attributes, inventory } = req.body;

    // Z req.body dostaneme všetky údaje o postave
    // ownerName použijeme z frontendu (localStorage => req.body.ownerName)

    const newChar = new Character({
      ownerName,
      picture,
      name,
      race,
      charClass,
      level,
      hitpoints,
      attributes,
      inventory
    });

    const savedChar = await newChar.save();
    return res.status(201).json(savedChar);
  } catch (err) {
    console.error('Chyba pri vytváraní postavy:', err);
    res.status(500).json({ msg: 'Serverová chyba pri vytváraní postavy.' });
  }
});

// READ (GET) - Získanie všetkých postáv prihláseného užívateľa
router.get('/', async (req, res) => {
  try {
    const ownerName = req.query.ownerName; 
    // Na frontende pri volaní GET pridáme ?ownerName=...
    // Napr. axios.get('/api/characters?ownerName=user123')

    const characters = await Character.find({ ownerName });
    res.json(characters);
  } catch (err) {
    console.error('Chyba pri načítavaní postáv:', err);
    res.status(500).json({ msg: 'Serverová chyba pri načítavaní postáv.' });
  }
});

// READ (GET) - Získanie detailu jednej postavy (len ak ownerName == user)
router.get('/:id', async (req, res) => {
  try {
    const ownerName = req.query.ownerName; // z query
    const charId = req.params.id;

    const character = await Character.findById(charId);
    if (!character) {
      return res.status(404).json({ msg: 'Postava neexistuje.' });
    }
    // Skontrolujeme, či postava patrí prihlásenému užívateľovi
    if (character.ownerName !== ownerName) {
      return res.status(403).json({ msg: 'Nemáš prístup k tejto postave.' });
    }

    res.json(character);
  } catch (err) {
    console.error('Chyba pri načítavaní detailu postavy:', err);
    res.status(500).json({ msg: 'Serverová chyba.' });
  }
});

// UPDATE (PUT) - Aktualizácia postavy
router.put('/:id', async (req, res) => {
  try {
    const ownerName = req.body.ownerName; 
    const charId = req.params.id;
    const { name, picture, race, charClass, level, hitpoints, attributes, inventory } = req.body;

    const character = await Character.findById(charId);
    if (!character) {
      return res.status(404).json({ msg: 'Postava neexistuje.' });
    }
    if (character.ownerName !== ownerName) {
      return res.status(403).json({ msg: 'Nemáš právo aktualizovať túto postavu.' });
    }

    // Aktualizuj len tie polia, ktoré užívateľ upravil
    if (name !== undefined) character.name = name;
    if (picture !== undefined) character.picture = picture;
    if (race !== undefined) character.race = race;
    if (charClass !== undefined) character.charClass = charClass;
    if (level !== undefined) character.level = level;
    if (hitpoints !== undefined) character.hitpoints = hitpoints;
    if (attributes !== undefined) character.attributes = attributes;
    if (inventory !== undefined) character.inventory = inventory;

    const updated = await character.save();
    return res.json(updated);
  } catch (err) {
    console.error('Chyba pri aktualizácii postavy:', err);
    res.status(500).json({ msg: 'Serverová chyba pri aktualizácii postavy.' });
  }
});

module.exports = router;
