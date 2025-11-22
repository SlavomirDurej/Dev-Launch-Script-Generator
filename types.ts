export interface Task {
  id: string;
  name: string;
  path: string;
  command: string;
}

export enum GenerateStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}