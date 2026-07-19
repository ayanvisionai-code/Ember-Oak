import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { InstagramIcon, FacebookIcon, TwitterIcon } from './Icons';
import restaurantInfo from '../data/restaurant-info.json';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__container">
        
        <div className="footer__brand">
          <h2 className="footer__logo">{restaurantInfo.name}</h2>
          <p className="footer__tagline">{restaurantInfo.tagline}</p>
          <div className="footer__socials">
            <a href={restaurantInfo.socials.instagram} target="_blank" rel="noreferrer"><InstagramIcon size={20} /></a>
            <a href={restaurantInfo.socials.facebook} target="_blank" rel="noreferrer"><FacebookIcon size={20} /></a>
            <a href={restaurantInfo.socials.twitter} target="_blank" rel="noreferrer"><TwitterIcon size={20} /></a>
          </div>
        </div>

        <div className="footer__links-group">
          <h3 className="footer__title">Navigation</h3>
          <ul className="footer__links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer__contact">
          <h3 className="footer__title">Contact Us</h3>
          <ul className="footer__contact-list">
            <li>
              <MapPin size={18} />
              <span>{restaurantInfo.address}</span>
            </li>
            <li>
              <Phone size={18} />
              <a href={`tel:${restaurantInfo.phone.replace(/[^0-9]/g, '')}`}>{restaurantInfo.phone}</a>
            </li>
            <li>
              <Mail size={18} />
              <a href={`mailto:${restaurantInfo.email}`}>{restaurantInfo.email}</a>
            </li>
          </ul>
        </div>

        <div className="footer__newsletter">
          <h3 className="footer__title">Newsletter</h3>
          <p>Subscribe for seasonal updates and exclusive tasting events.</p>
          <form className="footer__form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" required className="footer__input" autoComplete="email" />
            <button type="submit" className="btn btn--primary">Subscribe</button>
          </form>
        </div>

      </div>
      
      <div className="footer__bottom">
        <div className="container footer__bottom-container">
          <p>&copy; {new Date().getFullYear()} {restaurantInfo.name}. All rights reserved.</p>
          <div className="footer__legal">
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
