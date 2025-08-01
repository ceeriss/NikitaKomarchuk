import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeroUIProvider, Form, Input, Button } from '@heroui/react';
import { AuthService } from './AuthService';
import ThemeToggle from './ThemeToggle';
import './forma.css';

const LoginForm = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Валидация
    const newErrors = {};
    if (!form.email) newErrors.email = 'Please enter your email';
    if (!form.password) newErrors.password = 'Please enter your password';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Авторизация
    const user = AuthService.login(form.email, form.password);
    if (user) {
      if (user.completedBusinessInfo) {
        navigate('/dashboard');
      } else {
        navigate('/business-info');
      }
    } else {
      setErrors({ auth: 'Invalid email or password' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Основной рендер формы
  return (
    <HeroUIProvider>
      <div className="theme-toggle-container">
        <ThemeToggle />
      </div>
      
      <div className="form-container">
        <div className="form-content">
          <div className="form-header">
            <h1 className="form-logo">Castaway</h1>
            <h2 className="form-title">Sign in</h2>
            <p className="form-subtitle">
              Don't have an account?{' '}
              <Link to="/register" className="form-link">
                Back to registration
              </Link>
            </p>
          </div>

          {/* Блок ошибок авторизации */}
          {errors.auth && (
            <div className="auth-error" style={{ 
              color: 'var(--error-color)',
              textAlign: 'center',
              marginBottom: '16px'
            }}>
              {errors.auth}
            </div>
          )}

          {/* Форма входа */}
          <Form className="main-form" onSubmit={handleSubmit}>
            <Input
              isRequired
              label="Email"
              labelPlacement="outside"
              name="email"
              placeholder="Enter your email"
              type="email"
              value={form.email}
              onChange={handleChange}
              errorMessage={errors.email}
              className="form-input"
            />

            <Input
              isRequired
              label="Password"
              labelPlacement="outside"
              name="password"
              placeholder="Enter your password"
              type="password"
              value={form.password}
              onChange={handleChange}
              errorMessage={errors.password}
              className="form-input"
            />

            <div className="form-actions">
              <Button
                type="submit"
                color="primary"
                className="submit-btn"
                disableRipple
                fullWidth
              >
                Sign in
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </HeroUIProvider>
  );
};

export default LoginForm;