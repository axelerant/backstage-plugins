import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';
import { PlatformshHelper } from './PlatformshHelper';

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
      },
      async init({ httpRouter, logger, config }) {
        const platformshHelper = new PlatformshHelper(config, logger);
        httpRouter.use(
          await createRouter({
            logger,
            config,
            platformshHelper,
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
