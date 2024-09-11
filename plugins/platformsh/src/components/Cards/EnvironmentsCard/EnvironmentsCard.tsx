import React, { useCallback, useEffect } from 'react';
import {
  Table,
  TableColumn,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { PlatformshEnvironment } from '../../../models';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import { platformshApiRef } from '../../../api';
import { ActionButtons } from './ActionButtons';
import useAsyncFn from 'react-use/esm/useAsyncFn';
import { Link } from '@material-ui/core';

type DenseTableProps = {
  environments: PlatformshEnvironment[];
  actionCallback: (action: string, env_id: string) => Promise<void>;
};

export const DenseTable = ({
  environments,
  actionCallback,
}: DenseTableProps) => {
  const columns: TableColumn[] = [
    { title: 'Name', field: 'name' },
    { title: 'Parent', field: 'parent' },
    { title: 'Type', field: 'type' },
    { title: 'Status', field: 'status' },
    { title: 'Action', field: 'action' },
  ];

  const getEnvironmentDomain = (environment: PlatformshEnvironment) => {
    if (environment.default_domain) {
      return environment.default_domain;
    }
    return environment.edge_hostname;
  };

  const data = environments.map(environment => {
    const envDomain = `https://${getEnvironmentDomain(environment)}`;
    return {
      name: (
        <Link href={envDomain} target="_blank">
          {environment.name}
        </Link>
      ),
      parent: environment.parent ?? '--',
      type: environment.type,
      status: environment.status,
      action: (
        <ActionButtons
          enviroment={environment}
          actionCallback={actionCallback}
        />
      ),
    };
  });

  return (
    <Table
      title="Environments"
      options={{ search: false, paging: false }}
      columns={columns}
      data={data}
    />
  );
};

export const EnvironmentsCard = ({ projectId }: { projectId: string }) => {
  const platformshApi = useApi(platformshApiRef);
  const alertApi = useApi(alertApiRef);

  const [loadState, loadProjectEnvironments] = useAsyncFn(async (): Promise<
    PlatformshEnvironment[]
  > => {
    return platformshApi.getProjectEnvironments(projectId);
  }, []);

  const actionCallback = useCallback(
    async (action: string, env_id: string) => {
      const { result } = await platformshApi.doEnvironmentAction(
        projectId,
        env_id,
        action,
      );
      if (result.data.valid) {
        alertApi.post({ message: result.data.message, severity: 'success' });
        loadProjectEnvironments();
      } else {
        alertApi.post({ message: result.data.message, severity: 'error' });
      }
    },
    [platformshApi, projectId, loadProjectEnvironments, alertApi],
  );

  useEffect(() => {
    loadProjectEnvironments();
  }, [loadProjectEnvironments]);

  if (loadState.loading) {
    return <Progress />;
  } else if (loadState.error) {
    return <ResponseErrorPanel error={loadState.error} />;
  }
  return (
    <DenseTable
      environments={loadState.value || []}
      actionCallback={actionCallback}
    />
  );
};
