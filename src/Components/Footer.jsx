import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className='content'>
        <p>&copy; {new Date().getFullYear()} TEAM. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;