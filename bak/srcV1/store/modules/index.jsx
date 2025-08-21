import { createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';

import db from '@/database';

const billStore = createSlice({
  name: 'bill',
  initialState: {
    billList: [],
  },
  reducers: {
    setBillList(state, action) {
      state.billList = action.payload;
    },
    addBill(state,action){
      state.billList.push(action.payload)
    }
  },
});

const { setBillList,addBill } = billStore.actions;

// const getBillList = (dispatch) => {
//   return async () => {
//     const res = await axios.get('/api/bili/read_all_bili');
//     dispatch(setBillList(res.data));
//   };
// };

// 从本地数据库加载账单
const getBillList = () => async (dispatch) => {
  try {
    const allBills = await db.bills.toArray();
    // console.log(allBills);
    dispatch(setBillList(allBills));
  } catch (error) {
    console.error('Failed to load bills:', error);
  }
};

// const addBillList = (data) => {
//   return async (dispatch) => {
//     const res = await axios.post('/api/bili/create', data);
//     dispatch(addBill(res.data));
//   };
// };

// 添加账单到本地数据库
const addBillList = (data) => async (dispatch) => {
  // console.log(data);
  try {
    // 添加默认账本ID
    const billData = {
      ...data,
      date: new Date(data.date).toISOString(),
    };
    // 写入数据库并更新 Redux
    const id = await db.bills.add(billData);
    // console.log('保存ID:', id);
    const newBill = await db.bills.get(id);
    // console.log(newBill);
    dispatch(addBill(newBill));
  } catch (error) {
    console.error('保存失败:', error);
    throw error; // 抛出错误让 UI 层处理
  }
};

//删除账单根据ID
const deleteBill = (id) => async (dispatch) => {
  try {
    await db.bills.delete(id);
    dispatch(setBillList(await db.bills.toArray()));
  } catch (error) {
    console.error('删除失败:', error);
    throw error; // 抛出错误让 UI 层处理
  }
};

export { getBillList ,addBillList,deleteBill};

const reducer = billStore.reducer;
export default reducer;
