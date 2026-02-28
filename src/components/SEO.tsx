import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  image?: string;
  type?: 'website' | 'article';
}

export default function SEO({ 
  title = 'Mohamed Farid Amin - Portfolio', 
  description = 'Operations Senior Supervisor with over 10 years of experience in telecommunications, loyalty programs, and shopping mall operations.', 
  canonicalUrl,
  image = 'https://i.postimg.cc/ppKrWFP5/Personal-photo2.png',
  type = 'website'
}: SEOProps) {
  useEffect(() => {
    // Update the document title
    document.title = title.includes('Mohamed Farid Amin') ? title : `${title} | Mohamed Farid Amin`;

    // Update or create the meta description tag
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update or create the canonical link tag
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    
    // Construct the canonical URL using the current origin and provided path
    const finalCanonicalUrl = canonicalUrl || window.location.href;
    linkCanonical.setAttribute('href', finalCanonicalUrl);

    // Add Open Graph tags for better social media sharing
    const setMetaTag = (property: string, content: string) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    };

    setMetaTag('og:title', title);
    setMetaTag('og:description', description);
    setMetaTag('og:url', finalCanonicalUrl);
    setMetaTag('og:image', image);
    setMetaTag('og:type', type);

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);

  }, [title, description, canonicalUrl, image, type]);

  return null;
}
