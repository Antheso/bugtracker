import { IUser } from '../core/services';
import { ITableProject } from '../projects';

export interface ITask {
  id: string;
  number: string;
  project: ITableProject;
  summary: string;
  description: string;
  priorityId: string;
  typeId: string;
  statusId: string;
  assignee: IUser;
  author: {
    name: string;
    userId: string;
  };
}

export interface IComment {
  timestamp: number;
  user: IUser;
  text: string;
  issueId: string;
}
