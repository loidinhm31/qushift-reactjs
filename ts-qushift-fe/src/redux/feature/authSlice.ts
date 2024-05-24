import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  isAuthenticate?: boolean;
  username?: string;
};

const initialState = {
  isAuthenticate: false
} as AuthState;

const authSlice = createSlice({
  name: "authenticate",
  initialState: initialState,
  reducers: {
    resetAuthenticate: () => initialState,
    setAuthenticate: (state, action: PayloadAction<AuthState>) => {
      return action.payload;
    }
  }
});

export const { resetAuthenticate, setAuthenticate } = authSlice.actions;

export default authSlice.reducer;
