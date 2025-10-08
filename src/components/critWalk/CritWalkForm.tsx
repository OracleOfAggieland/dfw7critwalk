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

  const { register, handleSubmit } = useForm<{ notes: string }>();

  const onSubmit = async (data: { notes: string }) => {
    if (photos.length === 0) {
      setError('Please upload at least one photo');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const critWalkData: CritWalkFormData = {
        equipmentId,
        notes: data.notes,
        photos
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
