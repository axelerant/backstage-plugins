import {
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import Client from 'platformsh-client';

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
      {},
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
}
