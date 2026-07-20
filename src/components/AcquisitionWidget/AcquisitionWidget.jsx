import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConciergeBell, Check, Gift } from 'lucide-react';
import config from '../../data/vip-config.json';
import { cn } from '../../utils/cn';
import './AcquisitionWidget.css';

const AcquisitionModal = lazy(() => import('./AcquisitionModal'));

export default function AcquisitionWidget() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const heroElement = document.querySelector('.hero');
    if (!heroElement) {
      setIsHeroVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting && entry.intersectionRatio > 0.1);
      },
      {
        threshold: [0, 0.1]
      }
    );

    observer.observe(heroElement);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  if (!config.enabled) return null;

  return (
    <>
      <div 
        className={cn(
          "vip-widget-container", 
          isHeroVisible ? "vip-widget-container--hero" : "vip-widget-container--compact"
        )}
      >
        <AnimatePresence mode="wait">
          {isHeroVisible ? (
            <motion.div
              key="full-card"
              layoutId="vip-widget"
              className="vip-pill"
              onClick={() => setIsModalOpen(true)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <ConciergeBell size={26} className="vip-pill__icon" strokeWidth={1.5} />
              <h3 className="vip-pill__title">{config.title}</h3>
              <p className="vip-pill__desc">{config.description}</p>
              <p className="vip-pill__explanation">{config.explanation}</p>
              
              <button className="btn btn--gold vip-pill__btn">
                {config.ctaText}
              </button>
              
              <div className="vip-pill__trust">
                <span className="trust-item"><Check size={12} /> Delivered instantly to WhatsApp</span>
                <span className="trust-item"><Check size={12} /> Takes less than 30 seconds</span>
                <span className="trust-item"><Check size={12} /> One reward per guest</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="compact-pill"
              layoutId="vip-widget"
              className="vip-pill-compact"
              onClick={() => setIsModalOpen(true)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: isScrolling ? 0.6 : 1, 
                scale: 1 
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                opacity: { duration: 0.2 },
                scale: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                layout: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Gift size={20} className="vip-pill-compact__icon" strokeWidth={1.5} />
              <span className="vip-pill-compact__text">Welcome Gift</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isModalOpen && (
        <Suspense fallback={null}>
          <AcquisitionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
