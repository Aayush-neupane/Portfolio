import { useState, useEffect } from 'react';

export const useScrollActive = (sectionIds) => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    // Function to determine active section
    const determineActiveSection = () => {
      const scrollPosition = window.scrollY + 120; // Increased offset for header
      
      // Special case: at the very top of the page
      if (window.scrollY < 100) {
        setActiveSection('home');
        return;
      }

      // Check each section
      for (const sectionId of sectionIds) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(sectionId);
            return;
          }
        }
      }

      // If no section is found (e.g., at the bottom), set the last section
      const lastSection = document.getElementById(sectionIds[sectionIds.length - 1]);
      if (lastSection && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 100) {
        setActiveSection(sectionIds[sectionIds.length - 1]);
      }
    };

    // Run immediately on mount
    determineActiveSection();

    // Add scroll event listener
    window.addEventListener('scroll', determineActiveSection);
    
    // Add resize event listener to recalculate on window resize
    window.addEventListener('resize', determineActiveSection);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', determineActiveSection);
      window.removeEventListener('resize', determineActiveSection);
    };
  }, [sectionIds]);

  return activeSection;
};