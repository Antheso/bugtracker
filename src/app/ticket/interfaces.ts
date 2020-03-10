import { ISelectOption } from '../core/interfaces';

export interface ITask {
  id: string;
  number: string;
  project: ISelectOption;
  summary: string;
  description: string;
  priorityId: string;
  typeId: string;
  statusId: string;
  assignee: ISelectOption;
  author: {
    name: string;
    userId: string;
  };
}

export interface IComment {
  timestamp: number;
  user: {
    name: string;
    userId: string;
  };
  text: string;
  issueId: string;
}
