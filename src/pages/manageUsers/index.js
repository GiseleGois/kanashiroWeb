import React, { useState, useEffect } from 'react';
import { Edit } from 'react-feather';
import { useHistory } from 'react-router-dom';
import { auth } from '../../firebase';
import './style.css';
import { usersData, enableUser } from '../../service';

export default function ManagementUsers() {
  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newValue, setNewValue] = useState("");
  const history = useHistory();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      usersData()
        .then(response => {
          setUserData(response);
        })
        .catch(error => {
          console.error("Error fetching products:", error);
        });
    });

    return () => unsubscribeAuth();
  }, [history]);

  const openModal = (userData) => {
    setSelectedUser(userData);
    setNewValue(userData.authorizer);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setNewValue("");
  };

  const handleInputChange = (event) => {
    setNewValue(event.target.value === "true");
  };

  const updateUserValue = () => {
    if (selectedUser) {
      const updatedUser = { ...selectedUser, authorizer: newValue };
      enableUser(updatedUser)
        .then(() => {
          setUserData(prevUsers =>
            prevUsers.map(user =>
              user.uuid === updatedUser.uuid ? updatedUser : user
            )
          );
          closeModal();
        })
        .catch(error => {
          console.error("Error updating user:", error);
        });
    }
  };

  return (
    <div className="management-users">
      <h1>Gerenciamento de usuarios</h1>
      <div className="user-manager-list">
        {userData.map(user => (
          <div
            className="user-manager-card"
            key={user.userDocId}
            onClick={() => openModal(user)}
          >
            <h2>{user.name}</h2>
            <p>Email: {user.email}</p>
            <p>Status: {user.authorizer ? 'Habilitado' : 'Desabilitado'}</p>
            <span className="edit-icon">
              <Edit />
            </span>
          </div>
        ))}
      </div>
      {selectedUser && (
        <div className="management-users-modal">
          <div className="user-manager-modal-content">
            <h2>{selectedUser.name}</h2>
            <p>Email: {selectedUser.email}</p>
            <p>Status: {selectedUser.authorizer}</p>
            <p>
              Alterar status:
              <select value={newValue} onChange={handleInputChange}>
                <option value={true}>Habilitado</option>
                <option value={false}>Desabilitado</option>
              </select>
            </p>
            <button onClick={updateUserValue}>Confirmar</button>
            <button onClick={closeModal}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}
