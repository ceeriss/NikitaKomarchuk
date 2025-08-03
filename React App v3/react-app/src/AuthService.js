// AuthService.js
import { mockUsers } from './mockData';

class AuthService {
  static async register(userData) {
    try {
      await this._simulateNetworkDelay();
      
      const users = this._getUsers();
      const existingUser = this._findUserByEmail(userData.email);

      if (existingUser) {
        if (userData.provider === 'google' && existingUser.provider === 'google') {
          this._setCurrentUser(existingUser);
          return existingUser;
        }
        throw new Error(this._getUserExistsMessage(userData.provider));
      }

      const newUser = this._createUserObject(userData);
      this._saveUser(users, newUser);
      
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  static async login(email, password) {
    try {
      await this._simulateNetworkDelay();
      
      const user = this._findUserByEmail(email);
      if (!user) throw new Error('User not found');

      if (user.provider === 'google') {
        throw new Error('Please sign in with Google');
      }

      if (user.password !== password) {
        throw new Error('Invalid credentials');
      }

      this._setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async loginWithProvider(email, provider) {
    try {
      await this._simulateNetworkDelay();
      
      const user = this._findUserByEmail(email);
      if (!user) throw new Error('User not found');

      if (user.provider !== provider) {
        throw new Error(`Please sign in with ${provider}`);
      }

      this._setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Provider login error:', error);
      throw error;
    }
  }

  static async registerOrLoginWithGoogle(userData) {
    try {
      // Сначала пробуем зарегистрировать
      return await this.register(userData);
    } catch (error) {
      if (error.message.includes('already exists')) {
        // Если пользователь уже существует - логиним его
        return await this.loginWithProvider(userData.email, 'google');
      }
      throw error;
    }
  }

  static async updateUser(userData) {
    try {
      await this._simulateNetworkDelay();
      
      const users = this._getUsers();
      const index = users.findIndex(u => u.id === userData.id);
      
      if (index === -1) throw new Error('User not found');

      const updatedUser = this._createUpdatedUser(users[index], userData);
      this._updateUserInList(users, index, updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  }

  static getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('currentUser')) || null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  static logout() {
    try {
      localStorage.removeItem('currentUser');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }

  static isAuthenticated() {
    return !!this.getCurrentUser();
  }

  static async getUserById(id) {
    try {
      await this._simulateNetworkDelay();
      const user = this._getUsers().find(u => u.id === id);
      if (!user) throw new Error('User not found');
      return user;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }

  // ========== Приватные вспомогательные методы ==========
  static _simulateNetworkDelay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }

  static _getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
  }

  static _findUserByEmail(email) {
    return this._getUsers().find(u => u.email === email);
  }

  static _getUserExistsMessage(provider) {
    return provider === 'google' 
      ? 'This Google account is already registered' 
      : 'User with this email already exists';
  }

  static _createUserObject(userData) {
    return {
      ...userData,
      id: userData.id || `user_${Date.now()}`,
      createdAt: userData.createdAt || new Date().toISOString(),
      completedBusinessInfo: userData.completedBusinessInfo || false,
      provider: userData.provider || 'email'
    };
  }

  static _createUpdatedUser(existingUser, newData) {
    return {
      ...existingUser,
      ...newData,
      id: existingUser.id,
      email: existingUser.email,
      provider: existingUser.provider,
      createdAt: existingUser.createdAt
    };
  }

  static _saveUser(users, user) {
    const updatedUsers = [...users, user];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  static _updateUserInList(users, index, updatedUser) {
    const updatedUsers = [...users];
    updatedUsers[index] = updatedUser;
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  }

  static _setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  // ========== Методы для тестирования ==========
  static clearAllData() {
    try {
      localStorage.removeItem('users');
      localStorage.removeItem('currentUser');
      return true;
    } catch (error) {
      console.error('Clear data error:', error);
      return false;
    }
  }

  static checkUserExists(email) {
    try {
      return this._getUsers().some(u => u.email === email);
    } catch (error) {
      console.error('Check user error:', error);
      return false;
    }
  }

  static seedMockData() {
    try {
      localStorage.setItem('users', JSON.stringify(mockUsers));
      return true;
    } catch (error) {
      console.error('Seed mock data error:', error);
      return false;
    }
  }
  
}

export default AuthService;