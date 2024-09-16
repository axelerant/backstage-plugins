import { CatalogApi } from '@backstage/catalog-client';
import { ComponentEntity } from '@backstage/catalog-model';
import { ANNOTATION_PLATFORMSH_PROJECT } from '@axelerant/backstage-plugin-platformsh-common';

export const findEntityByProjectId = async (
  catalogApi: CatalogApi,
  projectId: string,
  token: string,
): Promise<ComponentEntity | undefined> => {
  const filter: Record<string, string> = {};
  filter.kind = 'Component';
  filter[`metadata.annotations.${ANNOTATION_PLATFORMSH_PROJECT}`] = projectId;
  const entities = await catalogApi.getEntities({ filter }, { token });
  return entities.items ? (entities.items[0] as ComponentEntity) : undefined;
};
