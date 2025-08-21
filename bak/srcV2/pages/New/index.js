// 导入所需的组件和库
import { Button, DatePicker, Input, NavBar,Toast } from 'antd-mobile';
import { useState } from 'react';
import Icon from '@/components/Icon';
import './index.scss';
import classNames from 'classnames';
import { billListData } from '@/contants';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { addBillList } from '@/store/modules';
import { useDispatch } from 'react-redux';

// 定义New组件
const New = () => {
  // 使用useNavigate钩子进行页面导航
  const navigate = useNavigate();
  // 定义账单类型状态，默认为'pay'（支出）
  const [billType, setBillType] = useState('pay');

  // 定义日期选择器可见状态
  const [dateVisible, setDateVisible] = useState(false);
  // 定义当前日期状态
  const [date, setDate] = useState(new Date());
  // 定义金额状态
  const [money, setMoney] = useState(0);
  // 定义用途状态
  const [useFor, setUseFor] = useState('');

  // 确认日期选择的回调函数
  const dateConfirm = (value) => {
    setDateVisible(false);
    setDate(value);
  };

  // 使用useDispatch钩子获取dispatch函数
  const dispatch = useDispatch();
  // 保存账单的回调函数
  const saveBill = () => {
    const userId = localStorage.getItem('userId');
    const data = {
      type: billType,
      date: date,
      money: billType === 'pay' ? -money : +money,
      useFor: useFor,
      userId: parseInt(userId),
    };

    // 检查用户是否已登录
    if (!userId) {
      Toast.show({ content: '请先登录', duration: 1500 });
      navigate('/login');
      return;
    }

    // console.log(data);

    // console.log(data);

    // 检查用途是否为空
    if (data.useFor.trim() === '') {
      Toast.show({
        content: '请输入用途，以便记录您的用途。',
        duration: 2000, // 消息显示时长（毫秒）
        position: 'bottom', // 消息显示位置
      });
      return;
    }

    // 检查金额是否为0
    if (data.money === 0|| !data.money ) {
      Toast.show({
        content: '请输入金额，金额不能为0或为空值。',
        duration: 2000,
        position: 'bottom',
      });
      return;
    }

    // 如果所有检查通过，调用 dispatch 和 navigate
    dispatch(addBillList(data));
    navigate(-1);
  };
  // 渲染组件
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
              }}>
                {dayjs(date).format('YYYY-MM-DD')}
              </span>
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
                onChange={(newValue) => setMoney(parseFloat(newValue))}
              />
              <span className='iconYuan'>¥</span>
            </div>
          </div>
        </div>
      </div>

      <div className='contentContainer'>
        <div className='scrollWrapper'>
          <div className='kaTypeList'>
            {
              billListData[billType].map(item => {
                return (
                  <div className='kaType' key={item.type}>
                    <div className='title'>{item.name}</div>
                    <div className='list'>
                      {item.list.map(item => {
                        return (<div
                          className={classNames('item', useFor === item.type ? 'selected' : '')}
                          key={item.type}
                          onClick={() => {
                            setUseFor(item.type);
                          }}
                        >
                          <div className='icon'>
                            <Icon type={item.type} />
                          </div>
                          <div className='text'>{item.name}</div>
                        </div>);
                      })}
                    </div>
                  </div>
                );
              })
            }
          </div>


        </div>
        <div className='btns'>
          <Button className='btn save' onClick={saveBill}>
            保 存
          </Button>
        </div>
      </div>
    </div>
  );
};

export default New;
