import {
  Modal,
  ModalContent,
  Button,
  ModalOverlay,
  ModalBody,
  Text,
  ModalFooter,
  ModalHeader,
  Box,
  Divider,
} from "@chakra-ui/react";
import { useAppContext } from "src/hooks/useAppContext";
import { capitalizeEachFirstLetter } from "src/utils/helpers";

const DeleteModal = ({
  onClose,
  isOpen,
  onConfirmDelete,
}: {
  onClose: () => void;
  isOpen: boolean;
  onConfirmDelete: () => void;
}) => {
  const { selectedProject } = useAppContext();

  const handleDelete = () => {
    onConfirmDelete();
    onClose();
  };

  return (
    <Modal isOpen={isOpen as boolean} onClose={onClose as () => void}>
      <ModalOverlay />
      <ModalContent minW="600px">
        <ModalHeader>{`Delete ${capitalizeEachFirstLetter(
          selectedProject.name
        )}`}</ModalHeader>
        <Box px={7}>
          <Divider />
        </Box>
        <ModalBody>
          <Text fontSize={14} fontWeight={500} textAlign="center" my={3}>
            Are you sure you want to delete this project? This action cannot be
            reversed!
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={handleDelete}>
            Delete
          </Button>
          <Button onClick={onClose} variant="ghost">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteModal;
