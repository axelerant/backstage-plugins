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

  router.get('/health', (_, res) => {
    logger.info('Health check - PONG!');
    res.json({ status: 'ok' });
  });

  router.get('/projects', async (_, res) => {
    try {
      const projects = await platformshHelper.listProjects();
      res.json({ result: { projects } });
    } catch (error) {
      logger.error(`Failed to fetch projects: ${error}`);
      res.status(500).json({ error: 'Unable to retrieve projects' });
    }
  });

  router.get('/project/:id', async (req: Request<{ id: string }>, res) => {
    try {
      const projectData = await platformshHelper.getProjectInfo(req.params.id);
      res.json({ result: { projectData } });
    } catch (error) {
      logger.error(
        `Failed to fetch project info for ID ${req.params.id}: ${error}`,
      );
      res.status(500).json({ error: 'Unable to retrieve project information' });
    }
  });

  router.get(
    '/project/:id/environments',
    async (req: Request<{ id: string }>, res) => {
      try {
        const environments = await platformshHelper.getProjectEnvironments(
          req.params.id,
        );
        res.json({ result: { environments } });
      } catch (error) {
        logger.error(
          `Failed to fetch environments for project ID ${req.params.id}: ${error}`,
        );
        res.status(500).json({ error: 'Unable to retrieve environments' });
      }
    },
  );

  router.post(
    '/project/:id/environments',
    async (
      req: Request<
        { id: string },
        {},
        { environmentId: string; action: string }
      >,
      res,
    ) => {
      const validActions = [
        'pause',
        'resume',
        'activate',
        'deactivate',
        'delete',
      ];

      if (!validActions.includes(req.body.action)) {
        res.status(400).json({
          result: {
            status: 0,
            message: `Invalid action: ${req.body.action}`,
          },
        });
        return;
      }

      try {
        const actionResult = await platformshHelper.doEnvironmentAction(
          req.params.id,
          req.body.environmentId,
          req.body.action,
        );
        res.json({ result: { actionResult } });
      } catch (error) {
        logger.error(
          `Failed to perform action on environment ${req.body.environmentId}: ${error}`,
        );
        res.status(500).json({ error: 'Unable to perform environment action' });
      }
    },
  );

  const middleware = MiddlewareFactory.create({ logger, config });

  router.use(middleware.error());

  return router;
}
