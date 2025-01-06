// models/Character.js

const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
  ownerName: {
    type: String,
    required: true
  },
  picture: {
    type: String, // Budeš ukladať cestu alebo URL k obrázku
    default: ''   // Môžeš si nastaviť default napr. na "/images/question.png"
  },
  name: {
    type: String,
    required: true
  },
  race: {
    type: String,
    enum: ['human', 'dwarf', 'elf'],  // obmedzí len na tieto možnosti
    required: true
  },
  charClass: {
    type: String,
    enum: ['fighter', 'rogue', 'wizard'],
    required: true
  },
  level: {
    type: Number,
    default: 1
  },
  hitpoints: {
    type: Number,
    default: 10
  },
  attributes: {
    strength: { type: Number, default: 10 },
    dexterity: { type: Number, default: 10 },
    constitution: { type: Number, default: 10 },
    intelligence: { type: Number, default: 10 },
    wisdom: { type: Number, default: 10 },
    charisma: { type: Number, default: 10 },
  },
  inventory: {
    type: String,
    default: ''
  },
  armor: { type: String, default: 'none' }, 
  weapon: { type: String, default: 'none' },
});

module.exports = mongoose.model('Character', CharacterSchema);
