import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FaShoppingCart, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';
import BannerModal from './BannerModal';
import '../App.css';

/**
 * Homepage - Nebsam Digital Solutions
 * - SEO meta tags via react-helmet
 * - Semantic HTML structure: <main>, <section>, <article>
 * - Accessible and responsive
 * - Includes Schema.org Structured Data (Organization)
 */
const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalOpen, setModalOpen] = useState(true);
  const navigate = useNavigate();

  // Service cards and their corresponding paths
  const services = [
    {
      title: 'Advanced Car Tracking',
      description: 'Real-time GPS tracking with theft prevention features',
      image: '/images/car-tracking-hero1.jpg',
      cta: 'Explore Trackers',
      path: '/services/car-tracking'
    },
    {
      title: 'Smart Car Alarms',
      description: '3-in-1 security system with remote control',
      image: '/images/car-alarms-hero1.jpg',
      cta: 'Secure Your Vehicle',
      path: '/services/car-alarms'
    },
    {
      title: 'Video Telematics',
      description: 'AI-powered driver monitoring and safety',
      image: '/images/video-telematics-hero1.jpg',
      cta: 'View Events',
      path: '/services/vehicle-video-telematics'
    },
    {
      title: 'Speed Governors',
      description: 'Compliance and fuel efficiency solutions',
      image: '/images/speed-governor-hero1.jpg',
      cta: 'Install/Renew',
      path: '/services/speed-governors'
    },
    {
      title: 'Fuel Monitoring',
      description: 'Prevent theft and reduce fuel costs',
      image: '/images/fuel-hero-bg1.jpg',
      cta: 'Monitor Fuel',
      path: '/services/fuel-monitoring'
    },
    {
      title: 'Radio Calls',
      description: 'Reliable communication for your team',
      image: '/images/radio-hero-bg1.jpg',
      cta: 'Stay Connected',
      path: '/services/radio-calls'
    },

    // NEW: Electronic Cargo Tracking System (ECTS)
    {
      title: 'Electronic Cargo Tracking System (ECTS)',
      description: 'Secure cross-border cargo transit with real-time tracking, GPS e-locks, tamper alerts and geofencing.',
      image: '/images/ects/ects-hero1.jpg', // placeholder
      cta: 'Explore ECTS',
      path: '/services/electronic-cargo-tracking-system'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === services.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [services.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === services.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? services.length - 1 : prev - 1));
  };

  return (
    <main className="home-container">
      <Helmet>
        <title>Nebsam Digital Solutions |Vehicle Video Telematics, GPS Vehicle Tracking, Smart Car Alarms, Speed Governors, Fuel monitoring and Radio call solutions.</title>
        <meta
          name="description"
          content="Kenya’s leading provider of vehicle telematics, fleet tracking, car alarms, fuel monitoring, video telematics, and radio communication."
        />
        <link rel="canonical" href="https://nebsamdigital.com/" />
        {/* Open Graph */}
        <meta property="og:title" content="Nebsam Digital Solutions | Vehicle Video Telematics, GPS Vehicle Tracking, Smart Car Alarms, Speed Governors, Fuel monitoring and Radio call solutions." />
        <meta
          property="og:description"
          content="Powerful tracking, security, and fleet management for vehicles in Kenya and East Africa."
        />
        <meta property="og:url" content="https://nebsamdigital.com/" />
        <meta property="og:image" content="https://nebsamdigital.com/images/site-og-image.jpg" />
        <meta property="og:type" content="website" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Nebsam Digital Solutions | Vehicle Video Telematics, GPS Vehicle Tracking, Smart Car Alarms, Speed Governors, Fuel monitoring and Radio call solutions." />
        <meta
          name="twitter:description"
          content="Kenya’s leading provider of vehicle telematics, fleet tracking, car alarms, fuel monitoring, video telematics, and radio communication."
        />
        <meta name="twitter:image" content="https://nebsamdigital.com/images/site-og-image.jpg" />

        {/* Schema.org Structured Data for Organization */}
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Nebsam Digital Solutions",
            "url": "https://nebsamdigital.com",
            "logo": "https://nebsamdigital.com/images/logo.png",
            "contactPoint": [
              {
                "@type": "ContactPoint",
                "telephone": "+254759000111",
                "contactType": "customer service"
              }
            ],
            "sameAs": [
              "https://www.facebook.com/nebsamdigital",
              "https://twitter.com/NebsamDigital",
              "https://www.linkedin.com/company/nebsam-digital-solutions"
            ]
          }
          `}
        </script>
      </Helmet>

      <BannerModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        imageSrc="/images/new-product-banner.png"
        message="🚀 Introducing our Hybrid Tracker! Click for details."
        link="/services/car-tracking"
      />

      <section className="hero-carousel-section" aria-label="Featured Services Carousel">
        <div className="hero-carousel">
          {services.map((service, index) => (
            <article
              key={index}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${service.image})`,
                cursor: 'pointer'
              }}
              onClick={() => navigate(service.path)}
              role="button"
              tabIndex={0}
              aria-label={`Navigate to ${service.title}`}
              onKeyDown={e => e.key === 'Enter' && navigate(service.path)}
            >
              <div className="slide-overlay"></div>
              <div className="slide-content">
                <h2 className="slide-title">{service.title}</h2>
                <p className="slide-description">{service.description}</p>
                <button
                  className="glow-button"
                  onClick={e => {
                    e.stopPropagation();
                    navigate(service.path);
                  }}
                  aria-label={`Go to ${service.title}`}
                >
                  {service.cta} <FaShoppingCart className="button-icon" />
                </button>
              </div>
            </article>
          ))}
          <button className="carousel-nav prev" onClick={prevSlide} aria-label="Previous Slide">
            <FaChevronLeft />
          </button>
          <button className="carousel-nav next" onClick={nextSlide} aria-label="Next Slide">
            <FaChevronRight />
          </button>
          <div className="carousel-dots" aria-label="Carousel Navigation Dots">
            {services.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                tabIndex={0}
                role="button"
                aria-label={`Go to slide ${index + 1}`}
                onKeyDown={e => e.key === 'Enter' && setCurrentSlide(index)}
              ></span>
            ))}
          </div>
        </div>
      </section>

      <section className="services-quicklinks-section" aria-label="Services Quick Links">
        <div className="services-grid">
          {services.map((service, index) => (
            <article
              key={index}
              className="service-card"
              onClick={() => navigate(service.path)}
              style={{ cursor: 'pointer' }}
              tabIndex={0}
              role="button"
              aria-label={`Service: ${service.title}`}
              onKeyDown={e => e.key === 'Enter' && navigate(service.path)}
            >
              <div
                className="service-image"
                style={{ backgroundImage: `url(${service.image})` }}
              ></div>
              <h3>{service.title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="fleet-simulation-section" aria-label="Live Fleet Simulation">
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
                speed={150}
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
      </section>

      <section className="cta-section" aria-label="Call To Action">
        <h2>Ready to Secure Your Fleet?</h2>
        <p>Get a free consultation with our telematics experts once you buy from us</p>
        <button className="cta-button glow-button" aria-label="Shop Now">
          SHOP NOW <FaShoppingCart className="button-icon" />
        </button>
      </section>
    </main>
  );
};

export default Home;