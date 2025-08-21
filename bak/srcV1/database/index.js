import Dexie from 'dexie';

// 使用显式主键定义（你的数据有预定义的字符串ID）
const index = new Dexie('BillAppDB');

index.version(1).stores({
  bills:"++id,type,money,date,useFor"
});

export default index;
