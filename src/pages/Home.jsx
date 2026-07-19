import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, Flame } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import menuData from '../data/menu.json';
import testimonialsData from '../data/testimonials.json';
import './Home.css';

export default function Home() {
  const featuredDishes = menuData.items.filter(item => item.tags.includes('Popular')).slice(0, 3);
  
  return (
    <PageTransition className="home">
      {/* Urgency Banner */}
      <div className="urgency-banner glass-dark text-center">
        <Flame size={16} className="text-accent" />
        <p><strong>High Demand:</strong> Only 4 tables left for this weekend. <Link to="/contact" className="text-accent">Reserve yours now.</Link></p>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero__background">
          <img 
            src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1920&q=80" 
            alt="Ember & Oak Interior" 
            className="hero__image"
          />
          <div className="hero__overlay"></div>
        </div>
        
        <div className="hero__content container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero__badge glass">
              <Star size={16} className="text-accent" />
              <span>4.9/5 from 1,200+ Reviews</span>
            </div>
            
            <h1 className="hero__title">
              A Symphony of <br />
              <span className="text-accent font-italic">Taste</span> & Elegance
            </h1>
            
            <p className="hero__subtitle">
              Experience the pinnacle of modern gastronomy. Secure your table for an unforgettable culinary journey tonight.
            </p>
            
            <div className="hero__actions">
              <Link to="/contact" className="btn btn--primary btn--large pulse-btn">Reserve a Table</Link>
              <Link to="/menu" className="btn btn--secondary hero__btn-secondary btn--large">View Menu</Link>
            </div>
            
            <div className="hero__info">
              <Clock size={18} />
              <span>Open Today until 11:30 PM</span>
              <span className="hero__dot">•</span>
              <span className="hero__availability text-accent">Limited Walk-ins Available</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Dishes - Asymmetrical Grid */}
      <section className="featured section-padding">
        <div className="container">
          <div className="section-header text-center">
            <span className="editorial-label">Curated Selection</span>
            <h2 className="section-title">Culinary Masterpieces</h2>
            <p className="section-desc">Our most celebrated dishes, requested daily by our distinguished guests.</p>
          </div>
          
          <div className="featured__asym-grid">
            {featuredDishes.map((dish, index) => (
              <motion.div 
                key={dish.id}
                className={`featured__card-premium offset-${index % 3}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="featured__img-premium img-reveal-wrapper">
                  <img src={dish.image} alt={dish.name} loading="lazy" />
                  <div className="featured__price-tag">${dish.price}</div>
                </div>
                <div className="featured__content-premium text-center">
                  <h3 className="featured__name-premium">{dish.name}</h3>
                  <p className="featured__desc-premium">{dish.description}</p>
                  <Link to="/menu" className="featured__link-premium text-accent">
                    Order Online <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-4">
             <Link to="/contact" className="btn btn--secondary">Book a Table to Taste</Link>
          </div>
        </div>
      </section>

      {/* Philosophy / About Preview */}
      <section className="philosophy">
        <div className="philosophy__container container">
          <motion.div 
            className="philosophy__image-wrapper"
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            whileInView={{ clipPath: 'inset(0 0 0 0)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="img-reveal-wrapper h-100">
              <img 
                src="https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1000&q=80" 
                alt="Chef plating a dish" 
                loading="lazy" 
                className="parallax-img"
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="philosophy__content"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="editorial-label">Our Philosophy</span>
            <h2 className="philosophy__title">Rooted in Tradition,<br/>Crafted for Tomorrow.</h2>
            <p className="philosophy__desc">
              Every dish tells a story. We believe in honoring the purity of natural ingredients through meticulous preparation and innovative techniques. Experience dining that is both an art form and a celebration.
            </p>
            
            <ul className="philosophy__list">
              <li>
                <div className="philosophy__list-icon"></div>
                <div>
                  <strong>Premium Ingredients</strong>
                  <p>Sourced locally from trusted organic farms daily.</p>
                </div>
              </li>
              <li>
                <div className="philosophy__list-icon"></div>
                <div>
                  <strong>Award-Winning Chefs</strong>
                  <p>Culinary experts with decades of global experience.</p>
                </div>
              </li>
            </ul>
            
            <Link to="/about" className="btn btn--secondary mt-4">Discover Our Story</Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials - Social Proof */}
      <section className="testimonials section-padding bg-soft">
        <div className="container">
          <div className="section-header text-center">
            <span className="editorial-label">Guest Experiences</span>
            <h2 className="section-title">Words from Our Guests</h2>
            <p className="section-desc">Join the thousands who have made unforgettable memories with us.</p>
          </div>
          
          <div className="testimonials__slider-container">
            <div className="testimonials__slider">
              {[...testimonialsData, ...testimonialsData].map((review, index) => (
                <div 
                  key={`${review.id}-${index}`}
                  className="testimonial-card glass hover-glow"
                >
                  <div className="testimonial-card__stars">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" className="text-accent" />
                    ))}
                  </div>
                  <p className="testimonial-card__text">"{review.text}"</p>
                  <div className="testimonial-card__author">
                    <img src={review.avatar} alt={review.author} loading="lazy" />
                    <div>
                      <h4>{review.author}</h4>
                      <span>{review.source} • {review.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - High Conversion */}
      <section className="final-cta">
        <div className="final-cta__overlay"></div>
        <div className="container final-cta__content text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="editorial-label text-white">Don't Miss Out</span>
            <h2>Ready for an Unforgettable Evening?</h2>
            <p className="mb-lg">Our tables fill up quickly. Secure your reservation now to guarantee your experience.</p>
            <Link to="/contact" className="btn btn--primary btn--large pulse-btn">Reserve Your Table Today</Link>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
