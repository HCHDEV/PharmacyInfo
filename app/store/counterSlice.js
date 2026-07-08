import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "ไม่มีข้อมูล",
  Data: {},
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    save: (state, action) => {
      state.value = action.payload.value;
      state.Data = action.payload.Data;
    },
  },
});
export const { save } = counterSlice.actions;
export default counterSlice.reducer;
