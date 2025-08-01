import React from 'react';
import { Button, Avatar } from '@heroui/react';
import axios from 'axios';
import qs from 'qs';

const YandexAuthButton = () => {
  const YANDEX_CLIENT_ID = 'ваш_client_id';
  const YANDEX_AUTH_URL = 'https://oauth.yandex.ru/authorize';
  const REDIRECT_URI = 'http://localhost:3000/oauth/yandex';

  const handleYandexLogin = () => {
    const params = {
      response_type: 'code',
      client_id: YANDEX_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      display: 'popup'
    };

    window.location.href = `${YANDEX_AUTH_URL}?${qs.stringify(params)}`;
  };

  return (
    <Button
      variant="bordered"
      className="social-btn"
      onClick={handleYandexLogin}
      disableRipple
      startContent={
        <Avatar
          src="../imgs/yandex.png"  // Добавьте иконку Яндекс
          alt="Yandex"
          size="sm"
          className="yandex-icon"
        />
      }
    >
      Continue with Yandex
    </Button>
  );
};

export default YandexAuthButton;
