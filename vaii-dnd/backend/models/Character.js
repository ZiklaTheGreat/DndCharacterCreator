const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerName: { type: String, required: true },
  race: { type: String, required: true },
  charClass: { 
    type: String, 
    required: true,
    enum: ['Fighter', 'Rogue', 'Wizard'] // Tu pridaj povolené triedy
  },
  level: { type: Number, required: true },
  hitpoints: { type: Number, required: true },
  attributes: {
    strength: { type: Number, required: true },
    dexterity: { type: Number, required: true },
    intelligence: { type: Number, required: true },
    constitution: { type: Number, required: true },
    wisdom: { type: Number, required: true },
    charisma: { type: Number, required: true },
  },
  inventory: { type: String, default: '' },
  picture: { type: String, default: '' },
  equippedWeapon: { type: String, default: 'none' }, // Nové pole
  equippedArmor: { type: String, default: 'none' }, // Nové pole
});

module.exports = mongoose.model('Character', CharacterSchema);
