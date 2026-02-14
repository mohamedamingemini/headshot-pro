
import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  type?: 'website' | 'article';
  image?: string;
  imageAlt?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  canonicalUrl = 'https://proheadshot.ai/',
  type = 'website',
  // Default professional image for social sharing - forced to JPG
  image = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?fm=jpg&fit=crop&w=1200&h=630&q=80',
  imageAlt = 'Professional Headshot AI Preview'
}) => {
  const { language } = useLanguage();
  
  const siteTitle = 'ProHeadshot AI';
  const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} - Professional AI Headshot Generator`;
  
  const defaultDesc = language === 'ar' 
    ? 'حول صورك الشخصية إلى صور عمل احترافية في ثوانٍ باستخدام الذكاء الاصطناعي.'
    : 'Transform casual selfies into professional business headshots in seconds using Gemini AI. No studio required.';
    
  const metaDescription = description || defaultDesc;

  useEffect(() => {
    // Update Title
    document.title = fullTitle;

    // Helper to update or create meta tags
    const updateMeta = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Description
    updateMeta('description', metaDescription);

    // Canonical
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);

    // Open Graph
    updateMeta('og:type', type, 'property');
    updateMeta('og:title', fullTitle, 'property');
    updateMeta('og:description', metaDescription, 'property');
    updateMeta('og:site_name', siteTitle, 'property');
    updateMeta('og:url', canonicalUrl, 'property');
    
    // OG Image
    updateMeta('og:image', image, 'property');
    updateMeta('og:image:width', '1200', 'property');
    updateMeta('og:image:height', '630', 'property');
    updateMeta('og:image:type', 'image/jpeg', 'property');
    updateMeta('og:image:alt', imageAlt, 'property');

    // Twitter
    updateMeta('twitter:card', 'summary_large_image', 'name'); 
    updateMeta('twitter:title', fullTitle, 'name');
    updateMeta('twitter:description', metaDescription, 'name');
    updateMeta('twitter:image', image, 'name');
    updateMeta('twitter:image:alt', imageAlt, 'name');

    // Schema.org Structured Data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "ProHeadshot AI",
      "applicationCategory": "PhotographyApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": "AI-powered tool to generate professional headshots from selfies.",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1250"
      },
      "image": image
    };

    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

  }, [fullTitle, metaDescription, canonicalUrl, type, image, imageAlt]);

  return null;
};

export default SEO;
