import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import blogData from '../data/blog.json';
import './Blog.css';

export default function Blog() {
  const featuredArticle = blogData[0];
  const recentArticles = blogData.slice(1);

  return (
    <PageTransition className="blog-page">
      <div className="blog-header">
        <div className="container blog-header__content text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="blog-title"
          >
            Journal
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="blog-subtitle"
          >
            Stories, recipes, and news from our kitchen.
          </motion.p>
        </div>
      </div>

      <div className="container section-padding">
        
        {/* Featured Article */}
        {featuredArticle && (
          <motion.div 
            className="featured-article hover-lift"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="featured-article__img img-reveal-wrapper">
              <img src={featuredArticle.image} alt={featuredArticle.title} loading="lazy" />
            </div>
            <div className="featured-article__content">
              <span className="blog-category text-accent">{featuredArticle.category}</span>
              <h2 className="featured-article__title">{featuredArticle.title}</h2>
              <p className="featured-article__excerpt">{featuredArticle.excerpt}</p>
              
              <div className="blog-meta">
                <span><User size={14} /> {featuredArticle.author}</span>
                <span><Calendar size={14} /> {featuredArticle.date}</span>
                <span><Clock size={14} /> {featuredArticle.readTime}</span>
              </div>
              
              <button className="blog-read-more">
                Read Full Story <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Recent Articles Grid */}
        <div className="blog-grid mt-4">
          {recentArticles.map((article, index) => (
            <motion.div 
              key={article.id}
              className="blog-card hover-lift"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="blog-card__img img-reveal-wrapper">
                <img src={article.image} alt={article.title} loading="lazy" />
                <span className="blog-card__category">{article.category}</span>
              </div>
              <div className="blog-card__content">
                <h3 className="blog-card__title">{article.title}</h3>
                <p className="blog-card__excerpt">{article.excerpt}</p>
                
                <div className="blog-meta">
                  <span>{article.date}</span>
                  <span>{article.readTime}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </PageTransition>
  );
}
