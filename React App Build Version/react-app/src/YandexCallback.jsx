import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from "./AuthService";

const YandexCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      console.error('Yandex auth error:', error);
      navigate('/login', { state: { error: 'Yandex authentication failed' } });
      return;
    }

    if (code) {
      fetch('/api/auth/yandex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.user) {
          const userData = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            avatar: data.user.avatar,
            provider: "yandex",
            completedBusinessInfo: false,
            createdAt: new Date().toISOString()
          };

          // Сохраняем пользователя
          AuthService.register(userData)
            .then(() => {
              // Перенаправляем на бизнес-форму
              navigate('/business-info');
            })
            .catch(error => {
              console.error('Registration error:', error);
              navigate('/login', { state: { error: 'Registration failed' } });
            });
        }
      })
      .catch(error => {
        console.error('Yandex auth error:', error);
        navigate('/login', { state: { error: 'Authentication failed' } });
      });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Авторизация через Яндекс...</h2>
      <p>Пожалуйста, подождите...</p>
    </div>
  );
};

export default YandexCallback;