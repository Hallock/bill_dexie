import { NavBar, DatePicker } from 'antd-mobile';
import './index.scss';
import { useState, useMemo, useEffect } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { getBillList } from '@/store/modules';


const Month = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBillList(dispatch));
  }, [dispatch]);

  const billList = useSelector(state => state.bill.billList);
  //console.log(billList);
  const monthGroup = useMemo(() => {
    return _.groupBy(billList, (item) => {
      return dayjs(item.date).format('YYYY-MM');
    });
  }, [billList]);

  console.log(monthGroup);

  const [dateVisible, setDateVisible] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(() => {
    return dayjs(new Date()).format('YYYY-MM');
  });

  const deleteConfirm = (date) => {
    setDateVisible(false);
    const month = dayjs(date).format('YYYY-MM');
    setCurrentMonth(month);
  };


  return (
    <div className='monthlyBill'>
      <NavBar className='nav' backArrow={true}>
        月度收支
      </NavBar>
      <div className='content'>
        <div className='header'>
          {/* 时间切换区域 */}
          <div className='date' onClick={() => setDateVisible(true)}>
            <span className='text'>
              {currentMonth + ''}月账单
            </span>
            <span className={classNames('arrow', dateVisible && 'expand')}></span>

          </div>
          {/* 统计区域 */}
          <div className='twoLineOverview'>
            <div className='item'>
              <span className='money'>{100}</span>
              <span className='type'>支出</span>
            </div>
            <div className='item'>
              <span className='money'>{200}</span>
              <span className='type'>收入</span>
            </div>
            <div className='item'>
              <span className='money'>{200}</span>
              <span className='type'>结余</span>
            </div>
          </div>
          {/* 时间选择器 */}
          <DatePicker
            className='kaDate'
            title='记账日期'
            precision='month'
            visible={dateVisible}
            max={new Date()}
            onConfirm={deleteConfirm}
            onCancel={() => setDateVisible(false)}
            onClose={() => setDateVisible(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default Month;