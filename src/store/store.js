
import { configureStore } from '@reduxjs/toolkit';
import mapDataReducer from './MapDataSlice';
 
export default configureStore({
  reducer: {
    map: mapDataReducer
  },
});