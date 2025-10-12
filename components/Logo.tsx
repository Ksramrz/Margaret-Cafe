import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Coffee } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  textColor?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '', textColor = 'text-cafe-green' }) => {
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedLogo = localStorage.getItem('siteLogo');
    if (savedLogo) {
      setLogoUrl(savedLogo);
    }
  }, []);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Margaret Café Logo */}
      <div className={`${sizeClasses[size]} relative`}>
        {isClient && logoUrl ? (
          <img
            src={logoUrl}
            alt="Margaret Café"
            className={`${sizeClasses[size]} object-contain`}
            onError={() => setLogoUrl('')}
          />
        ) : (
          <div className={`${sizeClasses[size]} bg-cafe-green rounded-full flex items-center justify-center`}>
            <Coffee className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'} text-white`} />
          </div>
        )}
      </div>
      
      {showText && (
        <div>
          <h1 className={`${textSizeClasses[size]} font-bold ${textColor}`}>
            Margaret Café
          </h1>
          {size !== 'sm' && (
            <p className="text-xs text-gray-600">Since 2022</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
