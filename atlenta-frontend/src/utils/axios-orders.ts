import { UseToastOptions, ToastId } from "@chakra-ui/react";
import axios from "axios";

export const baseURL = import.meta.env.VITE_BASE_URL;
const axiosOrders = (
  toast: (options?: UseToastOptions) => ToastId,
  setIsSignedIn: (value: boolean) => void
) => {
  const instance = axios.create({
    baseURL,
    headers: {
      "content-type": "application/json",
    },
  });

  const toggleToast = (description: string, status: "success" | "error") => {
    toast({
      description,
      status,
      duration: 4000,
      isClosable: true,
      position: "top-right",
      containerStyle: {
        fontSize: "14px",
        fontWeight: 500,
      },
    });
  };

  instance.interceptors.request.use(
    async (config) => {
      const authToken = config.headers["Authorization"];
      if (!authToken) {
        const savedAuthToken = localStorage.getItem("atlenta_auth_token");
        config.headers["Authorization"] = `Bearer ${savedAuthToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      const {
        data: { status, displayMessage },
      } = response;
      if (status === "success" && displayMessage) {
        toggleToast(displayMessage, "success");
      }
      return response;
    },
    (error) => {
      const {
        response: {
          data: { displayMessage },
        },
      } = error;
      if (error.response && error.response.status === 401) {
        // window.location.href = window.location.origin;
        setIsSignedIn(false);
      }
      if (displayMessage) {
        toggleToast(displayMessage, "error");
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default axiosOrders;
