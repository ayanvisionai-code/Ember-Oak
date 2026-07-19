import { useState, lazy, Suspense } from 'react';
import { ConciergeBell, Check } from 'lucide-react';
import config from '../../data/vip-config.json';
import './AcquisitionWidget.css';

const AcquisitionModal = lazy(() => import('./AcquisitionModal'));

export default function AcquisitionWidget() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!config.enabled) return null;

  return (
    <>
      <div className="vip-widget-container">
        <div className="vip-pill" onClick={() => setIsModalOpen(true)}>
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
        </div>
      </div>

      {isModalOpen && (
        <Suspense fallback={null}>
          <AcquisitionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
