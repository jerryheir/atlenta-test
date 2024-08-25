import { UseDisclosureProps } from "@chakra-ui/react";
import { IProject, ITask, IUser, Status } from ".";

export interface IAppContext {
  isSignedIn: boolean;
  setIsSignedIn: (value: boolean) => void;
  projects: IProject[];
  setProjects: (value: IProject[]) => void;
  user: IUser;
  setUser: (value: IUser) => void;
  selectedProject: IProject;
  setSelectedProject: (value: IProject) => void;
  getTasks: (status: Status) => ITask[];
  activityModalDisclosure: UseDisclosureProps;
}
