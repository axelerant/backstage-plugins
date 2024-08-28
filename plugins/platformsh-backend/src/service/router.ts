import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import {
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import express from 'express';
import Router from 'express-promise-router';

export interface RouterOptions {
  logger: LoggerService;
  config: RootConfigService;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/projects', (_, response) => {
    const exampleProjects = {
      projects: [
        {
          id: 'a1b2c3d4',
          status: 'requested',
          created_at: '2023-07-21T12:34:56Z',
          owner: '534359f7-5407-4b19-ba92-c71c370022a5',
          owner_info: {
            type: 'admin',
            username: 'carolyn.moore',
            display_name: 'Carolyn Moore',
          },
          vendor: 'Platform.sh',
          plan: 'Enterprise',
          environments: 3,
          storage: 100,
          user_licenses: 10,
          project_id: 'proj-001',
          project_endpoint: 'https://platform.sh/proj-001',
          project_title: 'E-commerce Platform',
          project_region: 'us-east',
          project_region_label: 'US East',
          project_ui: 'https://platform.sh/ui/proj-001',
        },
        {
          id: 'e5f6g7h8',
          status: 'requested',
          created_at: '2023-06-15T10:20:30Z',
          owner: 'd4e5f6g7-5407-4b19-ba92-c71c370022b6',
          owner_info: {
            type: 'developer',
            username: 'esma.berberoglu',
            display_name: 'Esma Berberoğlu',
          },
          vendor: 'Platform.sh',
          plan: 'Professional',
          environments: 2,
          storage: 50,
          user_licenses: 5,
          project_id: 'proj-002',
          project_endpoint: 'https://platform.sh/proj-002',
          project_title: 'Blog Platform',
          project_region: 'eu-west',
          project_region_label: 'EU West',
          project_ui: 'https://platform.sh/ui/proj-002',
        },
        {
          id: 'i9j0k1l2',
          status: 'requested',
          created_at: '2023-08-10T09:08:07Z',
          owner: 'h8i9j0k1-5407-4b19-ba92-c71c370022c7',
          owner_info: {
            type: 'manager',
            username: 'isabella.rhodes',
            display_name: 'Isabella Rhodes',
          },
          vendor: 'Platform.sh',
          plan: 'Starter',
          environments: 1,
          storage: 20,
          user_licenses: 2,
          project_id: 'proj-003',
          project_endpoint: 'https://platform.sh/proj-003',
          project_title: 'Portfolio Website',
          project_region: 'ap-southeast',
          project_region_label: 'AP Southeast',
          project_ui: 'https://platform.sh/ui/proj-003',
        },
        {
          id: 'i9j0k1l3',
          status: 'requested',
          created_at: '2023-08-10T09:08:07Z',
          owner: 'h8i9j0k1-5407-4b19-ba92-c71c370022c7',
          owner_info: {
            type: 'manager',
            username: 'isabella.rhodes',
            display_name: 'Isabella Rhodes',
          },
          vendor: 'Platform.sh',
          plan: 'Starter',
          environments: 1,
          storage: 20,
          user_licenses: 2,
          project_id: 'proj-004',
          project_endpoint: 'https://platform.sh/proj-003',
          project_title: 'Test Website',
          project_region: 'ap-southeast',
          project_region_label: 'AP Southeast',
          project_ui: 'https://platform.sh/ui/proj-003',
        },
      ],
    };
    response.json({ result: exampleProjects });
  });

  const middleware = MiddlewareFactory.create({ logger, config });

  router.use(middleware.error());
  return router;
}
