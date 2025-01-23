import { NavBar, DatePicker } from 'antd-mobile';
import './index.scss';
import { useState, useMemo, useEffect } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useSelector} from 'react-redux';
import _ from 'lodash';
import DailyBill from '@/pages/Month/DailyBill';


const Month = () => {

  const billList = useSelector(state => state.bill.billList);
  //console.log(billList);

  const [dateVisible, setDateVisible] = useState(false);

  const [chooseMonth, setChooseMonth] = useState(() => {
    return dayjs(new Date()).format('YYYY-MM');
  });
    // console.log(chooseMonth);

  const monthGroup = useMemo(() => {
    return _.groupBy(billList, (item) => {
      return dayjs(item.date).format('YYYY-MM');
    });
  }, [billList]);

  //console.log(monthGroup);

  const [monthGroupResults, setMonthGroupResults] = useState([]);
   // console.log(monthGroupResults);

  const filterDate = monthGroupResults.map(item => dayjs(item.date).format('YYYY-MM'));

  const newFilterDate = [...new Set(filterDate)];
   // console.log(newFilterDate[0]);

  const monthBudgetCount = useMemo(() => {
    const income = monthGroupResults.filter(item => item.type === 'income').reduce((acc, value) => acc + value.money, 0);
    const pay = monthGroupResults.filter(item => item.type === 'pay').reduce((acc, value) => acc + value.money, 0);
    return {
      income,
      pay,
      total: income + pay,
    };
  }, [monthGroupResults]);

  useEffect(() => {
    const currentMonth = dayjs(new Date()).format('YYYY-MM');
    if (monthGroup[currentMonth]) {
      setMonthGroupResults((prevResults) => {
        const newResults = monthGroup[currentMonth];
        return prevResults.length !== newResults.length || !_.isEqual(prevResults, newResults) ? newResults : prevResults;
      });
      //setMonthGroupResults(monthGroup[currentMonth])
    }
  }, [monthGroup]);

  const dayGroup=useMemo(() => {
    const dayGroupData = _.groupBy(monthGroupResults,(item) => dayjs(item.date).format('YYYY-MM-DD'));
    const keys = Object.keys(dayGroupData)
    // console.log(dayGroupData);
    // console.log(keys);
    return {
      dayGroupData,
      keys
    }
  },[monthGroupResults])
  // console.log(dayGroup);
  // console.log(dayGroup.dayGroupData);

  const deleteConfirm = (date) => {
    setDateVisible(false);
    const chooseDate = dayjs(date).format('YYYY-MM');
    // console.log(chooseDate);
    setChooseMonth(chooseDate);

    if (monthGroup[chooseDate]) {
      setMonthGroupResults((prevResults) => {
        const newResults = monthGroup[chooseDate];
        return newResults.length !== prevResults.length || !_.isEqual(newResults, prevResults) ? newResults : prevResults;
      });
    }
    // setMonthGroupResults(chooseDate)
  };

  return (<div className='monthlyBill'>
    <NavBar className='nav' backArrow={false}>
      月度收支
    </NavBar>
    <div className='content'>
      <div className='header'>
        {/* 时间切换区域 */}
        <div className='date' onClick={() => setDateVisible(true)}>
            <span className='text'>
              {chooseMonth + ''}月账单
            </span>
          <span className={classNames('arrow', dateVisible && 'expand')}></span>

        </div>
        {/* 统计区域 */}
        <div className='twoLineOverview'>
          <div className='item'>
            <span className='money'>{newFilterDate[0] !== chooseMonth ? 0 : monthBudgetCount.pay.toFixed(2)}</span>
            <span className='type'>支出</span>
          </div>
          <div className='item'>
            <span className='money'>{newFilterDate[0] !== chooseMonth ? 0 : monthBudgetCount.income.toFixed(2)}</span>
            <span className='type'>收入</span>
          </div>
          <div className='item'>
            <span className='money'>{newFilterDate[0] !== chooseMonth ? 0 : monthBudgetCount.total.toFixed(2)}</span>
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
      {/* 单日列表统计 */}
      {
        dayGroup.keys.map(key => {
          // console.log(key);
          // console.log(chooseDay);
          const keyMonth = dayjs(key).format('YYYY-MM')
          return(
            keyMonth === chooseMonth &&<DailyBill key={key} date={key} billList={dayGroup.dayGroupData[key]} chooseMonth={chooseMonth} />
          )
        })
      }

    </div>
  </div>);
};

export default Month;