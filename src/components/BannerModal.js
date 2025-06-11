import React, { useState, useEffect } from 'react';
import './BannerModal.css';

const BannerModal = ({
  imageSrc = '/images/new-product-banner.png', // Replace with your banner image path
  alt = 'Announcing Our New Product!',
  link = '',
  message = 'No Phone No Start Engine!!',
  show = true,
  onClose = () => {},
}) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  const handleClose = () => {
    setVisible(false);
    onClose();
    // Optionally, set in localStorage to not show again:
    // localStorage.setItem('bannerDismissed', 'yes');
  };

  // Optionally, have the whole banner clickable if a link is provided
  const content = (
    <div className="banner-modal-content">
      <img src={imageSrc} alt={alt} className="banner-modal-image" />
      <div className="banner-modal-message">{message}</div>
      <button className="banner-modal-close" onClick={handleClose} aria-label="Close">&times;</button>
    </div>
  );

  if (!visible) return null;

  return (
    <div className="banner-modal-overlay" onClick={handleClose}>
      <div
        className="banner-modal"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className="banner-modal-link">
            {content}
          </a>
        ) : (
          content
        )}
      </div>
    </div>
  );
};

export default BannerModal;