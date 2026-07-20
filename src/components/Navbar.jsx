import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from './Icons';
import { cn } from '../utils/cn';
import restaurantInfo from '../data/restaurant-info.json';
import './Navbar.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Menu', path: '/menu' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={cn('navbar', isScrolled ? 'navbar--scrolled glass' : '', isMobileMenuOpen && 'navbar--open')}>
      <div className="navbar__container container">
        <Link to="/" className="navbar__logo">
          {restaurantInfo.name}
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar__desktop">
          <ul className="navbar__links">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  to={link.path} 
                  className={cn('navbar__link', location.pathname === link.path && 'navbar__link--active')}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="navbar__actions">
            <Link to="/contact" className="btn btn--secondary pulse-btn">Reserve a Table</Link>
            <Link to="/menu" className="btn btn--primary">Order Online</Link>
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="navbar__mobile-toggle" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={cn('navbar__mobile-menu', isMobileMenuOpen && 'navbar__mobile-menu--open')}>
        <ul className="navbar__mobile-links">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link 
                to={link.path} 
                className={cn('navbar__mobile-link', location.pathname === link.path && 'navbar__mobile-link--active')}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="navbar__mobile-actions">
          <Link to="/contact" className="btn btn--secondary btn--full pulse-btn">Reserve a Table</Link>
          <Link to="/menu" className="btn btn--primary btn--full">Order Online</Link>
          
          <div className="navbar__mobile-socials">
            <a href={restaurantInfo.socials.instagram} target="_blank" rel="noreferrer"><InstagramIcon size={24} /></a>
            <a href={restaurantInfo.socials.facebook} target="_blank" rel="noreferrer"><FacebookIcon size={24} /></a>
            <a href={`tel:${restaurantInfo.phone.replace(/[^0-9]/g, '')}`}><Phone /></a>
          </div>
        </div>
      </div>
    </header>
  );
}
