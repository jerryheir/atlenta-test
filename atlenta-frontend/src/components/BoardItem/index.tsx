import {
  Divider,
  Heading,
  HStack,
  Box,
  IconButton,
  Center,
  Text,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import TaskCard from "../TaskCard";
import { COLORS } from "src/utils/theme/colors";
import { IoAdd } from "react-icons/io5";
import { ITask, Status } from "src/types";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import TaskModal from "../TaskModal";

interface IBoardItem {
  name: string;
  theme: string;
  tasks: ITask[];
  droppableId: Status;
}

const BoardItem = ({ name, theme, tasks, droppableId }: IBoardItem) => {
  const {
    isOpen: isModalOpen,
    onClose: onCloseModal,
    onOpen: onOpenModal,
  } = useDisclosure();

  const priorityOrder: { [key: string]: number } = {
    high: 1,
    medium: 2,
    low: 3,
  };

  return (
    <Flex
      flexDirection="column"
      alignItems="flex-start"
      width="full"
      p={4}
      borderRadius={8}
      bgColor={"white"}
      boxShadow="lg"
      minW="250px"
    >
      <HStack w="full" justifyContent="space-between">
        <HStack>
          <Box height="10px" width="10px" borderRadius="full" bgColor={theme} />
          <Heading fontSize="14px" fontWeight={500}>
            {name}
          </Heading>
          <Center
            borderRadius="full"
            height="18px"
            width="18px"
            bgColor={COLORS.slate[300]}
            p={3}
          >
            <Text fontSize={13} fontWeight={500}>
              {tasks.length}
            </Text>
          </Center>
        </HStack>
        <IconButton
          aria-label="Add Task"
          as={IoAdd}
          size="xs"
          cursor="pointer"
          onClick={onOpenModal}
        />
      </HStack>
      <Divider bgColor={theme} height="1px" my={3} />
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <Box
            minH={5}
            w="full"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks
              .sort(
                (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
              )
              .map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <Box
                      bgColor={COLORS.slate[50]}
                      border={`1px solid ${COLORS.slate[200]}`}
                      p={2}
                      w="full"
                      mb={2}
                      borderRadius={8}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskCard task={task} boardStatus={droppableId} />
                    </Box>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={onCloseModal}
          boardStatus={droppableId}
        />
      )}
    </Flex>
  );
};

export default BoardItem;
