import React from 'react';
import Header from '../components/Header';
import Content from '../components/Content';
import ContentTwo from '../components/ContentTwo';

const DefaultLayout = ({ children }) => {
  return (
    <div>
      
<Content/>
<ContentTwo/>
      <main>
{children}
      </main>
    </div>
  );
};

export default DefaultLayout;
