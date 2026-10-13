import React from 'react';
import { Phase1Content, Phase2Content, Phase3Content } from './phases/Phase1To3.tsx';
import { Phase4Content, Phase5Content, Phase6Content } from './phases/Phase4To6.tsx';

interface DataEngineeringPhaseRendererProps {
  phaseId: string;
}

export const DataEngineeringPhaseRenderer: React.FC<DataEngineeringPhaseRendererProps> = ({ phaseId }) => {
  switch (phaseId) {
    case 'phase-1':
      return <Phase1Content />;
    case 'phase-2':
      return <Phase2Content />;
    case 'phase-3':
      return <Phase3Content />;
    case 'phase-4':
      return <Phase4Content />;
    case 'phase-5':
      return <Phase5Content />;
    case 'phase-6':
      return <Phase6Content />;
    default:
      return <Phase1Content />;
  }
};
