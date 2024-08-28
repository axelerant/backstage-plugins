import React from 'react';
import {
  Table,
  TableColumn,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { PlatformShProject } from '../../models';
import { useApi } from '@backstage/core-plugin-api';
import { platformshApiRef } from '../../api';

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
  const platformshApi = useApi(platformshApiRef);

  const { value, loading, error } = useAsync(async (): Promise<
    PlatformShProject[]
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
