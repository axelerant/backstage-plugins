import React from 'react';
import { InfoCard } from '@backstage/core-components';

export const ProjectDetailsCard = ({ projectId }: { projectId: string }) => {
  return (
    <InfoCard title="Project Details">
      This is project details. {projectId}
    </InfoCard>
  );
};
