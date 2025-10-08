import { StatusColor, getStatusColor, getStatusTextColor, getStatusBgClass } from '../../utils/statusCalculator';

interface StatusBadgeProps {
  status: StatusColor;
  size?: 'small' | 'medium' | 'large';
}

export function StatusBadge({ status, size = 'medium' }: StatusBadgeProps) {
  const sizeClasses = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-6 h-6'
  };

  const label = status === 'never' ? 'No Data' : status.toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <div className={`rounded-full ${getStatusColor(status)} ${sizeClasses[size]}`} />
      <span className={`text-sm font-medium ${getStatusTextColor(status)}`}>
        {label}
      </span>
    </div>
  );
}
