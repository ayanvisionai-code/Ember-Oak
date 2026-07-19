import { useState, useEffect } from 'react';
import { MessageCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import './FloatingActionButtons.css';

export default function FloatingActionButtons() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling down 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fab-container ${isVisible ? 'fab-container--visible' : ''}`}>
      <Link to="/contact" className="fab fab--primary" title="Reserve a Table">
        <Calendar size={24} />
      </Link>
      <a href="https://wa.me/12125550199" target="_blank" rel="noreferrer" className="fab fab--whatsapp" title="WhatsApp Us">
        <MessageCircle size={24} />
      </a>
    </div>
  );
}
