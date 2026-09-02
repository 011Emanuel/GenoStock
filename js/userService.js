// UserService - Centralized User & Profile Data Service using sessionStorage
// Designed for seamless replacement with Supabase in the future.

(function () {
  const CURRENT_USER_KEY = 'currentUser';
  const REGISTERED_USERS_KEY = 'registeredUsers';

  const UserService = {
    /**
     * Get the currently logged in user object from sessionStorage
     * @returns {Object|null}
     */
    getCurrentUser() {
      const data = sessionStorage.getItem(CURRENT_USER_KEY);
      if (!data) return null;
      try {
        const user = JSON.parse(data);
        return this._ensureDefaults(user);
      } catch (e) {
        console.error('Error parsing currentUser from sessionStorage:', e);
        return null;
      }
    },

    /**
     * Set/update the active user object in sessionStorage
     * @param {Object} user 
     */
    setCurrentUser(user) {
      const sanitizedUser = this._ensureDefaults(user);
      sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sanitizedUser));
      this._syncToRegisteredUsers(sanitizedUser);
      // Dispatch custom event for real-time app reactivity across components
      window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: sanitizedUser }));
      return sanitizedUser;
    },

    /**
     * Get list of all registered users in current browser session
     * @returns {Array}
     */
    getRegisteredUsers() {
      const data = sessionStorage.getItem(REGISTERED_USERS_KEY);
      if (!data) return [];
      try {
        return JSON.parse(data);
      } catch (e) {
        return [];
      }
    },

    /**
     * Register a new user and set as current user in sessionStorage
     * @param {Object} userData 
     * @returns {Object}
     */
    registerUser(userData) {
      const newUser = {
        fullName: userData.fullName || userData.username || 'User',
        email: userData.email || '',
        phone: userData.phone || '',
        password: userData.password || '',
        ranchName: userData.ranchName || 'N/A',
        ranchAddress: userData.ranchAddress || userData.location || 'N/A',
        acres: userData.acres || 'N/A',
        foundedYear: userData.foundedYear || 'N/A',
        yearsExperience: userData.yearsExperience || 'N/A',
        specialty: userData.specialty || 'N/A',
        certifications: userData.certifications || 'N/A',
        role: userData.role || 'rancher',
        livestock: {
          totalCattle: userData.cattleCount !== undefined && userData.cattleCount !== '' ? Number(userData.cattleCount) : 0,
          brahman: 0,
          nelore: 0,
          pregnant: 0,
          healthRate: 'N/A',
          vaccinated: 'N/A',
          lastCheck: 'N/A',
          nextCheck: 'N/A',
          breedingSeason: 'N/A',
          expectedCalves: 0,
          aiScheduled: 'N/A',
          successRate: 'N/A'
        }
      };

      return this.setCurrentUser(newUser);
    },

    /**
     * Authenticate user against registered users in sessionStorage
     * @param {string} email 
     * @param {string} password 
     * @returns {Object|null}
     */
    loginUser(email, password) {
      const users = this.getRegisteredUsers();
      const matched = users.find(
        u => u.email && u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (matched) {
        return this.setCurrentUser(matched);
      }

      // Check current user if already logged in
      const current = this.getCurrentUser();
      if (current && current.email && current.email.toLowerCase() === email.toLowerCase() && current.password === password) {
        return current;
      }

      return null;
    },

    /**
     * Update user profile fields and persist back to sessionStorage
     * @param {Object} updatedFields 
     * @returns {Object}
     */
    updateProfile(updatedFields) {
      const current = this.getCurrentUser() || {};
      const updatedUser = {
        ...current,
        ...updatedFields,
        livestock: {
          ...(current.livestock || {}),
          ...(updatedFields.livestock || {})
        }
      };
      return this.setCurrentUser(updatedUser);
    },

    /**
     * Clear user session on logout
     */
    logout() {
      sessionStorage.removeItem(CURRENT_USER_KEY);
      window.dispatchEvent(new CustomEvent('userLoggedOut'));
    },

    /**
     * Helper to ensure all required fields and livestock defaults exist
     * @private
     */
    _ensureDefaults(user) {
      if (!user) return null;
      return {
        fullName: user.fullName || user.username || 'N/A',
        email: user.email || 'N/A',
        phone: user.phone || 'N/A',
        password: user.password || '',
        ranchName: user.ranchName || 'N/A',
        ranchAddress: user.ranchAddress || user.location || 'N/A',
        acres: user.acres !== undefined && user.acres !== '' ? user.acres : 'N/A',
        foundedYear: user.foundedYear !== undefined && user.foundedYear !== '' ? user.foundedYear : 'N/A',
        yearsExperience: user.yearsExperience !== undefined && user.yearsExperience !== '' ? user.yearsExperience : 'N/A',
        specialty: user.specialty || 'N/A',
        certifications: user.certifications || 'N/A',
        role: user.role || 'rancher',
        livestock: {
          totalCattle: user.livestock?.totalCattle ?? (user.cattleCount ? Number(user.cattleCount) : 0),
          brahman: user.livestock?.brahman ?? 0,
          nelore: user.livestock?.nelore ?? 0,
          pregnant: user.livestock?.pregnant ?? 0,
          healthRate: user.livestock?.healthRate || 'N/A',
          vaccinated: user.livestock?.vaccinated || 'N/A',
          lastCheck: user.livestock?.lastCheck || 'N/A',
          nextCheck: user.livestock?.nextCheck || 'N/A',
          breedingSeason: user.livestock?.breedingSeason || 'N/A',
          expectedCalves: user.livestock?.expectedCalves ?? 0,
          aiScheduled: user.livestock?.aiScheduled || 'N/A',
          successRate: user.livestock?.successRate || 'N/A'
        }
      };
    },

    /**
     * Helper to sync active user changes into the registered users array in sessionStorage
     * @private
     */
    _syncToRegisteredUsers(user) {
      const users = this.getRegisteredUsers();
      const index = users.findIndex(u => u.email && u.email.toLowerCase() === user.email.toLowerCase());
      if (index !== -1) {
        users[index] = user;
      } else {
        users.push(user);
      }
      sessionStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    }
  };

  window.UserService = UserService;
})();
