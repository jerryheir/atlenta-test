import { useEffect, useState } from "react";
import { useAppContext } from "./hooks/useAppContext";
import Auth from "./pages/Auth";
import Homepage from "./pages/Homepage";
import { useUsers } from "./hooks/useUsers";
import { Center, Spinner } from "@chakra-ui/react";

function App() {
  const { isSignedIn } = useAppContext();
  const { getUserDetails } = useUsers();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadProjects = async () => {
    try {
      await getUserDetails();
    } catch (error) {
      console.error("Unable to get projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isLoading ? (
    <Center h="80vh" w="full">
      <Spinner size="xl" color="green" />
    </Center>
  ) : isSignedIn ? (
    <Homepage />
  ) : (
    <Auth />
  );
}

export default App;
