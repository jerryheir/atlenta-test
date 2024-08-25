import { useMutation } from "@tanstack/react-query";
import axiosOrders from "src/utils/axios-orders";
import { useAppContext } from "./useAppContext";
import { useToast } from "@chakra-ui/react";
import { EMPTY_PROJECT } from "src/utils/constants";

export const useUsers = () => {
  const toast = useToast();
  const { setUser, setProjects, setIsSignedIn, setSelectedProject } =
    useAppContext();
  const axios = axiosOrders(toast, setIsSignedIn);

  const getUserDetailsMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.get(`users`);

      if (data.status !== "success") {
        throw new Error("Something went wrong, please try again.");
      }

      const fetchedProjects = data.data.user.projects;
      const [activeProject] = fetchedProjects;

      setUser(data.data.user);
      setProjects(fetchedProjects);
      if (fetchedProjects?.length) {
        setSelectedProject(activeProject || EMPTY_PROJECT);
      }
      return { status: "success" };
    },
  });

  const getUserDetails = async () => {
    return getUserDetailsMutation.mutateAsync();
  };

  return {
    getUserDetails,
  };
};
