import {
  Button,
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  Input,
  PopoverCloseButton,
  PopoverBody,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { useProjects } from "src/hooks/useProjects";
import { COLORS } from "src/utils/theme/colors";

const NewProjectButton = () => {
  const {
    isOpen: isPopoverOpen,
    onOpen: onOpenPopover,
    onClose: onClosePopover,
  } = useDisclosure();
  const { createProject } = useProjects();
  const [newProjectName, setNewProjectName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddNewProject = async () => {
    try {
      setIsLoading(true);
      await createProject(newProjectName);
      setNewProjectName("");
      onClosePopover();
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover isOpen={isPopoverOpen} onClose={onClosePopover}>
      <PopoverTrigger>
        <Button
          colorScheme="green"
          bgColor={COLORS.primary}
          fontWeight="bold"
          onClick={onOpenPopover}
          isDisabled={isLoading}
        >
          New Project
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverCloseButton />
          <PopoverBody pr={8} mt={4}>
            <Input
              colorScheme="green"
              _focusVisible={{
                borderColor: COLORS.primary,
                borderWidth: 2,
              }}
              fontSize="14px"
              fontWeight={500}
              placeholder="Create New Project"
              value={newProjectName}
              onChange={({ target }) => setNewProjectName(target.value)}
            />
            <Button
              colorScheme="green"
              bgColor={COLORS.primary}
              mt={4}
              isLoading={isLoading}
              onClick={handleAddNewProject}
              isDisabled={isLoading || newProjectName.length < 2}
            >
              Create
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default NewProjectButton;
