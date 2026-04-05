import React from 'react';

interface LogoProps {
  className?: string;
  showBackground?: boolean;
}

export default function Logo({ className = "", showBackground = true }: LogoProps) {
  return (
    <div className={`flex flex-col items-center justify-center font-sans tracking-tighter leading-none ${showBackground ? 'bg-black p-2 rounded-xl' : ''} ${className}`}>
      <div className="flex flex-col items-center">
        <span className="text-4xl font-black text-white tracking-[-0.05em]">10</span>
        <span className="text-4xl font-black text-white tracking-[-0.05em] -mt-2">01</span>
      </div>
      <span className="text-xl font-medium text-white mt-1 tracking-tight">Labs</span>
    </div>
  );
}
