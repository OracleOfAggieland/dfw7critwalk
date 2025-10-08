import { useEffect, useState } from 'react';
import { getCritWalksByEquipment } from '../../services/critWalk.service';
import { CritWalk } from '../../types/critWalk.types';
import { formatTimestamp } from '../../utils/dateHelpers';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface CritWalkHistoryProps {
  equipmentId: string;
}

export function CritWalkHistory({ equipmentId }: CritWalkHistoryProps) {
  const [critWalks, setCritWalks] = useState<CritWalk[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCritWalks();
  }, [equipmentId]);

  const loadCritWalks = async () => {
    try {
      const walks = await getCritWalksByEquipment(equipmentId);
      setCritWalks(walks);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (loading) return <LoadingSpinner />;

  if (critWalks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No crit walks completed yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {critWalks.map(walk => {
        const isExpanded = expandedIds.has(walk.id);

        return (
          <div key={walk.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{walk.technicianName}</p>
                <p className="text-sm text-gray-600">
                  {formatTimestamp(walk.completedAt)}
                </p>
              </div>
              <button
                onClick={() => toggleExpanded(walk.id)}
                className="px-3 py-1 bg-blue-100 text-brand-blue text-sm rounded hover:bg-blue-200 transition min-h-[44px] md:min-h-0 md:px-2 md:py-1"
              >
                {walk.photos.length} photo{walk.photos.length !== 1 ? 's' : ''} {isExpanded ? '▲' : '▼'}
              </button>
            </div>

            {walk.notes && (
              <p className="text-sm text-gray-700 mb-3">{walk.notes}</p>
            )}

            {/* Collapsible photo grid */}
            {isExpanded && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                {walk.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo.storageUrl}
                    alt={`Crit walk photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition"
                    onClick={() => window.open(photo.storageUrl, '_blank')}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
