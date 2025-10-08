import { useState } from 'react';
import { useEquipment } from '../../hooks/useEquipment';
import { useUser } from '../../contexts/UserContext';
import { EquipmentCard } from './EquipmentCard';
import { EquipmentForm } from './EquipmentForm';
import { Modal } from '../common/Modal';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';

export function EquipmentGrid() {
  const { equipment, statuses, loading } = useEquipment();
  const { isManager } = useUser();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'green' | 'yellow' | 'red' | 'never'>('all');

  const filteredEquipment = equipment.filter(eq => {
    if (filterStatus === 'all') return true;
    const status = statuses.get(eq.id);
    return status?.status === filterStatus;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Equipment</h2>
          <p className="text-gray-600">{equipment.length} total items</p>
        </div>
        {isManager && (
          <Button onClick={() => setShowCreateModal(true)} className="hidden md:block">
            + Create Equipment
          </Button>
        )}
      </div>

      {/* Filters - Horizontal scrollable on mobile */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-md transition whitespace-nowrap min-h-[48px] ${
            filterStatus === 'all'
              ? 'bg-brand-blue text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterStatus('green')}
          className={`px-4 py-2 rounded-md transition whitespace-nowrap min-h-[48px] ${
            filterStatus === 'green'
              ? 'bg-status-green text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Green
        </button>
        <button
          onClick={() => setFilterStatus('yellow')}
          className={`px-4 py-2 rounded-md transition whitespace-nowrap min-h-[48px] ${
            filterStatus === 'yellow'
              ? 'bg-status-yellow text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Yellow
        </button>
        <button
          onClick={() => setFilterStatus('red')}
          className={`px-4 py-2 rounded-md transition whitespace-nowrap min-h-[48px] ${
            filterStatus === 'red'
              ? 'bg-status-red text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Red
        </button>
        <button
          onClick={() => setFilterStatus('never')}
          className={`px-4 py-2 rounded-md transition whitespace-nowrap min-h-[48px] ${
            filterStatus === 'never'
              ? 'bg-status-gray text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Never
        </button>
      </div>

      {/* Grid - Single column on mobile, multi-column on desktop */}
      {filteredEquipment.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No equipment found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredEquipment.map(eq => (
            <EquipmentCard
              key={eq.id}
              equipment={eq}
              status={statuses.get(eq.id) || null}
              onClick={() => navigate(`/equipment/${eq.id}`)}
            />
          ))}
        </div>
      )}

      {/* Floating + button for managers on mobile */}
      {isManager && (
        <button
          onClick={() => setShowCreateModal(true)}
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-brand-blue text-white rounded-full shadow-lg flex items-center justify-center text-2xl font-bold hover:bg-brand-blue-light transition z-10"
          aria-label="Create Equipment"
        >
          +
        </button>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Equipment"
        size="medium"
      >
        <EquipmentForm onSuccess={() => setShowCreateModal(false)} />
      </Modal>
    </div>
  );
}
