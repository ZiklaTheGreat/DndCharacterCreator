import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Added `useNavigate`
import '../styles/CharacterDetailStyle.css';

function CharacterDetailPage() {
  const { id } = useParams();
  const [charData, setCharData] = useState(null);
  const username = localStorage.getItem('username');
  const navigate = useNavigate(); // Added navigation

  const armorClassValues = {
    none: 10,
    light: 12,
    medium: 14,
    heavy: 16,
  };

  const weapons = {
    none: { damage: '0', attribute: null },
    greatsword: { damage: '2d6', attribute: 'strength' },
    'sword and shield': { damage: '1d8', attribute: 'strength', acBonus: 2 },
    dagger: { damage: '1d4', attribute: 'dexterity' },
  };

  const skillsMapping = {
    strength: ['Athletics'],
    dexterity: ['Acrobatics', 'Sleight of Hand', 'Stealth'],
    intelligence: ['Arcana', 'History', 'Investigation', 'Nature', 'Religion'],
    wisdom: ['Animal Handling', 'Insight', 'Medicine', 'Perception', 'Survival'],
    charisma: ['Deception', 'Intimidation', 'Performance', 'Persuasion'],
  };

  const calculateSkill = (attributeValue) => Math.floor(attributeValue / 2) - 5;

  const calculateAC = () => {
    const baseAC = armorClassValues[charData?.armor || 'none'];
    const weaponACBonus = weapons[charData?.weapon]?.acBonus || 0;
    return baseAC + weaponACBonus;
  };

  const calculateOnHit = () => {
    const weapon = weapons[charData?.weapon || 'none'];
    const governingAttr = charData?.attributes[weapon.attribute] || 0;
    return Math.max(0, charData?.level + Math.floor(governingAttr / 2) - 6);
  };

  const calculateHP = (level, charClass, constitution) => {
    const classHitDice = {
      wizard: 4,
      rogue: 6,
      fighter: 8,
    };
    const constitutionBonus = Math.floor(constitution / 2) - 5;
    return level * (classHitDice[charClass] || 0) + level * constitutionBonus;
  };

  const calculateProficiency = (level) => Math.max(1, Math.floor(level / 2));

  useEffect(() => {
    const fetchChar = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/characters/${id}?ownerName=${username}`);
        setCharData(res.data);
      } catch (err) {
        console.error('Error fetching character detail:', err);
      }
    };
    fetchChar();
  }, [id, username]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setCharData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSave = async () => {
    try {
      const body = {
        ownerName: username,
        ...charData,
      };
      await axios.put(`http://localhost:5000/api/characters/${id}`, body);
      alert('Character updated!');
    } catch (err) {
      console.error('Error updating character:', err);
      alert('Failed to update character');
    }
  };

  const handleLevelUp = () => {
    navigate(`/characters/${id}/level-up`);
  };

  if (!charData) {
    return <div>Loading character...</div>;
  }

  const { level, charClass } = charData;
  const hp = calculateHP(level, charClass, charData.attributes.constitution);
  const proficiency = calculateProficiency(level);
  const ac = calculateAC(10, 0, 0);

  return (
    <div className="character-detail-page">
      <div className="character-sheet">
        <div className="character-header">
          <img
            src={
              charData.picture
                ? charData.picture.startsWith('http')
                  ? charData.picture
                  : `http://localhost:5000${charData.picture}`
                : '/images/question.png'
            }
            alt="Character"
            className="character-image"
          />
          <div className="character-overview">
            <h2 className="character-name">{charData.name}</h2>
            <div className="header-content">
              <div className="character-details">
                <p>Level: {level}</p>
                <p>Race: {charData.race}</p>
                <p>Class: {charClass}</p>
              </div>
              <div className="character-stats">
                <p>AC: {ac}</p>
                <p>HP: {hp}</p>
                <p>Proficiency: {proficiency}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Attributes */}
        <div className="character-attributes">
          <h3 className="attributes-title">Attributes & Skills</h3>
          {Object.entries(charData.attributes).map(([key, value]) => (
            <div key={key} className="attribute">
              <div className="attribute-header">
                <span>{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                <span className="attribute-value">{value}</span>
              </div>
              <div className="skills">
                {skillsMapping[key]?.map((skill) => (
                  <p key={skill}>
                    {skill}: {calculateSkill(value)}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Equipment */}
        <div className="character-gear">
          <div className="character-equipment">
            <h3>Equipment</h3>
            <label>Armor:</label>
            <select name="armor" value={charData.armor} onChange={onChange}>
              <option value="none">None</option>
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="heavy">Heavy</option>
            </select>
            <label>Weapon:</label>
            <select name="weapon" value={charData.weapon} onChange={onChange}>
              <option value="none">None</option>
              <option value="greatsword">Greatsword</option>
              <option value="sword and shield">Sword and Shield</option>
              <option value="dagger">Dagger</option>
            </select>
            <p>On-hit: {calculateOnHit()}</p>
            <p>Damage: {weapons[charData.weapon]?.damage}</p>
          </div>

          {/* Inventory */}
          <div className="character-inventory">
            <h3>Inventory</h3>
            <textarea
              name="inventory"
              value={charData.inventory}
              onChange={onChange}
              className="inventory-input"
            />
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="level-up-button" onClick={() => navigate(`/characters/${id}/level-up`)}>
          Level Up
        </button>
        <button className="save-button" onClick={onSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default CharacterDetailPage;
