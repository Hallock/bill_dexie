import { Button, Input, Form, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import db from '@/database';
import { getBillList } from '@/store/modules';
import { useDispatch } from 'react-redux';
import './index.scss';

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const values = await form.validateFields();
      const { username, password } = values;

      // 查找用户
      const user = await db.users.where('username').equals(username).first();
      if (!user) {
        Toast.show({ content: '用户名不存在', duration: 1500 });
        return;
      }

      // 验证密码
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        Toast.show({ content: '密码错误', duration: 1500 });
        return;
      }

      // 保存登录状态
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userId', user.id);
      localStorage.setItem('username', user.username);
      Toast.show({ content: '登录成功', duration: 1500 });
      dispatch(getBillList());
      navigate('/month');
    } catch (error) {
      console.error('登录失败:', error);
      Toast.show({ content: '登录失败，请重试', duration: 1500 });
    }
  };

  return (
    <div className="login-page">
      <h1>记一笔账</h1>
      <div className="login-card">
        <h2>登录</h2>
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input type="password" placeholder="请输入密码" />
          </Form.Item>
          <Button className="login-btn" type="primary" onClick={handleLogin}>
            登录
          </Button>
          <Button
            className="register-btn"
            onClick={() => navigate('/register')}
          >
            没有账号？去注册
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
