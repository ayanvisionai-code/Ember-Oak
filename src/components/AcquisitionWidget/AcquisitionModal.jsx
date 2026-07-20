import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ConciergeBell, CheckCircle, AlertCircle } from 'lucide-react';
import config from '../../data/vip-config.json';
import './AcquisitionWidget.css';

const normalizeWhatsApp = (number) => {
  return number.replace(/\D/g, '');
};

export default function AcquisitionModal({ isOpen, onClose }) {
  const [status, setStatus] = useState('idle'); // idle, loading, success_new, success_existing, error
  const [formData, setFormData] = useState({ fullName: '', email: '', whatsapp: '' });
  const [isAgreed, setIsAgreed] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    const normalizedPhone = normalizeWhatsApp(formData.whatsapp);
    
    const payload = {
      name: formData.fullName,
      email: formData.email,
      whatsapp: normalizedPhone
    };

    try {
      const res = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        setStatus('error');
        return;
      }

      const data = await res.json();
      
      // Handle the exact response from n8n
      if (data.status === 'existing') {
        setStatus('success_existing');
      } else if (data.status === 'success') {
        setStatus('success_new');
      } else {
        setStatus('error');
      }
      
    } catch (err) {
      // Network failure or JSON parse failure
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="vip-modal-overlay">
        <motion.div 
          className="vip-modal"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <button className="vip-modal__close" onClick={onClose} aria-label="Close modal">
            <X size={24} strokeWidth={1.5} />
          </button>

          {status === 'idle' || status === 'loading' ? (
            <>
              <div className="vip-modal__header">
                <ConciergeBell size={44} className="text-accent mb-sm mx-auto" style={{ display: 'block' }} strokeWidth={1.5} />
                <h2 className="vip-modal__title">{config.title}</h2>
                <p className="vip-modal__desc">{config.description}</p>
              </div>

              <form className="vip-form" onSubmit={handleSubmit}>
                <div className="vip-form__group">
                  <label className="vip-form__label" htmlFor="fullName">Full Name</label>
                  <input type="text" id="fullName" name="fullName" className="vip-form__input" required value={formData.fullName} onChange={handleChange} disabled={status === 'loading'} />
                </div>
                
                <div className="vip-form__group">
                  <label className="vip-form__label" htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" className="vip-form__input" required value={formData.email} onChange={handleChange} disabled={status === 'loading'} />
                </div>

                <div className="vip-form__group">
                  <label className="vip-form__label" htmlFor="whatsapp">WhatsApp Number</label>
                  <input type="tel" id="whatsapp" name="whatsapp" className="vip-form__input" required placeholder="+1 234 567 8900" value={formData.whatsapp} onChange={handleChange} disabled={status === 'loading'} />
                </div>
                
                <div className="vip-form__consent">
                  <label className="vip-form__consent-label">
                    <input type="checkbox" checked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)} disabled={status === 'loading'} />
                    <span>
                      By claiming your welcome gift, I agree to the <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href="/terms-conditions" target="_blank" rel="noopener noreferrer">Terms & Conditions</a>.
                    </span>
                  </label>
                </div>

                <button type="submit" className="btn btn--gold mt-sm" disabled={status === 'loading' || !isAgreed} style={{ width: '100%', minHeight: '48px', position: 'relative' }}>
                  {status === 'loading' ? 'Processing...' : config.ctaText}
                </button>
                
                <p className="vip-form__reassurance">We only use your information to deliver your welcome reward and improve your dining experience.</p>
              </form>
            </>
          ) : status === 'success_new' ? (
            <div className="vip-status">
              <CheckCircle size={64} className="vip-status__icon" />
              <h2 className="vip-status__title">Thank You.</h2>
              <div className="vip-status__box">
                <p className="vip-status__text">
                  Your welcome reward has been prepared. <br /><br />
                  Your reward has been sent securely to your WhatsApp. <br />
                  Please present your WhatsApp message when visiting the restaurant.<br /><br />
                  We look forward to welcoming you.
                </p>
              </div>
            </div>
          ) : status === 'success_existing' ? (
            <div className="vip-status">
              <ConciergeBell size={64} className="vip-status__icon" strokeWidth={1.5} />
              <h2 className="vip-status__title">Welcome Back.</h2>
              <div className="vip-status__box">
                <p className="vip-status__text">
                  It appears you've already claimed your first-visit reward. <br /><br />
                  We look forward to serving you again.
                </p>
              </div>
            </div>
          ) : (
            <div className="vip-status">
              <AlertCircle size={64} style={{ color: '#ff4d4f', marginBottom: '10px' }} />
              <h2 className="vip-status__title">We're sorry.</h2>
              <div className="vip-status__box">
                <p className="vip-status__text">
                  We couldn't process your request at the moment. <br />
                  Please try again shortly.
                </p>
              </div>
              <button className="btn btn--secondary mt-sm" onClick={() => setStatus('idle')}>
                Retry
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
