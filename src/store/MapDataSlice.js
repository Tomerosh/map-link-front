import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  position: {
    longitude: null,
    langitude: null
  },
  users: [],
  reports: []
};

const mapDataSlice = createSlice({
  name: "map",

  initialState,

  reducers: {
    setPosition(state, action) {
      console.log(state.position.langitude)
      state.position.langitude =  action.payload.langitude
      state.position.longitude =  action.payload.longitude
  },
}
});

export const { setPosition } = mapDataSlice.actions;

export default mapDataSlice.reducer;
