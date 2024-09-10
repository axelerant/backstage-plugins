import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import {
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import express, { Request } from 'express';
import Router from 'express-promise-router';
import { PlatformshHelper } from '../PlatformshHelper';

export interface RouterOptions {
  logger: LoggerService;
  config: RootConfigService;
  platformshHelper: PlatformshHelper;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config, platformshHelper } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/projects', async (_, response) => {
    const projects = await platformshHelper.listProjects();
    response.json({ result: { projects } });
  });

  router.get(
    '/project/:id',
    async (req: Request<{ id: string }, {}, {}, {}>, response) => {
      const data = await platformshHelper.getProjectInfo(req.params.id);
      response.json({ result: { data } });
    },
  );

  router.get(
    '/project/:id/environments',
    async (req: Request<{ id: string }, {}, {}, {}>, response) => {
      const data = await platformshHelper.getProjectEnvironments(req.params.id);
      response.json({ result: { data } });
    },
  );

  router.post(
    '/project/:id/environments',
    async (
      req: Request<
        { id: string },
        {},
        { environment_id: string; action: string },
        {}
      >,
      response,
    ) => {
      const valid_action = [
        'pause',
        'resume',
        'activate',
        'deactivate',
        'delete',
      ];
      if (!valid_action.includes(req.body.action)) {
        response.json({
          result: {
            data: {
              status: 0,
              message: 'Invalid action',
            },
          },
        });
        return;
      }

      const data = await platformshHelper.doEnvironmentAction(
        req.params.id,
        req.body.environment_id,
        req.body.action,
      );
      response.json({ result: { data } });
    },
  );

  const middleware = MiddlewareFactory.create({ logger, config });

  router.use(middleware.error());
  return router;
}
