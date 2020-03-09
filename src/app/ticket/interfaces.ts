import { ISelectOption } from '../core/interfaces';

export interface ITask {
  id: string;
  number: string;
  project: ISelectOption;
  summary: string;
  description: string;
  priority: string;
  type: string;
  state: string;
  assignee: ISelectOption;
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
