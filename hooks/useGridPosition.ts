import { useState, useEffect } from 'react';
import { UnitIdPosition } from '@/types';
import { calculateGridUnitId } from '@/utils/modbus';

export const useGridPosition = (initialPosition: UnitIdPosition = { row: 1, col: 1 }) => {
  const [position, setPosition] = useState<UnitIdPosition>(initialPosition);
  const [unitId, setUnitId] = useState<number>(11);

  useEffect(() => {
    try {
      const calculatedUnit = calculateGridUnitId(position.row, position.col);
      setUnitId(calculatedUnit);
    } catch (error) {
      console.error('Invalid grid position:', error);
      setUnitId(11); // fallback to default
    }
  }, [position]);

  const updatePosition = (updates: Partial<UnitIdPosition>) => {
    setPosition(prev => ({ ...prev, ...updates }));
  };

  const setRow = (row: number) => updatePosition({ row });
  const setCol = (col: number) => updatePosition({ col });

  return {
    position,
    unitId,
    setPosition,
    updatePosition,
    setRow,
    setCol,
    setUnitId
  };
};
