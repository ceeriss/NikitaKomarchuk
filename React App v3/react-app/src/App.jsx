import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";
import BusinessInfoForm from "./BusinessInfoForm";
import YandexCallback from "./YandexCallback";

function App() {
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'yandex-auth-success') {
        console.log('Yandex auth success:', event.data.user);
      } else if (event.data.type === 'yandex-auth-error') {
        console.error('Yandex auth error:', event.data.error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<RegisterForm />} />
        <Route path="/business-info" element={<BusinessInfoForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/yandex-callback" element={<YandexCallback />} />
      </Routes>
    </Router>
  );
}

export default App;