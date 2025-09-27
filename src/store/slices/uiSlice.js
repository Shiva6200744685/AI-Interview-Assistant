import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTab: 'interviewee', // 'interviewee' or 'interviewer'
  isMobile: window.innerWidth < 768,
  sidebarCollapsed: false,
  theme: 'light',
  notifications: [],
  modals: {
    welcomeBack: false,
    candidateDetail: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    
    addNotification: (state, action) => {
      const notification = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    openModal: (state, action) => {
      if (state.modals.hasOwnProperty(action.payload)) {
        state.modals[action.payload] = true;
      }
    },
    
    closeModal: (state, action) => {
      if (state.modals.hasOwnProperty(action.payload)) {
        state.modals[action.payload] = false;
      }
    },
    
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key] = false;
      });
    },
  },
});

export const {
  setActiveTab,
  setIsMobile,
  toggleSidebar,
  setSidebarCollapsed,
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
} = uiSlice.actions;

export default uiSlice.reducer;