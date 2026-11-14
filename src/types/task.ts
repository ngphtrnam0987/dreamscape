export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
  isActivePomodoro?: boolean;
}

export interface TaskState {
  tasks: TaskItem[];
  activeTaskId: string | null;
}
