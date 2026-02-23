import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Globe,
  Shield,
  BarChart,
  Award,
  Target,
  Rocket,
  Handshake,
  Medal,
  Download
} from 'lucide-react';
import '../App.css';

const AboutUs = () => {
  // Used for hover UI in Certifications + Why Choose Us (so ESLint is happy)
  const [hoveredCert, setHoveredCert] = useState(null);
  const [flippedClient, setFlippedClient] = useState(null);

  // Hero background images (used in an auto-rotating hero background)
  const heroImages = useMemo(
    () => [
      '/images/showroom.jpeg',
      '/images/service-bay.jpeg',
      '/images/office-hero.jpeg'
    ],
    []
  );

  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    if (!heroImages.length) return;
    const id = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, [heroImages]);

  // Certificates data
  const certificates = [
    { id: 1, src: '/certificates/data-processor.jpg', alt: 'Data Processor' },
    { id: 2, src: '/certificates/data-controller.jpg', alt: 'Data Controller' },
    { id: 3, src: '/certificates/cak.jpg', alt: 'CAK' },
    { id: 4, src: '/certificates/private-security-provider.jpg', alt: 'Private Security Provider' },
    { id: 5, src: '/certificates/kebs.jpg', alt: 'KEBS Standardization Mark' },
    { id: 6, src: '/certificates/installation.jpg', alt: 'Installation Certificate' }
  ];

  // Clients data
  const clients = [
    { id: 1, name: 'Ismax Security', logo: '/clients/ismax-security.png' },
    { id: 2, name: 'Muthukinjo Paints', logo: '/clients/muthukinjo.jpeg' },
    { id: 3, name: 'Buscar EA', logo: '/clients/buscar.jpg' },
    { id: 4, name: 'armytex Security', logo: '/clients/armytex.png' },
    { id: 5, name: 'Kensalt', logo: '/clients/kensalt.jpeg' },
    { id: 6, name: 'Ngong vegetables', logo: '/clients/ngongveg.png' }
  ];

  // Headquarters images
  const headquarters = [
    { id: 1, src: '/images/main-entrance.jpeg', alt: 'Main Entrance' },
    { id: 2, src: '/images/service-bay.jpeg', alt: 'Service Bay' },
    { id: 3, src: '/images/reception.jpeg', alt: 'Reception' },
    { id: 4, src: '/images/customer-care.jpeg', alt: 'Customer Care' },
    { id: 5, src: '/images/showroom.jpeg', alt: 'Show Room' },
    { id: 6, src: '/images/customer-parking.jpeg', alt: 'Customer Parking' }
  ];

  // Core values (now rendered, so ESLint won't complain)
  const coreValues = [
    {
      icon: <Shield size={32} />,
      title: 'Integrity',
      desc: 'We deliver on our promises with honesty, transparency, and accountability.'
    },
    {
      icon: <Rocket size={32} />,
      title: 'Innovation',
      desc: 'Continuous improvement drives our solutions.'
    },
    {
      icon: <Handshake size={32} />,
      title: 'Partnership',
      desc: 'Your success is our success.'
    },
    {
      icon: <Medal size={32} />,
      title: 'Excellence',
      desc: 'We deliver nothing but the best service.'
    }
  ];

  // Why Choose Us features
  const features = [
    { icon: <Award size={32} />, title: 'Industry Leaders', desc: 'Pioneers in telematics with 10+ years experience' },
    { icon: <Globe size={32} />, title: 'Pan-African Coverage', desc: 'Support across East, Central & Southern Africa' },
    { icon: <Shield size={32} />, title: 'Military-Grade Security', desc: '256-bit encryption for all tracking data' },
    { icon: <BarChart size={32} />, title: 'Proven ROI', desc: 'Clients save 30%+ on fleet costs annually' }
  ];

  return (
    <main className="about-us-container">
      <Helmet>
        <title>About Us | Nebsam Digital Solutions</title>
        <meta
          name="description"
          content="Learn about Nebsam Digital Solutions, Kenya’s trusted leader in vehicle telematics, fleet tracking, car alarms, fuel monitoring, radio communication, and video telematics."
        />
        <link rel="canonical" href="https://nebsamdigital.com/about" />
        {/* Open Graph tags */}
        <meta property="og:title" content="About Us | Nebsam Digital Solutions" />
        <meta
          property="og:description"
          content="Kenya’s trusted leader in vehicle telematics, fleet tracking, car alarms, fuel monitoring, radio communication, and video telematics."
        />
        <meta property="og:url" content="https://nebsamdigital.com/about" />
        <meta property="og:image" content="https://nebsamdigital.com/images/site-og-image.jpg" />
        <meta property="og:type" content="website" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | Nebsam Digital Solutions" />
        <meta
          name="twitter:description"
          content="Kenya’s trusted leader in vehicle telematics, fleet tracking, car alarms, fuel monitoring, radio communication, and video telematics."
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
            "description": "Nebsam Digital Solutions is a trusted leader in vehicle telematics, fleet tracking, car alarms, fuel monitoring, radio communication, and video telematics, serving 50,000+ clients across Africa.",
            "contactPoint": [
              {
                "@type": "ContactPoint",
                "telephone": "+254759000111",
                "contactType": "customer service"
              }
            ],
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "Kenya"
            },
            "sameAs": [
              "https://www.facebook.com/nebsamdigital",
              "https://twitter.com/NebsamDigital",
              "https://www.linkedin.com/company/nebsam-digital-solutions"
            ]
          }
          `}
        </script>
      </Helmet>

      {/* Hero Section with Sliding Background */}
      <header>
        <section
          className="hero-section about-hero-section"
          style={{
            backgroundImage: `url(${heroImages[heroIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          aria-label="About Nebsam hero section"
        >
          <div className="hero-content">
            <h1 className="hero-title">Driving Innovation in Vehicle Telematics</h1>
            <p className="hero-subtitle">Trusted by 50,000+ clients across Africa</p>
          </div>
        </section>
      </header>

      {/* Our Story Section */}
      <section className="section" aria-labelledby="our-story-title">
        <div className="section-card">
          <div className="two-column-layout">
            <figure className="image-container">
              <img
                src="/images/about-team.jpg"
                alt="Nebsam Team"
                className="rounded-2xl hover-3d"
                loading="lazy"
              />
            </figure>
            <article className="content">
              <h2 className="section-title" id="our-story-title">Our Story</h2>
              <p className="text-lg">
                At Nebsam Digital Solutions, our journey began over a decade ago with a simple mission — to revolutionize the vehicle telematics industry in Kenya and across Africa. Over the past 10 years, we have grown into a trusted name, delivering reliable and cutting-edge solutions in vehicle tracking, speed governors, car alarms, fuel monitoring, radio communication systems, and vehicle video telematics.
              </p>
              <p>
                What started as a small venture has evolved into a powerhouse serving over 50,000 satisfied clients across the continent. From fleet managers in Mombasa, Nairobi, Thika, Nakuru and Kisumu to individual car owners in remote towns, our clients rely on us for safety, efficiency, and peace of mind on the road.
              </p>
              <p>
                Our success is rooted in a customer-centered approach, driven by a deep understanding of the unique needs of African drivers and fleet operators. We believe that technology should not just be advanced — it should be accessible, practical, and built around the people who use it.
              </p>
              <p>
                Innovation is at the heart of what we do. Whether it's installing GPS car trackers, integrating real-time fuel monitoring systems, or deploying high-performance vehicle video telematics cameras, we continuously adapt and improve to stay ahead of evolving security and logistics challenges.
              </p>
              <p>
                Trust and resilience have carried us through every challenge — and we’ve emerged stronger, more experienced, and more committed to excellence than ever before. At Nebsam, we don’t just offer products — we deliver customized telematics solutions that enhance safety, reduce costs, and give our clients complete control over their vehicles and fleets.
              </p>
              <p>
                As we look to the future, we remain dedicated to setting new standards in vehicle telematics solutions in Kenya and beyond.
              </p>

              <ul className="icon-list mt-6">
                <li><span className="text-primary">✓</span> 10+ years industry experience</li>
                <li><span className="text-primary">✓</span> 50+ certified technicians</li>
                <li><span className="text-primary">✓</span> 24/7 monitoring center</li>
              </ul>

              <button className="download-profile-btn" type="button">
                Download Company Profile <Download size={18} className="ml-2" />
              </button>
            </article>
          </div>
        </div>
      </section>

      {/* Core Values (NEW: renders coreValues so it is used) */}
      <section className="section" aria-label="Our Core Values">
        <div className="section-card">
          <h2 className="section-title">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <article key={index} className="feature-card hover-rotate">
                <div className="feature-icon">{value.icon}</div>
                <h3 className="text-xl font-semibold mt-4">{value.title}</h3>
                <p className="mt-2">{value.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section" aria-label="Vision and Mission">
        <div className="section-card">
          <div className="grid md:grid-cols-2 gap-8">
            <article className="mission-card hover-scale">
              <Target size={48} className="text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
              <p className="text-lg">
                To be Africa's leading provider of intelligent vehicle telematics solutions that transform mobility and security.
              </p>
            </article>
            <article className="vision-card hover-scale">
              <Rocket size={48} className="text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
              <p className="text-lg">
                To deliver cutting-edge telematics solutions that enhance safety, efficiency, and profitability of moving assets.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Team Organogram */}
      <section className="section" aria-label="Team Organogram">
        <div className="section-card">
          <h2 className="section-title">Our Team Structure</h2>
          <figure className="organogram-container">
            <img
              src="/images/organogram.jpg"
              alt="Nebsam Organogram"
              className="rounded-2xl shadow-xl"
              loading="lazy"
            />
          </figure>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section bg-gradient-to-r from-blue-50 to-blue-100" aria-label="Why Choose Us">
        <div className="section-card">
          <h2 className="section-title">Why Choose Nebsam?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <article
                key={index}
                className="feature-card hover-rotate"
                onMouseEnter={() => setHoveredCert(index)}
                onMouseLeave={() => setHoveredCert(null)}
                aria-label={feature.title}
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
                <p className="mt-2">{feature.desc}</p>

                {/* Optional: subtle hover helper (uses hoveredCert state) */}
                {hoveredCert === index && (
                  <p className="mt-3 text-sm opacity-80">Learn more about {feature.title.toLowerCase()}.</p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section" aria-label="Our Certifications">
        <div className="section-card">
          <h2 id="certifications" className="section-title">
            <a
              href="#certifications"
              aria-label="Link to Our Certifications section"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              Our Certifications
            </a>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {certificates.map(cert => (
              <figure
                key={cert.id}
                className={`certificate-card ${hoveredCert === cert.id ? 'is-hovered' : ''}`}
                onMouseEnter={() => setHoveredCert(cert.id)}
                onMouseLeave={() => setHoveredCert(null)}
                aria-label={cert.alt}
              >
                <img
                  src={cert.src}
                  alt={cert.alt}
                  className="certificate-image"
                  loading="lazy"
                />
                <figcaption className="certificate-overlay">
                  <p>{cert.alt}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Our Headquarters */}
      <section className="section" aria-label="Our Headquarters">
        <div className="section-card">
          <h2 className="section-title">Our Headquarter</h2>
          <div className="headquarters-grid">
            {headquarters.map((item) => (
              <figure key={item.id} className="headquarters-item">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="headquarters-image"
                  loading="lazy"
                />
                <figcaption className="headquarters-label">{item.alt}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Tour */}
      <section className="section bg-blue-900 text-white" aria-label="Virtual Tour">
        <div className="section-card">
          <h2 className="section-title">Virtual Tour</h2>
          <div className="virtual-tour-container">
            <iframe
              className="tour-iframe rounded-2xl"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.8989471994046!2d39.654743973132156!3d-4.041040495932689!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x184012b6a695c773%3A0x3c53f3de1a4fa1d0!2sMakupa%20Roundabout!5e0!3m2!1sen!2ske!4v1747141043784!5m2!1sen!2ske"
              width="800"
              height="600"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Nebsam Head Office Virtual Tour"
            />
            <a
              href="https://wa.me/254759000111"
              className="whatsapp-button pulse"
              target="_blank"
              rel="noopener noreferrer"
            >
              Schedule Physical Visit
            </a>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="section" aria-label="Our Esteemed Clients">
        <div className="section-card">
          <h2 className="section-title">Our Esteemed Clients</h2>
          <div className="clients-scroller">
            {clients.map(client => (
              <article
                key={client.id}
                className="client-card"
                onMouseEnter={() => setFlippedClient(client.id)}
                onMouseLeave={() => setFlippedClient(null)}
              >
                <div className={`client-card-inner ${flippedClient === client.id ? 'flipped' : ''}`}>
                  <div className="client-card-front">
                    <img src={client.logo} alt={client.name} loading="lazy" />
                  </div>
                  <div className="client-card-back">
                    <p>{client.name}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="commitment-section" aria-label="Our Commitment">
        <div className="commitment-content">
          <h2 className="section-title">Our Commitment to You</h2>
          <p className="commitment-text">
            We pledge 24/7 support, customized solutions, and continuous innovation to keep your fleet secure and efficient
          </p>
          <a
            href="https://wa.me/254759000111"
            className="commitment-button pulse"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get Started Today
          </a>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;