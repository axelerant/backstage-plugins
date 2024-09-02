export type PlatformShProject = {
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
