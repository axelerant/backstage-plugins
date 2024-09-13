import React, { useCallback, useEffect } from 'react';
import {
  Table,
  TableColumn,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import {
  PlatformshEnvironment,
  platformshEnvironmentManagePermission,
} from '@internal/backstage-plugin-platformsh-common';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import { platformshApiRef } from '../../../api';
import { ActionButtons } from './ActionButtons';
import useAsyncFn from 'react-use/esm/useAsyncFn';
import { Link } from '@material-ui/core';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';

type DenseTableProps = {
  environments: PlatformshEnvironment[];
  actionCallback: (action: string, env_id: string) => Promise<void>;
  entity: Entity;
};

export const DenseTable = ({
  environments,
  actionCallback,
  entity,
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
        <RequirePermission
          permission={platformshEnvironmentManagePermission}
          errorPage={<></>}
          resourceRef={stringifyEntityRef(entity)}
        >
          <ActionButtons
            enviroment={environment}
            actionCallback={actionCallback}
          />
        </RequirePermission>
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
  const { entity } = useEntity();

  const [loadState, loadProjectEnvironments] = useAsyncFn(async (): Promise<
    PlatformshEnvironment[]
  > => {
    return platformshApi.getProjectEnvironments(projectId);
  }, []);

  const actionCallback = useCallback(
    async (action: string, env_id: string) => {
      try {
        const {
          result: { actionResult },
        } = await platformshApi.doEnvironmentAction(projectId, env_id, action);

        if (actionResult.valid) {
          alertApi.post({
            message: actionResult.message,
            severity: 'success',
          });
          loadProjectEnvironments();
        } else {
          alertApi.post({
            message: actionResult.message,
            severity: 'error',
          });
        }
      } catch (error) {
        alertApi.post({
          message: String(error),
          severity: 'error',
        });
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
      entity={entity}
    />
  );
};
