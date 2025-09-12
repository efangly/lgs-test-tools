'use client';

interface ConnectionStatusProps {
  connected: boolean;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ConnectionStatus({ connected, showText = true, size = 'md' }: ConnectionStatusProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-md',
    lg: 'text-lg'
  };

  return (
    <div className="flex items-center space-x-2">
      <div 
        className={`${sizeClasses[size]} rounded-full transition-colors duration-200 ${
          connected ? 'bg-success animate-pulse' : 'bg-error'
        }`}
        title={connected ? 'Connected' : 'Disconnected'}
      />
      {showText && (
        <span className={`${textSizeClasses[size]} transition-colors duration-200 ${
          connected ? 'text-success' : 'text-error'
        }`}>
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      )}
    </div>
  );
}
