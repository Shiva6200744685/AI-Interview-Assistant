import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  candidates: [],
  selectedCandidate: null,
  searchTerm: '',
  sortBy: 'score',
  sortOrder: 'desc',
  loading: false,
  error: null,
};

const candidateSlice = createSlice({
  name: 'candidate',
  initialState,
  reducers: {
    addCandidate: (state, action) => {
      const newCandidate = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        ...action.payload,
      };
      state.candidates.push(newCandidate);
    },
    
    updateCandidate: (state, action) => {
      const { id, updates } = action.payload;
      const candidateIndex = state.candidates.findIndex(c => c.id === id);
      if (candidateIndex !== -1) {
        state.candidates[candidateIndex] = { ...state.candidates[candidateIndex], ...updates };
      }
    },
    
    deleteCandidate: (state, action) => {
      state.candidates = state.candidates.filter(c => c.id !== action.payload);
    },
    
    selectCandidate: (state, action) => {
      state.selectedCandidate = state.candidates.find(c => c.id === action.payload) || null;
    },
    
    clearSelectedCandidate: (state) => {
      state.selectedCandidate = null;
    },
    
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    
    clearCandidates: (state) => {
      state.candidates = [];
      state.selectedCandidate = null;
    },
  },
});

export const {
  addCandidate,
  updateCandidate,
  deleteCandidate,
  selectCandidate,
  clearSelectedCandidate,
  setSearchTerm,
  setSortBy,
  setSortOrder,
  clearCandidates,
} = candidateSlice.actions;

// Selectors
export const selectFilteredCandidates = (state) => {
  const { candidates, searchTerm, sortBy, sortOrder } = state.candidate;
  
  let filtered = candidates;
  
  // Apply search filter
  if (searchTerm) {
    filtered = candidates.filter(candidate => 
      candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.phone?.includes(searchTerm)
    );
  }
  
  // Apply sorting
  filtered.sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case 'name':
        valueA = a.name || '';
        valueB = b.name || '';
        break;
      case 'score':
        valueA = a.totalScore || 0;
        valueB = b.totalScore || 0;
        break;
      case 'timestamp':
        valueA = a.timestamp || 0;
        valueB = b.timestamp || 0;
        break;
      default:
        valueA = a.totalScore || 0;
        valueB = b.totalScore || 0;
    }
    
    if (sortOrder === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });
  
  return filtered;
};

export default candidateSlice.reducer;