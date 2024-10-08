import React from 'react';
import { Grid } from '@material-ui/core';
import { ProjectDetailsCard } from '../Cards/ProjectDetailsCard';
import { useEntity } from '@backstage/plugin-catalog-react';
import { EnvironmentsCard } from '../Cards/EnvironmentsCard/EnvironmentsCard';
import { ANNOTATION_PLATFORMSH_PROJECT } from '@axelerant/backstage-plugin-platformsh-common';

export const EntityTabComponent = () => {
  const { entity } = useEntity();
  const projectId =
    entity.metadata.annotations?.[ANNOTATION_PLATFORMSH_PROJECT] ?? '';
  return (
    <Grid container spacing={3} direction="row">
      <Grid item md={4}>
        <ProjectDetailsCard projectId={projectId} />
      </Grid>
      <Grid item md={8}>
        <EnvironmentsCard projectId={projectId} />
      </Grid>
    </Grid>
  );
};
