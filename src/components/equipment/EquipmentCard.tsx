import { Equipment, EquipmentStatus } from '../../types/equipment.types';
import { formatTimeAgo } from '../../utils/dateHelpers';
import { calculateStatus, getStatusBorderColor, getStatusBgClass } from '../../utils/statusCalculator';

interface EquipmentCardProps {
  equipment: Equipment;
  status: EquipmentStatus | null;
  onClick: () => void;
}

export function EquipmentCard({ equipment, status, onClick }: EquipmentCardProps) {
  const currentStatus = status ? calculateStatus(status.lastCritWalkAt) : 'never';
  const borderColor = getStatusBorderColor(currentStatus);
  const bgColor = getStatusBgClass(currentStatus);
  const hasActiveFailure = status?.hasActiveFailure || false;
  const activeFailureCount = status?.activeFailureCount || 0;

  return (
    <div
      onClick={onClick}
      className={`card-hover border-l-8 ${borderColor} ${bgColor} min-h-[120px] cursor-pointer`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg md:text-base font-bold text-gray-900">{equipment.name}</h3>
            {hasActiveFailure && (
              <span className="text-brand-red text-lg" title="Active failure">
                🚨
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{equipment.location}</p>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-4 line-clamp-2">{equipment.description}</p>

      {/* Failure Warning */}
      {hasActiveFailure && (
        <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm font-medium text-brand-red">
            ⚠️ {activeFailureCount} unresolved issue{activeFailureCount !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">
          {equipment.category}
        </span>
        {status?.lastCritWalkAt && (
          <span className="text-gray-600">
            Last: {formatTimeAgo(status.lastCritWalkAt)}
          </span>
        )}
        {!status?.lastCritWalkAt && (
          <span className="text-gray-400 italic">No walks yet</span>
        )}
      </div>
    </div>
  );
}
