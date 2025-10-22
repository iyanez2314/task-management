export interface ITask {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate?: Date;
  assignee?: {
    id: string;
    name: string;
    email: string;
  };
  assigneeId?: string;
  organization?: {
    id: string;
    name: string;
  };
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTaskRequest {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  organizationId: string;
  dueDate?: Date;
}

export interface IUpdateTaskRequest {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  dueDate?: Date;
}
