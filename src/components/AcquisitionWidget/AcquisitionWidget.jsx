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
        setIsHeroVisible(entry.isIntersecting && entry.intersectionRatio > 0.15);
      },
      {
        threshold: [0, 0.15]
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
      <motion.div
        layout
        onClick={() => setIsModalOpen(true)}
        className={cn(
          "vip-widget-shared",
          isHeroVisible ? "vip-widget-shared--hero" : "vip-widget-shared--compact",
          isScrolling && !isHeroVisible && "vip-widget-shared--scrolling"
        )}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 26,
          layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="vip-widget-content-wrapper">
          <div className={cn("vip-content-hero", !isHeroVisible && "vip-content-hidden")}>
            <ConciergeBell size={26} className="vip-pill__icon" strokeWidth={1.5} />
            <div className="vip-pill__text-group">
              <h3 className="vip-pill__title">{config.title}</h3>
              <p className="vip-pill__desc">{config.description}</p>
            </div>
            <p className="vip-pill__explanation">{config.explanation}</p>
            
            <button className="btn btn--gold vip-pill__btn">
              {config.ctaText}
            </button>
            
            <div className="vip-pill__trust">
              <span className="trust-item"><Check size={12} /> Delivered instantly to WhatsApp</span>
              <span className="trust-item"><Check size={12} /> Takes less than 30 seconds</span>
              <span className="trust-item"><Check size={12} /> One reward per guest</span>
            </div>
          </div>
          
          <div className={cn("vip-content-compact", isHeroVisible && "vip-content-hidden")}>
            <Gift size={20} className="vip-pill-compact__icon" strokeWidth={1.5} />
            <span className="vip-pill-compact__text">Welcome Gift</span>
          </div>
        </div>
      </motion.div>

      {isModalOpen && (
        <Suspense fallback={null}>
          <AcquisitionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
