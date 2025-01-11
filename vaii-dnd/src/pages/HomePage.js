import React from 'react';
import "../styles/HomePageStyle.css";
import Card1 from '../images/card1.jpg';
import Card2 from '../images/card2.jpg';

const HomePage = () => {
  return (
    <main className="main">
      <section className="intro">
        <h2 className="welcome-title">Welcome to DnD Character Builder</h2>
        <p>
          On this site, you can build your very own character for Dungeons & Dragons.
          Go through the steps of selecting a race, class, and background, and create a
          unique character ready for adventure!
        </p>
        <h3 className="build-option">Pick your build:</h3>
      </section>

      <div className="card-selection">
        <div className="card">
          <a href="/create-character">
            <img src={Card1} alt="Class Selection" className="card-image" />
            <div className="card-text">Standard Build</div>
          </a>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
