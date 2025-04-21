import React from 'react';
import { FaFacebookF, FaTwitter,  FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaInstagram, FaTiktok } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            {/* Company Info */}
            <div className="footer-col">
              <h3 className="footer-heading">Nebsam Digital Solutions</h3>
              <p className="footer-description">
                Leading provider of vehicle security and tracking solutions in Kenya, 
                helping businesses protect their assets since 2015.
              </p>
              <div className="footer-hours">
                <FiClock className="footer-icon" />
                <span>Mon-Sat: 8:00 AM - 6:00 PM</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <h3 className="footer-heading">Quick Links</h3>
              <ul className="footer-links">
                <li><a href="/">Home</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/services">Services</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/blog">Blog</a></li>
              </ul>
            </div>

            {/* Services */}
            <div className="footer-col">
              <h3 className="footer-heading">Our Services</h3>
              <ul className="footer-links">
                <li><a href="/services/car-tracking">GPS Tracking</a></li>
                <li><a href="/services/car-alarms">Car Alarms</a></li>
                <li><a href="/services/fuel-monitoring">Fuel Monitoring</a></li>
                <li><a href="/services/speed-governors">Speed Governors</a></li>
                <li><a href="/services/fleet-management">Fleet Management</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-col">
              <h3 className="footer-heading">Contact Us</h3>
              <ul className="footer-contact">
                <li>
                  <FaPhoneAlt className="footer-icon" />
                  <div>
                    <a href="tel:+254759000111">+254 759 000 111</a>
                    <span className="contact-label">Sales</span>
                  </div>
                </li>
                <li>
                  <FaEnvelope className="footer-icon" />
                  <a href="mailto:info@nebsamdigital.com">info@nebsamdigital.com</a>
                </li>
                <li>
                  <FaMapMarkerAlt className="footer-icon" />
                  <span>Nairobi & Mombasa, Kenya</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              &copy; {new Date().getFullYear()} Nebsam Digital Solutions (K) Ltd . All Rights Reserved.
            </p>
            
            <div className="footer-social">
              <a href="https://facebook.com" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="https://tiktok.com" aria-label="LinkedIn">
                <FaTiktok />
              </a>
              <a href="https://instagram.com" aria-label="Twitter">
                <FaInstagram />
              </a>
              <a href="https://twitter.com" aria-label="Twitter">
                <FaTwitter />
              </a>
            </div>

            <div className="footer-legal">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/sitemap">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;