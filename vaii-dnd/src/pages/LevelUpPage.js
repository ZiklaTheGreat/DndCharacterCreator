import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/LevelUpPageStyle.css';

function LevelUpPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [charData, setCharData] = useState(null);
  const [remainingPoints, setRemainingPoints] = useState(2);
  const [originalAttributes, setOriginalAttributes] = useState({});
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchChar = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/characters/${id}?ownerName=${username}`);
        setCharData(res.data);
        setOriginalAttributes({ ...res.data.attributes }); // Store original attribute values
      } catch (err) {
        console.error('Error fetching character:', err);
      }
    };
    fetchChar();
  }, [id, username]);

  const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  const incrementAttribute = (attrName) => {
    if (remainingPoints > 0) {
      setCharData((prev) => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          [attrName]: prev.attributes[attrName] + 1,
        },
      }));
      setRemainingPoints((prev) => prev - 1);
    }
  };

  const decrementAttribute = (attrName) => {
    if (
      remainingPoints < 2 &&
      charData.attributes[attrName] > originalAttributes[attrName] // Prevent decreasing below original value
    ) {
      setCharData((prev) => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          [attrName]: prev.attributes[attrName] - 1,
        },
      }));
      setRemainingPoints((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const updatedCharData = {
        ...charData,
        charClass: capitalizeFirstLetter(charData.charClass), // Ensure proper capitalization
        level: charData.level + 1, // Increase level by 1
      };
      await axios.put(`http://localhost:5000/api/characters/${id}`, updatedCharData);
      alert('Level up successful!');
      navigate(`/characters/${id}`);
    } catch (err) {
      console.error('Error saving character:', err);
      alert('Failed to save changes.');
    }
  };

  if (!charData) {
    return <div>Loading character...</div>;
  }

  return (
    <div className="level-up-page">
      <h2>Level Up: {charData.name}</h2>
      <h3>Remaining Points: {remainingPoints}</h3>
      <div className="attributes">
        {Object.entries(charData.attributes).map(([key, value]) => (
          <div key={key} className="attribute">
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            <div className="attribute-controls">
              <button
                type="button"
                onClick={() => decrementAttribute(key)}
                disabled={value <= originalAttributes[key]} // Disable if value <= original
              >
                ↓
              </button>
              <span>{value}</span>
              <button
                type="button"
                onClick={() => incrementAttribute(key)}
                disabled={remainingPoints <= 0} // Disable if no points left
              >
                ↑
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="submit-button" onClick={handleSubmit} disabled={remainingPoints > 0}>
        Confirm Level Up
      </button>
    </div>
  );
}

export default LevelUpPage;
