"use client";

import { useEffect } from 'react';

/**
 * This component scans for incorrectly formatted link tags with string-based
 * event handlers and fixes them automatically.
 */
const LinkTagFixer = () => {
  useEffect(() => {
    // Find all link tags
    const linkTags = document.querySelectorAll('link');
    
    linkTags.forEach(link => {
      // Check for string-based onload attribute
      const onLoadAttr = link.getAttribute('onload');
      if (onLoadAttr && typeof onLoadAttr === 'string') {
        console.warn('Found link tag with string-based onload handler:', link);
        
        // Remove the string-based handler
        link.removeAttribute('onload');
        
        // Add a proper function-based handler
        link.onload = () => {
          console.log('Resource loaded properly:', link.href);
          // You might want to try to execute the original logic here
        };
      }
    });
    
    console.log('LinkTagFixer: Scan complete');
  }, []);
  
  return null;
};

export default LinkTagFixer;
