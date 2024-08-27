import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const platformshPlugin = createPlugin({
  id: 'platformsh',
  routes: {
    root: rootRouteRef,
  },
});

export const PlatformshPage = platformshPlugin.provide(
  createRoutableExtension({
    name: 'PlatformshPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
