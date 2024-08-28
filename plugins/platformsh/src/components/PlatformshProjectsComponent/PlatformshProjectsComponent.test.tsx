import React from 'react';
import { render, screen } from '@testing-library/react';
import { PlatformshProjectsComponent } from './PlatformshProjectsComponent';
import { platformshApiRef } from '../../api';
import { TestApiProvider } from '@backstage/test-utils';
import { PlatformShProject } from '../../models';

describe('PlatformshProjectsComponent', () => {
  const platformshApi: jest.Mocked<typeof platformshApiRef.T> = {
    listProjects: jest.fn(),
  };

  const Wrapper = ({ children }: { children?: React.ReactNode }) => (
    <TestApiProvider apis={[[platformshApiRef, platformshApi]]}>
      {children}
    </TestApiProvider>
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders the projects table', async () => {
    const projects: PlatformShProject[] = [
      {
        id: 'a1b2c3d4',
        status: 'requested',
        plan: 'Enterprise',
        project_id: 'proj-001',
        project_title: 'E-commerce Platform',
        project_region_label: 'US East',
        project_ui: 'https://platform.sh/ui/proj-001',
      },
      {
        id: 'e5f6g7h8',
        status: 'requested',
        plan: 'Professional',
        project_id: 'proj-002',
        project_title: 'Blog Platform',
        project_region_label: 'EU West',
        project_ui: 'https://platform.sh/ui/proj-002',
      },
    ];
    platformshApi.listProjects.mockResolvedValue(projects);

    render(
      <Wrapper>
        <PlatformshProjectsComponent />
      </Wrapper>,
    );

    // Wait for the table to render
    const table = await screen.findByRole('table');
    const nationality = screen.getAllByText('Projects');
    // Assert that the table contains the expected projects data
    expect(table).toBeInTheDocument();
    expect(screen.getByText('E-commerce Platform')).toBeInTheDocument();
    expect(screen.getByText('US East')).toBeInTheDocument();
    expect(nationality[0]).toBeInTheDocument();
  });
});
