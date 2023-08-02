import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as React from "react";

type DialogState = {
  isOpen: boolean;
  title?: string;
  dialogNode?: React.ReactNode;
};

const initialState = {
  isOpen: false,
} as DialogState;

const dialogSlice = createSlice({
  name: "dialog",
  initialState: initialState,
  reducers: {
    resetDialog: () => initialState,
    setDialog: (state, action: PayloadAction<DialogState>) => {
      return action.payload;
    },
  },
});

export const { resetDialog, setDialog } = dialogSlice.actions;

export default dialogSlice.reducer;
