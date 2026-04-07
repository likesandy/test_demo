export type LogType = 'info' | 'error' | 'success' | 'thought';

export interface TaskLog {
  id: string;
  text: string;
  type: LogType;
}

export interface TaskAction {
  message: string;
  buttons: {
    id: string;
    text: string;
    primary?: boolean;
    icon?: 'check';
  }[];
}

export interface Task {
  id: string;
  prompt: string;
  initialResponse: string;
  status: 'running' | 'action_required' | 'completed';
  logs: TaskLog[];
  action?: TaskAction;
  result?: React.ReactNode;
  createdAt: number;
}
