import { useMutation } from "@tanstack/react-query";
import axiosOrders from "src/utils/axios-orders";
import { useAppContext } from "./useAppContext";
import { useToast } from "@chakra-ui/react";

interface IAddActivity {
  description: string;
  project_id: string;
}

export const useActivities = () => {
  const toast = useToast();
  const { setIsSignedIn } = useAppContext();
  const axios = axiosOrders(toast, setIsSignedIn);

  const addActivityMutation = useMutation({
    mutationFn: async (payload: IAddActivity) => {
      const { data } = await axios.post(`activities`, payload);

      if (data.status !== "success") {
        throw new Error("Something went wrong, please try again.");
      }

      return { status: "success" };
    },
  });

  const addActivity = async (payload: IAddActivity) => {
    return addActivityMutation.mutateAsync(payload);
  };

  return {
    addActivity,
  };
};
