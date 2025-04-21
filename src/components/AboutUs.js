import React from 'react';
import '../App.css'; // Ensure you have the necessary styles

const AboutUs = () => {
  return (
    <div className="about-us-container">
      {/* Section 1: Picture on the left, text on the right */}
      <section className="section section-1">
        <div className="card">
          <div className="section-content">
            <div className="image-container">
              <img src="/about-us-image-1.jpg" alt="About Us" className="section-image" />
            </div>
            <div className="text-container">
              <h2>Who We Are</h2>
              <p>
              At Nebsam Digital Solutions, we don’t just offer technology—we deliver solutions. That’s why we proudly say, "We Are the Solution!" 💡

With over 10 years of experience in the vehicle telematics and communications industry, we specialize in vehicle tracking, fuel monitoring, smart car alarm services, 
speed governors, and radio call communication solutions. Whether you're looking to secure your fleet, optimize fuel usage, or enhance vehicle safety, 
we have the expertise and technology to make it happen.
              </p>
              <button className="learn-more-button">Learn More</button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Tracking Packages */}
      <section className="section section-2">
        <div className="card">
          <div className="section-content">
            <h2>Our Tracking Packages</h2>
            <p className="subtitle">Choose the package that suits your needs</p>
            <div className="package-columns">
              
              <div className="package-card basic">
              <h3>Basic Package</h3>
                <ul>
                <li>Live GPS Tracking💥</li>
                <li>Geofence💥</li>
                <li>Playback💥</li>
                <li>Remote engine cutoff/resume💥</li>
                <li>Local tracking (within Kenyan border)💥</li>
                <li>Nebsam gpsApp💥</li>
                <li>1-year data💥</li>
                <li>Real-time GPS tracking💥</li>
                <li>Basic reporting💥</li>
                <li>24/7 customer support💥</li>
                </ul>
                <button className="learn-more-button">Learn More</button>
              </div>
             
              <div className="package-card lite">
              <h3>Lite Package</h3>
                <ul>
                <li>Live GPS Tracking 💥</li>
                <li>Geofence💥 </li>
                <li>Playback💥 </li>
                <li>Remote engine cutoff/resume 💥</li>
                <li>Audio streaming (optional)💥 </li>
                <li>Global Tracking within East, Central and South Africa💥 </li>
                <li>Nebsam telematics App(more robust App) 💥</li>
                <li>Fleet management 💥</li>
                <li>1 year data💥 </li>
                </ul>
                <button className="learn-more-button">Learn More</button>
              </div>
              <div className="package-card standard">
              <h3>Standard Package</h3>
                <ul>
                <li>Live GPS Tracking </li>
                <li>Geofence💥 </li>
                <li>Playback Remote engine cutoff/resume 💥</li>
                <li>Audio streaming (optional)💥 </li>
                <li>Local Tracking within Kenyan borders💥</li>
                <li>Nebsam telematics App(more robust App) </li>
                <li>Fleet management💥 </li>
                <li>Fuel level monitoring 💥</li>
                <li>Real time fuel consumption report💥 </li>
                <li>real time SMS alerts on every fuel filling and fuel drainage events (capacity and location)💥 </li>
                <li>1 year data💥 </li>
               
                </ul>
                <button className="learn-more-button">Learn More</button>
              </div>
              <div className="package-card premium">
                <h3>Premium Package</h3>
                <ul>
                <li>Live GPS Tracking💥</li>
                <li>Geofence💥</li>
                <li>Playback💥</li>
                <li>Remote engine cutoff/resume💥</li>
                <li>Audio streaming (optional)💥</li>
                <li>Fleet management💥</li>
                <li>Global Tracking within Eastern, Central and south Africa💥</li>
                <li>Nebsam telematics App(more robust App)💥</li>
                <li>Fuel level monitoring💥</li>
                <li>Real time fuel consumption report💥</li>
                <li>Real time SMS alerts on every fuel filling and fuel drainage events (capacity and location)💥</li>
                <li>1-year data💥</li>
                </ul>
                <button className="learn-more-button">Learn More</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Features */}
      <section className="section section-3">
        <div className="card">
          <div className="section-content">
            <h2>Why Choose Us?</h2>
            <p className="subtitle">Our features set us apart</p>
            <div className="feature-columns">
              <div className="feature-card">
                <h3>Reliability</h3>
                <ul>
                  <li>99.9% uptime</li>
                  <li>Secure data handling</li>
                  <li>Proven track record</li>
                </ul>
              </div>
              <div className="feature-card">
                <h3>Innovation</h3>
                <ul>
                  <li>Cutting-edge technology</li>
                  <li>Regular updates</li>
                  <li>Scalable solutions</li>
                </ul>
              </div>
              <div className="feature-card">
                <h3>Support</h3>
                <ul>
                  <li>24/7 customer support</li>
                  <li>Dedicated account managers</li>
                  <li>Comprehensive training</li>
                </ul>
              </div>
              <div className="feature-card">
                <h3>Affordability</h3>
                <ul>
                  <li>Competitive pricing</li>
                  <li>Flexible payment plans</li>
                  <li>No hidden fees</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Background Image */}
      <section className="section section-4">
        <div className="card">
          <div className="section-content">
            <h2>Our Commitment</h2>
            <p className="subtitle">Driving innovation and excellence</p>
            <p>
              At Nebsam, we are committed to providing the best solutions for our clients. 
              Our team of experts works tirelessly to ensure your fleet operates at peak efficiency.
            </p>
            <button className="learn-more-button">Learn More</button>
          </div>
        </div>
      </section>

      {/* Section 5: Picture on the left, text on the right */}
      <section className="section section-5">
        <div className="card">
          <div className="section-content">
            <div className="image-container">
              <img src="/about-us-image-2.jpg" alt="Our Team" className="section-image" />
            </div>
            <div className="text-container">
              <h2>Our Team</h2>
              <p>
                Our team of professionals is dedicated to helping you achieve your goals. 
                With years of experience and a passion for innovation, we are here to support you every step of the way.
              </p>
              <button className="learn-more-button">Learn More</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;