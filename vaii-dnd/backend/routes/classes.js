const express = require('express');
const router = express.Router();
const Class = require('../models/Class');

// CREATE - Pridanie novej triedy
router.post('/', async (req, res) => {
  const { name, primaryAttributes, proficiencySkills, hpPerLevel } = req.body;

  if (!name || !primaryAttributes || !proficiencySkills || !hpPerLevel) {
    return res.status(400).json({ msg: 'Vyplňte všetky polia' });
  }

  try {
    const newClass = new Class({
      name,
      primaryAttributes,
      proficiencySkills,
      hpPerLevel,
    });

    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (err) {
    console.error('Chyba pri vytváraní triedy:', err);
    res.status(500).json({ msg: 'Serverová chyba' });
  }
});

// READ - Získanie všetkých tried
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    console.error('Chyba pri načítavaní tried:', err);
    res.status(500).json({ msg: 'Serverová chyba' });
  }
});

// READ - Získanie detailu jednej triedy
router.get('/:id', async (req, res) => {
  try {
    const classId = req.params.id;
    const singleClass = await Class.findById(classId);

    if (!singleClass) {
      return res.status(404).json({ msg: 'Trieda neexistuje' });
    }

    res.json(singleClass);
  } catch (err) {
    console.error('Chyba pri načítavaní detailu triedy:', err);
    res.status(500).json({ msg: 'Serverová chyba' });
  }
});

// UPDATE - Aktualizácia triedy
router.put('/:id', async (req, res) => {
  const { name, primaryAttributes, proficiencySkills, hpPerLevel } = req.body;

  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      { name, primaryAttributes, proficiencySkills, hpPerLevel },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ msg: 'Trieda neexistuje' });
    }

    res.json(updatedClass);
  } catch (err) {
    console.error('Chyba pri aktualizácii triedy:', err);
    res.status(500).json({ msg: 'Serverová chyba' });
  }
});

// DELETE - Vymazanie triedy
router.delete('/:id', async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);

    if (!deletedClass) {
      return res.status(404).json({ msg: 'Trieda neexistuje' });
    }

    res.json({ msg: 'Trieda úspešne vymazaná' });
  } catch (err) {
    console.error('Chyba pri mazaní triedy:', err);
    res.status(500).json({ msg: 'Serverová chyba' });
  }
});

module.exports = router;
