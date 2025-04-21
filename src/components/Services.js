import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaCar,
  FaMapMarkerAlt,
  FaBell,
  FaGasPump,
  FaMobile,
  FaVideo,
  FaTachometerAlt,
} from 'react-icons/fa';
import '../App.css';

const Services = () => {
  const services = [
    {
      id: 1,
      name: 'Car Tracking',
      icon: (
        <div className="icon-container">
          <FaCar className="car-icon" />
          <FaMapMarkerAlt className="location-icon" />
        </div>
      ),
      description: 'Real-time GPS tracking for your vehicles.',
      color: '#dbeafe', // light  Blue
      textColor: '#1e40af', // Dark Blue for text
      path: '/services/car-tracking', // Path for detailed page
    },
    {
      id: 2,
      name: 'Fuel Monitoring',
      icon: <FaGasPump className="fuel-icon" />,
      description: 'Monitor fuel usage and prevent theft.',
      color: '#dcfce7', // Light Green
      textColor: '#166534', // Dark Green for text
      path: '/services/fuel-monitoring', // Path for detailed page
    },
    {
      id: 3,
      name: 'Car Alarms',
      icon: (
        <div className="icon-container">
          <FaCar className="car-icon" />
          <FaBell className="alarm-icon" />

        </div>
      ),
      description: 'Advanced car alarm systems for security.',
      color: '#ffedd5', // Light Orange
      textColor: '#9a3412', // Dark Orange for text
      path: '/services/car-alarms', // Path for detailed page
    },
    {
      id: 4,
      name: 'Radio Calls',
      icon: <FaMobile className="radio-icon" />,
      description: 'Reliable communication with walkie-talkies.',
      color: '#fee2e2', // Light Red
      textColor: '#991b1b', // Dark Red for text
      path: '/services/radio-calls', // Path for detailed page
    },
    {
      id: 5,
      name: 'Vehicle Video Telematics',
      icon: <FaVideo className="video-icon" />,
      description: 'Live video monitoring and analytics for your fleet.',
      color: '#ede9fe', // Light Purple
      textColor: '#6d28d9', // Dark Purple for text
      path: '/services/vehicle-video-telematics', // Path for detailed page
    },
    {
      id: 6,
      name: 'Speed Governors',
      icon: <FaTachometerAlt className="tachometer-icon" />,
      description: 'speed limiting your fleet.',
      color: '#dbeafe', // light  Blue
      textColor: '#1e40af', // Dark Blue for text
      path: '/services/speed-governors', // Path for detailed page
    },
  ];

  return (
    <div className="services-container">
      <h2>Our Services</h2>
      <div className="services-grid">
        {services.map((service) => (
          <Link
            key={service.id}
            to={service.path}
            className="service-card"
            style={{ backgroundColor: service.color }}
          >
            <div className="service-icon">{service.icon}</div>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Services;