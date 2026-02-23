import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '../App.css';
const serviceMeta = {
  'car-tracking': {
    title: 'Car Tracking Services | Nebsam Digital Solutions',
    description: 'Explore advanced car tracking devices for real-time GPS, theft prevention, and fleet management at Nebsam Digital Solutions.',
    canonical: 'https://nebsamdigital.com/services/car-tracking',
    ogImage: 'https://nebsamdigital.com/images/tracking-hero-bg.jpg',
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Car Tracking",
      "description": "Explore advanced car tracking devices for real-time GPS, theft prevention, and fleet management at Nebsam Digital Solutions.",
      "provider": {
        "@type": "Organization",
        "name": "Nebsam Digital Solutions",
        "url": "https://nebsamdigital.com",
        "logo": "https://nebsamdigital.com/images/logo.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+254759000111",
          "contactType": "customer service"
        }
      },
      "areaServed": ["Kenya", "East Africa"],
      "serviceType": "Vehicle Tracking",
      "url": "https://nebsamdigital.com/services/car-tracking"
    }
  },

 'electronic-cargo-tracking-system': {
  title: 'Electronic Cargo Tracking System (ECTS) Providers in Kenya | Nebsam Digital Solutions',
  description: 'Nebsam Digital Solutions provides Electronic Cargo Tracking System (ECTS) solutions in Kenya: real-time cargo monitoring, GPS e-locks, tamper alerts, geofencing, and compliance-ready reporting for secure transit.',
  canonical: 'https://nebsamdigital.com/services/electronic-cargo-tracking-system',
  ogImage: 'https://nebsamdigital.com/ects-og.jpg',
  schema: {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Electronic Cargo Tracking System (ECTS)",
    "description": "Electronic Cargo Tracking System (ECTS) solutions in Kenya with GPS electronic locks, real-time monitoring, tamper alerts, geofencing, and compliance-ready tracking for secure cargo transit.",
    "provider": {
      "@type": "Organization",
      "name": "Nebsam Digital Solutions",
      "url": "https://nebsamdigital.com",
      "logo": "https://nebsamdigital.com/images/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+254759000111",
        "contactType": "customer service"
      }
    },
    "areaServed": ["Kenya", "East Africa"],
    "serviceType": "Electronic Cargo Tracking System",
    "url": "https://nebsamdigital.com/services/electronic-cargo-tracking-system"
  }
},
  
  'fuel-monitoring': {
    title: 'Fuel Monitoring Services | Nebsam Digital Solutions',
    description: 'Advanced fuel monitoring solutions to reduce costs and prevent theft for fleets, trucks, and vehicles.',
    canonical: 'https://nebsamdigital.com/services/fuel-monitoring',
    ogImage: 'https://nebsamdigital.com/images/fuel-hero-bg.jpg',
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Fuel Monitoring",
      "description": "Advanced fuel monitoring solutions to reduce costs and prevent theft for fleets, trucks, and vehicles.",
      "provider": {
        "@type": "Organization",
        "name": "Nebsam Digital Solutions",
        "url": "https://nebsamdigital.com",
        "logo": "https://nebsamdigital.com/images/logo.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+254759000111",
          "contactType": "customer service"
        }
      },
      "areaServed": ["Kenya", "East Africa"],
      "serviceType": "Fuel Monitoring",
      "url": "https://nebsamdigital.com/services/fuel-monitoring"
    }
  },
  'radio-calls': {
    title: 'Radio Call Services | Nebsam Digital Solutions',
    description: 'Stay connected with our reliable radio communication systems: long-range and short-range radio calls for teams and fleets.',
    canonical: 'https://nebsamdigital.com/services/radio-calls',
    ogImage: 'https://nebsamdigital.com/images/radio-hero-bg.jpg',
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Radio Call",
      "description": "Stay connected with our reliable radio communication systems: long-range and short-range radio calls for teams and fleets.",
      "provider": {
        "@type": "Organization",
        "name": "Nebsam Digital Solutions",
        "url": "https://nebsamdigital.com",
        "logo": "https://nebsamdigital.com/images/logo.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+254759000111",
          "contactType": "customer service"
        }
      },
      "areaServed": ["Kenya", "East Africa"],
      "serviceType": "Radio Communication",
      "url": "https://nebsamdigital.com/services/radio-calls"
    }
  },
  'vehicle-video-telematics': {
    title: 'Vehicle Video Telematics | Nebsam Digital Solutions',
    description: 'AI-powered vehicle video telematics solutions for fleet safety, driver monitoring, and accident prevention.',
    canonical: 'https://nebsamdigital.com/services/vehicle-video-telematics',
    ogImage: 'https://nebsamdigital.com/images/video-telematics-hero.jpg',
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Vehicle Video Telematics",
      "description": "AI-powered vehicle video telematics solutions for fleet safety, driver monitoring, and accident prevention.",
      "provider": {
        "@type": "Organization",
        "name": "Nebsam Digital Solutions",
        "url": "https://nebsamdigital.com",
        "logo": "https://nebsamdigital.com/images/logo.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+254759000111",
          "contactType": "customer service"
        }
      },
      "areaServed": ["Kenya", "East Africa"],
      "serviceType": "Video Telematics",
      "url": "https://nebsamdigital.com/services/vehicle-video-telematics"
    }
  },
  'speed-governors': {
    title: 'Speed Governors Services | Nebsam Digital Solutions',
    description: 'Speed limiting solutions for fleet safety, compliance and GPS tracking. Approved by NTSA.',
    canonical: 'https://nebsamdigital.com/services/speed-governors',
    ogImage: 'https://nebsamdigital.com/images/speed-governor-hero.jpg',
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Speed Governors",
      "description": "Speed limiting solutions for fleet safety, compliance and GPS tracking. Approved by NTSA.",
      "provider": {
        "@type": "Organization",
        "name": "Nebsam Digital Solutions",
        "url": "https://nebsamdigital.com",
        "logo": "https://nebsamdigital.com/images/logo.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+254759000111",
          "contactType": "customer service"
        }
      },
      "areaServed": ["Kenya", "East Africa"],
      "serviceType": "Speed Governors",
      "url": "https://nebsamdigital.com/services/speed-governors"
    }
  },
  'car-alarms': {
    title: 'Nebsmart Car Alarms | Nebsam Digital Solutions',
    description: '3 in 1 Car Alarm + Tracker + Cut. Advanced security, remote lock/unlock, instant alerts and monitoring.',
    canonical: 'https://nebsamdigital.com/services/car-alarms',
    ogImage: 'https://nebsamdigital.com/images/car-alarms-hero.jpg',
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Nebsmart Car Alarms",
      "description": "3 in 1 Car Alarm + Tracker + Cut. Advanced security, remote lock/unlock, instant alerts and monitoring.",
      "provider": {
        "@type": "Organization",
        "name": "Nebsam Digital Solutions",
        "url": "https://nebsamdigital.com",
        "logo": "https://nebsamdigital.com/images/logo.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+254759000111",
          "contactType": "customer service"
        }
      },
      "areaServed": ["Kenya", "East Africa"],
      "serviceType": "Car Alarms",
      "url": "https://nebsamdigital.com/services/car-alarms"
    }
  }
  // Add more meta for additional services if needed
};


