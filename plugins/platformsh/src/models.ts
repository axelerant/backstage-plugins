export type PlatformShProject = {
  id: string;
  status: string;
  created_at: string; // ISO 8601 date format
  owner: string;
  owner_info: {
    type: string;
    username: string;
    display_name: string;
  };
  vendor: string;
  plan: string;
  environments: number;
  storage: number;
  user_licenses: number;
  project_id: string;
  project_endpoint: string;
  project_title: string;
  project_region: string;
  project_region_label: string;
  project_ui: string;
};
