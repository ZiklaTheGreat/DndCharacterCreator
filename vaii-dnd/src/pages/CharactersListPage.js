import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/CharactersListStyle.css';

function CharactersListPage() {
  const [characters, setCharacters] = useState([]);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchChars = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/characters?ownerName=${username}`);
        setCharacters(res.data);
      } catch (err) {
        console.error('Error fetching characters:', err);
      }
    };

    if (username) {
      fetchChars();
    }
  }, [username]);

  if (!username) {
    return <div className="characters-list-page">Please log in to view your characters.</div>;
  }

  return (
    <div className="characters-list-page">
      <h1 className="page-title">My Characters</h1>
      <Link to="/create-character" className="create-character-link">
        Create New Character
      </Link>
      {characters.length === 0 ? (
        <div className="no-characters-message">No characters found.</div>
      ) : (
        <ul className="character-list">
          {characters.map((char) => (
            <li key={char._id} className="character-item">
              <Link to={`/characters/${char._id}`} className="character-link">
                {char.name}
              </Link>
              <span className="character-details">
                {char.race}, {char.charClass}, Level {char.level}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CharactersListPage;
