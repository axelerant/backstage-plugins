import React from 'react';
import { EnvironmentsCard } from './EnvironmentsCard';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { screen } from '@testing-library/react';
import {
  registerMswTestHooks,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { platformshApiRef } from '../../../api';
import { PlatformshEnvironment } from '../../../models';

describe('ProjectDetailsCard', () => {
  const server = setupServer();
  // Enable sane handlers for network requests
  registerMswTestHooks(server);

  const platformshApi: jest.Mocked<typeof platformshApiRef.T> = {
    listProjects: jest.fn(),
    getProjectInfo: jest.fn(),
    getProjectEnvironments: jest.fn(),
    doEnvironmentAction: jest.fn(),
  };

  const Wrapper = ({ children }: { children?: React.ReactNode }) => (
    <TestApiProvider apis={[[platformshApiRef, platformshApi]]}>
      {children}
    </TestApiProvider>
  );

  // setup mock response
  beforeEach(() => {
    server.use(
      rest.get('/*', (_, res, ctx) => res(ctx.status(200), ctx.json({}))),
    );
  });

  it('should render', async () => {
    const enviroment: PlatformshEnvironment = {
      id: '123456',
      name: 'Sample Project',
      machine_name: 'sample_project_machine',
      default_domain: 'sampleproject.com',
      edge_hostname: 'edge.sampleproject.com',
      status: 'active',
      type: 'production',
      created_at: '2023-01-15T10:30:00Z',
      updated_at: '2024-09-09T12:00:00Z',
      parent: 'parent-project-789',
    };
    platformshApi.getProjectEnvironments.mockResolvedValue([enviroment]);

    await renderInTestApp(
      <Wrapper>
        <EnvironmentsCard projectId="abc-123" />
      </Wrapper>,
    );
    expect(screen.getByText('Environments')).toBeInTheDocument();
    expect(screen.getByText('Sample Project')).toBeInTheDocument();
  });
});
