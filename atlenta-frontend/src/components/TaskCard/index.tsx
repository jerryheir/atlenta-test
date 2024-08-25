import { Badge, Box, Text, VStack, useDisclosure } from "@chakra-ui/react";
import { ITask, Status } from "src/types";
import { getPriorityColorScheme } from "src/utils/helpers";
import { COLORS } from "src/utils/theme/colors";
import TaskModal from "../TaskModal";

const TaskCard = ({
  task,
  boardStatus,
}: {
  task: ITask;
  boardStatus: Status;
}) => {
  const priorityColorScheme = getPriorityColorScheme(task?.priority);
  const {
    isOpen: isModalOpen,
    onClose: onCloseModal,
    onOpen: onOpenModal,
  } = useDisclosure();

  return (
    <Box
      bgColor={COLORS.slate[50]}
      w="full"
      borderRadius={4}
      onClick={onOpenModal}
    >
      <VStack align="start">
        <Badge colorScheme={priorityColorScheme}>{task?.priority}</Badge>
        <Text fontSize={14} fontWeight={500}>
          {task?.name}
        </Text>
      </VStack>

      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={onCloseModal}
          boardStatus={boardStatus}
          task={task}
        />
      )}
    </Box>
  );
};

export default TaskCard;
