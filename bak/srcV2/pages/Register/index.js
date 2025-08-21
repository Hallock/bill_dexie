import { Button, Input, Form, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import db from '@/database';
import './index.scss';

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const values = await form.validateFields();
      const { username, password, confirmPassword } = values;

      if (password !== confirmPassword) {
        Toast.show({ content: '两次密码输入不一致', duration: 1500 });
        return;
      }

      // 检查用户名是否已存在
      const existingUser = await db.users
        .where('username')
        .equals(username)
        .first();
      if (existingUser) {
        Toast.show({ content: '用户名已存在', duration: 1500 });
        return;
      }

      // 密码加密
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // 保存用户信息
      await db.users.add({ username, password: hashedPassword });
      Toast.show({ content: '注册成功', duration: 1500 });
      navigate('/login');
    } catch (error) {
      console.error('注册失败:', error);
      Toast.show({ content: '注册失败，请重试', duration: 1500 });
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>注册</h2>
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input type="password" placeholder="请输入密码" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            rules={[{ required: true, message: '请确认密码' }]}
          >
            <Input type="password" placeholder="请确认密码" />
          </Form.Item>
          <Button type="primary" onClick={handleRegister}>
            注册
          </Button>
          <Button onClick={() => navigate('/login')}>已有账号？去登录</Button>
        </Form>
      </div>
    </div>
  );
};

export default Register;
