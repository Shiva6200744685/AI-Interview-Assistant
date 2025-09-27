import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing localStorage with React state
 * @param {string} key - The localStorage key
 * @param {any} initialValue - Initial value if key doesn't exist
 * @returns {array} [value, setValue, removeValue]
 */
const useLocalStorage = (key, initialValue = null) => {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        if (valueToStore === null || valueToStore === undefined) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove the item from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error);
        }
      } else if (e.key === key && e.newValue === null) {
        setStoredValue(initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

/**
 * Hook for managing complex localStorage operations
 * @param {string} key - The localStorage key
 * @returns {object} Storage operations
 */
export const useLocalStorageManager = (key) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [key]);

  const saveData = useCallback((newData) => {
    try {
      setLoading(true);
      setError(null);
      
      const dataToStore = typeof newData === 'function' ? newData(data) : newData;
      localStorage.setItem(key, JSON.stringify(dataToStore));
      setData(dataToStore);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [key, data]);

  const removeData = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      localStorage.removeItem(key);
      setData(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [key]);

  const updateData = useCallback((updates) => {
    saveData(prevData => ({
      ...prevData,
      ...updates
    }));
  }, [saveData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    saveData,
    removeData,
    updateData,
    clearError
  };
};

/**
 * Hook for managing array data in localStorage
 * @param {string} key - The localStorage key
 * @param {array} initialValue - Initial array value
 * @returns {object} Array operations
 */
export const useLocalStorageArray = (key, initialValue = []) => {
  const [array, setArray] = useLocalStorage(key, initialValue);

  const addItem = useCallback((item) => {
    setArray(prevArray => [...prevArray, item]);
  }, [setArray]);

  const removeItem = useCallback((index) => {
    setArray(prevArray => prevArray.filter((_, i) => i !== index));
  }, [setArray]);

  const removeItemById = useCallback((id, idKey = 'id') => {
    setArray(prevArray => prevArray.filter(item => item[idKey] !== id));
  }, [setArray]);

  const updateItem = useCallback((index, updates) => {
    setArray(prevArray => 
      prevArray.map((item, i) => 
        i === index ? { ...item, ...updates } : item
      )
    );
  }, [setArray]);

  const updateItemById = useCallback((id, updates, idKey = 'id') => {
    setArray(prevArray =>
      prevArray.map(item =>
        item[idKey] === id ? { ...item, ...updates } : item
      )
    );
  }, [setArray]);

  const clearArray = useCallback(() => {
    setArray([]);
  }, [setArray]);

  const findItem = useCallback((predicate) => {
    return array.find(predicate);
  }, [array]);

  const findItemById = useCallback((id, idKey = 'id') => {
    return array.find(item => item[idKey] === id);
  }, [array]);

  const sortArray = useCallback((compareFn) => {
    setArray(prevArray => [...prevArray].sort(compareFn));
  }, [setArray]);

  return {
    array,
    setArray,
    addItem,
    removeItem,
    removeItemById,
    updateItem,
    updateItemById,
    clearArray,
    findItem,
    findItemById,
    sortArray,
    length: array.length,
    isEmpty: array.length === 0
  };
};

export default useLocalStorage;