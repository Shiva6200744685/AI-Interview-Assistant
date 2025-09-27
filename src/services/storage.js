import { STORAGE_KEYS } from '../utils/constants';

/**
 * Storage service for managing localStorage operations
 */
class StorageService {
  constructor() {
    this.isLocalStorageAvailable = this.checkLocalStorageAvailability();
  }

  /**
   * Check if localStorage is available
   * @returns {boolean} - Whether localStorage is available
   */
  checkLocalStorageAvailability() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, 'test');
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage is not available');
      return false;
    }
  }

  /**
   * Get item from localStorage
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if key doesn't exist
   * @returns {any} - Retrieved value
   */
  getItem(key, defaultValue = null) {
    if (!this.isLocalStorageAvailable) {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting localStorage item "${key}":`, error);
      return defaultValue;
    }
  }

  /**
   * Set item in localStorage
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @returns {boolean} - Whether operation was successful
   */
  setItem(key, value) {
    if (!this.isLocalStorageAvailable) {
      return false;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting localStorage item "${key}":`, error);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} - Whether operation was successful
   */
  removeItem(key) {
    if (!this.isLocalStorageAvailable) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage item "${key}":`, error);
      return false;
    }
  }

  /**
   * Clear all localStorage
   * @returns {boolean} - Whether operation was successful
   */
  clear() {
    if (!this.isLocalStorageAvailable) {
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  /**
   * Get all keys from localStorage
   * @returns {string[]} - Array of keys
   */
  getAllKeys() {
    if (!this.isLocalStorageAvailable) {
      return [];
    }

    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Error getting localStorage keys:', error);
      return [];
    }
  }

  /**
   * Get storage size in bytes
   * @returns {number} - Storage size in bytes
   */
  getStorageSize() {
    if (!this.isLocalStorageAvailable) {
      return 0;
    }

    try {
      let total = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 0;
    }
  }

  // Specific methods for interview app data

  /**
   * Save candidates data
   * @param {Array} candidates - Candidates array
   * @returns {boolean} - Whether operation was successful
   */
  saveCandidates(candidates) {
    return this.setItem(STORAGE_KEYS.CANDIDATES, candidates);
  }

  /**
   * Get candidates data
   * @returns {Array} - Candidates array
   */
  getCandidates() {
    return this.getItem(STORAGE_KEYS.CANDIDATES, []);
  }

  /**
   * Add candidate to storage
   * @param {Object} candidate - Candidate object
   * @returns {boolean} - Whether operation was successful
   */
  addCandidate(candidate) {
    const candidates = this.getCandidates();
    const candidateWithId = {
      ...candidate,
      id: candidate.id || Date.now().toString(),
      timestamp: candidate.timestamp || Date.now()
    };
    
    candidates.push(candidateWithId);
    return this.saveCandidates(candidates);
  }

  /**
   * Update candidate in storage
   * @param {string} id - Candidate ID
   * @param {Object} updates - Updates to apply
   * @returns {boolean} - Whether operation was successful
   */
  updateCandidate(id, updates) {
    const candidates = this.getCandidates();
    const candidateIndex = candidates.findIndex(c => c.id === id);
    
    if (candidateIndex !== -1) {
      candidates[candidateIndex] = { ...candidates[candidateIndex], ...updates };
      return this.saveCandidates(candidates);
    }
    
    return false;
  }

  /**
   * Remove candidate from storage
   * @param {string} id - Candidate ID
   * @returns {boolean} - Whether operation was successful
   */
  removeCandidate(id) {
    const candidates = this.getCandidates();
    const filteredCandidates = candidates.filter(c => c.id !== id);
    return this.saveCandidates(filteredCandidates);
  }

  /**
   * Clear all candidates
   * @returns {boolean} - Whether operation was successful
   */
  clearCandidates() {
    return this.removeItem(STORAGE_KEYS.CANDIDATES);
  }

  /**
   * Save current session data
   * @param {Object} sessionData - Session data
   * @returns {boolean} - Whether operation was successful
   */
  saveCurrentSession(sessionData) {
    return this.setItem(STORAGE_KEYS.CURRENT_SESSION, {
      ...sessionData,
      lastUpdated: Date.now()
    });
  }

  /**
   * Get current session data
   * @returns {Object|null} - Session data
   */
  getCurrentSession() {
    return this.getItem(STORAGE_KEYS.CURRENT_SESSION, null);
  }

  /**
   * Clear current session
   * @returns {boolean} - Whether operation was successful
   */
  clearCurrentSession() {
    return this.removeItem(STORAGE_KEYS.CURRENT_SESSION);
  }

  /**
   * Save user preferences
   * @param {Object} preferences - User preferences
   * @returns {boolean} - Whether operation was successful
   */
  saveUserPreferences(preferences) {
    return this.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
  }

  /**
   * Get user preferences
   * @returns {Object} - User preferences
   */
  getUserPreferences() {
    return this.getItem(STORAGE_KEYS.USER_PREFERENCES, {
      theme: 'light',
      autoSave: true,
      soundEnabled: true,
      notificationsEnabled: true
    });
  }

  /**
   * Update user preference
   * @param {string} key - Preference key
   * @param {any} value - Preference value
   * @returns {boolean} - Whether operation was successful
   */
  updateUserPreference(key, value) {
    const preferences = this.getUserPreferences();
    preferences[key] = value;
    return this.saveUserPreferences(preferences);
  }

  /**
   * Export all data as JSON
   * @returns {Object} - All stored data
   */
  exportData() {
    return {
      candidates: this.getCandidates(),
      currentSession: this.getCurrentSession(),
      userPreferences: this.getUserPreferences(),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
  }

  /**
   * Import data from JSON
   * @param {Object} data - Data to import
   * @returns {boolean} - Whether operation was successful
   */
  importData(data) {
    try {
      if (data.candidates) {
        this.saveCandidates(data.candidates);
      }
      
      if (data.currentSession) {
        this.saveCurrentSession(data.currentSession);
      }
      
      if (data.userPreferences) {
        this.saveUserPreferences(data.userPreferences);
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  /**
   * Get storage statistics
   * @returns {Object} - Storage statistics
   */
  getStorageStats() {
    const candidates = this.getCandidates();
    const currentSession = this.getCurrentSession();
    
    return {
      totalCandidates: candidates.length,
      completedCandidates: candidates.filter(c => c.status === 'completed').length,
      hasActiveSession: !!currentSession,
      storageSize: this.getStorageSize(),
      lastActivity: currentSession?.lastUpdated || null
    };
  }

  /**
   * Cleanup old data
   * @param {number} daysToKeep - Number of days to keep data
   * @returns {number} - Number of items cleaned up
   */
  cleanupOldData(daysToKeep = 30) {
    const cutoffDate = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    const candidates = this.getCandidates();
    
    const recentCandidates = candidates.filter(c => 
      (c.timestamp || 0) > cutoffDate || (c.completedAt || 0) > cutoffDate
    );
    
    const cleanedCount = candidates.length - recentCandidates.length;
    
    if (cleanedCount > 0) {
      this.saveCandidates(recentCandidates);
    }
    
    return cleanedCount;
  }

  /**
   * Backup data to download
   * @returns {string} - JSON string for download
   */
  createBackup() {
    const data = this.exportData();
    return JSON.stringify(data, null, 2);
  }

  /**
   * Restore data from backup
   * @param {string} backupData - JSON string from backup
   * @returns {boolean} - Whether operation was successful
   */
  restoreFromBackup(backupData) {
    try {
      const data = JSON.parse(backupData);
      return this.importData(data);
    } catch (error) {
      console.error('Error restoring from backup:', error);
      return false;
    }
  }
}

// Create and export singleton instance
const storageService = new StorageService();
export default storageService;

// Export class for testing
export { StorageService };