import { mockServices } from '@backstage/backend-test-utils';
import express from 'express';
import request from 'supertest';
import { PlatformshHelper } from '../PlatformshHelper';
import { createRouter } from './router';

jest.mock('../PlatformshHelper');

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const logger = mockServices.logger.mock();
    const config = mockServices.rootConfig();

    const router = await createRouter({
      logger,
      config,
      platformshHelper: new PlatformshHelper(config, logger),
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /projects', () => {
    it('returns a list of projects', async () => {
      // Mock the listProjects method
      const mockProjects = [
        { id: 1, name: 'Project A' },
        { id: 2, name: 'Project B' },
      ];
      (PlatformshHelper.prototype.listProjects as jest.Mock).mockResolvedValue(
        mockProjects,
      );

      const response = await request(app).get('/projects');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ result: { projects: mockProjects } });
    });
  });

  describe('GET /project/:id', () => {
    it('returns a project detail', async () => {
      // Mock the listProjects method
      const projectData = {
        project_id: 'proj-123',
        project_title: 'My Awesome Project',
        status: 'active',
        plan: 'standard',
        project_region_label: 'North America',
        project_ui: 'https://app.platform.sh/projects/12345abcde',
        size: 50,
        environment: {
          count: 11,
          used: 7,
        },
        url: 'https://my-awesome-project.com',
      };
      (
        PlatformshHelper.prototype.getProjectInfo as jest.Mock
      ).mockResolvedValue(projectData);

      const response = await request(app).get('/project/abc-123');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ result: { projectData } });
    });
  });

  describe('GET /project/:id/environments', () => {
    it('returns project environments', async () => {
      // Mock the listProjects method
      const environments = [
        {
          id: 'env-001',
          name: 'Development Environment',
          machine_name: 'dev_env',
          default_domain: 'dev.myproject.com',
          edge_hostname: 'edge.dev.myproject.com',
          status: 'active',
          parent: 'env-parent-123',
          type: 'development',
          created_at: '2024-01-01T08:00:00Z',
          updated_at: '2024-08-30T10:30:00Z',
        },
        {
          id: 'env-002',
          name: 'Staging Environment',
          machine_name: 'stage_env',
          default_domain: 'stage.myproject.com',
          edge_hostname: 'edge.stage.myproject.com',
          status: 'paused',
          parent: 'env-parent-123',
          type: 'staging',
          created_at: '2024-02-15T09:00:00Z',
          updated_at: '2024-08-25T11:45:00Z',
        },
      ];
      (
        PlatformshHelper.prototype.getProjectEnvironments as jest.Mock
      ).mockResolvedValue(environments);

      const response = await request(app).get('/project/abc-123/environments');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ result: { environments } });
    });
  });

  describe('POST /project/:id/environments', () => {
    it('environment actions', async () => {
      // Mock the listProjects method
      const result = {
        status: 0,
        message: 'Invalid action: undefined',
      };
      (
        PlatformshHelper.prototype.doEnvironmentAction as jest.Mock
      ).mockResolvedValue(result);

      const response = await request(app).post('/project/abc-123/environments');

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ result });
    });
  });
});
