import React from 'react';
import {
  ApiBlueprint,
  createApiFactory,
  PageBlueprint,
  createFrontendPlugin,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/frontend-plugin-api';
import {
  compatWrapper,
  convertLegacyRouteRef,
} from '@backstage/core-compat-api';
import { EntityContentBlueprint } from '@backstage/plugin-catalog-react/alpha';
import { platformshApiRef, PlatformshClient } from './api';
import { rootRouteRef } from './routes';
import { isPlatformshAvailable } from './utils';

/** @alpha */
export const platformshApi = ApiBlueprint.make({
  params: {
    factory: createApiFactory({
      api: platformshApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new PlatformshClient(discoveryApi, fetchApi),
    }),
  },
});

/** @alpha */
export const platformshPage = PageBlueprint.make({
  params: {
    defaultPath: '/platformsh',
    routeRef: convertLegacyRouteRef(rootRouteRef),
    loader: () =>
      import('./components/PageComponent').then(m =>
        compatWrapper(<m.PageComponent />),
      ),
  },
});

/** @alpha */
export const platformshEntityContent = EntityContentBlueprint.make({
  name: 'platformsh',
  params: {
    defaultPath: '/platformsh',
    defaultTitle: 'Platformsh',
    filter: entity => isPlatformshAvailable(entity),
    loader: () =>
      import('./components/EntityTabComponent').then(m =>
        compatWrapper(<m.EntityTabComponent />),
      ),
  },
});

/** @alpha */
export default createFrontendPlugin({
  id: 'platformsh',
  extensions: [platformshApi, platformshPage, platformshEntityContent],
});
