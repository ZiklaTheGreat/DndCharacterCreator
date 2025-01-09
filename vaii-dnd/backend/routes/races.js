// routes/races.js
const express = require('express');
const router = express.Router();
const Race = require('../models/Race');

// GET všetky rasy
router.get('/', async (req, res) => {
  try {
    const races = await Race.find();
    res.json(races);
  } catch (err) {
    console.error('Chyba pri načítavaní rás:', err);
    res.status(500).json({ msg: 'Serverová chyba' });
  }
});

// GET rasa podľa názvu
router.get('/:name', async (req, res) => {
  try {
    const race = await Race.findOne({ name: req.params.name });
    if (!race) {
      return res.status(404).json({ msg: 'Rasa nenájdená' });
    }
    res.json(race);
  } catch (err) {
    console.error('Chyba pri načítavaní rasy:', err);
    res.status(500).json({ msg: 'Serverová chyba' });
  }
});

// POST vytvoriť novú rasu
router.post('/', async (req, res) => {
  const { name, attributes } = req.body;

  if (!name || !attributes || !attributes.length) {
    return res.status(400).json({ msg: 'Vyplňte všetky polia' });
  }

  try {
    const newRace = new Race({ name, attributes });
    const savedRace = await newRace.save();
    res.status(201).json(savedRace);
  } catch (err) {
    console.error('Chyba pri vytváraní rasy:', err);
    res.status(500).json({ msg: 'Serverová chyba' });
  }
});

// DELETE vymazať rasu
router.delete('/:id', async (req, res) => {
  try {
    const deletedRace = await Race.findByIdAndDelete(req.params.id);
    if (!deletedRace) {
      return res.status(404).json({ msg: 'Rasa nenájdená' });
    }
    res.json({ msg: 'Rasa úspešne vymazaná' });
  } catch (err) {
    console.error('Chyba pri mazaní rasy:', err);
    res.status(500).json({ msg: 'Serverová chyba' });
  }
});

module.exports = router;
