import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import menuData from '../data/menu.json';
import './Menu.css';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...menuData.categories];

  const filteredItems = menuData.items.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageTransition className="menu-page">
      <div className="menu-header">
        <div className="menu-header__overlay"></div>
        <div className="container menu-header__content text-center">
          <span className="editorial-label text-white">Culinary Arts</span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="menu-title"
          >
            The Menu
          </motion.h1>
        </div>
      </div>

      <div className="container menu-main section-padding">
        
        {/* Sticky Filter Bar */}
        <div className="menu-controls">
          <div className="menu-categories">
            {categories.map(category => (
              <button
                key={category}
                className={`menu-category-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="menu-search">
            <Search size={16} className="menu-search-icon" />
            <input 
              type="text" 
              placeholder="Search our offerings..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Editorial Menu List */}
        <motion.div layout className="menu-list">
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="menu-item-row hover-lift"
              >
                <div className="menu-item-image">
                  <img src={item.image} alt={item.name} loading="lazy" />
                </div>
                <div className="menu-item-info">
                  <div className="menu-item-header">
                    <h3 className="menu-item-name">{item.name}</h3>
                    <div className="menu-leader"></div>
                    <div className="menu-item-price">${item.price}</div>
                  </div>
                  <p className="menu-item-desc">{item.description}</p>
                  <div className="menu-item-tags">
                    {item.tags.map(tag => (
                      <span key={tag} className={`menu-tag ${tag.toLowerCase().replace(' ', '-')}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button className="menu-item-add" aria-label="Add to order">
                  <Plus size={20} className="plus-icon" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredItems.length === 0 && (
          <div className="menu-empty text-center">
            <p>No offerings found matching your criteria.</p>
            <button className="btn btn--secondary mt-4" onClick={() => {setSearchQuery(''); setActiveCategory('All');}}>
              Reset Filters
            </button>
          </div>
        )}

        {/* Mid-Menu Conversion Prompt */}
        <motion.div 
          className="menu-conversion-prompt text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Calendar size={32} className="text-accent mx-auto mb-4" />
          <h2>Taste the Excellence</h2>
          <p>The true essence of our dishes can only be experienced in person.</p>
          <Link to="/contact" className="btn btn--primary pulse-btn mt-4">Book Your Table Now</Link>
        </motion.div>

      </div>
    </PageTransition>
  );
}
