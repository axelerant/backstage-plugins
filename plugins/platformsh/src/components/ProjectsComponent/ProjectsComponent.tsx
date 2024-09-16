import React from 'react';
import {
  Table,
  TableColumn,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { PlatformshProject } from '@axelerant/backstage-plugin-platformsh-common';
import { useApi } from '@backstage/core-plugin-api';
import { platformshApiRef } from '../../api';

type DenseTableProps = {
  projects: PlatformshProject[];
};

export const DenseTable = ({ projects }: DenseTableProps) => {
  const columns: TableColumn[] = [
    { title: 'ID', field: 'id' },
    { title: 'Project Title', field: 'title' },
    { title: 'Region', field: 'region' },
    { title: 'Plan', field: 'plan' },
    { title: 'Status', field: 'status' },
  ];

  const data = projects.map(project => {
    return {
      id: project.project_id,
      title: project.project_title,
      region: project.project_region_label,
      plan: project.plan,
      status: project.status,
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

export const ProjectsComponent = () => {
  const platformshApi = useApi(platformshApiRef);

  const { value, loading, error } = useAsync(async (): Promise<
    PlatformshProject[]
  > => {
    return platformshApi.listProjects();
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }
  return <DenseTable projects={value || []} />;
};
