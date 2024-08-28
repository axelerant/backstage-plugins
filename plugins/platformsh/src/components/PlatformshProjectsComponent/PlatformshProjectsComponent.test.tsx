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
    expect(screen.getByText('us-east')).toBeInTheDocument();
    expect(nationality[0]).toBeInTheDocument();
  });
});
