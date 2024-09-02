import {
  createApiRef,
  DiscoveryApi,
  FetchApi,
} from '@backstage/core-plugin-api';
import { PlatformShProject } from './models';

export interface PlatformshApi {
  listProjects(): Promise<PlatformShProject[]>;
  getProjectInfo(id: string): Promise<PlatformShProject>;
}

export const platformshApiRef = createApiRef<PlatformshApi>({
  id: 'platformsh',
});

export class PlatformshClient implements PlatformshApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;
  private baseUrl: string = '';

  constructor(options: { discoveryApi: DiscoveryApi; fetchApi: FetchApi }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  async getBaseUrl() {
    if (this.baseUrl) {
      return this.baseUrl;
    }
    this.baseUrl = await this.discoveryApi.getBaseUrl('platformsh');
    return this.baseUrl;
  }

  async listProjects(): Promise<PlatformShProject[]> {
    const response = await this.fetchApi.fetch(
      `${await this.getBaseUrl()}/projects`,
    );
    const data = await response.json();
    return data.result.projects;
  }

  async getProjectInfo(id: string): Promise<PlatformShProject> {
    const response = await this.fetchApi.fetch(
      `${await this.getBaseUrl()}/project/${id}`,
    );
    const data = await response.json();
    return data.result.data;
  }
}
