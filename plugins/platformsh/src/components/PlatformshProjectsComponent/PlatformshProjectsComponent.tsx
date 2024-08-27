import React from 'react';
import {
  Table,
  TableColumn,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';

export const exampleProjects = {
  results: [
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
  ],
};

type PlatformShProject = {
  id: string;
  status: string;
  created_at: string; // ISO 8601 date format
  owner: string;
  owner_info: {
    type: string;
    username: string;
    display_name: string;
  };
  vendor: string;
  plan: string;
  environments: number;
  storage: number;
  user_licenses: number;
  project_id: string;
  project_endpoint: string;
  project_title: string;
  project_region: string;
  project_region_label: string;
  project_ui: string;
};

type DenseTableProps = {
  projects: PlatformShProject[];
};

export const DenseTable = ({ projects }: DenseTableProps) => {
  const columns: TableColumn[] = [
    { title: 'ID', field: 'id' },
    { title: 'Project Title', field: 'title' },
    { title: 'Region', field: 'region' },
    { title: 'Plan', field: 'plan' },
  ];

  const data = projects.map(project => {
    return {
      id: project.project_id,
      title: project.project_title,
      region: project.project_region,
      plan: project.plan,
    };
  });

  return (
    <Table
      title="Projects"
      options={{ search: false, paging: false }}
      columns={columns}
      data={data}
    />
  );
};

export const PlatformshProjectsComponent = () => {
  const { value, loading, error } = useAsync(async (): Promise<
    PlatformShProject[]
  > => {
    // Would use fetch in a real world example
    return exampleProjects.results;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return <DenseTable projects={value || []} />;
};
