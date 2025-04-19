
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
    
    // Add hash to URL without causing a page jump
    window.history.pushState(null, '', `#${sectionId}`);
  } else {
    console.log(`Element with id ${sectionId} not found`);
  }
};

export const setupSmoothScrolling = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        scrollToSection(targetId);
      }
    });
  });
};
