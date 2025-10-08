import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEquipmentById, getEquipmentStatus } from '../services/equipment.service';
import { Equipment, EquipmentStatus } from '../types/equipment.types';
import { useUser } from '../contexts/UserContext';
import { CritWalkHistory } from '../components/critWalk/CritWalkHistory';
import { CritWalkForm } from '../components/critWalk/CritWalkForm';
import { EquipmentForm } from '../components/equipment/EquipmentForm';
import { Modal } from '../components/common/Modal';
import { StatusBadge } from '../components/common/StatusBadge';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { calculateStatus } from '../utils/statusCalculator';
import { formatTimeAgo } from '../utils/dateHelpers';

export function EquipmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isManager } = useUser();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [status, setStatus] = useState<EquipmentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCritWalkModal, setShowCritWalkModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadEquipment();
    }
  }, [id]);

  const loadEquipment = async () => {
    if (!id) return;

    try {
      const [equipmentData, statusData] = await Promise.all([
        getEquipmentById(id),
        getEquipmentStatus(id)
      ]);

      setEquipment(equipmentData);
      setStatus(statusData);
    } finally {
      setLoading(false);
    }
  };

  const handleCritWalkSuccess = () => {
    setShowCritWalkModal(false);
    loadEquipment();
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    loadEquipment();
  };

  const handleDeleteSuccess = () => {
    setShowEditModal(false);
    navigate('/dashboard');
  };

  if (loading) return <LoadingSpinner />;
  if (!equipment) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Equipment not found</p>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  const currentStatus = status ? calculateStatus(status.lastCritWalkAt) : 'never';

  return (
    <div className="space-y-6">
      {/* Equipment Details Card */}
      <div className="card">
        {/* Hero section with large equipment name */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl md:text-2xl font-bold text-gray-900 mb-2">{equipment.name}</h1>
            <p className="text-lg md:text-base text-gray-600">{equipment.location}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={currentStatus} size="large" />
            {isManager && (
              <button
                onClick={() => setShowEditModal(true)}
                className="text-sm text-brand-blue hover:text-brand-blue-light underline"
              >
                Edit Equipment
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Category</p>
            <p className="font-medium text-lg md:text-base">{equipment.category}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Crit Walk</p>
            <p className="font-medium text-lg md:text-base">
              {status?.lastCritWalkAt
                ? formatTimeAgo(status.lastCritWalkAt)
                : 'Never'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Walks</p>
            <p className="font-medium text-lg md:text-base">{status?.totalWalksCompleted || 0}</p>
          </div>
        </div>

        <p className="text-base md:text-sm text-gray-700 mb-4">{equipment.description}</p>

        {/* Photo guidelines in prominent callout box */}
        {equipment.photoGuidelines && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-md p-4 mb-4">
            <p className="text-base md:text-sm font-medium text-brand-blue mb-1">📸 Photo Guidelines:</p>
            <p className="text-base md:text-sm text-blue-800">{equipment.photoGuidelines}</p>
          </div>
        )}

        {/* Complete Crit Walk button */}
        <div className="mt-4">
          <Button onClick={() => setShowCritWalkModal(true)} fullWidth>
            Complete Crit Walk
          </Button>
        </div>
      </div>

      {/* Crit Walk History */}
      <div className="card">
        <h2 className="text-2xl md:text-xl font-bold mb-4">Crit Walk History</h2>
        <CritWalkHistory equipmentId={equipment.id} />
      </div>

      {/* Crit Walk Modal - Full screen on mobile */}
      <Modal
        isOpen={showCritWalkModal}
        onClose={() => setShowCritWalkModal(false)}
        title="Complete Crit Walk"
        size="medium"
      >
        <CritWalkForm
          equipmentId={equipment.id}
          equipmentName={equipment.name}
          photoGuidelines={equipment.photoGuidelines}
          onSuccess={handleCritWalkSuccess}
        />
      </Modal>

      {/* Edit Equipment Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Equipment"
        size="medium"
      >
        <EquipmentForm
          equipment={equipment}
          equipmentId={equipment.id}
          onSuccess={handleEditSuccess}
          onDelete={handleDeleteSuccess}
        />
      </Modal>
    </div>
  );
}
