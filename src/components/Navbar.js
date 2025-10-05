import React, { useState } from 'react';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = (item) => {
    setActiveDropdown(activeDropdown === item ? null : item);
  };

  // Service dropdown links with their direct paths
  const serviceDropdownLinks = [
    { label: 'GPS Tracking', path: '/services/car-tracking' },
    { label: 'Smart Car Alarms', path: '/services/car-alarms' },
    { label: 'Fuel Monitoring', path: '/services/fuel-monitoring' },
    { label: 'Video Telematics', path: '/services/vehicle-video-telematics' },
    { label: 'Speed Governors', path: '/services/speed-governors' },
    { label: 'Radio Calls', path: '/services/radio-calls' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Nebsam</span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item dropdown">
            <div
              className="nav-link dropdown-toggle"
              onClick={() => toggleDropdown('about')}
            >
              About Us <FaChevronDown className="dropdown-icon" />
            </div>
            {activeDropdown === 'about' && (
              <ul className="dropdown-menu">
                <li>
                  <Link to="/about" className="dropdown-link" onClick={() => setIsOpen(false)}>
                    Our Company
                  </Link>
                </li>
                <li>
                  <Link to="/team" className="dropdown-link" onClick={() => setIsOpen(false)}>
                    Our Team
                  </Link>
                </li>
                <li>
                  <Link to="/clients" className="dropdown-link" onClick={() => setIsOpen(false)}>
                    Our Clients
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li className="nav-item dropdown">
            <div
              className="nav-link dropdown-toggle"
              onClick={() => toggleDropdown('services')}
            >
              Services <FaChevronDown className="dropdown-icon" />
            </div>
            {activeDropdown === 'services' && (
              <ul className="dropdown-menu">
                {serviceDropdownLinks.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      to={item.path}
                      className="dropdown-link"
                      onClick={() => {
                        setIsOpen(false);
                        setActiveDropdown(null);
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link contact-btn" onClick={() => setIsOpen(false)}>
              Contact Us
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-marquee">
      <span className="marquee-text">We Are The Solution</span>
    </div>
    </nav>
  );
};

export default Navbar;