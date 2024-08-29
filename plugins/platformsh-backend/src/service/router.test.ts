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
});
