import React from 'react';
import { EntityTabComponent } from './EntityTabComponent';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { screen } from '@testing-library/react';
import {
  registerMswTestHooks,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { platformshApiRef } from '../../api';

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntity: () => {
    return { loading: false, entity: { metadata: {} } };
  },
}));

describe('EntityTabComponent', () => {
  const server = setupServer();
  // Enable sane handlers for network requests
  registerMswTestHooks(server);

  const platformshApi: jest.Mocked<typeof platformshApiRef.T> = {
    listProjects: jest.fn(),
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
    await renderInTestApp(
      <Wrapper>
        <EntityTabComponent />
      </Wrapper>,
    );
    expect(
      screen.getByText('This is Platformsh entity tab'),
    ).toBeInTheDocument();
  });
});
