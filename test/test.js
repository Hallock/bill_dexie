import classNames from 'classnames';
import './index.scss';
import { useMemo, useState } from 'react';
import Icon from '@/components/Icon';
import {billTypeToName} from '@/contants';
import { deleteBill} from '@/store/modules';
import { useDispatch } from 'react-redux';



const DailyBill = ({date, billList }) => {
  const dayResult = useMemo(
    () => {
      const pay = billList.filter(item => item.type === 'pay').reduce((pre, cur) => pre + cur.money, 0);
      const income = billList.filter(item => item.type === 'income').reduce((pre, cur) => pre + cur.money, 0);
      return { pay, income, total: pay + income };
    }, [billList],
  );
  // console.log(dayResult);
  const [visible,setVisible]=useState(false);

  const dispatch = useDispatch();

  const handleDeleteUseForClick = (id) => {
    console.log(id);
    dispatch(deleteBill(id));
  }

  return (
    <div className={classNames('dailyBill')} >
      <div className='header'>
        <div className='dateIcon' onClick={() => setVisible(!visible)}>
          <span className='date'>{date}</span>
          <span className={classNames('arrow', visible && 'expand')} onClick={() => setVisible(!visible)}></span>
        </div>
        <div className='oneLineOverview' onClick={() => setVisible(!visible)}>
          <div className='pay'>
            <span className='type'>支出</span>
            <span className='money'>{dayResult.pay.toFixed(2)}</span>
          </div>
          <div className='income'>
            <span className='type'>收入</span>
            <span className='money'>{dayResult.income.toFixed(2)}</span>
          </div>
          <div className='balance'>
            <span className='money'>{dayResult.total.toFixed(2)}</span>
            <span className='type'>结余</span>
          </div>
        </div>
      </div>
      {/* 单日列表 */}
      <div className='billList' style={{ display: visible ? 'block' : 'none' }}>
        {billList.map(item => {
          return (
            <div className='bill' key={item.id}>
              <Icon type={item.useFor}></Icon>
              <div className='detail'>
                <div className='billType'>{billTypeToName[item.useFor]}</div>
              </div>
              <div className={classNames('money', item.type)}>
                {item.money.toFixed(2)}
              </div>
              <button className='delete-button' onClick={() => handleDeleteUseForClick(item.id)}>
                删除
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default DailyBill;