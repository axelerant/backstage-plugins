import {
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import Client from 'platformsh-client';
import Environment from 'platformsh-client/types/model/Environment';

type PlatformshAccessToken = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

export class PlatformshHelper {
  private lastAccessToken: PlatformshAccessToken = {} as PlatformshAccessToken;
  private tokenExpireTime: number = 0;
  constructor(
    private config: RootConfigService,
    private logger: LoggerService,
  ) {
    this.logger.info('Initializing platformsh helper client');
  }

  isTokenExpired() {
    const currentTime = Date.now();
    return currentTime >= this.tokenExpireTime;
  }

  async getClient() {
    try {
      if (this.isTokenExpired()) {
        this.logger.info('token expired. generating new token');
        this.lastAccessToken = await this.getAccessToken();
        this.tokenExpireTime =
          Date.now() + this.lastAccessToken.expires_in * 1000;
      } else {
        this.logger.info('reusing existing token');
      }
    } catch (error) {
      this.logger.error('Unable to get platformsh access token');
    }
    return new Client({
      access_token: this.lastAccessToken.access_token,
      api_url: 'https://api.platform.sh/api',
      authorization: '',
    });
  }

  async getAccessToken(): Promise<PlatformshAccessToken> {
    const basicAuth = Buffer.from('platform-cli:', 'latin1').toString('base64');
    const credentials = {
      grant_type: 'api_token',
      api_token: this.config.getOptionalString('platformsh.cli_token'),
    };
    const headers = {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(
        `https://accounts.platform.sh/oauth2/token`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(credentials),
        },
      );

      if (!response.ok) {
        throw new Error(`Unable to authenticate: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Unable to authenticate: ${String(error)}`);
    }
  }

  async listProjects() {
    const client = await this.getClient();
    // Passing bool value givens an error @todo fix undefined as unknown as boolean later
    const projects = await client.getSubscriptions(
      { status: 'active' },
      undefined as unknown as boolean,
    );
    return projects.map(project => ({
      id: project.id,
      project_id: project.project_id,
      project_title: project.project_title,
      status: project.status,
      plan: project.plan,
      project_region_label: project.project_region_label,
      project_ui: project.project_ui,
    }));
  }

  async getProjectInfo(id: string) {
    const client = await this.getClient();
    const project = await client.getProject(id);
    const subscriptionId = project.getSubscriptionId();
    const subscription = await client.getSubscription(subscriptionId);
    const enviroments = await client.getEnvironments(id);

    return {
      project_id: project.id,
      project_title: project.title,
      status: subscription.status,
      plan: subscription.plan,
      project_region_label: subscription.project_region_label,
      project_ui: subscription.project_ui,
      size: subscription.storage,
      environment: {
        count: project.subscription.environments + 1,
        used: enviroments.length,
      },
      url: await this.getProjectDomain(enviroments),
    };
  }

  async getProjectDomain(enviroments: Environment[]): Promise<string> {
    let mainEnviroment = enviroments.find(item => item.name === 'main');
    if (!mainEnviroment) {
      mainEnviroment = enviroments[0];
    }
    const urls: string[] = mainEnviroment.getRouteUrls();
    let url = urls.find(item => item.startsWith('https'));
    if (!url) {
      url = urls[0];
    }
    return url;
  }
}
