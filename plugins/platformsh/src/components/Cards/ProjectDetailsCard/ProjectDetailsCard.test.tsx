import React from 'react';
import { ProjectDetailsCard } from './ProjectDetailsCard';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { screen } from '@testing-library/react';
import {
  registerMswTestHooks,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { platformshApiRef } from '../../../api';
import { PlatformshProject } from '@axelerant/backstage-plugin-platformsh-common';

describe('ProjectDetailsCard', () => {
  const server = setupServer();
  // Enable sane handlers for network requests
  registerMswTestHooks(server);

  const platformshApi: jest.Mocked<typeof platformshApiRef.T> = {
    listProjects: jest.fn(),
    getProjectInfo: jest.fn(),
    getProjectEnvironments: jest.fn(),
    doEnvironmentAction: jest.fn(),
    pollForActivityCompletion: jest.fn(),
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
    const project: PlatformshProject = {
      id: 'proj-123',
      status: 'active',
      plan: 'standard',
      project_id: '12345abcde',
      project_title: 'My Awesome Project',
      project_region_label: 'North America',
      project_ui: 'https://app.platform.sh/projects/12345abcde',
      size: 'large',
      environment: {
        count: 10,
        used: 7,
      },
      url: 'https://my-awesome-project.com',
    };
    platformshApi.getProjectInfo.mockResolvedValue(project);

    await renderInTestApp(
      <Wrapper>
        <ProjectDetailsCard projectId="abc-123" />
      </Wrapper>,
    );
    expect(screen.getByText('Project Details')).toBeInTheDocument();
    expect(screen.getByText('My Awesome Project')).toBeInTheDocument();
  });
});
