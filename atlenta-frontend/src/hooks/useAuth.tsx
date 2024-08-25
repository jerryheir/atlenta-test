import { useMutation } from "@tanstack/react-query";
import axiosOrders from "src/utils/axios-orders";
import { useAppContext } from "./useAppContext";
import { useToast } from "@chakra-ui/react";

interface IAuthenticateUser {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  userType: "new" | "existing";
}

export const useAuth = () => {
  const toast = useToast();
  const { setIsSignedIn } = useAppContext();
  const axios = axiosOrders(toast, setIsSignedIn);

  const authenticateUserMutation = useMutation({
    mutationFn: async (payload: IAuthenticateUser) => {
      const { data } = await axios.post(
        `auth/${payload.userType === "existing" ? "sign_in" : "sign_up"}`,
        payload
      );

      if (data.status !== "success") {
        toast({
          description: data.displayMessage || "Authentication failed!",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top-right",
          containerStyle: {
            fontSize: "14px",
            fontWeight: 500,
          },
        });
      }

      localStorage.setItem("atlenta_auth_token", data.data.access_token);
      localStorage.setItem("isSignedIn", "true");
      setIsSignedIn(true);
      return { status: "success" };
    },
  });

  const authenticateUser = async (payload: IAuthenticateUser) => {
    return authenticateUserMutation.mutateAsync(payload);
  };

  const signOutMutation = useMutation({
    mutationFn: async () => {
      localStorage.removeItem("atlenta_auth_token");
      localStorage.setItem("isSignedIn", "false");
      setIsSignedIn(false);
      return { status: "success" };
    },
  });

  const signOut = async () => {
    return signOutMutation.mutateAsync();
  };

  return {
    authenticateUser,
    signOut,
  };
};
