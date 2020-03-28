export interface ITableProject {
  projectId: string;
  projectName: string;
  description: string;
  private: boolean;
  projectRoleId: number;
}

export interface IProjectRole {
  projectRoleId: number;
  projectRoleName: string;
}
