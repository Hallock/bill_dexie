import { TabBar } from 'antd-mobile';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  BillOutline, AddCircleOutline, CalculatorOutline,
} from 'antd-mobile-icons';
import './index.scss';
import { getBillList } from '@/store/modules';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';


const tabs = [{
  key: '/',
  title: '月度账单',
  icon: <BillOutline />,
}, {
  key: '/new',
  title: '记账',
  icon: <AddCircleOutline />,
}, {
  key: '/year',
  title: '年度账单',
  icon: <CalculatorOutline />,
}];


const Layout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBillList(dispatch));
  }, [dispatch]);

  const navigate = useNavigate();
  const optsRouter = (key) => {
    navigate(key);
    // console.log(key);
  };

  return (<div className='layout'>
    <div className='container'>
      <Outlet></Outlet>
    </div>
    <div className='footer'>
      <TabBar onChange={optsRouter}>
        {tabs.map(item => {
          return (<TabBar.Item key={item.key} icon={item.icon} title={item.title}></TabBar.Item>);
        })}
      </TabBar>
    </div>
  </div>);

};

export default Layout;