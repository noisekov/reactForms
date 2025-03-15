import { createSlice } from '@reduxjs/toolkit';
// import type { PayloadAction } from '@reduxjs/toolkit';

export interface formData {
  name: string;
  age: number;
  email: string;
  password: string;
  repeatPassword: string;
  sex: string;
  terms: boolean;
  country: string;
  image: string;
}
const initialState: formData = {
  name: '',
  age: 0,
  email: '',
  password: '',
  repeatPassword: '',
  sex: '',
  terms: false,
  country: '',
  image: '',
};

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    addData: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearData: () => {
      return initialState;
    },
  },
});

export const { addData, clearData } = dataSlice.actions;
export default dataSlice.reducer;
