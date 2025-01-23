import { Button, DatePicker, Input, NavBar } from 'antd-mobile';
import { useState } from 'react';
import Icon from '@/components/Icon';
import './index.scss';
import classNames from 'classnames';
import { billListData } from '@/contants';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import {addBillList} from '@/store/modules';
import { useDispatch } from 'react-redux';


const New = () => {
  const navigate = useNavigate();
  const [billType, setBillType] = useState('pay');

  const dateConfirm = (value) => {
    console.log(value);
    setDateVisible(false);
    setDate(value);
  };
  const [dateVisible, setDateVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [money, setMoney] = useState(0);
  const [useFor, setUseFor] = useState('');

  const dispatch=useDispatch();
  const saveBill = () => {
    const data = {
        type: billType,
        date:date,
        money: billType ==='pay'? -money :+money,
        useFor:useFor
    }
    // console.log(data);
      dispatch(addBillList(data));
  }

  return (
    <div className='keepAccounts'>
      <NavBar className='nav' onBack={() => navigate(-1)}>
        记一笔
      </NavBar>

      <div className='header'>
        <div className='kaType'>
          <Button
            shape='rounded'
            className={classNames(billType === 'pay' ? 'selected' : '')}
            onClick={() => setBillType('pay')}
          >
            支出
          </Button>
          <Button
            shape='rounded'
            className={classNames(billType === 'income' ? 'selected' : '')}
            onClick={() => setBillType('income')}
          >
            收入
          </Button>
        </div>

        <div className='kaFormWrapper'>
          <div className='kaForm'>
            <div className='date'>
              <Icon type='calendar' className='icon' />
              <span className='text' onClick={() => {
                setDateVisible(true);
              }}>{dayjs(date).format('YYYY-MM-DD')}</span>
              <DatePicker
                className='kaDate'
                title='记账日期'
                max={new Date()}
                visible={dateVisible}
                onConfirm={dateConfirm}
                onCancel={() => setDateVisible(false)}
                onClose={() => setDateVisible(false)}
              />
            </div>
            <div className='kaInput'>
              <Input
                className='input'
                placeholder='0.00'
                type='number'
                value={money}
                onChange={(newValue) => setMoney(parseFloat(newValue))}
              />
              <span className='iconYuan'>¥</span>
            </div>
          </div>
        </div>
      </div>

      <div className='kaTypeList'>
        {
          billListData[billType].map(item => {
            return (<div className='kaType' key={item.type}>
              <div className='title'>{item.name}</div>
              <div className='list'>
                {item.list.map(item => {
                  return (<div
                    className={classNames('item', useFor === item.type ? 'selected' : '')}
                    key={item.type}
                    onClick={() => { setUseFor(item.type); }}
                  >
                    <div className='icon'>
                      <Icon type={item.type} />
                    </div>
                    <div className='text'>{item.name}</div>
                  </div>);
                })}
              </div>
            </div>);
          })
        }
      </div>

      <div className='btns'>
        <Button className='btn save' onClick={saveBill}>
          保 存
        </Button>
      </div>
    </div>
  );
};

export default New;