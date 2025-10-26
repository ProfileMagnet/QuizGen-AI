import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <div className="logo-icon">
              <img src="/icon.png" alt="QuizGen AI" />
            </div>
            <span>QuizGen AI</span>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <ul>
                <li><a href="#architecture">Architecture</a></li>
                <li><a href="#examples">Examples</a></li>
                <li><a href="#try">Try It Live</a></li>
                <li><a href="#upcoming">Roadmap</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li><a href="#team">About Us</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="https://chat.whatsapp.com/DbaUWOQGGC6HpmKDf9VsIL">Community</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            &copy; {currentYear} QuizGen AI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;