import { configureStore } from "@reduxjs/toolkit";

import dialogReducer from "@/redux/feature/dialogSlice";
import authReducer from "@/redux/feature/authSlice";


const store = configureStore({
  reducer: {
    dialogReducer,
    authReducer
  }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
