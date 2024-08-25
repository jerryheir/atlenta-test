import { Priority, Status } from "src/types";

export const PAGE_MAX_WIDTH = 1200;

export const EMPTY_USER = {
  id: "",
  name: "",
  projects: [],
  created_at: "",
  first_name: "",
  last_name: "",
  email: "",
};

export const EMPTY_PROJECT = {
  id: "",
  name: "",
  admin_id: "",
  members: [],
  tasks: [],
  activities: [],
  created_at: "",
};

export const TASK_STATUS: Status[] = [
  Status.Todo,
  Status.InProgress,
  Status.Review,
  Status.Completed,
];

export const TASK_PRIORITY: Priority[] = [
  Priority.Low,
  Priority.Medium,
  Priority.High,
];
