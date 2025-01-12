// routes/characters.js

console.log("characters.js loaded");

const express = require('express');
const router = express.Router();
const Character = require('../models/Character');
const multer = require('multer');
const fs = require('fs');
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
    const { ownerName, name, picture, race, charClass, level, hitpoints, attributes, inventory, equippedWeapon, equippedArmor } = req.body;
    const charId = req.params.id;

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
    if (equippedWeapon !== undefined) character.equippedWeapon = equippedWeapon;
    if (equippedArmor !== undefined) character.equippedArmor = equippedArmor;

    const updatedCharacter = await character.save();
    return res.json(updatedCharacter);
  } catch (err) {
    console.error('Chyba pri aktualizácii postavy:', err);
    res.status(500).json({ msg: 'Serverová chyba pri aktualizácii postavy.' });
  }
});

// DELETE (DELETE) - Odstránenie postavy
router.delete('/:id', async (req, res) => {
  try {
    const ownerName = req.query.ownerName; // Prihlásený užívateľ
    const charId = req.params.id;

    // Nájdeme postavu
    const character = await Character.findById(charId);
    if (!character) {
      return res.status(404).json({ msg: 'Postava neexistuje.' });
    }

    // Overíme, či patrí prihlásenému užívateľovi
    if (character.ownerName !== ownerName) {
      return res.status(403).json({ msg: 'Nemáš právo odstrániť túto postavu.' });
    }

    // Ak má postava obrázok uložený lokálne, vymažeme ho
    if (character.picture && !character.picture.startsWith('http')) {
      const imagePath = path.join(__dirname, '..', character.picture);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Chyba pri mazaní obrázka: ${imagePath}`, err);
        }
      });
    }

    // Vymažeme postavu z databázy
    await Character.findByIdAndDelete(charId);

    res.json({ msg: 'Postava bola úspešne vymazaná.' });
  } catch (err) {
    console.error('Chyba pri odstraňovaní postavy:', err);
    res.status(500).json({ msg: 'Serverová chyba pri odstraňovaní postavy.' });
  }
});


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

// DELETE (DELETE) - Odstránenie postavy
router.delete('/delete-image', (req, res) => {
  console.log('Delete image request received.');
  const imageUrl = req.query.imageUrl;
  console.log('Image URL:', imageUrl);

  if (!imageUrl || imageUrl.startsWith('http')) {
    return res.status(400).json({ msg: 'Neplatný obrázok na mazanie.' });
  }

  const imagePath = path.join(__dirname, '..', 'uploads', path.basename(imageUrl));
  console.log('Computed image path:', imagePath);

  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error(`Chyba pri mazaní obrázka: ${imagePath}`, err);
      if (err.code === 'ENOENT') {
        return res.status(404).json({ msg: 'Obrázok neexistuje.' });
      }
      return res.status(500).json({ msg: 'Serverová chyba pri mazaní obrázka.' });
    }

    console.log('Obrázok bol úspešne vymazaný.');
    res.json({ msg: 'Obrázok bol úspešne vymazaný.' });
  });
});



module.exports = router;
