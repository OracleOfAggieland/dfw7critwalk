import { useEffect, useState } from 'react';
import { getCritWalksByEquipment } from '../../services/critWalk.service';
import { CritWalk } from '../../types/critWalk.types';
import { formatTimestamp } from '../../utils/dateHelpers';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ImageLightbox } from '../common/ImageLightbox';

interface CritWalkHistoryProps {
  equipmentId: string;
}

interface LightboxState {
  isOpen: boolean;
  images: string[];
  initialIndex: number;
}

export function CritWalkHistory({ equipmentId }: CritWalkHistoryProps) {
  const [critWalks, setCritWalks] = useState<CritWalk[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [lightbox, setLightbox] = useState<LightboxState>({
    isOpen: false,
    images: [],
    initialIndex: 0,
  });

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

  const openLightbox = (images: string[], index: number) => {
    setLightbox({
      isOpen: true,
      images,
      initialIndex: index,
    });
  };

  const closeLightbox = () => {
    setLightbox({
      isOpen: false,
      images: [],
      initialIndex: 0,
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
                {walk.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-200 h-48 bg-gray-100"
                    onClick={() =>
                      openLightbox(
                        walk.photos.map((p) => p.storageUrl),
                        index
                      )
                    }
                  >
                    <img
                      src={photo.storageUrl}
                      alt={`Crit walk photo ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                    {/* Overlay with magnifying glass icon */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center pointer-events-none">
                      <svg
                        className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Image Lightbox */}
      {lightbox.isOpen && (
        <ImageLightbox
          images={lightbox.images}
          initialIndex={lightbox.initialIndex}
          onClose={closeLightbox}
        />
      )}
    </div>
  );
}
