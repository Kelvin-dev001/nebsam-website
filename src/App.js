import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import ServiceDetail from './components/ServiceDetail';
import ContactPage from './components/ContactUs';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Footer from './components/Footer';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:serviceName" element={<ServiceDetail />} />
      </Routes>
      <FloatingWhatsApp />
      <Footer />
    </Router>
  );
};

export default App;