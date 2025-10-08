import logoImg from './logo.png';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onClick?: () => void;
}

export function Logo({ size = 'medium', className = '', onClick }: LogoProps) {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  return (
    <img
      src={logoImg}
      alt="DFW7 RME Logo"
      className={`${sizeClasses[size]} ${className}`}
      onClick={onClick}
    />
  );
}
