
export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    // Offset for header height
    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    // Remove the pushState that was causing page refresh issues
    // window.history.pushState(null, '', `#${sectionId}`);
  } else {
    console.log(`Element with id ${sectionId} not found`);
  }
};

export const setupSmoothScrolling = () => {
  // Store references to event listeners so we can remove them later
  const clickListeners = new Map();
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // Create the event listener function
    const clickHandler = function(e: Event) {
      e.preventDefault();
      const href = (this as HTMLAnchorElement).getAttribute('href');
      
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        scrollToSection(targetId);
      }
    };
    
    // Store reference to the listener
    clickListeners.set(anchor, clickHandler);
    
    // Add the event listener
    anchor.addEventListener('click', clickHandler);
  });
  
  // Return cleanup function
  return () => {
    clickListeners.forEach((listener, anchor) => {
      anchor.removeEventListener('click', listener);
    });
  };
};
