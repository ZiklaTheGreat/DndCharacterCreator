import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/CharacterDetailStyle.css';
import defaultImage from '../images/default.jpg';

function CharacterDetailPage() {
  const { id } = useParams();
  const [charData, setCharData] = useState(null);
  const [classDetails, setClassDetails] = useState(null);
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const fetchRaceDetails = async (raceName) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/races?name=${raceName}`);
      return res.data;
    } catch (err) {
      console.error('Chyba pri získavaní detailov rasy:', err);
    }
  };
  
  useEffect(() => {
    const fetchCharacterAndRaceDetails = async () => {
      try {
        const charRes = await axios.get(`http://localhost:5000/api/characters/${id}`);
        const character = charRes.data;
  
        const raceDetails = await fetchRaceDetails(character.race);
  
        setCharData({ ...character, raceDetails });
      } catch (err) {
        console.error('Chyba pri načítavaní detailov:', err);
      }
    };
  
    fetchCharacterAndRaceDetails();
  }, [id]);
  

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

  const calculateSkillWithProficiency = (skill, attributeValue, profSkills, level) => {
    const baseSkill = Math.floor(attributeValue / 2) - 5;
    const proficiencyBonus = profSkills.includes(skill) ? Math.max(1, Math.floor(level / 2)) : 0;
    return baseSkill + proficiencyBonus;
  };

  const calculateModifier = (attributeValue) => {
    const modifier = Math.floor(attributeValue / 2) - 5;
    return modifier === 0 ? "0" : modifier > 0 ? `+${modifier}` : `${modifier}`;
  };

  const calculateAC = () => {
    const baseAC = armorClassValues[charData?.equippedArmor || 'none'];
    const weaponACBonus = weapons[charData?.equippedWeapon]?.acBonus || 0;
    return baseAC + weaponACBonus;
  };

  const calculateOnHit = () => {
    const weapon = weapons[charData?.equippedWeapon || 'none'];
    const governingAttr = charData?.attributes[weapon?.attribute] || 0;
    return Math.max(0, proficiency + Math.floor(governingAttr / 2) - 5);
  };

  const calculateHP = (level, classDetails, constitution) => {
    if (!classDetails) return 0;
    const hpPerLevel = classDetails.hitpointsPerLevel || 0;
    const constitutionBonus = Math.floor((constitution || 0) / 2) - 5;
    return level * (hpPerLevel + constitutionBonus);
  };

  useEffect(() => {
    const fetchCharacterAndClassDetails = async () => {
      try {
        const charRes = await axios.get(
          `http://localhost:5000/api/characters/${id}?ownerName=${username}`
        );
        const character = charRes.data;

        const classRes = await axios.get(
          `http://localhost:5000/api/classes?name=${character.charClass}`
        );
        const classDetails = classRes.data[0];

        setCharData(character);
        setClassDetails(classDetails);
      } catch (err) {
        console.error('Error fetching character or class details:', err);
      }
    };

    fetchCharacterAndClassDetails();
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

  if (!charData || !classDetails) {
    return <div>Loading character...</div>;
  }

  const { level, charClass } = charData;
  const hp = calculateHP(level, classDetails, charData.attributes.constitution);
  const ac = calculateAC();
  const proficiency = Math.max(1, Math.floor(level / 2));
  const weapon = weapons[charData.equippedWeapon] || { damage: '0', attribute: null };

  return (
    <div className="character-detail-page">
      <div className="character-sheet">
        <div className="character-header">
        <img
          src={
            charData.picture && charData.picture.trim() !== "" // Skontroluje, či je obrázok nastavený a nie je prázdny
              ? charData.picture.startsWith('http')
                ? charData.picture
                : `http://localhost:5000${charData.picture}`
              : defaultImage// Použije default.jpg, ak je prázdny reťazec alebo null
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

        <div className="character-attributes">
  <h3 className="attributes-title">Attributes & Skills</h3>
  {Object.entries(charData.attributes)
    .sort(([keyA], [keyB]) => {
      const order = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];
      return order.indexOf(keyA) - order.indexOf(keyB);
    })
    .map(([key, value]) => (
      <div key={key} className="attribute">
        <div className="attribute-header">
          <span>{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
          <div className="attribute-group">
            <span className="attribute-value">{value}</span>
            <span className="modifier-value">{calculateModifier(value)}</span>
          </div>
        </div>
        <div className="skills">
          {skillsMapping[key]?.map((skill) => (
            <p key={skill}>
              {skill}:{' '}
              {calculateSkillWithProficiency(
                skill,
                value,
                classDetails.proficiencySkills,
                level
              )}
            </p>
          ))}
        </div>
      </div>
    ))}
</div>


        <div className="character-gear">
          <div className="character-equipment">
            <h3>Equipment</h3>
            <label>Armor:</label>
            <select
              name="equippedArmor"
              value={charData.equippedArmor}
              onChange={(e) =>
                setCharData({ ...charData, equippedArmor: e.target.value })
              }
            >
              <option value="none">None</option>
              <option value="light">Light Armor</option>
              <option value="medium">Medium Armor</option>
              <option value="heavy">Heavy Armor</option>
            </select>

            <label>Weapon:</label>
            <select
              name="equippedWeapon"
              value={charData.equippedWeapon}
              onChange={(e) =>
                setCharData({ ...charData, equippedWeapon: e.target.value })
              }
            >
              <option value="none">None</option>
              <option value="greatsword">Greatsword</option>
              <option value="sword and shield">Sword and Shield</option>
              <option value="dagger">Dagger</option>
            </select>

            <p>On-hit: {calculateOnHit()}</p>
            <p>Damage: {weapon.damage}</p>
          </div>

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
        <button className="level-up-button" onClick={handleLevelUp}>
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
