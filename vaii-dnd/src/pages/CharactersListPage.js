import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/CharactersListStyle.css';

function CharactersListPage() {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!username) {
      navigate('/Login');
      return;
    }

    const fetchChars = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/characters?ownerName=${username}`);
        setCharacters(res.data);
      } catch (err) {
        console.error('Error fetching characters:', err);
      }
    };

    fetchChars();
  }, [username, navigate]);

  const handleDelete = async (charId) => {
    const ownerName = localStorage.getItem('username');
  
    if (!window.confirm('Are you sure you want to delete this character?')) {
      return;
    }
  
    try {
      await axios.delete(`http://localhost:5000/api/characters/${charId}`, {
        params: { ownerName },
      });
      alert('Character deleted successfully!');
      setCharacters((prev) => prev.filter((char) => char._id !== charId));
    } catch (err) {
      console.error('Error deleting character:', err);
      alert('Failed to delete character.');
    }
  };
  
  

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
              <div className='character-info'>
              <Link to={`/characters/${char._id}`} className="character-link">
                {char.name}
              </Link>
              <span className="character-details">
                {char.race}, {char.charClass}, Level {char.level}
              </span>
              </div>
              <button
                className="delete-character-button"
                onClick={() => handleDelete(char._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CharactersListPage;