const ServiceDetail = () => {
  const { serviceName } = useParams();
  const meta = serviceMeta[serviceName] || {
    title: 'Nebsam Digital Solutions Vehicle Tracking Services in Kenya',
    description: 'Explore our Vehicle Video Telematics, Electronic Cargo Tracking System, GPS Vehicle Tracking, Smart Car Alarms, Speed Governors, Fuel monitoring and Radio call solutions.',
    canonical: 'https://nebsamdigital.com/services',
    ogImage: 'https://nebsamdigital.com/images/logo.png',
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Fleet & Vehicle Services",
      "description": "Explore our Vehicle Video Telematics, GPS Vehicle Tracking, Smart Car Alarms, Speed Governors, Fuel monitoring and Radio call solutions.",
      "provider": {
        "@type": "Organization",
        "name": "Nebsam Digital Solutions",
        "url": "https://nebsamdigital.com",
        "logo": "https://nebsamdigital.com/images/logo.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+254759000111",
          "contactType": "customer service"
        }
      },
      "areaServed": ["Kenya", "East Africa"],
      "serviceType": "Fleet & Vehicle Services",
      "url": "https://nebsamdigital.com/services"
    }
  };
  
  // Reusable Hero Section Component (Mobile-first)
  const renderHeroSection = (heroData) => {
     // Icon mapping
  return (
    <section className="hero-section" style={{ backgroundImage: `url(${heroData.backgroundImage})` }}>
      <div className="hero-content">
        <h1 className="hero-title">{heroData.title}</h1>
        <p className="hero-subtitle">{heroData.subtitle}</p>
        
      </div>
    </section>
  );
};

  // Define content for all services
  const serviceDetails = {
    'car-tracking': {
      title: 'Car Tracking Services',
      subtitle: 'Explore our range of advanced car tracking devices designed to meet your specific needs.',
      hero: {
        title: 'Advanced Vehicle Tracking Solutions',
        subtitle: 'Real-time monitoring and security for your vehicles',
        backgroundImage: '/images/tracking-hero-bg.jpg',
        features: [
          { icon: 'map-marker-alt', text: 'Real-time GPS Tracking' },
          { icon: 'shield-alt', text: 'Theft Prevention' },
          { icon: 'chart-line', text: 'Fleet Management' }
        ]
      },
      sections: [
        {
          id: 1,
          title: '2-Wire Tracker',
          image: '/2-wire-tracker.jpg',
          features: [
            'Connects directly to the vehicle’s wiring system.✅',
            'Provides real-time location updates.✅',
            'Geofencing.✅',
            'Trip reports✅',
            'Can be monitored via a mobile app or web platform.✅',
          ],
        },
        {
          id: 2,
          title: '3-Wire Tracker',
          image: '/3-wire-tracker.jpg',
          features: [
            'Connects directly to the vehicle’s wiring system.✅',
            'Provides real-time location updates.✅',
            'Geofencing.✅',
            'Trip reports✅',
            'Remote Engine cut-off/ resume✅',
            'Advanced features like ignition detection.✅',
            'Battery backup for uninterrupted tracking.✅',
            'Fleet management✅',
            'Ideal for enhanced security and tracking.✅',
          ],
        },
        {
          id: 3,
          title: 'Magnetic Tracker',
          image: '/magnetic-tracker.jpg',
          features: [
            'No Wiring Required – Magnetic trackers do not connect to the vehicle’s wiring system, making installation effortless.✅',
            'Daily Location Updates – These trackers send only one location update per day, optimizing battery life.✅',
            'Long Battery Life – Designed for long-term use, they have a lifespan of up to 3 years without needing a recharge.✅',
            'Ideal for Emergency Tracking – Best used as an additional security layer to complement a primary tracking system.✅',
            ' Discreet and Portable – With a compact and covert design, it can be hidden anywhere in the vehicle for added protection.✅',
          ],
        },
        {
          id: 4,
          title: 'Fingerprint Tracker',
          image: '/fingerprint-tracker.jpg',
          features: [
            'Integrates biometric authentication.✅',
            'Ensures only authorized users can start the vehicle.✅',
            'Provides real-time tracking and tamper alerts.✅',
            'Connects directly to the vehicle’s wiring system.✅',
            'Provides real-time location updates.✅',
            'Geofencing.✅',
            'Trip reports✅',
            'Remote Engine cut-off/ resume✅',
            'Advanced features like ignition detection.✅',
          ],
        },
        {
          id: 5,
          title: 'OBD Tracker',
          image: '/obd-tracker.jpg',
          features: [
            'Plugs directly into the vehicle’s OBD port.✅',
            'Live GPS Tracking✅',
            'Anti GSM signal jamming✅',
            'Vehicle Protection (once the OBD tracker is unplugged illegally, the vehicle will not start).✅',
            'USB Dongle (optional) when tracker is unplugged or not working, plug in the USB Dongle to start the vehicle✅',
            'Bluetooth RFID for recognising legal driver✅',
            'Diagnostic trouble codes report (DTC)✅',
            'Harsh braking/ Harsh acceleration alarm✅',
            'Remote engine cut off / resume✅',
            'Quick and easy installation.✅',
          ],
        },
        {
          id: 6,
          title: 'Fuel Tracker',
          image: '/fuel-tracker.jpg',
          features: [
            'Live GPS Tracking✅',
            'Monitors fuel consumption in real-time.✅',
            'Detects and send SMS incase of fuel theft.✅',
            'Detects and send SMS incase of fuel filling.✅',
            'Provides detailed reports for cost optimization.✅',
            'Fleet management✅',
            'Global tracking within Eastern, Central and South African borders✅',
          ],
        },
      ],
    },
    'fuel-monitoring': {
      title: 'Fuel Monitoring Services',
      subtitle: 'Advanced fuel monitoring to reduce costs and prevent theft',
      hero: {
        title: 'Smart Fuel Monitoring Systems',
        subtitle: 'Prevent fuel theft and optimize consumption',
        backgroundImage: '/images/fuel-hero-bg.jpg',
        features: [
          { icon: 'gas-pump', text: 'Real-time Fuel Monitoring' },
          { icon: 'bell', text: 'Instant Theft Alerts' },
          { icon: 'chart-pie', text: 'Detailed Analytics' }
        ]
      },
      sections: [
        {
          id: 1,
          image: '/fuel-sensor.jpg',
          features: [
            'Real-time Route Monitoring ✔️',
            'GPS Online Tracking. ✔️',
            'Real-time Fuel Filling SMS Alert (Amount and Location) ✔️',
            'Real-time Fuel Theft SMS Alert (Amount and Location) ✔️',
            'Real-time Fuel Level ✔️',
            'Trip Report ✔️',
            'Daily and Monthly Fuel Consumption Report ✔️',
            'Fuel Filling and Theft Report ✔️',
            'Mileage Report ✔️',
            'Fleet management features✔️',
            'Global tracking within Eastern, Central and South African borders✔️',
          ],
        },
      ],
      additionalSections: [
        {
          id: 1,
          title: 'How Fuel Monitoring Works',
          image: '/fuel-monitoring-diagram.jpg',
          description:
            'IoT-based sensors attached to the tankers surface automatically recognize the fuel level. By measuring fuel volume precisely, it detects tank fill-up and fuel draining volumes continuously. The data is sent to our cloud-based server through the IoT gateway attached to the truck and monitored the data in the KPI dashboard. The GPS tracker allows one to locate the truck in real-time and monitors fuel refilling and draining location.',
        },
        {
          id: 2,
          title: 'Benefits of Fuel Monitoring',
          image: '/fuel-monitoring-benefits.jpg',
          description:
            'Fuel monitoring helps you reduce costs, prevent theft, and optimize fuel usage. It provides detailed insights into fuel consumption patterns and identifies inefficiencies.',
        },
        {
          id: 3,
          title: 'Why Choose Nebsam?',
          image: '/nebsam-fuel-monitoring.jpg',
          description:
            'Nebsam offers state-of-the-art fuel monitoring solutions with 24/7 support and customizable features. Our systems are designed to meet the unique needs of your fleet.',
        },
      ],
      monitoringPlatforms: [
        {
          id: 1,
          title: 'Nebsam Fuel Mobile App',
          image: '/web-platform.jpg',
          features: [
            'Detailed fuel consumption report',
            'Real-time fuel refill and drainage location and capacitySMS alerts' ,
            'Geofence',
            'Real time tracking',
            'Route diversion notification',
            'Mileage/odometer report',
          ],
        },
        {
          id: 2,
          title: 'Nebsam Telematics Mobile App',
          image: '/mobile-app.jpg',
          features: [
            'Detailed fuel consumption report.',
            'Real-time fuel refill and drainage location and capacity SMS alerts',
            'Geofence',
            'Real-time tracking',
            'Route diversion notification',
            'Mileage/odometer report',
            'Real-time ignition SMS alerts',
            'Maintenance, inspection and insurance reminder alerts',
            'Eco-driving (harsh braking, harsh acceleration detectionand reporting)',
            'Real-time ignition SMS alerts',
          ],
        },
      ],
    },

        //: ECTS Service
        'electronic-cargo-tracking-system': {
          title: 'Electronic Cargo Tracking System (ECTS)',
          subtitle: 'Secure cargo transit with real-time tracking, alerts, and compliance-ready visibility.',
          hero: {
            title: 'Electronic Cargo Tracking System (ECTS) in Kenya',
            subtitle: 'Real-time cargo monitoring + GPS electronic locks + tamper alerts + geofencing',
            backgroundImage: '/images/ects-hero-bg.jpg',
            features: [
              { icon: 'map-marker-alt', text: 'Real-time Monitoring' },
              { icon: 'shield-alt', text: 'Tamper & Theft Prevention' },
              { icon: 'bell', text: 'Instant Alerts & Events' }
            ]
          },
          sections: [
            {
              type: 'ects-problem',
              id: 1,
              title: 'Problem To Solve',
              intro:
                'Cargo in transit is vulnerable to theft, tampering, route deviation and costly manual security checks. For cross-border or high-value logistics, organizations also face tax revenue losses, long wait times, and high escort costs.',
              bullets: [
                'Electronic Cargo Tracking System (ECTS): minimize tax losses and reduce high escort costs.',
                'Cross-border transit monitoring: prevent illegal activities and reduce delays at checkpoints.',
                'Airport sensitive baggage & cargo: improve security and ensure timely delivery (beverages, medications, blankets).',
                'High-value goods escort: real-time tracking and secure transportation of sensitive goods (cash, documents, jewelry, firearms, oil & gas).',
                'Cold chain transportation: maintain strict temperature requirements and prevent contamination for medicines/fresh food.'
              ],
              images: [
                { src: '/images/ects/problem-1.jpg', alt: 'ECTS cargo risk monitoring in Kenya - photo 1' },
                { src: '/images/ects/problem-2.jpg', alt: 'Cross-border cargo transit risk - photo 2' },
                { src: '/images/ects/problem-3.jpg', alt: 'Airport sensitive baggage tracking - photo 3' },
                { src: '/images/ects/problem-4.jpg', alt: 'High-value goods escort tracking - photo 4' }
              ]
            },
            {
              type: 'ects-solution',
              id: 2,
              title: 'Our Solution',
              intro:
                'Nebsam provides an ECTS-ready cargo visibility stack built around GPS electronic locks, sensors and a monitoring platform—designed to improve security, compliance and operational efficiency across Kenya and East Africa.',
              cards: [
                {
                  title: 'Enhanced Security',
                  text: 'Protect goods from theft, tampering and unauthorized access with real-time tracking and instant alerts.'
                },
                {
                  title: 'Operational Efficiency',
                  text: 'Reduce manual inspections and delays with remote monitoring and faster clearance workflows.'
                },
                {
                  title: 'Cost-Effective',
                  text: 'Lower losses from theft/damage while minimizing labor-intensive manual security checks.'
                },
                {
                  title: 'Compliance & Transparency',
                  text: 'Track and record shipments with event logs, alerts, and auditable reporting for regulated operations.'
                }
              ],
              images: [
                { src: '/images/ects/solution-1.jpg', alt: 'GPS electronic lock solution - photo 1' },
                { src: '/images/ects/solution-2.jpg', alt: 'Remote cargo monitoring dashboard - photo 2' },
                { src: '/images/ects/solution-3.jpg', alt: 'Tamper alert and geofence events - photo 3' },
                { src: '/images/ects/solution-4.jpg', alt: 'Customizable scalable cargo security - photo 4' }
              ]
            },
            {
              type: 'ects-products',
              id: 3,
              title: 'Our Products Information',
              intro:
                'Our ECTS product family is built around a GPS Electronic Lock with keyless access, long battery life, real-time monitoring and event-based alarms—ready for containers, oil tankers, dump trucks/topless trucks with tarpaulin and delivery vans.',
              models: [
                {
                  name: 'Model A (Standard GPS E-Lock)',
                  description: 'Reliable electronic lock with real-time monitoring, geofencing and core tamper detection.',
                  image: '/images/ects/models/model-a.jpg'
                },
                {
                  name: 'Model B (Extended Battery + Solar Option)',
                  description: 'Longer deployments with optional solar charging and deep-sleep wake automation.',
                  image: '/images/ects/models/model-b.jpg'
                },
                {
                  name: 'Model C (Multi-Container / Sub-locks + Sensors)',
                  description: 'Supports sub-locks (up to 7 via Bluetooth) and scalable LoRa modules for more locks/sensors.',
                  image: '/images/ects/models/model-c.jpg'
                }
              ],
              highlights: [
                {
                  title: 'Keyless design',
                  points: [
                    'RFID/remote unlocking (Bluetooth/Platform/SMS)'
                  ]
                },
                {
                  title: 'Large capacity battery',
                  points: [
                    'Long working time (15200/8000mAh)',
                    'Solar panel optional'
                  ]
                },
                {
                  title: 'Connectivity',
                  points: [
                    'Real-time online monitoring',
                    'Real-time alarms (unlock/lock events, anti-tampering, geofence)',
                    'Bluetooth 4.0 with sub-locks (up to 7)',
                    'LoRa modules for sub-locks/sensors (> 7 units)',
                    'Temperature/Humidity/Light sensor support'
                  ]
                },
                {
                  title: 'Reliability',
                  points: [
                    'Explosion-proof & waterproof (ATEX / IP67 / CE)',
                    'Flame retardant material; oil corrosion resistant option (oil & gas)',
                    'Abnormal battery temperature alarm'
                  ]
                },
                {
                  title: 'Real-time alarms (examples)',
                  points: [
                    'Rope-cutting alarm',
                    'Unlocking alarm',
                    'Geofence (enter/exit/route deviation)',
                    'Low battery alarm',
                    'SIM cover alarm',
                    'Abnormal motor alarm',
                    'Unauthorized RFID card alarm',
                    'Connection timeout alarm (master/sub-locks/sensors)'
                  ]
                }
              ],
              productImages: [
                { src: '/images/ects/products/product-1.jpg', alt: 'ECTS product image 1' },
                { src: '/images/ects/products/product-2.jpg', alt: 'ECTS product image 2' },
                { src: '/images/ects/products/product-3.jpg', alt: 'ECTS product image 3' },
                { src: '/images/ects/products/product-4.jpg', alt: 'ECTS product image 4' },
                { src: '/images/ects/products/product-5.jpg', alt: 'ECTS product image 5' },
                { src: '/images/ects/products/product-6.jpg', alt: 'ECTS product image 6' },
                { src: '/images/ects/products/product-7.jpg', alt: 'ECTS product image 7' },
                { src: '/images/ects/products/product-8.jpg', alt: 'ECTS product image 8' }
              ]
            },
            {
              type: 'ects-usecases',
              id: 4,
              title: 'Real Use Cases',
              intro:
                'ECTS is ideal for regulated and security-sensitive logistics where real-time visibility, alerts and audit trails matter.',
              cases: [
                {
                  title: 'Cross-Border Transit Monitoring',
                  description:
                    'Track cargo movement in real-time, detect route deviations, and reduce delays and revenue leakage with automated event logs and alerts.',
                  image: '/images/ects/usecases/usecase-1.jpg'
                },
                {
                  title: 'Airport Sensitive Baggage & Cargo',
                  description:
                    'Improve security and operational efficiency for sensitive baggage, beverages, medications, and blankets with monitored handling and delivery.',
                  image: '/images/ects/usecases/usecase-2.jpg'
                },
                {
                  title: 'High-Value Goods Escort (Cash / Jewelry / Firearms / Documents)',
                  description:
                    'Reduce escort cost and risk using electronic locks, tamper detection and real-time monitoring with instant incident alerts.',
                  image: '/images/ects/usecases/usecase-3.jpg'
                },
                {
                  title: 'Cold Chain Transportation (Medicines / Fresh Food)',
                  description:
                    'Support temperature/humidity sensing and event visibility to protect compliance and prevent contamination during transit.',
                  image: '/images/ects/usecases/usecase-4.jpg'
                }
              ]
            }
          ]
        },



    'radio-calls': {
      title: 'Radio Call Services',
      subtitle: 'Stay connected with our reliable radio communication systems',
      hero: {
        title: 'Professional Radio Communication',
        subtitle: 'Long-range and short-range solutions for all your needs',
        backgroundImage: '/images/radio-hero-bg.jpg',
        features: [
          { icon: 'broadcast-tower', text: 'Countrywide Coverage' },
          { icon: 'microphone', text: 'Clear Audio Quality' },
          { icon: 'mobile-alt', text: 'Mobile Integration' }
        ]
      },
      sections: [
        {
          id: 1,
          title: 'Long Range Radio Calls',
          description: 'Our long-range radio calls ensure seamless communication over vast distances.',
          cards: [
            {
              id: 1,
              title: 'Inrico T521',
              image: '/xlr-1000.jpg',
              features: [
                'No range restriction.(countrywide coverage)✅',
                'IP66 waterproof and dustproof.✅',
                'Long battery life (up to 25hrs talk time).✅',
                'Built-in GPS for location tracking.✅',
                'Clear message delivery in harsh and noisy environments.✅',
                'SOS feature for rapid reinforcement and enhanced personnel safety✅',
                'Audio record and playback✅',
                'Group Talk Feature✅',
                'Geofence✅',
                'steel casing rugged and shock proof design✅', 
                'PTT Web-platform✅', 
              ],
            },
            {
              id: 2,
              title: 'Inrico S200',
              image: '/xlr-2000.jpg',
              features: [
                'No range restriction.(countrywide coverage)✅',
                'Front Camera 2MP,Rear Camera 13MP✅',
                '4000mAh Battery✅',
                'Built-in GPS for location tracking.✅',
                'Clear message delivery in harsh and noisy environments.✅',
                'SOS feature for rapid reinforcement and enhanced personnel safety✅',
                'Audio record and playback✅',
                '2.8" Touch Display✅',
                'Group Talk Feature✅',
                'Android 10.0✅',
                'Wi-Fi, BT, NFC✅',
                'Geofence✅',
                'PTT Web-platform✅', 
              ],
            },
            {
              id: 3,
              title: 'Inrico S200',
              image: '/xlr-3000.jpg',
              features: [
                'No range restriction.(countrywide coverage)✅',
                'Built-in GPS for location tracking.✅',
                'Clear message delivery in harsh and noisy environments.✅',
                'SOS feature for rapid reinforcement and enhanced personnel safety✅',
                'Audio record and playback✅',
                '2.45" Touch Screen✅',
                'Group Talk Feature✅',
                'Android 10.0✅',
                'Wi-Fi, BT, NFC✅',
                'Geofence✅',
                'PTT Web-platform✅', 
              ],
            },
            {
              id: 4,
              title: 'Inrico TM7',
              image: '/xlr-4000.jpg',
              features: [
                'No range restriction.(countrywide coverage)✅',
                'Best used as base radio call for vehicles✅',
                'Built-in GPS for location tracking.✅',
                'Clear message delivery in harsh and noisy environments.✅',
                'SOS feature for rapid reinforcement and enhanced personnel safety✅',
                'Audio record and playback✅',
                '2.8" Touch Display✅',
                'Group Talk Feature✅',
                'Android 10.0✅',
                'Wi-Fi, BT, NFC✅',
                'Geofence✅',
                'PTT Web-platform✅', 
              ],
            },
          ],
        },
        {
          id: 2,
          title: 'Short Range Radio Calls',
          description: 'Our short-range radio calls are perfect for on-site communication and team coordination.',
          cards: [
            {
              id: 1,
              title: 'Baofeng-888s',
              image: '/sr-100.jpg',
              features: [
                'Range: Up to 5 km.✅',
                'Compact and lightweight design.✅',
                'Easy-to-use interface.✅',
                'Affordable and reliable.✅',
                'Frequency: 400-469.995MHz✅',
                '16 channels✅',
                'VOX Function✅',
                'Voice Prompt✅',
                'PC Programming✅',
                'Emergency Alarm✅',
                'Low Voltage Alert.✅',
                'Time-out Timer✅',
                'Flash Light✅',
              ],
            },
            {
              id: 2,
              title: 'Baofeng-UV5R',
              image: '/sr-400.jpg',
              features: [
                'Range: Up to 8 km.✅',
                'Durable and waterproof.✅',
                'Supports hands-free operation.✅',
                'Dual-Band Display, Dual Freq. Display, Dual-Standby✅',
                'Output Power: 4 /1Watts✅',
                'Built-in VOX Function✅',
                'LED Flashlight✅',
                'Emergency Alert✅',
                'Low Battery Alert✅',
                'Battery Saver✅',
                'Time-out Timer✅',
                'Keypad Lock✅',
                'Monitor Channel✅',
                '1750Hz Brust Tone✅',
              ],
            },
            {
              id: 3,
              title: 'Baofeng-UV9R Plus',
              image: '/sr-300.jpg',
              features: [
                'Range: Up to 5 km.✅',
                'Built-in flashlight for emergencies.✅',
                'Working Frequency: VHF136-174MHz & UHF400-520MH✅',
                'Cross band reception/transmission✅',
                'Frequency reverse✅',
                'Battery saving function "SAVE"✅',
                'Programmable by PC.✅',
                'Display illumination and programmable keyboard.✅',
              ],
            },
            {
              id: 4,
              title: 'Kenwood TK 3000',
              image: '/sr-200.jpg',
              features: [
                'Communication Range: 5KM',
                'Thin & Lightweight✅',
                '16 Channels with Scan Function✅',
                'Programmable Function Key with Hold.✅',
                'Robust & Reliable.✅',
                'Output Power 5W (VHF) / 4W (UHF).✅',
                'Busy Channel Lockout✅',
                'Low-Battery Alert✅',
                'PC Programming and Tuning✅',
                'Time-Out-Timer✅',
                'Priority Scan✅',
                'VOX Ready✅',
              ],
            },
            {
              id: 5,
              title: 'Crony TG360',
              image: '/sr-500.jpg',
              features: [
                'Communication Range: 2-7 KM✅',
                'Frequency Range : UHF (420-470MHz)✅',
                'Memory Channel:16 channels✅',
                'Battery Capacity : 2200mAh✅',
                'Low-Battery Alert✅',
                'PC Programming and Tuning✅',
                'Time-Out-Timer✅',
                'Priority Scan✅',
                'VOX Ready✅',
              ],
            },
            {
              id: 6,
              title: 'Motorolla T62',
              image: '/sr-600.jpg',
              features: [
                'Up to 8km range (depending on terrain)✅',
                'Rugged and shockproof design.✅',
                'Supports hands-free operation.✅',
                'Long battery life (up to 48 hours).✅',
                '16 channels plus 121 privacy codes✅',
                'Scan / Monitor✅',
              ]
            }
          ]
        }
      ]
    },
        // Add the new vehicle-video-telematics service
    'vehicle-video-telematics': {
      title: 'Vehicle Video Telematics',
      subtitle: 'Advanced video telematics solutions for enhanced fleet safety and management',
      hero: {
        title: 'Intelligent Video Telematics',
        subtitle: 'AI-powered safety and fleet optimization',
        backgroundImage: '/images/video-telematics-hero.jpg',
        features: [
          { icon: 'video', text: 'Multi-Camera Recording' },
          { icon: 'brain', text: 'AI-Powered Alerts' },
          { icon: 'map-marked-alt', text: 'Real-time Tracking' }
        ]
      },
          sections: [
            {
              type: 'open-layout',
              id: 1,
              title: 'Nebsam Vehicle  Video Telematics Solution',
              description: 'Our vehicle video telematics solution 🚗📹 is advanced and stands out from the rest, as it leverages cutting-edge camera systems 🎥 with built-in AI processors 🤖 to detect road signs 🚧 and limit speed accordingly 🛑. It also detects driving events such as lane departure ↪️, forward collision ⚠️, and improper driver behavior like using mobile phones 📱 or not wearing seat belts 🪢. Our solution alerts the driver in real-time ⏰ of dangerous behaviors and uploads events to a monitoring platform 🖥️, allowing a fleet manager 👨‍✈️ to review and coach drivers 🗣️ to help reduce traffic risks 🛡️. We consider our vehicle video telematics solution the ideal companion for everyday driving 🚘 and long-distance hauling 🚛.',
              image: '/video-telematics-main.webp',
              imagePosition: 'center'
            },
            {
              type: 'open-layout',
              id: 2,
              title: 'Key Features',
              description: 'Our cameras have amazing features that make them perfect for helping to deter crime 🚔, record bad driving behaviors 🚫🚗, identify drivers , and quickly resolve disputes or false claims relating to traffic accidents ⚖️🚦.',
              image: '/video-telematics-features.jpg',
              imagePosition: 'center'
            },
            {
              type: 'card-grid',
              id: 3,
              title: '',
              cards: [
                {
                  id: 1,
                  title: 'Live GPS Tracking',
                  description: '🌐🚛 The vehicle video telematics solution features a GNSS module 📡 that provides precise real-time location data 📍 of en-route fleet vehicles and cargoes 📦. This way, you can always keep an eye on them 👀 to see if anything unexpected happens during transit 🚧, and review their route history 🗺️ if any issues arise later 🔍',
                  image: '/driver-safety.jpg'
                },
                {
                  id: 2,
                  title: 'Driver Monitoring (DMS)',
                  description: '🧠📷 The driver-monitoring camera uses an AI algorithm 🤖 to detect your driver’s status, such as drowsy driving 😴 (nodding off, frequent yawning 🥱, droopy eyes 👀) or distracted driving 📱 (talking or texting on a phone, looking away 👈), and gives out audible alerts 🔊 to remind drivers in real-time ⏰ to stay vigilant at the wheel 🛞. When combined with our platform 🌐, you can receive DMS-specific push notifications 📲 and view inattentive driving reports 📑 on your mobile or online 💻.',
                  image: '/accident-prevention.jpg'
                },
                {
                  id: 3,
                  title: 'Driving Behavior Analysis (DBA)',
                  description: 'Leveraging data 📊  on the reckless driving behavior of your drivers 🚗💨 can help reduce the accident rate 🚫🚑, coach drivers to increase safety awareness on the road 🛣️🧠, and improve the fuel economy of your fleet ⛽💰. This can further save you on your insurance expenditure 💸🛡️.',
                  image: '/video-evidence.webp'
                },
                {
                  id: 4,
                  title: 'Event Video To Cloud',
                  description: 'In the event of a collision 💥, reckless driving behavior 🚗💨, or any ADAS and DMS events 🧠📈, Nebsam DVR Cameras 🎥 will, as required, capture crisp, clear video clips 🎬 and upload them to the cloud ☁️ for evidentiary support and later review 👀. The reliable 4G module 📡 allows data to be transmitted to the cloud-based platform even faster ⚡, so you can respond or take action at the earliest time possible ⏱️.',
                  image: '/fleet-optimization.jpg'
                },
                {
                  id: 5,
                  title: 'Road sign detect and response',
                  description: 'Our vehicle video telematics solution 🚗💡 comes equipped with powerful built-in AI processors 🤖 that smartly detect and respond to traffic road signs 🚧 by automatically reducing speed 🐢 to a predefined safe threshold ✅. This helps promote safer driving 🛣️, prevents violations 🚫, and gives fleet managers peace of mind knowing their drivers are being supported by intelligent technology 📊. Its like having a co-pilot that never sleeps 😴❌!.',
                  image: '/theft-prevention.jpeg'
                },
                {
                  id: 6,
                  title: 'Driver Identification',
                  description: 'Our smart system comes equipped with a driver face identification feature 👁️‍🗨️ that keeps your vehicle secure at all times. It uses advanced biometrics 🧬 to recognize who’s behind the wheel, and if an unauthorized driver tries to take control, 🚫 the system instantly sends an alert 🚨 to the server. Whether its a case of mistaken identity or something more serious, this powerful feature ensures only the right person is driving 🔐🚗—giving you peace of mind on every journey',
                  image: '/compliance-management.webp'
                },
              ]
            },
            {
              type: 'three-column',
              id: 4,
              title: '3 Cameras Recording At The Same Time',
              columns: [
                {
                  id: 1,
                  title: 'Front Camera',
                  description: ' The high-resolution forward-facing camera📷 features a sharp 1920P lens 🎯 and a wide 140° DFOV 🌐 that captures every detail of the road ahead 🛣️. With built-in AI 🤖, it provides smart collision warnings ⚠️ to help keep you safe and alert while driving.',
                  image: '/front-camera.jpg'
                },
                {
                  id: 2,
                  title: 'Cabin Camera',
                  description: 'Equipped with 1080p resolution 🎥  and a 170° DFOV, the interior-facing camera keeps a close eye 👀 on driver behavior, seatbelt usage 🪢, and any potential distractions 🚫📱—helping ensure safer, more focused driving every time you are on the road 🛣️.',
                  image: '/cabin-camera.jpg'
                },
                {
                  id: 3,
                  title: 'Rear Camera',
                  description: 'The rear-facing camera 🔄🚗  has your back—literally! It provides clear visibility of those tricky blind spots 👀, making reversing and lane changes safer than ever. Plus, it continuously records everything happening behind the vehicle 🎥🛣️, giving you solid backup in case of unexpected incidents. Stay aware, stay protected!',
                  image: '/rear-camera.jpg'
                }
              ]
            },
            {
              type: 'why-need',
              id: 5,
              title: 'Why You Need Our Solution',
              description: 'Our video telematics solution helps businesses of all sizes improve safety, reduce costs, and optimize operations.',
              cards: [
                {
                  id: 1,
                  title: 'Provides Evidence',
                  description: 'In today’s fast-paced world, having solid evidence during traffic incidents is everything 🎥🛑. Our smart video telematics solution captures every moment on the road — from reckless drivers 🚗💨 to unexpected collisions 💥. Whether you are dealing with insurance claims, false accusations, or disputes, you will have clear, time-stamped video proof to back you up 📁✅. No more “he said, she said” — just the truth, straight from the camera lens! 🧾🔍'
                },
                {
                  id: 2,
                  title: 'Deter Corruption',
                  description: 'With our vehicle video telematics solution 🛡️💡, you are not just improving safety—you are also taking a bold stand against corruption. By recording every event on the road and within the vehicle 🎥🚗, our system provides clear, unbiased evidence that can help prevent false accusations, eliminate bribery, and hold both drivers and officials accountable. It promotes transparency ⚖️, encourages responsible behavior 🙌, and builds trust across your entire fleet. When everything is on camera, there’s no room for shady practices!'
                },
                {
                  id: 3,
                  title: 'Resolves Disputes Related to Traffic Violations',
                  description: 'Traffic accidents can be stressful and confusing 🚦💥, especially when there is no clear evidence of what really happened. Our vehicle video telematics solution takes the guesswork out of the equation by capturing high-quality footage 🎥 of every moment on the road. This helps resolve disputes quickly and fairly ⚖️—whether it’s proving your innocence, handling insurance claims 🧾, or avoiding false accusations. With clear visual proof, you are always one step ahead 🛡️.'
                },
              ]
            }
          ]
            }, 
           
            'speed-governors': {
              title: 'Speed Governors Services',
              subtitle: 'Advanced speed limiting solutions for fleet safety and compliance',
              hero: {
                title: 'Professional Speed Limiting Solutions',
                subtitle: 'Ensure compliance and improve safety with Nebsam  speed governors',
                backgroundImage: '/images/speed-governor-hero.jpg',
                features: [
                  { icon: 'tachometer-alt', text: 'Precise Speed Control' },
                  { icon: 'shield-alt', text: 'Safety Compliance' },
                  { icon: 'message', text: 'SMS violation alerts' }
                ]
              },
              sections: [
                {
                  type: 'intro',
                  id: 1,
                  content: 'Speed is a major cause of road accidents in Kenya 🚗💥. For fleet owners, accidents can be costly — from legal issues to long insurance claims ⏳⚖️. A speed governor is a device that limits how fast a vehicle can go, helping drivers stay within legal speed limits and reducing the chances of crashes 🛑🚛. In Kenya, it is a legal requirement for certain vehicles like trucks, school buses, and public service vehicles to have speed governors installed ✅📏. Stay safe, save lives, and stay compliant! 💡🇰🇪 with Nebsam Speed governors!'
                },
                {
                  type: 'centered-image',
                  id: 2,
                  image: '/images/speed-governor-main.jpg',
                  alt: 'Speed Governor Installation'
                },
                {
                  type: 'feature-cards',
                  id: 3,
                  title: 'Our Speed Governor Solutions',
                  cards: [
                    {
                      id: 1,
                      title: 'Functions',
                      features: [
                        'Speed limiting up to 80 km/h✅',
                        'Sends data to NTSA portal at real time✅',
                        'Sends violation reports and expiry alerts via SMS to owners✅',
                        'Has accurate GPS Tracking ✅',
                        'Approved by NTSA ✅',
                        
                       
                      ]
                    },
                    {
                      id: 2,
                      title: 'Key Features',
                      features: [
                        'Mobile App platform✅',
                        'Can store records for a period of 1 year✅',
                        'Receives commands at very high speeds✅',
                        'LED indicator for system status✅',
                        'GPS integration option✅',
                        'Tamper-proof design✅',
                       'Compatible with most vehicle types✅',
                        
                      ]
                    },
                    {
                      id: 3,
                      title: 'Areas of Application',
                      features: [
                        'Cargo trucks and logistics✅',
                        'School, education institutions, parastatal buses✅',
                        'Tourist Service Vehicles✅',
                        'Public Service busess✅',
                        'Matatus✅',
                       
                      ]
                    }
                  ]
                }
              ]
          },

              'car-alarms': { 
        title: 'Nebsmart Car Alarms',
        subtitle: '3 in 1 Car Alarm + Tracker + Cut',
        hero: {
          title: 'Nebsmart Car Alarms',
          subtitle: 'Advanced security with real-time monitoring',
          backgroundImage: '/images/car-alarms-hero.jpg',
          features: [
            { icon: 'lock', text: 'Remote Lock/Unlock' },
            { icon: 'map-marker-alt', text: 'GPS Tracking' },
            { icon: 'bell', text: 'Instant Alerts' }
          ]
        },
        sections: [
          {
            type: 'open-layout',
            id: 1,
            title: '',
            description: 'Nebsmart car alarms go far beyond the features of a standard alarm system. With cutting-edge technology and smart integrations, they offer unmatched protection and peace of mind—no matter where you are. 🚗✨ From GPS tracking and remote door control via mobile app or SMS 📲, to engine cut-off and a secret button start feature 🛑🔒, you are always in control. It even includes protection against GSM network jammers and a handy remote car finder to locate your vehicle with ease. 🛰️🔍 ',
            image: '/car-alarm-main.jpg',
            imagePosition: 'center'
          },
          {
            type: 'feature-grid',
            id: 2,
            title: 'Unique Features',
            titleColor: "#000000",
            cards: [
              {
                id: 1,
                title: 'GPS tracking',
                description: 'Enjoy real-time tracking and monitoring of your vehicle right from your computer or smartphone—anytime, anywhere. 🌍📱 Stay connected and in control, whether you are at home, at work, or on the go. 🚗💡',
                image: '/shock-sensor.jpg'
              },
              {
                id: 2,
                title: 'Remote Central lock',
                description: 'Easily lock or unlock your car using a remote, SMS, computer, or smartphone. 🔐📲 This feature is especially helpful in those tricky moments—like when you have accidentally locked your keys inside or need to grant someone access from a distance. 🚗✨',

                image: '/engine-immobilizer.jpg'
              },
              {
                id: 3,
                title: 'Identify jamming GSM signal',
                description: 'If the Nebsmart Car Alarm detects a jamming device trying to block the GSM signal, it instantly triggers the alarm 🚨 and activates the relay to cut off the engine or fuel supply, effectively immobilizing the vehicle. 🛑🔧 It’s smart protection that stays one step ahead. 🧠🚗Control and monitor your alarm system from anywhere using our mobile app',
                image: '/smartphone-integration.jpg'
              },
              {
                id: 4,
                title: 'Remote Car Search',
                description: 'The car alarm remote comes with a special button that lets you activate the siren anytime 🔊. With just a press, the horn honks and the turn signals flash 🚨🔁—making it super easy to spot your car in a busy parking lot or crowded area. 🅿️🚗',
                image: '/anti-hijack.jpg'
              },
              {
                id: 5,
                title: 'Alarm Reports',
                description: 'Nebsmart car alarms come with a powerful mobile app that keeps you connected to your vehicle at all times. 📱🚘 The app provides instant notifications and detailed alarm reports whenever there’s unusual activity—whether it’s a break-in attempt, a door opened, or movement detected. 📊🔔 You’ll always know what’s happening, in real time, giving you full control and peace of mind wherever you are. 🌍🛡️',
                image: '/engine-immobilizer-1.jpg'
              },
              {
                id: 6,
                title: 'Remote Engine cut off and resume',
                description: 'With the Nebsmart Car Alarm, you can remotely cut off and resume the engine using your smartphone, computer, or SMS 🛑📲. This powerful security feature lets you immobilize the vehicle in case of theft or unauthorized movement, ensuring the engine will not start or continue running without your command 🔐. Once the situation is secure, you can easily resume engine operation with a simple tap or text. It is a peace of mind—right at your fingertips. 🧠💡',
                image: '/two-way-communication.jpg'
              }
            ]
          },
          {
            type: 'other-features',
            id: 3,
            title: 'Other Features',
            cards: [
              {
                id: 1,
                title: 'Security Features',
                features: [
                  'Cut-out required before ignition start',
                  'Anti-hijacking',
                  'Glass break sensors',
                  'Geo fence alarm',
                  'Open trunk function'
                ]
              },
              {
                id: 2,
                title: 'Convenience Features',
                features: [
                  'Remote start capability',
                  'Automatic door locking',
                  'Window roll-up',
                  'Panic alarm',
                  'Valet mode'
                ]
              },
              {
                id: 3,
                title: 'Monitoring Features',
                features: [
                  '24/7 monitoring available',
                  'Instant mobile notifications',
                  'Battery backup system',
                  'Self-diagnostic system',
                  'Service reminders'
                ]
              }
            ]
          }
        ]
      }
    };
  

    // Add more services as needed
    const service = serviceDetails[serviceName];
    if (!service) {
      return <div>Service not found.</div>;
    }
  // Render function for vehicle-video-telematics service
  const renderVideoTelematics = (sections) => {
    return (
      <div className="video-telematics-container">
        {sections.map((section) => {
          switch (section.type) {
            case 'open-layout':
              return (
                <div key={section.id} className="open-layout-section">
                  <h3>{section.title}</h3>
                  <p className="section-description">{section.description}</p>
                  {section.image && (
                    <div className={`image-container ${section.imagePosition || 'center'}`}>
                      <img src={section.image} alt={section.title} />
                    </div>
                  )}
                </div>
              );
            
            case 'card-grid':
              return (
                <div key={section.id} className="card-grid-section">
                  <h3>{section.title}</h3>
                  <div className="card-grid">
                    {section.cards.map((card) => (
                      <div key={card.id} className="feature-card">
                        <h4>{card.title}</h4>
                        <p>{card.description}</p>
                        <div className="card-image-container">
                          <img src={card.image} alt={card.title} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            
            case 'three-column':
              return (
                <div key={section.id} className="three-column-section">
                  <h3>{section.title}</h3>
                  <div className="three-column-grid">
                    {section.columns.map((column) => (
                      <div key={column.id} className="column-item">
                        <h4>{column.title}</h4>
                        <p>{column.description}</p>
                        <div className="column-image-container">
                          <img src={column.image} alt={column.title} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            
            case 'why-need':
              return (
                <div key={section.id} className="why-need-section">
                  <h3>{section.title}</h3>
                  <p className="section-description">{section.description}</p>
                  <div className="benefit-cards">
                    {section.cards.map((card) => (
                      <div key={card.id} className="benefit-card">
                        <h4>{card.title}</h4>
                        <p>{card.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            
            default:
              return null;
          }
        })}
      </div>
    );
  };

  // render function for speed governors
  const renderSpeedGovernors = (sections) => {
    return (
      <div className="speed-governors-container">
        {sections.map((section) => {
          switch (section.type) {
            case 'intro':
              return (
                <section key={section.id} className="intro-section">
                  <div className="intro-content">
                    <p>{section.content}</p>
                  </div>
                </section>
              );
            
            case 'centered-image':
              return (
                <section key={section.id} className="centered-image-section">
                  <img src={section.image} alt={section.alt || ''} className="centered-image" />
                </section>
              );
            
            case 'feature-cards':
              return (
                <section key={section.id} className="feature-cards-section">
                  {section.title && <h2 className="section-title">{section.title}</h2>}
                  <div className="feature-cards-grid">
                    {section.cards.map((card) => (
                      <div key={card.id} className="feature-card">
                        <h3>{card.title}</h3>
                        <ul className="feature-list">
                          {card.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              );
            
            default:
              return null;
          }
        })}
      </div>
    );
  };

// render function for ECTS
  const renderECTS = (sections) => {
    const ImageGrid = ({ images = [], columnsClass = '' }) => {
      return (
        <div className={`ects-image-grid ${columnsClass}`}>
          {images.map((img, idx) => (
            <figure key={idx} className="ects-image-slot">
              <img src={img.src} alt={img.alt || 'ECTS image'} loading="lazy" />
              {img.caption && <figcaption>{img.caption}</figcaption>}
            </figure>
          ))}
        </div>
      );
    };

    return (
      <article className="ects-container">
        {sections.map((section) => {
          switch (section.type) {
            case 'ects-problem':
              return (
                <section key={section.id} className="ects-section">
                  <header className="ects-section-header">
                    <h2>{section.title}</h2>
                    <p className="ects-lead">{section.intro}</p>
                  </header>

                  <div className="ects-content-grid">
                    <div className="ects-text">
                      <ul className="ects-bullets">
                        {section.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="ects-media">
                      <h3 className="ects-subtitle">Gallery</h3>
                      <ImageGrid images={section.images} columnsClass="cols-2" />
                      <p className="ects-hint">Replace the placeholder images with your real project photos.</p>
                    </div>
                  </div>
                </section>
              );

            case 'ects-solution':
              return (
                <section key={section.id} className="ects-section">
                  <header className="ects-section-header">
                    <h2>{section.title}</h2>
                    <p className="ects-lead">{section.intro}</p>
                  </header>

                  <div className="ects-card-grid">
                    {section.cards.map((card, idx) => (
                      <div key={idx} className="ects-card">
                        <h3>{card.title}</h3>
                        <p>{card.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="ects-media-block">
                    <h3 className="ects-subtitle">Solution Photos</h3>
                    <ImageGrid images={section.images} columnsClass="cols-2" />
                  </div>
                </section>
              );

            case 'ects-products':
              return (
                <section key={section.id} className="ects-section">
                  <header className="ects-section-header">
                    <h2>{section.title}</h2>
                    <p className="ects-lead">{section.intro}</p>
                  </header>

                  <div className="ects-models">
                    <h3 className="ects-subtitle">Models</h3>
                    <div className="ects-model-grid">
                      {section.models.map((m, idx) => (
                        <div key={idx} className="ects-model-card">
                          <div className="ects-model-image">
                            <img src={m.image} alt={m.name} loading="lazy" />
                          </div>
                          <div className="ects-model-body">
                            <h4>{m.name}</h4>
                            <p>{m.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="ects-highlights">
                    <h3 className="ects-subtitle">Product Capabilities</h3>
                    <div className="ects-highlight-grid">
                      {section.highlights.map((h, idx) => (
                        <div key={idx} className="ects-highlight-card">
                          <h4>{h.title}</h4>
                          <ul>
                            {h.points.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="ects-media-block">
                    <h3 className="ects-subtitle">Product Gallery</h3>
                    <ImageGrid images={section.productImages} columnsClass="cols-4" />
                    <p className="ects-hint">You requested 8 product images — all slots are provided.</p>
                  </div>
                </section>
              );

              case 'ects-usecases':
              return (
                <section key={section.id} className="ects-section">
                  <header className="ects-section-header">
                    <h2>{section.title}</h2>
                    <p className="ects-lead">{section.intro}</p>
                  </header>

                  <div className="ects-usecase-grid">
                    {section.cases.map((c, idx) => (
                      <div key={idx} className="ects-usecase-card">
                        <div className="ects-usecase-image">
                          <img src={c.image} alt={c.title} loading="lazy" />
                        </div>
                        <div className="ects-usecase-body">
                          <h3>{c.title}</h3>
                          <p>{c.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );

            default:
              return null;
          }
        })}
      </article>
    );
  };

  // Render function for car-alarms service
  const renderCarAlarms = (sections) => {
    return (
      <div className="car-alarms-container">
        {sections.map((section) => {
          switch (section.type) {
            case 'open-layout':
              return (
                <div key={section.id} className="open-layout-section">
                  <h3 className="section-title">{section.title}</h3>
                  <p className="section-description">{section.description}</p>
                  {section.image && (
                    <div className="centered-image-container">
                      <img 
                        src={section.image} 
                        alt={section.title} 
                        className="centered-image"
                      />
                    </div>
                  )}
                </div>
              );

            case 'feature-grid':
              return (
                <section key={section.id} className="feature-section">
                  <h3 className="section-title neon">{section.title}</h3>
                  <div className="feature-grid">
                    {section.cards.map((card) => (
                      <div key={card.id} className="feature-card glass">
                        <div className="card-content">
                          <h4 className="card-title">{card.title}</h4>
                          <p className="card-description">{card.description}</p>
                        </div>
                        <div className="card-image-wrapper">
                          <img 
                            src={card.image} 
                            alt={card.title} 
                            className="card-image"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'other-features':
              return (
                <section key={section.id} className="other-features-section">
                  <h3 className="section-title neon">{section.title}</h3>
                  <div className="features-grid">
                    {section.cards.map((card) => (
                      <div key={card.id} className="feature-list-card glass">
                        <h4>{card.title}</h4>
                        <ul className="feature-list">
                          {card.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              );

            default:
              return null;
          }
        })}
      </div>
    );
  };

  // Default render function for other services
  const renderDefaultService = (service) => {
    return (
      <div className="service-detail-container">
        <div className="tracker-sections">
          {service.sections.map((section) => (
            <div key={section.id} className="tracker-section">
              <h3>{section.title}</h3>
              {section.description && <p>{section.description}</p>}
        
              {/* Car Tracking Specific Rendering */}
              {serviceName === 'car-tracking' && (
                <div className="tracker-card">
                  {section.image && (
                    <div className="image-container-single">
                      <img src={section.image} alt={section.title} className="tracker-image" />
                    </div>
                  )}
                  <ul className="features-list">
                    {section.features?.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
        
              {/* Radio Calls Specific Rendering */}
              {serviceName === 'radio-calls' && section.cards && (
                <div className="radio-call-cards">
                  {section.cards.map((card) => (
                    <div key={card.id} className="radio-call-card">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="radio-call-image"
                      />
                      <h4>{card.title}</h4>
                      <ul className="features-list">
                        {card.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
        
              {/* Fuel Monitoring Specific Rendering */}
              {serviceName === 'fuel-monitoring' && !section.cards && (
                <div className="fuel-monitoring-section">
                  {section.image && (
                    <div className="image-container-single">
                      <img src={section.image} alt={section.title} className="tracker-image" />
                    </div>
                  )}
                  <ul className="features-list">
                    {section.features?.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
        
              {/* Features list for sections that have features but no cards */}
              {section.features && !section.cards && !['car-tracking', 'fuel-monitoring'].includes(serviceName) && (
                <ul className="features-list">
                  {section.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
    
        {/* Additional sections for fuel monitoring */}
        {serviceName === 'fuel-monitoring' && service.additionalSections && (
          <>
            <div className="additional-sections">
              {service.additionalSections.map((section) => (
                <div key={section.id} className="additional-section">
                  <h3>{section.title}</h3>
                  <img
                    src={section.image}
                    alt={section.title}
                    className="additional-image"
                  />
                  <p>{section.description}</p>
                </div>
              ))}
            </div>
    
            {service.monitoringPlatforms && (
              <div className="monitoring-platforms">
                <h3>Monitoring Platforms</h3>
                <div className="platform-cards">
                  {service.monitoringPlatforms.map((platform) => (
                    <div key={platform.id} className="platform-card">
                      <img
                        src={platform.image}
                        alt={platform.title}
                        className="platform-image"
                      />
                      <h4>{platform.title}</h4>
                      <ul className="features-list">
                        {platform.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  // Main render function
  const renderServiceContent = () => {
    const service = serviceDetails[serviceName];
    if (!service) {
      return <div>Service not found.</div>;
    }

    return (
      <div className="service-container">
        <Helmet>
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />
          <link rel="canonical" href={meta.canonical} />
          {/* Open Graph */}
          <meta property="og:title" content={meta.title} />
          <meta property="og:description" content={meta.description} />
          <meta property="og:url" content={meta.canonical} />
          <meta property="og:image" content={meta.ogImage} />
          <meta property="og:type" content="website" />
          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={meta.title} />
          <meta name="twitter:description" content={meta.description} />
          <meta name="twitter:image" content={meta.ogImage} />
          {/* Schema.org Structured Data for Service */}
          <script type="application/ld+json">
            {JSON.stringify(meta.schema)}
          </script>
        </Helmet>
        {service.hero && renderHeroSection(service.hero)}
        {(() => {
          switch (serviceName) {
            case 'vehicle-video-telematics':
              return renderVideoTelematics(service.sections);
            case 'car-alarms':
              return renderCarAlarms(service.sections);
            case 'speed-governors':
              return renderSpeedGovernors(service.sections);
            case 'electronic-cargo-tracking-system':
              return renderECTS(service.sections);
            default:
              return renderDefaultService(service);
          }
        })()}
      </div>
    );
  };
  return renderServiceContent();
};
export default ServiceDetail;