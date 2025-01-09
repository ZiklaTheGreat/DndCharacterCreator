const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  primaryAttributes: { type: [String], required: true }, // Zoznam hlavných atribútov
  proficiencySkills: { type: [String], required: true }, // Zoznam proficiency skills
  hpPerLevel: { type: Number, required: true }, // HP za level
});

module.exports = mongoose.model('Class', classSchema);
