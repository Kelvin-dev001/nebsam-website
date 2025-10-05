import React, { useState } from 'react';
import '../App.css'; 
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaClock, FaWhatsapp } from 'react-icons/fa';
import { MdOutlineSupportAgent } from 'react-icons/md';
import { RiCustomerService2Fill } from 'react-icons/ri';
import { motion } from 'framer-motion';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      // Hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 2000);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>

      <div className="contact-page">
        {/* Removed Floating WhatsApp Button */}

        {/* Hero Section */}
        <section className="contact-hero">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Your vehicle safety is our top priority
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Our experts are  ready to provide  advice on vehicle tracking, fuel monitoring, vehicle security and radio call solutions
            </motion.p>
          </div>
        </section>

        {/* Main Content */}
        <div className="contact-container">
          {/* Contact Form */}
          <motion.section 
            className="contact-form-section"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2>Send Us a Message</h2>
            <p>Fill out the form below and we'll get back to you within 24 hours</p>
            
            {submitSuccess && (
              <motion.div 
                className="success-message"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <FaPaperPlane /> Thank you! Your message has been sent successfully.
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+254 700 000000"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Tell us about your vehicle security needs..."
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : (
                  <>
                    <FaPaperPlane /> Send Message
                  </>
                )}
              </button>
            </form>
          </motion.section>

          {/* Contact Info */}
          <motion.section 
            className="contact-info-section"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2>Other Ways to Reach Us</h2>
            
            <div className="info-cards">
              <motion.div 
                className="info-card"
                whileHover={{ y: -5 }}
              >
                <div className="card-icon">
                  <FaPhone />
                </div>
                <h3>Call Us</h3>
                <p>+254 759000111</p>
                <p>+254 711895555</p>
                <a href="tel:+254759000111" className="action-link">
                  Call Now
                </a>
              </motion.div>
              
              <motion.div 
                className="info-card"
                whileHover={{ y: -5 }}
              >
                <div className="card-icon">
                  <FaEnvelope />
                </div>
                <h3>Email Us</h3>
                <p>info@nebsam.com</p>
                <p>support@nebsam.com</p>
                <a href="mailto:info@nebsamdigital.com" className="action-link">
                  Send Email
                </a>
              </motion.div>
              
              <motion.div 
                className="info-card"
                whileHover={{ y: -5 }}
              >
                <div className="card-icon">
                  <FaMapMarkerAlt />
                </div>
                <h3>Visit Us</h3>
                <p>Nebsam Headquarters</p>
                <p>Makupa Roundabout Next to Mass Petrol Station, Mombasa</p>
                <a 
                  href="https://maps.app.goo.gl/xUU3NDHXhwxRzyb28" 
                  target="https://maps.app.goo.gl/xUU3NDHXhwxRzyb28k" 
                  rel="noopener noreferrer" 
                  className="action-link"
                >
                  Get Directions
                </a>
              </motion.div>
            </div>
            
            <div className="additional-info">
              <div className="info-item">
                <FaClock />
                <div>
                  <h4>Working Hours</h4>
                  <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                  <p>Saturday: 9:00 AM - 2:00 PM</p>
                </div>
              </div>
              
              <div className="info-item">
                <RiCustomerService2Fill />
                <div>
                  <h4>Customer Support</h4>
                  <p>24/7 Emergency Support Available</p>
                  <p>For tracking emergencies: +254 722 000000</p>
                </div>
              </div>
              
              <div className="info-item">
                <MdOutlineSupportAgent />
                <div>
                  <h4>Technical Support</h4>
                  <p>support@nebsam.com</p>
                  <p>+254 759000111</p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Map Section */}
        <motion.section 
          className="map-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2>Our Location</h2>
          <div className="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.808206679718!2d36.82115931475393!3d-1.2923598359809256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d664f5a9a7%3A0x7d9f0e9b9c9c9c9c!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2ske!4v1620000000000!5m2!1sen!2ske" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
              title="Nebsam Location"
            ></iframe>
          </div>
        </motion.section>

        {/* CTA Section */}
        <section className="contact-cta">
          <div className="cta-content">
            <h2>Still Have Questions?</h2>
            <p>Our security experts are standing by to assist you with any inquiries</p>
            <div className="cta-buttons">
              <a href="tel:+254759000111" className="cta-btn phone">
                <FaPhone /> Call Now
              </a>
              <a 
                href="https://wa.me/254759000111" 
                className="cta-btn whatsapp"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaWhatsapp /> WhatsApp Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;