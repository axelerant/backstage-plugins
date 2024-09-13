import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';
import { PlatformshHelper } from './PlatformshHelper';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';

/**
 * platformshPlugin backend plugin
 *
 * @public
 */
export const platformshPlugin = createBackendPlugin({
  pluginId: 'platformsh',
  register(env) {
    env.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        permissions: coreServices.permissions,
        httpAuth: coreServices.httpAuth,
        catalogApi: catalogServiceRef,
        auth: coreServices.auth,
      },
      async init({
        httpRouter,
        logger,
        config,
        permissions,
        httpAuth,
        catalogApi,
        auth,
      }) {
        const platformshHelper = new PlatformshHelper(config, logger);
        httpRouter.use(
          await createRouter({
            logger,
            config,
            platformshHelper,
            permissions,
            httpAuth,
            catalogApi,
            auth,
          }),
        );
        httpRouter.addAuthPolicy({
          path: '/health',
          allow: 'unauthenticated',
        });
      },
    });
  },
});
