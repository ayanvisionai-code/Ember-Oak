import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import './About.css';

export default function About() {
  return (
    <PageTransition className="about-page">
      <div className="about-hero">
        <div className="about-hero__overlay"></div>
        <div className="container about-hero__content text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="about-title"
          >
            Our Story
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="about-subtitle"
          >
            A legacy of culinary excellence.
          </motion.p>
        </div>
      </div>

      <section className="about-story section-padding">
        <div className="container">
          <div className="story-grid">
            <motion.div 
              className="story-content"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="story-title">A Vision Realized</h2>
              <p>
                Founded in 2012, Ember & Oak was born out of a passion for authentic flavors and a desire to create a dining space that feels both luxurious and intimate. 
              </p>
              <p>
                Our journey began with a simple belief: that food should not just nourish the body, but also elevate the soul. Over the years, we have cultivated relationships with local farmers, artisans, and purveyors to ensure that only the finest ingredients enter our kitchen.
              </p>
            </motion.div>
            
            <motion.div 
              className="story-images"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80" alt="Restaurant interior" className="img-main hover-lift" loading="lazy" />
              <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=500&q=80" alt="Plated food" className="img-sub hover-lift" loading="lazy" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="about-chef section-padding bg-soft">
        <div className="container">
          <div className="chef-grid">
            <motion.div 
              className="chef-image img-reveal-wrapper"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80" alt="Chef Marcus Thorne" loading="lazy" />
            </motion.div>
            
            <motion.div 
              className="chef-content"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-accent">Executive Chef</span>
              <h2 className="chef-name">Marcus Thorne</h2>
              <p className="chef-bio">
                With over two decades of experience in Michelin-starred kitchens across Europe and North America, Chef Marcus brings a wealth of knowledge and an uncompromising standard of quality to Ember & Oak.
              </p>
              <p className="chef-bio">
                His culinary philosophy centers on respecting the ingredient, utilizing modern techniques to highlight natural flavors without masking them. 
              </p>
              
              <div className="chef-awards">
                <div className="award">
                  <h4 className="text-accent">2023</h4>
                  <p>James Beard Award Nominee</p>
                </div>
                <div className="award">
                  <h4 className="text-accent">2021</h4>
                  <p>Culinary Innovator of the Year</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="about-gallery section-padding">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">The Ambiance</h2>
            <p className="section-desc">Designed to provide a serene escape from the bustling city.</p>
          </div>
          
          <div className="gallery-grid">
            <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80" alt="Gallery 1" className="hover-lift" loading="lazy" />
            <img src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=600&q=80" alt="Gallery 2" className="hover-lift" loading="lazy" />
            <img src="https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=600&q=80" alt="Gallery 3" className="hover-lift" loading="lazy" />
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
