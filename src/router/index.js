import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Layout from '@/pages/Layout';
import New from '@/pages/New';
import Month from '@/pages/Month';
import Year from '@/pages/Year';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Me from '@/pages/UserInfo';
import { useSelector } from 'react-redux';

// 私有路由组件，用于保护需要登录才能访问的页面
const PrivateRoute = () => {
  const user = localStorage.getItem('isLoggedIn') === 'true';
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Navigate to={'/month'} replace />,
          },
          {
            path: '/month',
            element: <Month />,
          },
          {
            path: '/year',
            element: <Year />,
          },
          {
            path: '/new',
            element: <New />,
          },
          {
            path: '/me',
            element: <Me />,
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  // 重定向所有未匹配的路由到登录页
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
export default router;
