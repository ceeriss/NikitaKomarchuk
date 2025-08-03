import React from 'react';
import { Button, Avatar } from '@heroui/react';
import './forma.css';

const YandexAuthButton = () => {
  const handleYandexLogin = () => {
    const YANDEX_CLIENT_ID = 'c282b16b44454cbfb3dd4c5b731415cf';
    // Изменяем redirect_uri на страницу callback
    const REDIRECT_URI = encodeURIComponent(`http://localhost:4173/business-info`);
    const YANDEX_AUTH_URL = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${YANDEX_CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;

    // Открываем авторизацию в том же окне
    window.location.href = YANDEX_AUTH_URL;
  };

  return (
    <Button
      className="social-btn yandex"
      onClick={handleYandexLogin}
      disableRipple
      startContent={
        <Avatar
          src="https://yastatic.net/s3/passport-static/core/_/8e5k2g1Qw8Q5j0-jyQy8SJqFxY.svg"
          alt="Yandex"
          size="sm"
          className="yandex-icon"
        />
      }
    >
      Войти через Яндекс
    </Button>
  );
};

export default YandexAuthButton;