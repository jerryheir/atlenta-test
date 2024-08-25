export enum Priority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

export enum Status {
  Todo = "todo",
  InProgress = "in_progress",
  Review = "review",
  Completed = "completed",
}

export interface IComment {
  user: IUser;
  details: string;
  created_at: string;
}

export interface IUser {
  id: string;
  name: string;
  projects: IProject[];
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface ITask {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  status: Status;
  project_id: string;
  created_at: string;
  comments: IComment[];
}

export interface IActivity {
  id: string;
  description: string;
  project_id: string;
  created_at: string;
}

export interface IProject {
  id: string;
  name: string;
  admin_id: string;
  members: IUser[];
  tasks: ITask[];
  activities: IActivity[];
  created_at: string;
}
