import React from 'react';
import { Grid } from '@material-ui/core';
import { ProjectDetailsCard } from '../Cards/ProjectDetailsCard';
import { useEntity } from '@backstage/plugin-catalog-react';
import { ANNOTATION_PLATFORMSH_PROJECT } from '../../utils';

export const EntityTabComponent = () => {
  const { entity } = useEntity();
  const projectId =
    entity.metadata.annotations?.[ANNOTATION_PLATFORMSH_PROJECT] ?? '';
  return (
    <Grid container spacing={3} direction="column">
      <Grid item>This is Platformsh entity tab</Grid>
      <Grid item md={4}>
        <ProjectDetailsCard projectId={projectId} />
      </Grid>
    </Grid>
  );
};
