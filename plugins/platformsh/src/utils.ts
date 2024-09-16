import { Entity } from '@backstage/catalog-model';
import { ANNOTATION_PLATFORMSH_PROJECT } from '@axelerant/backstage-plugin-platformsh-common';

export const isPlatformshAvailable = (entity: Entity) =>
  Boolean(entity?.metadata.annotations?.[ANNOTATION_PLATFORMSH_PROJECT]);
