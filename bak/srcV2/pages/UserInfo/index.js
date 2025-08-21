import React, { useEffect, useState } from 'react';
import { Button } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setBillList } from '@/store/modules';
import './index.scss';

const UserInfo = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 从localStorage获取用户名
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // 退出登录处理函数
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    dispatch(setBillList([]));
    navigate('/login');
  };

  return (
    <div className="user-info">
      <div className="user-avatar">
        {/* <img src={avatarUrl} alt="User Avatar" /> */}
      </div>
      <span className="username">欢迎，{username}！</span>
      <Button type="text" onClick={handleLogout} className="logout-btn">
        退出登录
      </Button>
    </div>
  );
};

export default UserInfo;
