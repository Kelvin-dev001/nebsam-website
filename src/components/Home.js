import React, { useState, useEffect } from 'react';
import { FaTruck, FaWhatsapp, FaShoppingCart, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';
import '../App.css';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredTruck, setHoveredTruck] = useState(null);
  
  const services = [
    {
      title: 'Advanced Car Tracking',
      description: 'Real-time GPS tracking with theft prevention features',
      image: '/images/car-tracking-hero1.jpg',
      cta: 'Explore Trackers'
    },
    {
      title: 'Smart Car Alarms',
      description: '3-in-1 security system with remote control',
      image: '/images/car-alarms-hero1.jpg',
      cta: 'Secure Your Vehicle'
    },
    {
      title: 'Video Telematics',
      description: 'AI-powered driver monitoring and safety',
      image: '/images/video-telematics-hero1.jpg',
      cta: 'View Events'
    },
    {
      title: 'Speed Governors',
      description: 'Compliance and fuel efficiency solutions',
      image: '/images/speed-governor-hero1.jpg',
      cta: 'Install/Renew'
    },
    {
      title: 'Fuel Monitoring',
      description: 'Prevent theft and reduce fuel costs',
      image: '/images/fuel-hero-bg1.jpg',
      cta: 'Monitor Fuel'
    },
    {
      title: 'Radio Calls',
      description: 'Reliable communication for your team',
      image: '/images/radio-hero-bg1.jpg',
      cta: 'Stay Connected'
    }
  ];

  const getRandomAlert = () => {
    const alerts = [
      "is speeding (92km/h in 80km/h zone)",
      "has been idling for 18 minutes",
      "fuel level dropped suddenly (possible theft)",
      "is off-route by 5.2km",
      "needs maintenance soon",
      "entered restricted area",
      "hard braking detected"
    ];
    return alerts[Math.floor(Math.random() * alerts.length)];
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === services.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === services.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? services.length - 1 : prev - 1));
  };

  return (
    <div className="home-container">
      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/254759000111" 
        className="whatsapp-float" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <FaWhatsapp className="whatsapp-icon" />
      </a>

      {/* Hero Carousel */}
      <div className="hero-carousel">
        {services.map((service, index) => (
          <div 
            key={index}
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${service.image})` }}
          >
            <div className="slide-overlay"></div>
            <div className="slide-content">
              <h2 className="slide-title">{service.title}</h2>
              <p className="slide-description">{service.description}</p>
              <button className="glow-button">
                {service.cta} <FaShoppingCart className="button-icon" />
              </button>
            </div>
          </div>
        ))}
        <button className="carousel-nav prev" onClick={prevSlide}>
          <FaChevronLeft />
        </button>
        <button className="carousel-nav next" onClick={nextSlide}>
          <FaChevronRight />
        </button>
        <div className="carousel-dots">
          {services.map((_, index) => (
            <span 
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
      </div>

      {/* Services Quick Links */}
      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card" onClick={() => setCurrentSlide(index)}>
            <div 
              className="service-image" 
              style={{ backgroundImage: `url(${service.image})` }}
            ></div>
            <h3>{service.title}</h3>
          </div>
        ))}
      </div>

    {/* Live Fleet Simulation - Compact Version */}
<div className="fleet-simulation">
  <h2>Have Your Whole Fleet At The Palms of Your Hands</h2>
  <div className="terminal-container">
    <div className="terminal-header">
      <div className="terminal-controls">
        <span className="terminal-close"></span>
        <span className="terminal-minimize"></span>
        <span className="terminal-expand"></span>
      </div>
      <span className="terminal-title">FLEET ALERTS MONITOR</span>
    </div>
    <div className="terminal-content">
    <TypeAnimation
              sequence={[
                'Initializing Nebsam fleet monitoring system...\n',
                500,
                'Connecting to satellite network...\n',
                800,
                'Syncing with 23 active vehicles...\n',
                700,
                'Monitoring started at ' + new Date().toLocaleTimeString() + '\n\n',
                500,
                'Truck #KLB 123A: Exceeding speed limit (89km/h in 80km/h zone)\n',
                1200,
                'Truck #KLD 456B: Idle for 22 minutes (Nairobi Depot)\n',
                1200,
                'Truck #KLM 789C: Fuel level dropped 15% in 5 minutes\n',
                1200,
                'Alert: Possible fuel theft detected on Truck #KLR 101D\n',
                1200,
                'Truck #KLS 202E: Entering geofenced restricted area\n',
                1200,
                'Truck #KLT 303F: Harsh braking detected (-0.48g force)\n',
                1200,
                'Maintenance due: Truck #KLU 404G (Next service in 342km)\n',
                1200,
                'Alert: Truck #KTA 004X Unauthorized driver detected!\n',
                1200,
                'Truck #KLV 505H: Route deviation detected (5.7km off-route)\n',
                1200,
                'All other vehicles operating within normal parameters\n',
                2000
              ]}
        wrapper="pre"
        speed={100}
        style={{ 
          fontFamily: "'IBM Plex Mono', monospace",
          color: '#e0e0e0',
          whiteSpace: 'pre-wrap',
          fontSize: '0.9rem',
          lineHeight: '1.4'
        }}
        repeat={Infinity}
      />
    </div>
    <div className="terminal-footer">
      <span className="status-indicator active"></span>
      <span>LIVE FEED</span>
      <span className="timestamp">{new Date().toLocaleTimeString()}</span>
    </div>
  </div>
</div>

      {/* CTA Section */}
      <div className="cta-section">
        <h2>Ready to Secure Your Fleet?</h2>
        <p>Get a free consultation with our telematics experts once you buy from us</p>
        <button className="cta-button glow-button">
          SHOP NOW <FaShoppingCart className="button-icon" />
        </button>
      </div>
    </div>
  );
};

export default Home;