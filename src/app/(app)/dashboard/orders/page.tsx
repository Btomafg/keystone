'use client';
import CabinetGrid from '@/components/app/projects/Grid';
import { useGetCabinetTypes } from '@/hooks/api/projects.queries';

export default function Orders() {
  /*  const cabinetTypes = [
    {
      id: 1,
      name: 'Base Cabinet',
      description: 'Base cabinets are the foundation of your kitchen or bathroom design.',
      min_height: 3.5,
      max_height: 3.5,
      min_width: 2,
      max_width: null,
      base_y_lock: 0,
    },
    {
      id: 2,
      name: 'Upper Cabinet',
      description: 'Wall cabinets are mounted on the wall and are ideal for maximizing vertical space.',
      min_height: 3,
      max_height: null,
      min_width: 1,
      max_width: null,
      base_y_lock: 4.5,
    },
    {
      id: 3,
      name: 'Tall Cabinet',
      description: 'Tall cabinets are designed to reach the ceiling and provide ample storage space.',
      min_height: 8,
      max_height: 10,
      min_width: 2,
      max_width: null,
      base_y_lock: 0,
    },
  ]; */

  const { data: cabinetTypes, isLoading } = useGetCabinetTypes();
  console.log('Cabinet Types', cabinetTypes);
  return (
    <div>
      ORDERS PAGE
      <CabinetGrid cabinetTypes={cabinetTypes} onCabinetSave={() => console.log('save')} />
    </div>
  );
}
