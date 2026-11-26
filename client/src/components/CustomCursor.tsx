import React, { useState, useEffect, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState<string>('');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Only activate on devices with fine pointer (mouse)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    // Global listener for interactive hover targets
    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-cursor]') as HTMLElement | null;
      if (target) {
        const text = target.getAttribute('data-cursor') || '';
        setCursorText(text);
        setIsHovered(true);
      } else {
        const clickable = (e.target as HTMLElement).closest('button, a, input, textarea, [role="button"]');
        if (clickable) {
          setCursorText('');
          setIsHovered(true);
        } else {
          setCursorText('');
          setIsHovered(false);
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);

    // Spring physics render loop
    const render = () => {
      // Smooth lerp follow
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ willChange: 'transform' }}
    >
      {cursorText ? (
        // Morphed Pill Label
        <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#CCFF00] text-black font-['Plus_Jakarta_Sans'] font-extrabold text-[12px] uppercase tracking-wider shadow-[0_8px_25px_rgba(204,255,0,0.5)] transform scale-100 transition-transform duration-200">
          <span>{cursorText}</span>
          <span className="text-black font-mono">↗</span>
        </div>
      ) : (
        // Tactile Spring Dot / Halo
        <div
          className={`rounded-full transition-all duration-200 ${
            isHovered
              ? 'w-10 h-10 bg-[rgba(204,255,0,0.2)] border-2 border-[#CCFF00] scale-100'
              : 'w-3.5 h-3.5 bg-[#CCFF00] shadow-[0_0_15px_#CCFF00] scale-100'
          }`}
        />
      )}
    </div>
  );
};
