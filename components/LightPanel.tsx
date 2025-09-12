'use client';

import { useState } from 'react';
import { LightPosition } from '@/types';
import { LightControlSection } from './LightControlSection';
import { UnitIdConfigSection } from './UnitIdConfigSection';

export function LightPanel() {
  const [lightPosition, setLightPosition] = useState<LightPosition>({ row: 1, col: 1, led: 1 });

  return (
    <div className="space-y-6">
      <LightControlSection lightPosition={lightPosition} onPositionChange={setLightPosition} />
      <UnitIdConfigSection />
    </div>
  );
}
