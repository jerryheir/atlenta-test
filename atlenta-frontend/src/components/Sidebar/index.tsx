import {
  Box,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  BoxProps,
  FlexProps,
  CloseButton,
  Divider,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  HStack,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { COLORS } from "src/utils/theme/colors";
import { TbSubtask, TbActivity } from "react-icons/tb";
import { HiOutlineViewColumns } from "react-icons/hi2";
import { useAppContext } from "src/hooks/useAppContext";
import { capitalizeEachFirstLetter } from "src/utils/helpers";

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

interface LinkItemProps {
  name: string;
  icon: IconType;
}

interface NavItemProps extends FlexProps {
  icon: IconType;
  name: string;
  onClose: () => void;
}

const NavItem = ({ icon, name, onClose, ...rest }: NavItemProps) => {
  const { activityModalDisclosure } = useAppContext();
  const { onOpen: onOpenActivityModal } = activityModalDisclosure;
  return (
    <Box
      as="a"
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p={2}
        pl={4}
        w="full"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: COLORS.primary,
          color: "white",
        }}
        onClick={() =>
          name === "Activity" && onOpenActivityModal
            ? onOpenActivityModal()
            : onClose()
        }
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        <Text fontSize="14px" fontWeight={500}>
          {name}
        </Text>
      </Flex>
    </Box>
  );
};

const Sidebar = ({ onClose, ...rest }: SidebarProps) => {
  const { projects, setSelectedProject, selectedProject } = useAppContext();
  const LinkItems: Array<LinkItemProps> = [
    { name: "Board", icon: HiOutlineViewColumns },
    { name: "Activity", icon: TbActivity },
  ];

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex
        h="20"
        alignItems="center"
        px="8"
        justifyContent="space-between"
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Text fontSize="4xl" fontWeight={700} color={COLORS.secondary}>
          Atlenta
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <VStack alignItems="flex-start" position="relative" px={8} py={2}>
        <Text fontWeight={700}>My Projects</Text>
        <Divider />
      </VStack>
      {projects?.length ? (
        <Box mx={8}>
          <Accordion allowToggle>
            {projects
              .sort((a, b) => b.created_at.localeCompare(a.created_at))
              .map((project, index) => (
                <AccordionItem
                  border="none"
                  p={0}
                  onClick={() => setSelectedProject(project)}
                  key={index}
                >
                  <AccordionButton
                    px={0}
                    color={
                      project.id === selectedProject?.id
                        ? COLORS.primary
                        : "black"
                    }
                    borderRadius={8}
                  >
                    <HStack justifyContent="space-between" w="full" px={1}>
                      <HStack>
                        <Icon
                          aria-label="Project"
                          as={TbSubtask}
                          fontSize="32px"
                          p={1}
                          borderRadius={5}
                        />
                        <Text fontSize="14px" fontWeight={700} align="start">
                          {capitalizeEachFirstLetter(project.name)}
                        </Text>
                      </HStack>
                      <AccordionIcon />
                    </HStack>
                  </AccordionButton>
                  <AccordionPanel w="full" p={0}>
                    {LinkItems.map(({ name, icon }) => (
                      <NavItem
                        key={name}
                        icon={icon}
                        name={name}
                        onClose={onClose}
                      />
                    ))}
                  </AccordionPanel>
                </AccordionItem>
              ))}
          </Accordion>
        </Box>
      ) : (
        <Text
          mx="auto"
          textAlign={"center"}
          fontSize={14}
          fontWeight={500}
          opacity={0.4}
        >
          No Projects added yet
        </Text>
      )}
    </Box>
  );
};

export default Sidebar;
