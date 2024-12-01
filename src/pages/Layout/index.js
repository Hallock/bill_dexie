import { Button, TabBar } from 'antd-mobile';
import { Outlet } from 'react-router-dom';
import {
  AppOutline, MessageOutline, UnorderedListOutline, UserOutline, BillOutline, AddCircleOutline, CalculatorOutline,
} from 'antd-mobile-icons';
import './index.scss';


const Layout = () => {

  const optsRouter = (key) => {
    console.log(key);
  };

  const tabs = [{
    key: '/month', title: '月度账单', icon: <BillOutline />,
  }, {
    key: '/new', title: '记账', icon: <AddCircleOutline />,
  }, {
    key: '/year', title: '年度账单', icon: <CalculatorOutline />,
  }];
  return (
    <div className='layout'>
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
    </div>
  );

};

export default Layout;