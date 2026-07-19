import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, CheckCircle, AlertCircle } from 'lucide-react';
import config from '../../data/vip-config.json';
import './AcquisitionWidget.css';

const normalizeWhatsApp = (number) => {
  return number.replace(/\D/g, '');
};

export default function AcquisitionModal({ isOpen, onClose }) {
  const [status, setStatus] = useState('idle'); // idle, loading, success_new, success_existing, error
  const [formData, setFormData] = useState({ fullName: '', email: '', whatsapp: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    const normalizedPhone = normalizeWhatsApp(formData.whatsapp);
    
    const payload = {
      ...formData,
      whatsapp: normalizedPhone,
      reward: config.rewardTitle
    };

    try {
      if (config.webhookUrl.includes('mock-webhook-endpoint')) {
        setTimeout(() => {
          if (normalizedPhone.endsWith('0')) {
             setStatus('success_existing');
          } else {
             setStatus('success_new');
          }
        }, 1500);
        return;
      }

      const res = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (data.status === 'existing') {
        setStatus('success_existing');
      } else if (data.status === 'success') {
        setStatus('success_new');
      } else {
        setStatus('error');
      }
      
    } catch (err) {
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="vip-modal-overlay">
        <motion.div 
          className="vip-modal"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <button className="vip-modal__close" onClick={onClose} aria-label="Close modal">
            <X size={24} />
          </button>

          {status === 'idle' || status === 'loading' ? (
            <>
              <div className="vip-modal__header">
                <Gift size={40} className="text-accent mb-sm mx-auto" style={{ display: 'block' }} />
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

                <button type="submit" className="btn btn--gold mt-sm" disabled={status === 'loading'} style={{ width: '100%', minHeight: '48px', position: 'relative' }}>
                  {status === 'loading' ? 'Processing...' : config.ctaText}
                </button>
                
                <p className="vip-form__privacy">We only use your details to deliver your welcome reward.</p>
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
              <Gift size={64} className="vip-status__icon" />
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
