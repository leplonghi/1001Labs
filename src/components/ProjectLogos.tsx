import React from 'react';

interface LogoProps {
  className?: string;
}

export const HoraMedLogo = ({ className = "" }: LogoProps) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="12" />
    <path d="M100 60V140M60 100H140" stroke="#EF4444" strokeWidth="20" strokeLinecap="round" />
    <path d="M100 100L130 130" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
  </svg>
);

export const ArenaCupLogo = ({ className = "" }: LogoProps) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 160C40 160 40 60 100 60C160 60 160 160 160 160" stroke="currentColor" strokeWidth="12" />
    <path d="M70 160V100M100 160V80M130 160V100" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    <path d="M80 40L100 20L120 40" stroke="#F59E0B" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DoughLabLogo = ({ className = "" }: LogoProps) => (
  <svg viewBox="0 0 800 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Bowl */}
    <path d="M20 50C20 85 60 110 100 110C140 110 180 85 180 50H20Z" fill="white" stroke="#111827" strokeWidth="6" />
    <path d="M35 65C35 85 60 100 100 100" stroke="#78C878" strokeWidth="4" strokeLinecap="round" />
    <path d="M50 110H150" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
    
    {/* Drop */}
    <path d="M100 5C115 25 100 45 100 45C100 45 85 25 100 5Z" fill="#78C878" />
    
    {/* Text */}
    <text x="200" y="85" fontFamily="sans-serif" fontWeight="900" fontSize="72" fill="#111827" style={{ letterSpacing: '-0.05em' }}>DoughLab</text>
    <text x="580" y="85" fontFamily="sans-serif" fontWeight="400" fontSize="72" fill="#78C878">Pro</text>
  </svg>
);

export const GuataLogo = ({ className = "" }: LogoProps) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 20C66.86 20 40 46.86 40 80C40 125 100 180 100 180C100 180 160 125 160 80C160 46.86 133.14 20 100 20Z" stroke="#6366F1" strokeWidth="12" />
    <circle cx="100" cy="80" r="25" stroke="#6366F1" strokeWidth="8" />
  </svg>
);
