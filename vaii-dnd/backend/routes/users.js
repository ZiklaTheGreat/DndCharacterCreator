// routes/users.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Registrácia užívateľa
router.post('/register', async (req, res) => {
  console.log("Reached POST / in users.js");
  const { username, password } = req.body;

  // Overenie vstupov
  if (!username || !password) {
    return res.status(400).json({ msg: 'Vyplňte všetky polia' });
  }

  try {
    // Skontroluj, či užívateľ existuje
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'Užívateľ už existuje' });
    }

    // Vytvor nový užívateľ
    user = new User({
      username,
      password
    });

    // Hashuj heslo
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Ulož užívateľa
    await user.save();

    res.status(201).json({ msg: 'Registrácia úspešná' });
  } catch (err) {
    console.error('Chyba pri registrácii:', err);
    res.status(500).json({ msg: 'Serverová chyba' });
  }
});

// Prihlásenie užívateľa
router.post('/login', async (req, res) => {
  console.log("Step 1: Route reached");
  const { username, password } = req.body;
  console.log("Step 2: Request body received", { username, password });
  // Overenie, či sú všetky polia vyplnené
  if (!username || !password) {
    return res.status(400).json({ success: false, msg: 'Vyplňte všetky polia' });
  }

  try {
    // Skontroluj, či užívateľ existuje
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, msg: 'Nesprávne užívateľské meno alebo heslo' });
    }

    // Overenie hesla
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: 'Nesprávne užívateľské meno alebo heslo' });
    }

    // Prihlásenie úspešné
    res.json({ success: true, msg: 'Prihlásenie úspešné' });
  } catch (err) {
    console.log(err);
    console.error('Chyba pri prihlásení:', err);
    res.status(500).json({ success: false, msg: 'Serverová chyba' });
  }
});

// Načítanie všetkých užívateľov (len pre admina)
router.get('/', async (req, res) => {
    try {
      const users = await User.find().select('-password'); // Vylúčime heslá
      res.json(users);
    } catch (err) {
      console.error('Chyba pri načítavaní užívateľov:', err);
      res.status(500).json({ msg: 'Serverová chyba' });
    }
  });
  
  // Vymazanie užívateľa (len pre admina)
  router.delete('/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      await User.findByIdAndDelete(userId);
      res.json({ msg: 'Užívateľ úspešne vymazaný' });
    } catch (err) {
      console.error('Chyba pri mazaní užívateľa:', err);
      res.status(500).json({ msg: 'Serverová chyba' });
    }
  });

  router.put('/:id', async (req, res) => {
    const userId = req.params.id;
    const { username } = req.body;
  
    // Overenie vstupov
    if (!username || username.trim() === '') {
      return res.status(400).json({ msg: 'Invalid username' });
    }
  
    try {
      // Skontroluj, či užívateľ s novým menom už neexistuje
      let existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ msg: 'Username already exists' });
      }
  
      // Nájdeme užívateľa a aktualizujeme jeho meno
      let user = await User.findByIdAndUpdate(userId, { username: username.trim() }, { new: true });
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      res.json({ msg: 'Username updated successfully' });
    } catch (err) {
      console.error('Chyba pri aktualizácii užívateľa:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  });

module.exports = router;
