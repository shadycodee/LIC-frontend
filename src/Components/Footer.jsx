import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className='content'>
        <p>&copy; {new Date().getFullYear()} Capstone TEAM 27. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;