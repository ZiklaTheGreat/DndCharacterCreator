// models/Race.js
const mongoose = require('mongoose');

const RaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  attributes: {
    type: [String],
    required: true,
    validate: {
      validator: function (v) {
        return v.length > 0 && v.every((attr) => ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].includes(attr));
      },
      message: 'Attributes must be a valid list of attribute names.',
    },
  },
});

module.exports = mongoose.model('Race', RaceSchema);
