import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUser } from '../../contexts/UserContext';
import { createCritWalk } from '../../services/critWalk.service';
import { CritWalkFormData } from '../../types/critWalk.types';
import { PhotoUpload } from './PhotoUpload';
import { Button } from '../common/Button';

interface CritWalkFormProps {
  equipmentId: string;
  equipmentName: string;
  photoGuidelines?: string;
  onSuccess: () => void;
}

export function CritWalkForm({ equipmentId, equipmentName, photoGuidelines, onSuccess }: CritWalkFormProps) {
  const { userProfile } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [hasFailure, setHasFailure] = useState(false);

  const { register, handleSubmit, watch } = useForm<{ notes: string; workOrderNumber: string }>();

  const workOrderNumber = watch('workOrderNumber');

  const onSubmit = async (data: { notes: string; workOrderNumber: string }) => {
    if (photos.length === 0) {
      setError('Please upload at least one photo');
      return;
    }

    // Validate WO number if failure is flagged
    if (hasFailure && !data.workOrderNumber?.trim()) {
      setError('Work Order number is required when flagging a failure');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const critWalkData: CritWalkFormData = {
        equipmentId,
        notes: data.notes,
        photos,
        hasFailure,
        workOrderNumber: hasFailure ? data.workOrderNumber?.trim() : undefined
      };

      await createCritWalk(critWalkData, userProfile.name, equipmentName);
      onSuccess();
    } catch (err) {
      setError('Failed to create crit walk. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Photo Guidelines */}
      {photoGuidelines && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm font-medium text-brand-blue mb-1">📸 Photo Guidelines:</p>
          <p className="text-sm text-blue-800">{photoGuidelines}</p>
        </div>
      )}

      {/* Photo Upload - Primary action at top */}
      <PhotoUpload onPhotosSelected={setPhotos} />

      {/* Failure Detection Section */}
      <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
        <label className="block text-sm font-medium text-gray-900 mb-3">
          ⚠️ Failure Detected?
        </label>

        <div className="space-y-3">
          {/* Radio: No Issues */}
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              checked={!hasFailure}
              onChange={() => setHasFailure(false)}
              className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300"
            />
            <span className="ml-3 text-sm text-gray-700">
              No issues (equipment operating normally)
            </span>
          </label>

          {/* Radio: Issue Found */}
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              checked={hasFailure}
              onChange={() => setHasFailure(true)}
              className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300"
            />
            <span className="ml-3 text-sm text-gray-700 font-medium">
              Issue found - requires attention
            </span>
          </label>

          {/* Conditional Work Order Input */}
          {hasFailure && (
            <div className="mt-4 pl-7">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Work Order Number <span className="text-brand-red">*</span>
              </label>
              <input
                type="text"
                {...register('workOrderNumber', {
                  required: hasFailure
                })}
                className="input-field text-base"
                placeholder="WO-12345"
              />
              {hasFailure && !workOrderNumber && (
                <p className="mt-1 text-xs text-gray-500">
                  Enter the Work Order number associated with this issue
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes (optional)
        </label>
        <textarea
          {...register('notes')}
          rows={4}
          className="input-field text-base"
          placeholder="Add any observations or notes..."
        />
      </div>

      {/* Submit Button */}
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading || photos.length === 0} fullWidth>
          {loading ? 'Submitting...' : 'Complete Crit Walk'}
        </Button>
      </div>
    </form>
  );
}
