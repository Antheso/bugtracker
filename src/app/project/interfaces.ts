export interface IProject {
  projectId: string;
  projectName: string;
  description: string;
  isPrivate: boolean;
  users: IProjectUser[];
}

export interface IProjectUser {
  userId: string;
  projectRoleId: number;
}
