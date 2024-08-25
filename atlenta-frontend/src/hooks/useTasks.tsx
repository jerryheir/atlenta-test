import { useMutation } from "@tanstack/react-query";
import axiosOrders from "src/utils/axios-orders";
import { useAppContext } from "./useAppContext";
import { useToast } from "@chakra-ui/react";
import { IProject, Priority, Status } from "src/types";
import { useActivities } from "./useActivities";

interface ICreateTask {
  name: string;
  description: string;
  priority: Priority;
  status: Status;
  project_id: string;
}

interface IEditTask {
  name?: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  project_id: string;
  id: string;
  source?: string;
  destination?: string;
}

interface IDeleteTask {
  task_id: string;
  project_id: string;
  name: string;
}

export const useTasks = () => {
  const toast = useToast();
  const { setIsSignedIn, setProjects, setSelectedProject, user } =
    useAppContext();
  const { addActivity } = useActivities();
  const axios = axiosOrders(toast, setIsSignedIn);

  const createTaskMutation = useMutation({
    mutationFn: async (payload: ICreateTask) => {
      const { data } = await axios.post("tasks", payload);
      const fetchedProjects = data.data.projects;
      const selectedProject = fetchedProjects.find(
        (project: IProject) => project.id === payload.project_id
      );

      await addActivity({
        description: `${user.first_name} ${user.last_name} added a new task - ${payload.name}`,
        project_id: selectedProject?.id,
      });

      if (data.status !== "success") {
        throw new Error("Something went wrong, please try again.");
      }

      setProjects(fetchedProjects);
      setSelectedProject(selectedProject);
      return { status: "success" };
    },
  });

  const createTask = async (payload: ICreateTask) => {
    return createTaskMutation.mutateAsync(payload);
  };

  const editTaskMutation = useMutation({
    mutationFn: async (payload: IEditTask) => {
      const { id, source, destination, project_id } = payload;
      const { data } = await axios.patch(`tasks/${id}`, payload);
      const fetchedProjects = data.data.projects;
      const selectedProject = fetchedProjects.find(
        (project: IProject) => project.id === project_id
      );
      if (source && destination && source !== destination) {
        await addActivity({
          description: `${user.first_name} ${user.last_name} moved task from ${source} to ${destination}`,
          project_id: selectedProject?.id,
        });
      }

      if (data.status !== "success") {
        throw new Error("Something went wrong, please try again.");
      }

      setSelectedProject(selectedProject);
      setProjects(fetchedProjects);
      return { status: "success" };
    },
  });

  const editTask = async (payload: IEditTask) => {
    return editTaskMutation.mutateAsync(payload);
  };

  const deleteTaskMutation = useMutation({
    mutationFn: async ({ task_id, project_id, name }: IDeleteTask) => {
      const { data } = await axios.delete(`tasks/${task_id}`);
      const fetchedProjects = data.data.projects;
      const selectedProject = fetchedProjects.find(
        (project: IProject) => project.id === project_id
      );
      await addActivity({
        description: `${user.first_name} ${user.last_name} deleted task - ${name}`,
        project_id: selectedProject?.id,
      });

      if (data.status !== "success") {
        throw new Error("Something went wrong, please try again.");
      }

      setSelectedProject(selectedProject);
      setProjects(fetchedProjects);
      return { status: "success" };
    },
  });

  const deleteTask = async (payload: IDeleteTask) => {
    return deleteTaskMutation.mutateAsync(payload);
  };

  return {
    createTask,
    editTask,
    deleteTask,
  };
};
