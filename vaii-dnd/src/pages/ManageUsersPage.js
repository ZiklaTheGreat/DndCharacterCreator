import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import "../styles/ManageUsersPageStyle.css";

function ManageUsersPage({ username }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Stav pre načítanie

  useEffect(() => {
    if (username) {
      setIsLoading(false); // Username je načítaný
      if (username === 'admin') {
        // Načítame všetkých užívateľov
        axios.get('http://localhost:5000/api/users')
          .then(res => {
            setUsers(res.data);
          })
          .catch(err => {
            console.error('Chyba pri načítavaní užívateľov:', err);
          });
      }
    }
  }, [username]);

  // Zobrazíme načítavaciu obrazovku, ak sa údaje ešte načítavajú
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Ak užívateľ nie je admin, presmerujeme ho
  if (username !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const deleteUser = (userId) => {
    // Vymažeme užívateľa
    axios.delete(`http://localhost:5000/api/users/${userId}`)
      .then(res => {
        alert(res.data.msg);
        // Odstránime vymazaného užívateľa z lokálneho stavu
        setUsers(users.filter(user => user._id !== userId));
      })
      .catch(err => {
        console.error('Chyba pri mazaní užívateľa:', err);
      });
  };

  const renameUser = (userId, currentUsername) => {
    // Získame nové meno užívateľa pomocou promptu
    const newUsername = prompt('Enter new username:', currentUsername);
    if (newUsername && newUsername.trim() !== '') {
      // Aktualizujeme užívateľa
      axios.put(`http://localhost:5000/api/users/${userId}`, { username: newUsername })
        .then(res => {
          alert(res.data.msg);
          // Aktualizujeme užívateľa v lokálnom stave
          setUsers(users.map(user => user._id === userId ? { ...user, username: newUsername } : user));
        })
        .catch(err => {
          console.error('Chyba pri premenovávaní užívateľa:', err);
          alert('Error renaming user.');
        });
    } else {
      alert('Invalid username.');
    }
  };

  return (
    <div className="manage-users-page">
      <h2 className="manage-users-title">Manage Users</h2>
      {users.length === 0 ? (
        <div className="empty-message">No users available.</div>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>
                  <button
                    className="action-button rename-button"
                    onClick={() => renameUser(user._id, user.username)}
                  >
                    Rename
                  </button>
                  <button
                    className="action-button delete-button"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageUsersPage;
