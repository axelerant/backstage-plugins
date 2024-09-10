import React from 'react';
import { PageComponent } from './PageComponent';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { screen } from '@testing-library/react';
import {
  registerMswTestHooks,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { platformshApiRef } from '../../api';

describe('PlatformshPageComponent', () => {
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
    platformshApi.listProjects.mockResolvedValue([]);
    await renderInTestApp(
      <Wrapper>
        <PageComponent />
      </Wrapper>,
    );
    expect(
      screen.getByText('Platform.sh Project Explorer'),
    ).toBeInTheDocument();
  });
});
