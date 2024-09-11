export type EnvironmentMethods =
  | 'pause'
  | 'resume'
  | 'activate'
  | 'deactivate'
  | 'delete';

export type PlatformshEnvironment = {
  id: string;
  name: string;
  machine_name: string;
  default_domain: string;
  edge_hostname: string;
  status: string;
  type: string;
  created_at: string;
  updated_at: string;
  parent: string;
};
