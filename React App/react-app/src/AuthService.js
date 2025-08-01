// AuthService.js
import { mockUsers } from './mockData';

export const AuthService = {
  register: (userData) => {
    const users = JSON.parse(localStorage.getItem('users')) || [...mockUsers];
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(userData));
    return userData;
  },

  login: (email, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || [...mockUsers];
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    return null;
  },

  updateUser: (userData) => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const index = users.findIndex(u => u.id === userData.id);
  if (index !== -1) {
    users[index] = userData;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(userData));
    return true;
  }
  return false;
},

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('currentUser')) || mockUsers[0];
  },

  logout: () => {
    localStorage.removeItem('currentUser');
  }
};
