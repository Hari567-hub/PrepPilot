import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, glow = false, style, className = '', ...props }) => {
  return (
    <div 
      className={`glass-card ${className}`}
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--glass-border)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: glow ? '0 8px 32px 0 rgba(99, 102, 241, 0.15), var(--card-shadow)' : 'var(--card-shadow)',
        transition: 'all 0.3s ease',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};
export default GlassCard;
