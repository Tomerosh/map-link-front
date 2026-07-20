
import { configureStore } from '@reduxjs/toolkit';
import mapDataReducer from './MapDataSlice.js';
 
export default configureStore({
  reducer: {
    map: mapDataReducer
  },
});
