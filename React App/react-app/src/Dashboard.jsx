import React from "react";
import { useNavigate } from "react-router-dom";
import { HeroUIProvider, Button } from "@heroui/react";
import { AuthService } from "./AuthService";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <HeroUIProvider>
      <div className="dashboard-container">
        <h1>Welcome, {user.firstName || user.name}!</h1>
        <div className="user-info">
          {user.company && <p><strong>Компания:</strong> {user.company}</p>}
          {user.phone && <p><strong>Телефон:</strong> {user.phone}</p>}
          {user.category && <p><strong>Категория:</strong> {user.category}</p>}
          <p><strong>Email:</strong> {user.email}</p>
        </div>
        
        <Button 
          color="primary"
          onClick={handleLogout}
          className="logout-btn"
        >
          Logout
        </Button>
      </div>
    </HeroUIProvider>
  );
};

export default Dashboard;