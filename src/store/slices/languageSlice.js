import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  language: typeof window !== 'undefined' ? localStorage.getItem('language') || 'eng' : 'eng',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', action.payload);
      }
    },
    toggleLanguage: (state) => {
      state.language = state.language === 'eng' ? 'amh' : 'eng';
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', state.language);
      }
    },
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;
export default languageSlice.reducer;
