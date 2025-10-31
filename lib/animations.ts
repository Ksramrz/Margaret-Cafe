import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Page transition animation
export const pageTransition = {
  enter: (element: HTMLElement) => {
    return gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }
    );
  },
  exit: (element: HTMLElement) => {
    return gsap.to(element, {
      opacity: 0,
      y: -30,
      duration: 0.5,
      ease: 'power3.in',
    });
  },
};

// Fade in animation
export const fadeIn = (
  element: HTMLElement | HTMLElement[],
  delay: number = 0,
  duration: number = 1
) => {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration,
      delay,
      ease: 'power2.out',
    }
  );
};

// Slide up animation
export const slideUp = (
  element: HTMLElement | HTMLElement[],
  delay: number = 0,
  duration: number = 1
) => {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 60,
    },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: 'power3.out',
    }
  );
};

// Scale in animation
export const scaleIn = (
  element: HTMLElement | HTMLElement[],
  delay: number = 0,
  duration: number = 0.8
) => {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      scale: 0.8,
    },
    {
      opacity: 1,
      scale: 1,
      duration,
      delay,
      ease: 'back.out(1.7)',
    }
  );
};

// Text reveal animation (split text effect)
export const textReveal = (element: HTMLElement, delay: number = 0) => {
  const text = element.textContent || '';
  element.innerHTML = '';
  const words = text.split(' ');
  
  words.forEach((word, i) => {
    const span = document.createElement('span');
    span.textContent = word + ' ';
    span.style.display = 'inline-block';
    span.style.opacity = '0';
    span.style.transform = 'translateY(20px)';
    element.appendChild(span);
    
    gsap.to(span, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      delay: delay + i * 0.05,
      ease: 'power2.out',
    });
  });
};

// Stagger animation for lists
export const staggerFadeIn = (
  elements: HTMLElement[],
  delay: number = 0.1
) => {
  return gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: 40,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: delay,
      ease: 'power2.out',
    }
  );
};

// Parallax effect
export const parallax = (
  element: HTMLElement,
  speed: number = 0.5
) => {
  return gsap.to(element, {
    yPercent: speed * 100,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
};

// Smooth scroll reveal
export const scrollReveal = (
  element: HTMLElement | HTMLElement[],
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  delay: number = 0
) => {
  const from: gsap.TweenVars = { opacity: 0 };
  
  switch (direction) {
    case 'up':
      from.y = 60;
      break;
    case 'down':
      from.y = -60;
      break;
    case 'left':
      from.x = 60;
      break;
    case 'right':
      from.x = -60;
      break;
  }

  return gsap.fromTo(
    element,
    from,
    {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 1,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    }
  );
};

// Floating animation
export const floating = (element: HTMLElement, duration: number = 3) => {
  return gsap.to(element, {
    y: -20,
    duration,
    ease: 'power1.inOut',
    yoyo: true,
    repeat: -1,
  });
};

// Magnetic effect for buttons
export const magnetic = (element: HTMLElement) => {
  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(element, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};

// Split text into lines/words/chars for advanced animations
export const splitText = (element: HTMLElement, type: 'lines' | 'words' | 'chars' = 'words') => {
  const text = element.textContent || '';
  const wrapper = document.createElement('div');
  wrapper.style.overflow = 'hidden';
  
  if (type === 'chars') {
    text.split('').forEach((char) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      wrapper.appendChild(span);
    });
  } else if (type === 'words') {
    text.split(' ').forEach((word, i) => {
      const span = document.createElement('span');
      span.textContent = word + (i < text.split(' ').length - 1 ? ' ' : '');
      span.style.display = 'inline-block';
      wrapper.appendChild(span);
    });
  } else {
    // lines (requires more complex logic)
    const lines = text.split('\n');
    lines.forEach((line) => {
      const div = document.createElement('div');
      div.textContent = line;
      wrapper.appendChild(div);
    });
  }
  
  element.innerHTML = '';
  element.appendChild(wrapper);
  return Array.from(wrapper.children) as HTMLElement[];
};

export default {
  pageTransition,
  fadeIn,
  slideUp,
  scaleIn,
  textReveal,
  staggerFadeIn,
  parallax,
  scrollReveal,
  floating,
  magnetic,
  splitText,
};

