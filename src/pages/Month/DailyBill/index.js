import classNames from 'classnames';
import './index.scss';
import { useMemo, useState, useRef } from 'react';
import Icon from '@/components/Icon';
import { billTypeToName } from '@/contants';
import { deleteBill } from '@/store/modules';
import { useDispatch } from 'react-redux';

const DailyBill = ({ date, billList }) => {
  const dayResult = useMemo(
    () => {
      const pay = billList.filter(item => item.type === 'pay').reduce((pre, cur) => pre + cur.money, 0);
      const income = billList.filter(item => item.type === 'income').reduce((pre, cur) => pre + cur.money, 0);
      return { pay, income, total: pay + income };
    }, [billList],
  );

  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();

  // 用于存储每个账单项的滑动状态
  const [swipedItems, setSwipedItems] = useState({});

  // 存储触摸起始位置
  const touchStartXRef = useRef(0);

  const handleDeleteUseForClick = (id) => {
    dispatch(deleteBill(id));
    // 删除后重置该账单项的滑动状态
    setSwipedItems(prev => {
      const newState = {...prev};
      delete newState[id];
      return newState;
    });
  }

  // 处理触摸开始事件
  const handleTouchStart = (id, e) => {
    touchStartXRef.current = e.touches[0].clientX;
    // 重置其他账单项的滑动状态
    setSwipedItems(prev => {
      const newState = {...prev};
      Object.keys(newState).forEach(key => {
        if (key !== id) newState[key] = false;
      });
      return newState;
    });
  }

  // 处理触摸移动事件
  const handleTouchMove = (id, e) => {
    const touchX = e.touches[0].clientX;
    const deltaX = touchX - touchStartXRef.current;

    // 如果是左滑（负值），则更新状态
    if (deltaX < -20) {
      setSwipedItems(prev => ({
        ...prev,
        [id]: true
      }));
    }
    // 如果是右滑（正值），则重置状态
    else if (deltaX > 20) {
      setSwipedItems(prev => ({
        ...prev,
        [id]: false
      }));
    }
  }

  // 处理触摸结束事件
  const handleTouchEnd = (id) => {
    // 可以在这里添加一些逻辑，比如滑动距离超过阈值才保持状态
    // console.log(id);
  }

  return (
    <div className={classNames('dailyBill')} >
      <div className='header'>
        <div className='dateIcon' onClick={() => setVisible(!visible)}>
          <span className='date'>{date}</span>
          <span className={classNames('arrow', visible && 'expand')}></span>
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
          const isSwiped = swipedItems[item.id] || false;

          return (
            <div
              className='bill'
              key={item.id}
              onTouchStart={(e) => handleTouchStart(item.id, e)}
              onTouchMove={(e) => handleTouchMove(item.id, e)}
              onTouchEnd={() => handleTouchEnd(item.id)}
            >
              <Icon type={item.useFor}></Icon>
              <div className='detail'>
                <div className='billType'>{billTypeToName[item.useFor]}</div>
              </div>
              <div className={classNames('money', item.type)}>
                {item.money.toFixed(2)}
              </div>

              {/* 删除按钮 */}
              <button
                className='delete-button'
                onClick={() => handleDeleteUseForClick(item.id)}
                style={{
                  transform: isSwiped ? 'translateX(0)' : 'translateX(100%)',
                  opacity: isSwiped ? 1 : 0
                }}
              >
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