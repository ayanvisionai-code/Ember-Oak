import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ConciergeBell, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import Select from 'react-select';
import { Country } from 'country-state-city';
import config from '../../data/vip-config.json';
import './AcquisitionWidget.css';

const countryOptions = Country.getAllCountries().map(c => ({
  value: c.isoCode,
  label: `${c.flag} ${c.name} (+${c.phonecode})`,
  country: c.name,
  phonecode: `+${c.phonecode}`
}));

const defaultCountry = countryOptions.find(c => c.value === 'IN') || countryOptions[0];

const selectStyles = {
  control: (base, state) => ({
    ...base,
    background: 'rgba(255, 255, 255, 0.05)',
    borderColor: state.isFocused ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '2px',
    fontSize: '16px',
    boxShadow: state.isFocused ? '0 0 0 1px var(--color-gold)' : 'none',
    '&:hover': {
      borderColor: 'var(--color-gold)'
    }
  }),
  menu: (base) => ({
    ...base,
    background: '#1a1a1a',
    border: '1px solid rgba(212, 175, 55, 0.25)',
    borderRadius: '8px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
    fontSize: '16px'
  }),
  option: (base, state) => ({
    ...base,
    background: state.isSelected ? 'rgba(212, 175, 55, 0.2)' : state.isFocused ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
    color: state.isSelected ? 'var(--color-gold)' : '#fff',
    cursor: 'pointer',
    fontSize: '16px',
    '&:active': {
      background: 'rgba(212, 175, 55, 0.3)'
    }
  }),
  singleValue: (base) => ({
    ...base,
    color: '#fff',
    fontSize: '16px'
  }),
  input: (base) => ({
    ...base,
    color: '#fff',
    fontSize: '16px'
  }),
  placeholder: (base) => ({
    ...base,
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '16px'
  })
};

const normalizeWhatsApp = (number) => {
  return number.replace(/\D/g, '');
};

const getTheme = (type) => {
  switch (type) {
    case 'error': return { color: '#ff4d4f', bg: 'rgba(255, 77, 79, 0.05)', border: 'rgba(255, 77, 79, 0.3)' };
    default: return { 
      color: 'var(--color-gold)', 
      bg: 'linear-gradient(145deg, rgba(25, 25, 25, 0.9) 0%, rgba(15, 15, 15, 0.95) 100%)', 
      border: 'rgba(212, 175, 55, 0.25)' 
    };
  }
};

export default function AcquisitionModal({ isOpen, onClose }) {
  const [status, setStatus] = useState('idle'); // idle, loading, done, network_error
  const [responseData, setResponseData] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', whatsapp: '' });
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
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
      country: selectedCountry.country,
      countryCode: selectedCountry.phonecode,
      whatsapp: normalizedPhone,
      fullWhatsapp: `${selectedCountry.phonecode}${normalizedPhone}`
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

      const rawText = await res.text();
      console.log('Webhook Raw Response Text:', rawText);

      let rawData;
      try {
        rawData = JSON.parse(rawText);
        console.log('Webhook Parsed JSON:', rawData);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        setStatus('network_error');
        return;
      }
      
      // If n8n returns an array (default behavior when not "First Entry JSON"), extract the first item
      const data = Array.isArray(rawData) && rawData.length > 0 ? rawData[0] : rawData;
      
      // Normalize all keys: trim whitespace and lowercase
      const normalizedKeysData = {};
      if (data && typeof data === 'object') {
        Object.keys(data).forEach(key => {
          const cleanKey = key.trim().toLowerCase();
          normalizedKeysData[cleanKey] = data[key];
        });
      }

      console.log('Normalized Webhook Keys & Data:', normalizedKeysData);
      
      // Resolve title and message
      const title = normalizedKeysData.title || '';
      const message = normalizedKeysData.message || '';
      
      // Smart resolution of messageType
      let messageType = (normalizedKeysData.messagetype || normalizedKeysData.type || '').toLowerCase();
      if (!messageType) {
        if (normalizedKeysData.success === true || normalizedKeysData.success === 'true') {
          messageType = 'success';
        } else if (normalizedKeysData.success === false || normalizedKeysData.success === 'false') {
          messageType = 'error';
        } else if (message) {
          const lowerMsg = message.toLowerCase();
          if (lowerMsg.includes('error') || lowerMsg.includes('fail') || lowerMsg.includes('sorry')) {
            messageType = 'error';
          } else if (lowerMsg.includes('warning') || lowerMsg.includes('limit')) {
            messageType = 'warning';
          } else {
            messageType = 'success'; // Default to success
          }
        } else {
          messageType = 'info';
        }
      }

      const normalizedData = {
        title,
        message,
        messageType
      };

      console.log('Final Normalized State to render:', normalizedData);

      // Trust n8n response completely
      setResponseData(normalizedData);
      setStatus('done');
      
    } catch (err) {
      console.error('Fetch operation error:', err);
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
                  <input type="text" id="fullName" name="fullName" className="vip-form__input" required value={formData.fullName} onChange={handleChange} disabled={status === 'loading'} autoComplete="name" />
                </div>
                
                <div className="vip-form__group">
                  <label className="vip-form__label" htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" className="vip-form__input" required value={formData.email} onChange={handleChange} disabled={status === 'loading'} autoComplete="email" inputMode="email" />
                </div>

                <div className="vip-form__group">
                  <label className="vip-form__label" htmlFor="country">Country</label>
                  <Select
                    id="country"
                    options={countryOptions}
                    value={selectedCountry}
                    onChange={(option) => setSelectedCountry(option)}
                    isDisabled={status === 'loading'}
                    classNamePrefix="vip-select"
                    styles={selectStyles}
                    isSearchable={true}
                  />
                </div>

                <div className="vip-form__group">
                  <label className="vip-form__label" htmlFor="whatsapp">WhatsApp Number</label>
                  <input type="tel" id="whatsapp" name="whatsapp" className="vip-form__input" required placeholder={`${selectedCountry.phonecode} 98765 43210`} value={formData.whatsapp} onChange={handleChange} disabled={status === 'loading'} autoComplete="tel" inputMode="tel" />
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
              {responseData.messageType === 'success' && <CheckCircle size={64} className="vip-status__icon-glow" style={{ color: theme.color, marginBottom: '16px' }} strokeWidth={1.2} />}
              {responseData.messageType === 'info' && <Info size={64} className="vip-status__icon-glow" style={{ color: theme.color, marginBottom: '16px' }} strokeWidth={1.2} />}
              {responseData.messageType === 'warning' && <AlertTriangle size={64} className="vip-status__icon-glow" style={{ color: theme.color, marginBottom: '16px' }} strokeWidth={1.2} />}
              {responseData.messageType === 'error' && <AlertCircle size={64} style={{ color: theme.color, marginBottom: '16px' }} strokeWidth={1.2} />}
              {(!responseData.messageType || !['success', 'info', 'warning', 'error'].includes(responseData.messageType)) && <ConciergeBell size={64} className="vip-status__icon-glow" style={{ color: theme.color, marginBottom: '16px' }} strokeWidth={1.2} />}

              {responseData.title && <h2 className="vip-status__title">{responseData.title}</h2>}
              <div className="vip-status__box" style={{ background: theme.bg, borderColor: theme.border }}>
                <p className="vip-status__text">
                  {responseData.message}
                </p>
              </div>
              <button 
                className="btn btn--gold mt-sm" 
                onClick={onClose} 
                style={{ width: '100%', minHeight: '48px', position: 'relative' }}
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
