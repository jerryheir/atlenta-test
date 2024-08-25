import { Button, Center, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { COLORS } from "src/utils/theme/colors";

const NotFound = () => {
  return (
    <Center bgColor={COLORS.slate[100]} flex={1} height="100vh">
      <VStack>
        <Text lineHeight={1} fontWeight={700} fontSize="120px">
          404
        </Text>
        <Text fontWeight={700} fontSize="20px">
          PAGE NOT FOUND!
        </Text>
        <Button
          colorScheme="green"
          bgColor={COLORS.primary}
          borderRadius="full"
          px={10}
          py={6}
          mt={3}
        >
          <Link to="/">RETURN HOME</Link>
        </Button>
      </VStack>
    </Center>
  );
};

export default NotFound;
