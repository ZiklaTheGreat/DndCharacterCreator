import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/CreateCharacterPageStyle.css";

function CreateCharacterPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [classes, setClasses] = useState([]);
  const [races, setRaces] = useState([]);
  const [selectedRaceInfo, setSelectedRaceInfo] = useState('');
  const [selectedClassInfo, setSelectedClassInfo] = useState('');
  const [formData, setFormData] = useState({
    picture: '',
    name: '',
    race: '',
    charClass: '',
    level: 1,
    hitpoints: 10,
    attributes: {
      strength: 10,
      dexterity: 10,
      intelligence: 10,
      constitution: 10,
      wisdom: 10,
      charisma: 10,
    },
    attributeLimits: {
      strength: { min: 0, max: 20 },
      dexterity: { min: 0, max: 20 },
      intelligence: { min: 0, max: 20 },
      constitution: { min: 0, max: 20 },
      wisdom: { min: 0, max: 20 },
      charisma: { min: 0, max: 20 },
    },
    inventory: '',
  });

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/login'); // Presmeruje na prihlasovaciu stránku
    }
  }, [navigate]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/classes');
        setClasses(res.data); // `classes` je nový stav
      } catch (err) {
        console.error('Chyba pri načítavaní tried:', err);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/races');
        setRaces(res.data);
      } catch (err) {
        console.error('Chyba pri načítavaní rás:', err);
      }
    };

    fetchRaces();
  }, []);

  const handleClassChange = (e) => {
    const selectedClass = e.target.value;
    setFormData({ ...formData, charClass: selectedClass });

    const classInfo = classes.find((cls) => cls.name === selectedClass);
    if (classInfo) {
      setSelectedClassInfo(
        `Trieda "${classInfo.name}" dáva proficiency v: ${classInfo.proficiencySkills
          .map((skill) => `"${skill}"`)
          .join(' a ')}.`
      );
    } else {
      setSelectedClassInfo('');
    }
  };

  const applyRaceBonuses = (raceName) => {
    const selectedRace = races.find((race) => race.name === raceName);
    if (!selectedRace) return;

    const previousRace = races.find((race) => race.name === formData.race);

    const updatedAttributes = { ...formData.attributes };
    const updatedLimits = { ...formData.attributeLimits };

    // Odstránenie bonusov predchádzajúcej rasy a aktualizácia limitov
    if (previousRace) {
      previousRace.attributes.forEach((attr) => {
        updatedAttributes[attr] -= 1;
        updatedLimits[attr].max -= 1;
        updatedLimits[attr].min -= 1;
      });
    }

    // Pridanie bonusov novej rasy a aktualizácia limitov
    selectedRace.attributes.forEach((attr) => {
      updatedAttributes[attr] += 1;
      updatedLimits[attr].max += 1;
      updatedLimits[attr].min += 1;
    });

    // Uistíme sa, že aktuálne hodnoty sú v povolených hraniciach
    Object.keys(updatedAttributes).forEach((key) => {
      if (updatedAttributes[key] > updatedLimits[key].max) {
        updatedAttributes[key] = updatedLimits[key].max;
      }
      if (updatedAttributes[key] < updatedLimits[key].min) {
        updatedAttributes[key] = updatedLimits[key].min;
      }
    });

    setFormData((prev) => ({
      ...prev,
      race: raceName,
      attributes: updatedAttributes,
      attributeLimits: updatedLimits,
    }));

    setSelectedRaceInfo(
      `Rasa "${selectedRace.name}" dáva +1 do ${selectedRace.attributes
        .map((attr) => `"${attr}"`)
        .join(' a ')}.`
    );
  };


  const steps = ['Name & Picture', 'Race', 'Class', 'Attributes', 'Inventory'];

  const [remainingPoints, setRemainingPoints] = useState(10);

  const incrementAttribute = (attrName) => {
    if (remainingPoints > 0 && formData.attributes[attrName] < formData.attributeLimits[attrName].max) {
      setFormData((prev) => ({
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
    if (formData.attributes[attrName] > formData.attributeLimits[attrName].min) {
      setFormData((prev) => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          [attrName]: prev.attributes[attrName] - 1,
        },
      }));
      setRemainingPoints((prev) => prev + 1);
    }
  };



  const handleNext = (e) => {
    if (e) e.preventDefault(); // Zabránime predvolenému správaniu
    console.log(`Moving to step ${currentStep + 1}`);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('http://localhost:5000/api/characters/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { imageUrl } = res.data;
      setFormData((prev) => ({
        ...prev,
        picture: imageUrl, // Uložíme URL obrázka do state
      }));
      alert('Obrázok bol úspešne nahraný!');
    } catch (err) {
      console.error('Chyba pri nahrávaní obrázka:', err);
      alert('Nahrávanie obrázka zlyhalo.');
    }
  };


  const onChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('attributes.')) {
      const attrName = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          [attrName]: parseInt(value) || 0,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const ownerName = localStorage.getItem('username');

    // Kontrola: Používateľ musí byť prihlásený
    if (!ownerName || ownerName.trim() === '') {
      alert('You must be logged in to create a character!');
      return;
    }

    // Kontrola: Meno musí byť zadané
    if (!formData.name || formData.name.trim() === '') {
      alert('You must enter a character name!');
      return;
    }

    // Kontrola: Rasa musí byť vybraná
    if (!formData.race || formData.race.trim() === "") {
      alert("Please select a race before creating your character!");
      return;
    }

    // Kontrola: Trieda musí byť vybraná
    if (!formData.charClass || formData.charClass.trim() === "") {
      alert("Please select a class before creating your character!");
      return;
    }

    // Kontrola: Zvyšné body atribútov
    if (remainingPoints > 0) {
      alert('You must use all attribute points before creating your character!');
      return;
    }

    try {
      const body = { ownerName, ...formData }; // Formátovanie údajov pre odoslanie
      const res = await axios.post('http://localhost:5000/api/characters', body);
      const newCharacterId = res.data._id;
      alert('Character created!');
      navigate(`/characters/${newCharacterId}`);
    } catch (err) {
      console.error('Error creating character:', err);

      const errorMsg = err.response?.data?.msg || 'Failed to create character';
      alert(errorMsg);
    }
  };

  const fileInputRef = useRef(null);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="form-section">
            <label htmlFor="name">Character Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="Enter character name"
              required
            />

            <label htmlFor="picture">Picture URL:</label>
            <input
              type="text"
              id="picture"
              name="picture"
              value={formData.picture}
              onChange={onChange}
              placeholder="Optional URL"
              disabled={!!formData.uploadedImage} // Zablokuje pole, ak je nahraný obrázok
              style={{ width: '100%' }} // Rovnaká šírka ako ostatné polia
            />

            <label htmlFor="upload-image">Upload Picture:</label>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <input
                ref={fileInputRef} // Pripojenie referencie
                type="file"
                id="upload-image"
                name="image"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const uploadFormData = new FormData();
                  uploadFormData.append('image', file);

                  try {
                    const res = await axios.post('http://localhost:5000/api/characters/upload-image', uploadFormData, {
                      headers: {
                        'Content-Type': 'multipart/form-data',
                      },
                    });

                    const { imageUrl } = res.data;
                    setFormData((prev) => ({
                      ...prev,
                      uploadedImage: imageUrl, // Uloží URL nahraného obrázka
                      picture: imageUrl, // Nastaví URL obrázka
                    }));
                    alert('Image uploaded successfully!');
                  } catch (err) {
                    console.error('Error uploading image:', err);
                    alert('Image upload failed.');
                  }
                }}
                style={{ width: '100%' }}
              />
              {formData.uploadedImage && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      if (formData.uploadedImage) {
                        console.log('Attempting to delete image:', formData.uploadedImage);
                        await axios.delete(`http://localhost:5000/api/characters/delete-image`, {
                          params: { imageUrl: formData.uploadedImage },
                        });
                        console.log('Image deleted successfully.');
                  
                        setFormData((prev) => ({
                          ...prev,
                          uploadedImage: null,
                          picture: '',
                        }));
                  
                        alert('Obrázok bol úspešne vymazaný.');
                      }
                    } catch (err) {
                      console.error('Chyba pri mazaní obrázka:', err);
                      alert('Chyba pri mazaní obrázka.');
                    }
                  }}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'red',
                    fontSize: '1.5em',
                  }}
                  title="Remove Uploaded Image"
                >
                  ✖
                </button>
              )}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="form-section">
            <label htmlFor="race">Race:</label>
            <select
              id="race"
              name="race"
              value={formData.race}
              onChange={(e) => applyRaceBonuses(e.target.value)}
            >
              <option value="">Select a race</option>
              {races.map((race) => (
                <option key={race._id} value={race.name}>
                  {race.name}
                </option>
              ))}
            </select>
            {selectedRaceInfo && <p className="info-text">{selectedRaceInfo}</p>}
          </div>
        );
      case 2:
        return (
          <div className="form-section">
            <label htmlFor="charClass">Class:</label>
            <select
              id="charClass"
              name="charClass"
              value={formData.charClass}
              onChange={handleClassChange}
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls.name}>
                  {cls.name}
                </option>
              ))}
            </select>
            {selectedClassInfo && <p className="info-text">{selectedClassInfo}</p>}
          </div>
        );
      case 3:
        return (
          <div className="form-section">
            <h3>Remaining Points: {remainingPoints}</h3>
            {Object.entries(formData.attributes).map(([key, value]) => (
              <div key={key} className="attribute">
                <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                <div className="attribute-controls">
                  <button type="button" onClick={() => decrementAttribute(key)}>↓</button>
                  <span>{value}</span>
                  <button type="button" onClick={() => incrementAttribute(key)}>↑</button>
                </div>
              </div>
            ))}
          </div>

        );

      case 4:
        return (
          <div className="form-section">
            <label htmlFor="inventory">Inventory:</label>
            <textarea
              id="inventory"
              name="inventory"
              value={formData.inventory}
              onChange={onChange}
              placeholder="Enter inventory items"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="create-character-page">
      <h2 className="page-title">Create New Character</h2>
      <div className="steps-navigation">
        {steps.map((step, index) => (
          <button
            key={index}
            className={`step-button ${currentStep === index ? 'active' : ''
              }`}
            onClick={() => setCurrentStep(index)}
          >
            {step}
          </button>
        ))}
      </div>
      <div className="form-container">
        <form className="character-form" onSubmit={onSubmit}>
          {renderStepContent()}
          <div className="navigation-buttons">
            {currentStep > 0 && (
              <button type="button" onClick={handlePrev}>
                Previous
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button type="button" onClick={handleNext}>
                Next
              </button>
            ) : (
              <button type="submit" className="submit-button">
                Create Character
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCharacterPage;
