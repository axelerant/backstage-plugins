import { createPermission } from '@backstage/plugin-permission-common';
import { RESOURCE_TYPE_CATALOG_ENTITY } from '@backstage/plugin-catalog-common/alpha';

export const platformshEnvironmentManagePermission = createPermission({
  name: 'platformsh.environment.manage',
  attributes: {},
  resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
});

export const platformshPermissions = [platformshEnvironmentManagePermission];
