import { Entity } from '@backstage/catalog-model';

export const ANNOTATION_PLATFORMSH_PROJECT = 'platform.sh/project-id';

export const isPlatformshAvailable = (entity: Entity) =>
  Boolean(entity?.metadata.annotations?.[ANNOTATION_PLATFORMSH_PROJECT]);
