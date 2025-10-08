import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUser } from '../../contexts/UserContext';
import { createEquipment } from '../../services/equipment.service';
import { EquipmentFormData } from '../../types/equipment.types';
import { EQUIPMENT_CATEGORIES } from '../../data/teamMembers';
import { Button } from '../common/Button';

interface EquipmentFormProps {
  onSuccess: () => void;
}

export function EquipmentForm({ onSuccess }: EquipmentFormProps) {
  const { userProfile } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<EquipmentFormData>({
    defaultValues: {
      critWalkInterval: 12,
      expectedPhotoCount: 1
    }
  });

  const onSubmit = async (data: EquipmentFormData) => {
    setLoading(true);
    setError('');

    try {
      await createEquipment(data, userProfile.name);
      onSuccess();
    } catch (err) {
      setError('Failed to create equipment. Please try again.');
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Equipment Name *
        </label>
        <input
          {...register('name', { required: 'Name is required' })}
          type="text"
          className="input-field text-base"
          placeholder="e.g., Conveyor Belt A-1"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          rows={3}
          className="input-field text-base"
          placeholder="Describe the equipment..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location *
        </label>
        <input
          {...register('location', { required: 'Location is required' })}
          type="text"
          className="input-field text-base"
          placeholder="e.g., Building A, Floor 2, Zone 3"
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category *
        </label>
        <select
          {...register('category', { required: 'Category is required' })}
          className="input-field text-base"
        >
          <option value="">Select a category</option>
          {EQUIPMENT_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Crit Walk Interval (hours)
          </label>
          <input
            {...register('critWalkInterval', {
              required: 'Interval is required',
              min: { value: 1, message: 'Must be at least 1 hour' }
            })}
            type="number"
            inputMode="numeric"
            className="input-field text-base"
          />
          {errors.critWalkInterval && (
            <p className="mt-1 text-sm text-red-600">{errors.critWalkInterval.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expected Photo Count
          </label>
          <input
            {...register('expectedPhotoCount', {
              required: 'Photo count is required',
              min: { value: 1, message: 'Must be at least 1' }
            })}
            type="number"
            inputMode="numeric"
            className="input-field text-base"
          />
          {errors.expectedPhotoCount && (
            <p className="mt-1 text-sm text-red-600">{errors.expectedPhotoCount.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Photo Guidelines (optional)
        </label>
        <textarea
          {...register('photoGuidelines')}
          rows={2}
          className="input-field text-base"
          placeholder="e.g., Take photos from front and side angles..."
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading} fullWidth>
          {loading ? 'Creating...' : 'Create Equipment'}
        </Button>
      </div>
    </form>
  );
}
