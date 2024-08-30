import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { platformshApiRef, PlatformshClient } from './api';

export const platformshPlugin = createPlugin({
  id: 'platformsh',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: platformshApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new PlatformshClient({ discoveryApi, fetchApi }),
    }),
  ],
});

export const PlatformshPage = platformshPlugin.provide(
  createRoutableExtension({
    name: 'PlatformshPage',
    component: () =>
      import('./components/PageComponent').then(m => m.PageComponent),
    mountPoint: rootRouteRef,
  }),
);

export const EntityPlatformshContents = platformshPlugin.provide(
  createComponentExtension({
    name: 'EntityPlatformshContents',
    component: {
      lazy: () =>
        import('./components/EntityTabComponent').then(
          m => m.EntityTabComponent,
        ),
    },
  }),
);
