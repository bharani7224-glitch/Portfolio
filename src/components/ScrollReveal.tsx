import React, { useRef, useEffect, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right';
  duration?: number; // duration in ms
  delay?: number; // delay in ms
  threshold?: number; // trigger threshold
  rootMargin?: string;
  triggerOnce?: boolean; // false to fade out on scroll away
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  animation = 'fade-up',
  duration = 800,
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px 0px -8% 0px',
  triggerOnce = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  const style: React.CSSProperties = {
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
  };

  return (
    <div
      ref={ref}
      className={`scroll-reveal reveal-${animation} ${isVisible ? 'revealed' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};
