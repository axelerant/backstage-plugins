import {
  createApiRef,
  DiscoveryApi,
  FetchApi,
} from '@backstage/core-plugin-api';
import { PlatformShProject } from './models';

export interface PlatformshApi {
  listProjects(): Promise<PlatformShProject[]>;
}

export const platformshApiRef = createApiRef<PlatformshApi>({
  id: 'platformsh',
});

export class PlatformshClient implements PlatformshApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  async listProjects(): Promise<PlatformShProject[]> {
    const baseUrl = await this.discoveryApi.getBaseUrl('platformsh');

    const response = await this.fetchApi.fetch(`${baseUrl}/projects`);
    const data = await response.json();
    return data.result.projects;
  }
}
