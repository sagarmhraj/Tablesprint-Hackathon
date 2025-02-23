import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import { TablesprintState } from '../contexts/TablesprintContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './signup-login.css';

const Login = () => {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isCreateUser, setIsCreateUser] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const { setUser } = TablesprintState();

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = { email, password };
    try {
      let { data } = await axios.post('http://localhost:5000/api/v1/user/login', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      toast({ title: 'Login Successful', status: 'success', duration: 4000, isClosable: true });
      navigate('/home', { replace: true });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast({ title: 'Login failed', description: errorMessage, status: 'error', duration: 5000, isClosable: true });
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/api/v1/user/forgot-password', { email });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/v1/user/register', { name, email, password });
      toast({ title: 'User registered successfully', status: 'success', duration: 4000, isClosable: true });
      setIsCreateUser(false);
      setEmail('');
      setPassword('');
      setName('');
    } catch (error) {
      toast({ title: 'Registration failed', description: error.response?.data?.message || 'Something went wrong!', status: 'error', duration: 5000, isClosable: true });
    }
  };

  return (
    <Container fluid className="login-page d-flex align-items-center justify-content-center min-vh-100 position-relative">
      <img src="/singup-bg_image.png" id="bg" className="position-absolute top-0 start-0 w-100 h-100 object-cover" alt="Background" />
      <div className="blue-overlay position-absolute top-0 start-0 w-100 h-100 bg-black opacity-50"></div>
      <Row className="login-container position-relative z-10 w-100" style={{ maxWidth: '400px' }}>
        <Col xs={12} className="bg-white p-4 rounded shadow-lg">
          <div className="text-center mb-4">
            <img src="/tablesprint_logo.png" alt="Logo" className="login-logo mb-3" />
            <h5>{isForgotPassword ? 'Forgot Password' : isCreateUser ? 'Create User' : 'Welcome to TableSprint Admin'}</h5>
          </div>
          {isForgotPassword ? (
            <Form onSubmit={handleForgotPassword}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
                {loading ? 'Sending...' : 'Request Reset Link'}
              </Button>
              {message && <p className="text-center text-success fw-bold">{message}</p>}
              <p
                className="text-primary text-center cursor-pointer mt-2"
                style={{ cursor: 'pointer' }}
                onClick={() => setIsForgotPassword(false)}
              >
                Back to Login
              </p>
            </Form>
          ) : isCreateUser ? (
            <Form onSubmit={handleRegister}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 mb-2">
                Register
              </Button>
              <Button
                variant="outline-secondary"
                className="w-100"
                onClick={() => setIsCreateUser(false)}
              >
                Back to Login
              </Button>
            </Form>
          ) : (
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <div className="text-end mb-3">
                <p
                  className="text-primary cursor-pointer"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setIsForgotPassword(true)}
                >
                  Forgot Password?
                </p>
              </div>
              <Button variant="primary" type="submit" className="w-100 mb-2">
                Log In
              </Button>
              <Button
                variant="outline-secondary"
                className="w-100"
                onClick={() => setIsCreateUser(true)}
              >
                Create User
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
