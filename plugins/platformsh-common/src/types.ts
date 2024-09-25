export type PlatformshProject = {
  id: string;
  status: string;
  plan: string;
  project_id: string;
  project_title: string;
  project_region_label: string;
  project_ui: string;
  size?: string;
  environment?: {
    count: number;
    used: number;
  };
  url?: string;
};

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

export type EnvironmentActionResponse = {
  result: {
    actionResult: {
      valid: number;
      message: string;
      activityId: string;
    };
  };
};

export type ListProjectsResponse = {
  result: { projects: PlatformshProject[] };
};

export type ProjectInfoResponse = {
  result: { projectData: PlatformshProject };
};

export type ProjectEnvironmentsResponse = {
  result: { environments: PlatformshEnvironment[] };
};

export type EnvironmentMethods =
  | 'pause'
  | 'resume'
  | 'activate'
  | 'deactivate'
  | 'delete';

export type EnvironmentActivityStatusResponse = {
  result: {
    completed: boolean;
  };
};
