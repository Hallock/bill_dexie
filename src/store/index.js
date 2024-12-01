import { configureStore } from '@reduxjs/toolkit';
import billReducerStore from '@/store/modules';

const store = configureStore({
  reducer: {
    bill: billReducerStore,
  },
});

export default store;