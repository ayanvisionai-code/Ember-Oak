import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ConciergeBell, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import config from '../../data/vip-config.json';
import './AcquisitionWidget.css';

const normalizeWhatsApp = (number) => {
  return number.replace(/\D/g, '');
};

const getTheme = (type) => {
  switch (type) {
    case 'success': return { color: '#52c41a', bg: 'rgba(82, 196, 26, 0.1)', border: '#52c41a' };
    case 'info': return { color: '#1890ff', bg: 'rgba(24, 144, 255, 0.1)', border: '#1890ff' };
    case 'warning': return { color: '#faad14', bg: 'rgba(250, 173, 20, 0.1)', border: '#faad14' };
    case 'error': return { color: '#ff4d4f', bg: 'rgba(255, 77, 79, 0.1)', border: '#ff4d4f' };
    default: return { color: 'var(--color-gold)', bg: 'rgba(212, 175, 55, 0.1)', border: 'var(--color-gold)' };
  }
};

export default function AcquisitionModal({ isOpen, onClose }) {
  const [status, setStatus] = useState('idle'); // idle, loading, done, network_error
  const [responseData, setResponseData] = useState(null);
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
      
      console.log('Webhook Raw Response Object:', res);

      if (!res.ok) {
        setStatus('network_error');
        return;
      }

      // Clone response to safely log and parse
      const resClone = res.clone();
      try {
        console.log('Webhook Raw JSON String:', await resClone.text());
      } catch (e) {
        console.log('Could not read raw text from response');
      }

      let rawData = await res.json();
      console.log('Webhook Parsed JSON:', rawData);
      
      // If n8n returns an array (default behavior when not "First Entry JSON"), extract the first item
      const data = Array.isArray(rawData) && rawData.length > 0 ? rawData[0] : rawData;
      
      // Dynamically extract keys regardless of casing
      const normalizedData = {
        title: data.title || data.Title || data.TITLE || '',
        message: data.message || data.Message || data.MESSAGE || '',
        messageType: (data.messageType || data.MessageType || data.MESSAGETYPE || data.type || data.Type || '').toLowerCase()
      };

      // Trust n8n response completely
      setResponseData(normalizedData);
      setStatus('done');
      
    } catch (err) {
      // Network failure or JSON parse failure
      setStatus('network_error');
    }
  };

  const theme = responseData ? getTheme(responseData.messageType) : getTheme('error');

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
                  {status === 'loading' ? 'Preparing your welcome reward...' : config.ctaText}
                </button>
                
                <p className="vip-form__reassurance">We only use your information to deliver your welcome reward and improve your dining experience.</p>
              </form>
            </>
          ) : status === 'done' && responseData ? (
            <div className="vip-status">
              {responseData.messageType === 'success' && <CheckCircle size={64} style={{ color: theme.color, marginBottom: '10px' }} />}
              {responseData.messageType === 'info' && <Info size={64} style={{ color: theme.color, marginBottom: '10px' }} />}
              {responseData.messageType === 'warning' && <AlertTriangle size={64} style={{ color: theme.color, marginBottom: '10px' }} />}
              {responseData.messageType === 'error' && <AlertCircle size={64} style={{ color: theme.color, marginBottom: '10px' }} />}
              {(!responseData.messageType || !['success', 'info', 'warning', 'error'].includes(responseData.messageType)) && <ConciergeBell size={64} style={{ color: theme.color, marginBottom: '10px' }} />}

              <h2 className="vip-status__title">{responseData.title}</h2>
              <div className="vip-status__box" style={{ background: theme.bg, borderColor: theme.border }}>
                <p className="vip-status__text">
                  {responseData.message}
                </p>
              </div>
              <button 
                className="btn mt-sm" 
                onClick={onClose} 
                style={{ width: '100%', backgroundColor: theme.color, color: '#fff', border: 'none', fontWeight: 600, padding: '14px 20px', borderRadius: '8px' }}
              >
                Done
              </button>
            </div>
          ) : status === 'network_error' ? (
            <div className="vip-status">
              <AlertCircle size={64} style={{ color: '#ff4d4f', marginBottom: '10px' }} />
              <h2 className="vip-status__title">Connection Problem</h2>
              <div className="vip-status__box" style={{ background: 'rgba(255, 77, 79, 0.1)', borderColor: '#ff4d4f' }}>
                <p className="vip-status__text">
                  We're unable to prepare your welcome reward right now. <br />
                  Please try again in a few moments.
                </p>
              </div>
              <button className="btn btn--secondary mt-sm" onClick={() => setStatus('idle')} style={{ width: '100%' }}>
                Retry
              </button>
            </div>
          ) : null}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
