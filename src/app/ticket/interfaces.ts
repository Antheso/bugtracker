import { IAssigneeOption, IProjectOption } from '../core/interfaces';
import { IUser } from '../core/services';

export interface ITask {
  id: string;
  number: string;
  project: IProjectOption;
  summary: string;
  description: string;
  priorityId: string;
  typeId: string;
  statusId: string;
  assignee: IAssigneeOption;
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
