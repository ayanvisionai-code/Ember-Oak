import { useState, lazy, Suspense } from 'react';
import { Gift } from 'lucide-react';
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
          <Gift size={24} className="vip-pill__icon" />
          <h3 className="vip-pill__title">{config.title}</h3>
          <p className="vip-pill__desc">{config.description}</p>
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
