import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

/**
 * FloatingWhatsApp
 * A globally accessible floating WhatsApp button with a notifier.
 * - Notifier is a small, friendly message bubble above the button.
 * - Uses ARIA for accessibility.
 * - Opens WhatsApp in a new tab with proper rel attributes.
 * - Phone number is easily configurable.
 */

const WHATSAPP_NUMBER = "254759000111"; // Place in env/config for production

const FloatingWhatsApp = ({ number = WHATSAPP_NUMBER, message = "We're online!" }) => (
  <>
    <div className="whatsapp-notifier" aria-hidden="true">
      {message}
    </div>
    <a
      href={`https://wa.me/${number}`}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Nebsam on WhatsApp"
      tabIndex={0}
    >
      <FaWhatsapp className="whatsapp-icon" />
    </a>
  </>
);

export default FloatingWhatsApp;