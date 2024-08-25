import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react";
import { useAppContext } from "src/hooks/useAppContext";
import dayjs from "dayjs";
import { COLORS } from "src/utils/theme/colors";

const ActivityModal = () => {
  const { selectedProject, activityModalDisclosure } = useAppContext();
  const { isOpen, onClose } = activityModalDisclosure;

  return (
    <Modal isOpen={isOpen as boolean} onClose={onClose as () => void}>
      <ModalOverlay />
      <ModalContent minW={{ base: "none", md: "600px" }}>
        <ModalHeader>{`Activities - ${selectedProject.name}`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack alignItems="flex-start" spacing={6}>
            {selectedProject?.activities?.map(
              ({ created_at, description }, index) => (
                <VStack key={index} maxH="800px" overflowY="auto" w="full">
                  <VStack
                    alignItems="flex-start"
                    w="full"
                    borderBottom={`1px solid ${COLORS.slate[200]}`}
                    pb={2}
                  >
                    <HStack
                      justifyContent="space-between"
                      w="full"
                      fontWeight={500}
                      fontSize={14}
                    >
                      <Text>
                        {dayjs(created_at).format("MMM D, YYYY h:mm A")}
                      </Text>
                    </HStack>
                    <Text fontWeight={400} fontSize={14}>
                      {description}
                    </Text>
                  </VStack>
                </VStack>
              )
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ActivityModal;
