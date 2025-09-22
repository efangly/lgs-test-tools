'use client';

import { useState } from 'react';
import { LightPosition } from '@/types';
import { LightControlSection } from './LightControlSection';
import { UnitIdConfigSection } from './UnitIdConfigSection';
import { ResetControl } from './ResetControl';

export function LightPanel() {
  const [lightPosition, setLightPosition] = useState<LightPosition>({ row: 1, col: 1, led: 1 });

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <LightControlSection lightPosition={lightPosition} onPositionChange={setLightPosition} />
        <UnitIdConfigSection />
        <ResetControl />
      </div>
    </>
  );
}
