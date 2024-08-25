import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  VStack,
  HStack,
  Select,
  FormErrorMessage,
  FormControl,
  Text,
  Heading,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { ITask, Priority, Status } from "src/types";
import { TASK_PRIORITY, TASK_STATUS } from "src/utils/constants";
import { capitalizeEachFirstLetter } from "src/utils/helpers";
import { COLORS } from "src/utils/theme/colors";
import { string, object } from "yup";
import { MdOutlineComment } from "react-icons/md";
import { useAppContext } from "src/hooks/useAppContext";
import { useTasks } from "src/hooks/useTasks";
import { useState } from "react";

interface ITaskModal {
  isOpen: boolean;
  onClose: () => void;
  task?: ITask;
  boardStatus: Status;
}

const TaskModal = ({ isOpen, onClose, task, boardStatus }: ITaskModal) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { createTask, deleteTask, editTask } = useTasks();
  const { selectedProject } = useAppContext();
  const validationSchema = object({
    name: string().required("Task Name is required"),
  });
  const { values, errors, handleBlur, handleChange, handleSubmit, touched } =
    useFormik({
      initialValues: {
        name: task?.name || "",
        description: task?.description || "",
        priority: task?.priority || Priority.Low,
        status: task?.status || boardStatus,
        comments: task?.comments || [],
      },
      validationSchema,
      onSubmit: async (values) => {
        try {
          setIsLoading(true);
          if (isEditing) {
            await editTask({
              ...values,
              id: task.id,
              project_id: selectedProject?.id,
            });
          } else {
            await createTask({ ...values, project_id: selectedProject?.id });
          }
        } catch (error) {
          console.error("Something went wrong:", error);
        } finally {
          setIsLoading(false);
        }
        onClose();
      },
    });
  const isEditing = !!task?.id;

  const handleDeleteTask = async () => {
    try {
      setIsDeleting(true);
      await deleteTask({
        task_id: task?.id || "",
        project_id: selectedProject.id,
        name: task?.name || "",
      });
    } catch (error) {
      console.error("Unable to delete task:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent minW={{ base: "none", md: "600px" }}>
        <ModalHeader>{isEditing ? "Edit Task" : "Add Task"}</ModalHeader>
        <ModalBody>
          <VStack alignItems="flex-start" spacing={6}>
            <FormControl isInvalid={!!errors.name && !!touched.name}>
              <Input
                fontSize="14px"
                fontWeight={500}
                name={"name"}
                placeholder="Task Name"
                value={values.name}
                onChange={handleChange}
                colorScheme="green"
                _focusVisible={{
                  borderColor: COLORS.primary,
                  borderWidth: 2,
                }}
              />
              <FormErrorMessage fontSize="12px">{errors.name}</FormErrorMessage>
            </FormControl>
            <Textarea
              fontSize="14px"
              fontWeight={500}
              name={"description"}
              placeholder="Task Description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              colorScheme="green"
              _focusVisible={{
                borderColor: COLORS.primary,
                borderWidth: 2,
              }}
            />
            <HStack w="full">
              <Select
                value={values.status}
                onChange={handleChange}
                name={"status"}
                fontSize="14px"
                fontWeight={500}
                colorScheme="green"
                _focusVisible={{
                  borderColor: COLORS.primary,
                  borderWidth: 2,
                }}
              >
                {TASK_STATUS.map((status: string) => (
                  <option key={status} value={status}>
                    {capitalizeEachFirstLetter(status.replace("_", " "))}
                  </option>
                ))}
              </Select>
              <Select
                value={values.priority}
                onChange={handleChange}
                name={"priority"}
                fontSize="14px"
                fontWeight={500}
                colorScheme="green"
                _focusVisible={{
                  borderColor: COLORS.primary,
                  borderWidth: 2,
                }}
              >
                {TASK_PRIORITY.map((priority: string) => (
                  <option key={priority} value={priority}>
                    {capitalizeEachFirstLetter(priority)}
                  </option>
                ))}
              </Select>
            </HStack>
            {values.comments?.length && (
              <VStack alignItems="flex-start" fontSize="14px" w="full">
                <HStack>
                  <MdOutlineComment />
                  <Heading size="sm" fontSize="14px">
                    Comments
                  </Heading>
                </HStack>
                {values.comments.map(({ details, created_at, user }, index) => (
                  <VStack maxH="300px" overflowY="auto" w="full" key={index}>
                    <VStack
                      alignItems="flex-start"
                      w="full"
                      borderBottom={`1px solid ${COLORS.slate[200]}`}
                      pb={2}
                    >
                      <HStack
                        justifyContent="space-between"
                        fontWeight={500}
                        w="full"
                      >
                        <Text>{`${user.first_name} ${user.last_name}`}</Text>
                        <Text>
                          {dayjs(created_at).format("MMM D, YYYY h:mm A")}
                        </Text>
                      </HStack>
                      <Text>{details}</Text>
                    </VStack>
                  </VStack>
                ))}
              </VStack>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          {isEditing && (
            <Button
              colorScheme="red"
              mr={3}
              onClick={handleDeleteTask}
              isDisabled={isLoading || isDeleting}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          )}
          <Button
            colorScheme="green"
            bgColor={COLORS.primary}
            mr={3}
            onClick={() => handleSubmit()}
            isLoading={isLoading}
            isDisabled={isLoading || isDeleting}
          >
            Save
          </Button>
          <Button onClick={onClose} variant="ghost">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TaskModal;
