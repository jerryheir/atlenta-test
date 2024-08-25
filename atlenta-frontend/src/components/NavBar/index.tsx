import {
  IconButton,
  Avatar,
  Box,
  Flex,
  HStack,
  VStack,
  useColorModeValue,
  Text,
  FlexProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { AiOutlineUser } from "react-icons/ai";
import { FiMenu, FiChevronDown } from "react-icons/fi";
import { COLORS } from "src/utils/theme/colors";
import { capitalizeEachFirstLetter } from "src/utils/helpers";
import { useAppContext } from "src/hooks/useAppContext";
import { useAuth } from "src/hooks/useAuth";
import NewProjectButton from "../NewProjectButton";

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const NavBar = ({ onOpen, ...rest }: MobileProps) => {
  const { user } = useAppContext();
  const { signOut } = useAuth();
  const handleSignOut = async () => await signOut();

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="space-between"
      {...rest}
    >
      <Box display={{ base: "none", md: "flex" }}>
        <NewProjectButton />
      </Box>
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="4xl"
        fontWeight={700}
        color={COLORS.secondary}
      >
        Atlenta
      </Text>
      <HStack spacing={5}>
        <Flex alignItems={"center"}>
          <Menu autoSelect={false}>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack spacing={3}>
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-end"
                  spacing={0}
                >
                  <Text fontSize="sm" fontWeight="bold" lineHeight="14px">
                    {`${capitalizeEachFirstLetter(user.first_name)} `}
                  </Text>
                  <Text
                    fontSize="sm"
                    fontWeight={500}
                    opacity={0.7}
                    lineHeight="14px"
                  >
                    {`${capitalizeEachFirstLetter(user.last_name)}`}
                  </Text>
                </VStack>
                <Avatar
                  size={"sm"}
                  bgColor={COLORS.primary}
                  icon={<AiOutlineUser fontSize="1.5rem" />}
                />
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

export default NavBar;
