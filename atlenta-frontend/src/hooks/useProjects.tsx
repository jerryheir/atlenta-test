import { useMutation } from "@tanstack/react-query";
import axiosOrders from "src/utils/axios-orders";
import { useAppContext } from "./useAppContext";
import { useToast } from "@chakra-ui/react";
import { useActivities } from "./useActivities";
import { EMPTY_PROJECT } from "src/utils/constants";

export const useProjects = () => {
  const toast = useToast();
  const {
    projects,
    setProjects,
    setIsSignedIn,
    setSelectedProject,
    user,
    selectedProject,
  } = useAppContext();
  const { addActivity } = useActivities();
  const axios = axiosOrders(toast, setIsSignedIn);

  const createProjectMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data } = await axios.post(`projects`, { name });
      await addActivity({
        description: `${user.first_name} ${user.last_name} created a new project`,
        project_id: data.data.project.id,
      });

      if (data.status !== "success") {
        throw new Error("Something went wrong, please try again.");
      }

      setProjects([data.data.project, ...projects]);
      setSelectedProject(data.data.project);
      return { status: "success" };
    },
  });

  const createProject = async (name: string) => {
    return createProjectMutation.mutateAsync(name);
  };

  const deleteProjectMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(`projects/${selectedProject.id}`);

      if (data.status !== "success") {
        throw new Error("Something went wrong, please try again.");
      }

      const fetchedProjects = data.data.projects;
      const [activeProject] = fetchedProjects;

      setProjects(fetchedProjects);

      setSelectedProject(activeProject || EMPTY_PROJECT);
      return { status: "success" };
    },
  });

  const deleteProject = async () => {
    return deleteProjectMutation.mutateAsync();
  };

  return {
    createProject,
    deleteProject,
  };
};
