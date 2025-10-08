import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Equipment, EquipmentStatus } from '../types/equipment.types';
import { calculateStatus } from '../utils/statusCalculator';

export function useEquipment() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [statuses, setStatuses] = useState<Map<string, EquipmentStatus>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const equipmentQuery = query(
      collection(db, 'equipment'),
      where('isActive', '==', true)
    );

    const unsubscribe = onSnapshot(equipmentQuery, (snapshot) => {
      const equipmentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Equipment));

      setEquipment(equipmentData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const statusQuery = query(collection(db, 'equipmentStatus'));

    const unsubscribe = onSnapshot(statusQuery, (snapshot) => {
      const statusMap = new Map<string, EquipmentStatus>();

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const equipmentId = data.equipmentId;

        // Calculate current status based on time
        const currentStatus = calculateStatus(data.lastCritWalkAt);

        statusMap.set(equipmentId, {
          ...data,
          status: currentStatus
        } as EquipmentStatus);
      });

      setStatuses(statusMap);
    });

    return unsubscribe;
  }, []);

  return { equipment, statuses, loading };
}
