import React from 'react';
import "../styles/ClassListStyle.css";
import FighterPicture from "../images/Fighter.png";
import WizardPicture from "../images/Wizard.png";
import RoguePicture from "../images/Rogue.png";



const ClassListPage = () => {
  const classes = [
    {
      name: 'Fighter',
      description: 'A master of martial combat, skilled with a variety of weapons and armor.',
      subclasses: ['Champion', 'Battle Master', 'Eldritch Knight'],
      image: FighterPicture
    },
    {
      name: 'Rogue',
      description: 'A cunning trickster who uses stealth and agility to achieve their goals.',
      subclasses: ['Thief', 'Assassin', 'Arcane Trickster'],
      image: RoguePicture
    },
    {
      name: 'Wizard',
      description: 'A scholarly magic-user capable of manipulating the fabric of reality.',
      subclasses: ['Evocation', 'Illusion', 'Necromancy'],
      image: WizardPicture
    }
  ];

  return (
    <main className="content">
      <h2 className="page-subtitle">Classes</h2>
      <div className="class-list">
        {classes.map((classItem, index) => (
          <div className="class-item" key={index}>
            <div className="class-symbol">
              <img src={classItem.image} alt={`${classItem.name} Symbol`} />
            </div>
            <div className="class-details">
              <h3><a href="#">{classItem.name}</a></h3>
              <p className="class-description">{classItem.description}</p>
              <h4>Subclasses:</h4>
              <ul className="subclass-list">
                {classItem.subclasses.map((subclass, idx) => (
                  <li key={idx}><a href="#">{subclass}</a></li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ClassListPage;
