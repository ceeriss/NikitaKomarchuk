import React from 'react';
import Header from './Header';
import Content from './Content';
import ContentTwo from './ContentTwo';
import ThemeToggle from '../ThemeToggle';

const MainPage = () => {
  return (
    <>
      <div className="theme-toggle-container">
        <ThemeToggle />
      </div>
      <Header />
      <Content />
      <ContentTwo />
      {/* Можно добавить другие компоненты */}
    </>
  );
};

export default MainPage;