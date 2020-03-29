export interface IProject {
  projectId: string;
  projectName: string;
  description: string;
  isPrivate: boolean;
  users: IProjectUser[];
  currUserRole?: string;
}

export interface IProjectUser {
  userId: string;
  projectRoleId: number;
}
