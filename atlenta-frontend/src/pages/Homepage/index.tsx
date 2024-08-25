import {
  Box,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
  HStack,
  VStack,
  Heading,
  Button,
  Spacer,
  IconButton,
  Center,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import NavBar from "src/components/NavBar";
import BoardItem from "src/components/BoardItem";
import Sidebar from "src/components/Sidebar";
import { ITask, Status } from "src/types";
import { COLORS } from "src/utils/theme/colors";
import {
  DragDropContext,
  DraggableLocation,
  DropResult,
} from "@hello-pangea/dnd";
import { IoAddCircleOutline } from "react-icons/io5";
import { useAppContext } from "src/hooks/useAppContext";
import { useTasks } from "src/hooks/useTasks";
import ActivityModal from "src/components/ActivityModal";
import { capitalizeEachFirstLetter } from "src/utils/helpers";
import { MdDeleteOutline } from "react-icons/md";
import DeleteModal from "src/components/DeleteModal";
import { useProjects } from "src/hooks/useProjects";
import NewProjectButton from "src/components/NewProjectButton";

const Homepage = () => {
  const {
    isOpen: isSidebarOpen,
    onOpen: onOpenSidebar,
    onClose: onCloseSidebar,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();
  const { selectedProject, getTasks, activityModalDisclosure } =
    useAppContext();
  const { isOpen: isActivityModalOpen } = activityModalDisclosure;
  const { editTask } = useTasks();
  const { deleteProject } = useProjects();
  const [todoTasks, setTodoTasks] = useState<ITask[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<ITask[]>([]);
  const [reviewTasks, setReviewTasks] = useState<ITask[]>([]);
  const [completedTasks, setCompletedTasks] = useState<ITask[]>([]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const sourceColumn = getColumnById(source.droppableId);
    const destinationColumn = getColumnById(destination.droppableId);

    if (sourceColumn === destinationColumn) {
      const updatedTasks = reorderTasks(
        getColumnTasks(sourceColumn),
        source.index,
        destination.index
      );
      updateColumnTasks(sourceColumn, updatedTasks);
    } else {
      const result = moveTask(
        getColumnTasks(sourceColumn),
        getColumnTasks(destinationColumn),
        source,
        destination
      );
      updateColumnTasks(sourceColumn, result[sourceColumn]);
      updateColumnTasks(destinationColumn, result[destinationColumn]);
    }

    await editTask({
      id: draggableId,
      project_id: selectedProject.id,
      status: destination.droppableId as Status,
      source: capitalizeEachFirstLetter(source.droppableId.replace("_", " ")),
      destination: capitalizeEachFirstLetter(
        destination.droppableId.replace("_", " ")
      ),
    });
  };

  const getColumnById = (id: string) => {
    switch (id) {
      case "todo":
        return Status.Todo;
      case "in_progress":
        return Status.InProgress;
      case "review":
        return Status.Review;
      case "completed":
        return Status.Completed;
      default:
        return Status.Todo;
    }
  };

  const getColumnTasks = (column: Status) => {
    switch (column) {
      case Status.Todo:
        return todoTasks;
      case Status.InProgress:
        return inProgressTasks;
      case Status.Review:
        return reviewTasks;
      case Status.Completed:
        return completedTasks;
      default:
        return [];
    }
  };

  const updateColumnTasks = (column: Status, tasks: ITask[]) => {
    switch (column) {
      case Status.Todo:
        setTodoTasks(tasks);
        break;
      case Status.InProgress:
        setInProgressTasks(tasks);
        break;
      case Status.Review:
        setReviewTasks(tasks);
        break;
      case Status.Completed:
        setCompletedTasks(tasks);
        break;
    }
  };

  const reorderTasks = (
    list: ITask[],
    startIndex: number,
    endIndex: number
  ): ITask[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const moveTask = (
    source: ITask[],
    destination: ITask[],
    droppableSource: DraggableLocation,
    droppableDestination: DraggableLocation
  ) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result: { [key: string]: ITask[] } = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  useEffect(() => {
    const todoTasksArr = getTasks(Status.Todo);
    const inProgressTasksArr = getTasks(Status.InProgress);
    const reviewTasksArr = getTasks(Status.Review);
    const completedTasksArr = getTasks(Status.Completed);

    setTodoTasks(todoTasksArr);
    setInProgressTasks(inProgressTasksArr);
    setReviewTasks(reviewTasksArr);
    setCompletedTasks(completedTasksArr);
  }, [getTasks, selectedProject.tasks]);

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <Sidebar
        onClose={() => onCloseSidebar}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isSidebarOpen}
        placement="left"
        onClose={onCloseSidebar}
        returnFocusOnClose={false}
        onOverlayClick={onCloseSidebar}
        size="full"
      >
        <DrawerContent>
          <Sidebar onClose={onCloseSidebar} />
        </DrawerContent>
      </Drawer>
      <NavBar onOpen={onOpenSidebar} />
      <Box display={{ base: "block", md: "none" }} m={4}>
        <NewProjectButton />
      </Box>
      <VStack ml={{ base: 0, md: 60 }} p="4" overflowX="auto">
        {selectedProject?.id ? (
          <>
            <HStack w="full">
              <HStack>
                <Heading
                  fontSize="25px"
                  color={COLORS.primary}
                  w="full"
                  alignItems="flex-start"
                >
                  {selectedProject?.name}
                </Heading>
                <IconButton
                  variant="outline"
                  aria-label="Delete Project"
                  icon={
                    <MdDeleteOutline color={COLORS.red[500]} fontSize={19} />
                  }
                  onClick={onOpenDeleteModal}
                />
              </HStack>
              <Spacer />
              <Button
                display="none"
                leftIcon={<IoAddCircleOutline fontSize={22} />}
                variant="outline"
                colorScheme="green"
                fontWeight={500}
                fontSize={14}
              >
                Add Member
              </Button>
            </HStack>
            <DragDropContext onDragEnd={onDragEnd}>
              <HStack
                spacing={5}
                justifyContent="space-between"
                alignItems="flex-start"
                w="full"
              >
                <BoardItem
                  name="Todo"
                  theme="gray.400"
                  tasks={todoTasks}
                  droppableId={Status.Todo}
                />
                <BoardItem
                  name="In Progress"
                  theme="#ff8800"
                  tasks={inProgressTasks}
                  droppableId={Status.InProgress}
                />
                <BoardItem
                  name="Review"
                  theme="blue.400"
                  tasks={reviewTasks}
                  droppableId={Status.Review}
                />
                <BoardItem
                  name="Completed"
                  theme="#00ad23"
                  tasks={completedTasks}
                  droppableId={Status.Completed}
                />
              </HStack>
            </DragDropContext>
          </>
        ) : (
          <Center>
            <Text fontWeight={700} opacity={0.4}>
              Add new project to view boards
            </Text>
          </Center>
        )}
      </VStack>
      {isActivityModalOpen && <ActivityModal />}
      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={onCloseDeleteModal}
          onConfirmDelete={deleteProject}
        />
      )}
    </Box>
  );
};

export default Homepage;
