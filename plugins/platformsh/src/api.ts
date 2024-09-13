import {
  createApiRef,
  DiscoveryApi,
  FetchApi,
} from '@backstage/core-plugin-api';
import {
  EnvironmentActionResponse,
  ListProjectsResponse,
  PlatformshEnvironment,
  PlatformshProject,
  ProjectEnvironmentsResponse,
  ProjectInfoResponse,
} from '@internal/backstage-plugin-platformsh-common';

export interface PlatformshApi {
  listProjects(): Promise<PlatformshProject[]>;
  getProjectInfo(id: string): Promise<PlatformshProject>;
  getProjectEnvironments(id: string): Promise<PlatformshEnvironment[]>;
  doEnvironmentAction(
    projectId: string,
    environmentId: string,
    action: string,
  ): Promise<EnvironmentActionResponse>;
}

export const platformshApiRef = createApiRef<PlatformshApi>({
  id: 'platformsh',
});

export class PlatformshClient implements PlatformshApi {
  private baseUrl: string | undefined;

  constructor(
    private readonly discoveryApi: DiscoveryApi,
    private readonly fetchApi: FetchApi,
  ) {}

  private async getBaseUrl(): Promise<string> {
    if (!this.baseUrl) {
      this.baseUrl = await this.discoveryApi.getBaseUrl('platformsh');
    }
    return this.baseUrl;
  }

  private async fetchApiData<T>(
    path: string,
    options?: RequestInit,
  ): Promise<T> {
    const response = await this.fetchApi.fetch(
      `${await this.getBaseUrl()}${path}`,
      options,
    );

    if (!response.ok) {
      const errorBody = await response.json();

      const errorMessage = errorBody?.error?.message || 'An error occurred';
      const errorName = errorBody?.error?.name || 'Error';
      const statusCode = errorBody?.response?.statusCode || response.status;

      throw new Error(`${errorName} (${statusCode}): ${errorMessage}`);
    }
    return response.json();
  }

  async listProjects(): Promise<PlatformshProject[]> {
    const data = await this.fetchApiData<ListProjectsResponse>('/projects');
    return data.result.projects;
  }

  async getProjectInfo(id: string): Promise<PlatformshProject> {
    const data = await this.fetchApiData<ProjectInfoResponse>(`/project/${id}`);
    return data.result.projectData;
  }

  async getProjectEnvironments(id: string): Promise<PlatformshEnvironment[]> {
    const data = await this.fetchApiData<ProjectEnvironmentsResponse>(
      `/project/${id}/environments`,
    );
    return data.result.environments;
  }

  async doEnvironmentAction(
    projectId: string,
    environmentId: string,
    action: string,
  ): Promise<EnvironmentActionResponse> {
    return this.fetchApiData<EnvironmentActionResponse>(
      `/project/${projectId}/environments`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ environmentId, action }),
      },
    );
  }
}
