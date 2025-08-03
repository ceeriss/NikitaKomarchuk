app.post('/api/auth/yandex', async (req, res) => {
  try {
    const { code } = req.body;
    
    const tokenResponse = await axios.post('https://oauth.yandex.ru/token', {
      grant_type: 'authorization_code',
      code,
      client_id: YANDEX_CLIENT_ID,
      client_secret: YANDEX_CLIENT_SECRET
    });

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get('https://login.yandex.ru/info', {
      headers: { Authorization: `OAuth ${accessToken}` },
      params: { format: 'json' }
    });

    const userData = {
      id: userResponse.data.id,
      name: userResponse.data.real_name || userResponse.data.display_name,
      email: userResponse.data.default_email,
      avatar: userResponse.data.default_avatar_id 
        ? `https://avatars.yandex.net/get-yapic/${userResponse.data.default_avatar_id}/islands-200`
        : null
    };

    res.json({ user: userData });
  } catch (error) {
    console.error('Yandex auth error:', error);
    res.status(500).json({ error: 'Yandex authentication failed' });
  }
});