import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import restaurantInfo from '../data/restaurant-info.json';
import './Contact.css';

export default function Contact() {
  const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success
  const [inquiryType, setInquiryType] = useState('Reservation');

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Simulate API call
    setTimeout(() => {
      setFormStatus('success');
      e.target.reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
    }, 1500);
  };

  return (
    <PageTransition className="contact-page">
      <div className="container section-padding">
        
        <div className="contact-header text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title"
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="section-desc"
          >
            Whether it's a reservation for two or a private event, we are here to assist you.
          </motion.p>
        </div>

        <div className="contact-grid">
          {/* Info Side */}
          <motion.div 
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="info-block">
              <h3>Visit Us</h3>
              <div className="info-item">
                <MapPin className="text-accent" />
                <p>{restaurantInfo.address}</p>
              </div>
            </div>

            <div className="info-block">
              <h3>Contact</h3>
              <div className="info-item">
                <Phone className="text-accent" />
                <a href={`tel:${restaurantInfo.phone.replace(/[^0-9]/g, '')}`}>{restaurantInfo.phone}</a>
              </div>
              <div className="info-item">
                <Mail className="text-accent" />
                <a href={`mailto:${restaurantInfo.email}`}>{restaurantInfo.email}</a>
              </div>
            </div>

            <div className="info-block">
              <h3>Hours of Operation</h3>
              <div className="hours-list">
                {Object.entries(restaurantInfo.hours).map(([day, hours]) => (
                  <div key={day} className="hours-item">
                    <span className="day">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                    <span className="hours">{hours}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Map Placeholder */}
            <div className="map-placeholder">
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" alt="Map Location" />
              <div className="map-overlay">
                <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="btn btn--secondary bg-white">Get Directions</a>
              </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div 
            className="contact-form-wrapper glass"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2>Send an Inquiry</h2>
            <p>We typically respond within 24 hours.</p>

            {formStatus === 'success' ? (
              <motion.div 
                className="form-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="success-icon">✓</div>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for reaching out. A member of our team will get back to you shortly.</p>
              </motion.div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="inquiryType">Inquiry Type</label>
                  <select 
                    id="inquiryType" 
                    value={inquiryType} 
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="form-control"
                  >
                    <option>Reservation</option>
                    <option>Private Event</option>
                    <option>Catering</option>
                    <option>General Question</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input type="text" id="name" required className="form-control" placeholder="John Doe" autoComplete="name" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" required className="form-control" placeholder="john@example.com" autoComplete="email" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input type="tel" id="phone" className="form-control" placeholder="+1 (555) 000-0000" autoComplete="tel" />
                  </div>
                  
                  {inquiryType === 'Reservation' && (
                    <div className="form-group">
                      <label htmlFor="guests">Number of Guests</label>
                      <select id="guests" className="form-control">
                        <option>2 People</option>
                        <option>3 People</option>
                        <option>4 People</option>
                        <option>5+ People</option>
                      </select>
                    </div>
                  )}
                </div>
                
                {inquiryType === 'Reservation' && (
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="date">Date</label>
                      <input type="date" id="date" required className="form-control" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="time">Time</label>
                      <input type="time" id="time" required className="form-control" />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="message">Message / Special Requests</label>
                  <textarea id="message" rows="4" required className="form-control" placeholder="How can we help you?"></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn btn--primary btn--full form-submit"
                  disabled={formStatus === 'submitting'}
                >
                  {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
