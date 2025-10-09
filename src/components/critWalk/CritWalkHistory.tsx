import { useEffect, useState } from 'react';
import { getCritWalksByEquipment, updateCritWalkFailureStatus, addCritWalkComment, updateCritWalkFailureDetails } from '../../services/critWalk.service';
import { CritWalk } from '../../types/critWalk.types';
import { formatTimestamp } from '../../utils/dateHelpers';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ImageLightbox } from '../common/ImageLightbox';
import { useUser } from '../../contexts/UserContext';
import { Button } from '../common/Button';

interface CritWalkHistoryProps {
  equipmentId: string;
}

interface LightboxState {
  isOpen: boolean;
  images: string[];
  initialIndex: number;
}

export function CritWalkHistory({ equipmentId }: CritWalkHistoryProps) {
  const { userProfile } = useUser();
  const [critWalks, setCritWalks] = useState<CritWalk[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [commentText, setCommentText] = useState<Map<string, string>>(new Map());
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [editingIds, setEditingIds] = useState<Set<string>>(new Set());
  const [editValues, setEditValues] = useState<Map<string, { hasFailure: boolean; workOrderNumber: string }>>(new Map());
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

  const handleResolveFailure = async (walkId: string) => {
    setProcessingIds(prev => new Set(prev).add(walkId));
    try {
      await updateCritWalkFailureStatus(equipmentId, walkId, userProfile.name);
      await loadCritWalks(); // Reload to get updated data
    } catch (error) {
      console.error('Error resolving failure:', error);
      alert('Failed to resolve failure. Please try again.');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(walkId);
        return newSet;
      });
    }
  };

  const handleAddComment = async (walkId: string) => {
    const text = commentText.get(walkId)?.trim();
    if (!text) return;

    setProcessingIds(prev => new Set(prev).add(walkId));
    try {
      await addCritWalkComment(equipmentId, walkId, text, userProfile.name);

      // Clear the comment text
      setCommentText(prev => {
        const newMap = new Map(prev);
        newMap.delete(walkId);
        return newMap;
      });

      await loadCritWalks(); // Reload to get updated data
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(walkId);
        return newSet;
      });
    }
  };

  const updateCommentText = (walkId: string, text: string) => {
    setCommentText(prev => {
      const newMap = new Map(prev);
      newMap.set(walkId, text);
      return newMap;
    });
  };

  const startEditing = (walk: CritWalk) => {
    setEditingIds(prev => new Set(prev).add(walk.id));
    setEditValues(prev => {
      const newMap = new Map(prev);
      newMap.set(walk.id, {
        hasFailure: walk.hasFailure,
        workOrderNumber: walk.workOrderNumber || ''
      });
      return newMap;
    });
  };

  const cancelEditing = (walkId: string) => {
    setEditingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(walkId);
      return newSet;
    });
    setEditValues(prev => {
      const newMap = new Map(prev);
      newMap.delete(walkId);
      return newMap;
    });
  };

  const saveEdit = async (walkId: string) => {
    const values = editValues.get(walkId);
    if (!values) return;

    setProcessingIds(prev => new Set(prev).add(walkId));
    try {
      await updateCritWalkFailureDetails(
        equipmentId,
        walkId,
        values.hasFailure,
        values.workOrderNumber.trim() || null
      );

      setEditingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(walkId);
        return newSet;
      });

      await loadCritWalks(); // Reload to get updated data
    } catch (error) {
      console.error('Error saving edit:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(walkId);
        return newSet;
      });
    }
  };

  const updateEditValue = (walkId: string, field: 'hasFailure' | 'workOrderNumber', value: boolean | string) => {
    setEditValues(prev => {
      const newMap = new Map(prev);
      const current = newMap.get(walkId) || { hasFailure: false, workOrderNumber: '' };
      newMap.set(walkId, {
        ...current,
        [field]: value
      });
      return newMap;
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
        const isProcessing = processingIds.has(walk.id);
        const isResolved = walk.hasFailure && walk.failureResolvedAt != null;
        const isEditing = editingIds.has(walk.id);
        const editValue = editValues.get(walk.id);
        const isManager = userProfile.role === 'manager';

        return (
          <div key={walk.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">{walk.technicianName}</p>
                  {walk.hasFailure && !isResolved && (
                    <span className="text-brand-red font-bold" title="Flagged failure">
                      🚨 FLAGGED
                    </span>
                  )}
                  {isResolved && (
                    <span className="text-green-600 font-bold" title="Resolved">
                      ✓ RESOLVED
                    </span>
                  )}
                </div>
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

            {/* Work Order Info - View Mode */}
            {!isEditing && walk.workOrderNumber && (
              <div className={`mb-3 px-3 py-2 rounded-md ${
                walk.hasFailure
                  ? (isResolved ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200')
                  : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      walk.hasFailure
                        ? (isResolved ? 'text-green-700' : 'text-brand-red')
                        : 'text-gray-700'
                    }`}>
                      {walk.hasFailure ? '⚠️ Issue:' : '🔧 Referenced:'} Work Order {walk.workOrderNumber}
                    </p>
                    {isResolved && walk.failureResolvedAt && (
                      <p className="text-xs text-green-600 mt-1">
                        Resolved by {walk.failureResolvedBy} on {formatTimestamp(walk.failureResolvedAt)}
                      </p>
                    )}
                  </div>
                  {isManager && !isResolved && (
                    <button
                      onClick={() => startEditing(walk)}
                      className="ml-2 text-xs text-brand-blue hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Failure Info - Edit Mode (Managers Only) */}
            {isEditing && isManager && editValue && (
              <div className="mb-3 px-3 py-3 rounded-md bg-blue-50 border border-blue-200">
                <p className="text-xs font-medium text-gray-700 mb-2">Edit Failure Details</p>

                {/* Toggle Failure Flag */}
                <div className="mb-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editValue.hasFailure}
                      onChange={(e) => updateEditValue(walk.id, 'hasFailure', e.target.checked)}
                      className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      This crit walk has a failure
                    </span>
                  </label>
                </div>

                {/* Work Order Number */}
                {editValue.hasFailure && (
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Work Order Number
                    </label>
                    <input
                      type="text"
                      value={editValue.workOrderNumber}
                      onChange={(e) => updateEditValue(walk.id, 'workOrderNumber', e.target.value)}
                      className="input-field text-sm w-full"
                      placeholder="WO-12345"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => saveEdit(walk.id)}
                    disabled={isProcessing}
                    variant="primary"
                    fullWidth={false}
                  >
                    {isProcessing ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    onClick={() => cancelEditing(walk.id)}
                    disabled={isProcessing}
                    variant="secondary"
                    fullWidth={false}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {walk.notes && (
              <p className="text-sm text-gray-700 mb-3">{walk.notes}</p>
            )}

            {/* Collapsible photo grid */}
            {isExpanded && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
                {walk.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 aspect-square bg-gray-100"
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
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 z-0"
                    />
                    {/* Overlay with magnifying glass icon */}
                    <div className="absolute inset-0 group-hover:bg-black group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center pointer-events-none z-10">
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

            {/* Comments Section */}
            {walk.comments && walk.comments.length > 0 && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">💬 Comments ({walk.comments.length})</p>
                <div className="space-y-2">
                  {walk.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-md p-3">
                      <p className="text-xs text-gray-600 mb-1">
                        {comment.createdBy} - {formatTimestamp(comment.createdAt)}
                      </p>
                      <p className="text-sm text-gray-800">{comment.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {walk.workOrderNumber && (
              <div className="mt-4 border-t border-gray-200 pt-4 space-y-3">
                {/* Mark as Resolved Button */}
                {walk.hasFailure && !isResolved && (
                  <Button
                    onClick={() => handleResolveFailure(walk.id)}
                    disabled={isProcessing}
                    variant="secondary"
                    fullWidth
                  >
                    {isProcessing ? 'Resolving...' : '✓ Mark as Resolved'}
                  </Button>
                )}

                {/* Add Comment */}
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentText.get(walk.id) || ''}
                      onChange={(e) => updateCommentText(walk.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isProcessing) {
                          handleAddComment(walk.id);
                        }
                      }}
                      placeholder="Add a comment..."
                      className="input-field text-sm flex-1"
                      disabled={isProcessing}
                    />
                    <Button
                      onClick={() => handleAddComment(walk.id)}
                      disabled={isProcessing || !commentText.get(walk.id)?.trim()}
                      variant="primary"
                    >
                      {isProcessing ? '...' : '💬'}
                    </Button>
                  </div>
                </div>
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
