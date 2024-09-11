import {
  createApiRef,
  DiscoveryApi,
  FetchApi,
} from '@backstage/core-plugin-api';
import {
  EnvironmentActionResponse,
  ListProjectsResponse,
  PlatformshEnvironment,
  PlatformShProject,
  ProjectEnvironmentsResponse,
  ProjectInfoResponse,
} from './models';

export interface PlatformshApi {
  listProjects(): Promise<PlatformShProject[]>;
  getProjectInfo(id: string): Promise<PlatformShProject>;
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
    return response.json();
  }

  async listProjects(): Promise<PlatformShProject[]> {
    const data = await this.fetchApiData<ListProjectsResponse>('/projects');
    return data.result.projects;
  }

  async getProjectInfo(id: string): Promise<PlatformShProject> {
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
