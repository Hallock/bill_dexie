import { NavBar, DatePicker } from 'antd-mobile';
import './index.scss';
import { useState, useMemo, useEffect } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useSelector} from 'react-redux';
import _ from 'lodash';
import DailyBill from '@/pages/Month/DailyBill';


const Year = () => {

  const billList = useSelector(state => state.bill.billList);
  //console.log(billList);

  const [dateVisible, setDateVisible] = useState(false);

  const [chooseYear, setchooseYear] = useState(() => {
    return dayjs(new Date()).format('YYYY');
  });
  // console.log(chooseYear);

  const yearGroup = useMemo(() => {
    return _.groupBy(billList, (item) => {
      return dayjs(item.date).format('YYYY');
    });
  }, [billList]);

  // console.log(yearGroup);

  const [yearGroupResults, setyearGroupResults] = useState([]);
  // console.log(yearGroupResults);

  const filterDate = yearGroupResults.map(item => dayjs(item.date).format('YYYY'));

  const newFilterDate = [...new Set(filterDate)];
  // console.log(newFilterDate[0]);

  const yearBudgetCount = useMemo(() => {
    const income = yearGroupResults.filter(item => item.type === 'income').reduce((acc, value) => acc + value.money, 0);
    const pay = yearGroupResults.filter(item => item.type === 'pay').reduce((acc, value) => acc + value.money, 0);
    return {
      income,
      pay,
      total: income + pay,
    };
  }, [yearGroupResults]);

  useEffect(() => {
    const currentYear = dayjs(new Date()).format('YYYY');
    if (yearGroup[currentYear]) {
      setyearGroupResults((prevResults) => {
        const newResults = yearGroup[currentYear];
        return prevResults.length !== newResults.length || !_.isEqual(prevResults, newResults) ? newResults : prevResults;
      });
      //setyearGroupResults(yearGroup[currentYear])
    }
  }, [yearGroup]);

  const monthGroup=useMemo(() => {
    const monthGroupData = _.groupBy(yearGroupResults,(item) => dayjs(item.date).format('YYYY-MM'));
    const keys = Object.keys(monthGroupData)
    // console.log(monthGroupData);
    // console.log(keys);
    return {
      monthGroupData,
      keys
    }
  },[yearGroupResults])
  // console.log(monthGroup);
  // console.log(monthGroup.monthGroupData);

  const deleteConfirm = (date) => {
    setDateVisible(false);
    const chooseDate = dayjs(date).format('YYYY');
    // console.log(chooseDate);
    setchooseYear(chooseDate);

    if (yearGroup[chooseDate]) {
      setyearGroupResults((prevResults) => {
        const newResults = yearGroup[chooseDate];
        return newResults.length !== prevResults.length || !_.isEqual(newResults, prevResults) ? newResults : prevResults;
      });
    }
    // setyearGroupResults(chooseDate)
  };

  return (<div className='monthlyBill'>
    <NavBar className='nav' backArrow={false}>
      年度收支
    </NavBar>
    <div className='content'>
      <div className='header'>
        {/* 时间切换区域 */}
        <div className='date' onClick={() => setDateVisible(true)}>
            <span className='text'>
              {chooseYear + ''}年账单
            </span>
          <span className={classNames('arrow', dateVisible && 'expand')}></span>

        </div>
        {/* 统计区域 */}
        <div className='twoLineOverview'>
          <div className='item'>
            <span className='money'>{newFilterDate[0] !== chooseYear ? 0 : yearBudgetCount.pay.toFixed(2)}</span>
            <span className='type'>支出</span>
          </div>
          <div className='item'>
            <span className='money'>{newFilterDate[0] !== chooseYear ? 0 : yearBudgetCount.income.toFixed(2)}</span>
            <span className='type'>收入</span>
          </div>
          <div className='item'>
            <span className='money'>{newFilterDate[0] !== chooseYear ? 0 : yearBudgetCount.total.toFixed(2)}</span>
            <span className='type'>结余</span>
          </div>
        </div>
        {/* 时间选择器 */}
        <DatePicker
          className='kaDate'
          title='记账日期'
          precision='year'
          visible={dateVisible}
          max={new Date()}
          onConfirm={deleteConfirm}
          onCancel={() => setDateVisible(false)}
          onClose={() => setDateVisible(false)}
        />
      </div>
      {/* 单日列表统计 */}
      {
        monthGroup.keys.map(key => {
          // console.log(key);
          // console.log(chooseDay);
          const keyMonth = dayjs(key).format('YYYY')
          return(
            keyMonth === chooseYear &&<DailyBill key={key} date={key} billList={monthGroup.monthGroupData[key]}  />
          )
        })
      }

    </div>
  </div>);
};

export default Year;