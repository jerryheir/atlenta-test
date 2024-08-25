import { useDisclosure } from "@chakra-ui/react";
import { createContext, useState, ReactNode, FC, useEffect } from "react";
import { IProject, ITask, IUser, Status } from "src/types";
import { IAppContext } from "src/types/context";
import { EMPTY_PROJECT, EMPTY_USER } from "src/utils/constants";

interface AppProviderProps {
  children: ReactNode;
}

const defaultContextValue: IAppContext = {
  isSignedIn: false,
  setIsSignedIn: () => {},
  projects: [],
  setProjects: () => {},
  user: EMPTY_USER,
  setUser: () => {},
  selectedProject: EMPTY_PROJECT,
  setSelectedProject: () => {},
  getTasks: () => [],
  activityModalDisclosure: {},
};

export const AppContext = createContext<IAppContext>(defaultContextValue);
export const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const activityModalDisclosure = useDisclosure();
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>(EMPTY_USER);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [selectedProject, setSelectedProject] =
    useState<IProject>(EMPTY_PROJECT);

  const getTasks = (status: Status) => {
    const updatedTasks = [...selectedProject.tasks].filter((task: ITask) => {
      return task.status === status;
    });

    return updatedTasks;
  };

  useEffect(() => {
    const signedIn = localStorage.getItem("isSignedIn");
    setIsSignedIn(!!signedIn);
  }, []);

  return (
    <AppContext.Provider
      value={{
        isSignedIn,
        user,
        projects,
        setProjects,
        setUser,
        setIsSignedIn,
        selectedProject,
        setSelectedProject,
        getTasks,
        activityModalDisclosure,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
