import React, { useState } from 'react';
import axios from 'axios';
import "../styles/CreateCharacterPageStyle.css";

function CreateCharacterPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    picture: '',
    name: '',
    race: 'human',
    charClass: 'fighter',
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
    inventory: '',
  });
  

  const steps = ['Name & Picture', 'Race', 'Class', 'Attributes', 'Inventory'];

  const [remainingPoints, setRemainingPoints] = useState(10);

  const incrementAttribute = (attrName) => {
    if (remainingPoints > 0 && formData.attributes[attrName] < 20) {
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
    if (formData.attributes[attrName] > 0) {
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
    if (remainingPoints > 0) {
      alert('You must use all attribute points before creating your character!');
      return;
    }
  
    try {
      const ownerName = localStorage.getItem('username');
      const body = { ownerName, ...formData };
      await axios.post('http://localhost:5000/api/characters', body);
      alert('Character created!');
    } catch (err) {
      console.error('Error creating character:', err);
      alert('Failed to create character');
    }
  };
  
  

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
            <label htmlFor="picture">Picture (URL or path):</label>
            <input
              type="text"
              id="picture"
              name="picture"
              value={formData.picture}
              onChange={onChange}
              placeholder="Optional"
            />
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
              onChange={onChange}
            >
              <option value="human">Human</option>
              <option value="dwarf">Dwarf</option>
              <option value="elf">Elf</option>
            </select>
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
              onChange={onChange}
            >
              <option value="fighter">Fighter</option>
              <option value="rogue">Rogue</option>
              <option value="wizard">Wizard</option>
            </select>
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
            className={`step-button ${
              currentStep === index ? 'active' : ''
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
