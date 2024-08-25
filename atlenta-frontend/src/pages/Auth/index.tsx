import {
  Box,
  Center,
  Container,
  Heading,
  keyframes,
  Stack,
  VStack,
} from "@chakra-ui/react";
import AuthForm from "src/components/AuthForm";
import { COLORS } from "src/utils/theme/colors";
import { PAGE_MAX_WIDTH } from "src/utils/constants";

const Auth = () => {
  const rotateInUpLeft = keyframes`
  0% {
    transform-origin: left bottom;
    transform: rotate(90deg);
    opacity: 0;
  }
  100% {
    transform-origin: left bottom;
    transform: rotate(0);
    opacity: 1;
  }
`;

  return (
    <Center minH="100vh" w="full" bgColor={COLORS.slate[100]}>
      <Container maxW={PAGE_MAX_WIDTH}>
        <Stack
          flexDir={{ base: "column", md: "row" }}
          w="full"
          justifyContent="space-between"
          alignItems="center"
        >
          <VStack w={{ base: "100%", lg: "50%" }}>
            <Heading
              textAlign="center"
              fontSize={{ base: "40px", lg: "60px" }}
              fontWeight={700}
              color={COLORS.blue["800"]}
            >
              Manage all your tasks in one place with{" "}
              <span style={{ color: COLORS.secondary }}>Atlenta</span>
            </Heading>
            <Box
              as="div"
              display="inline-block"
              width="100px"
              height="100px"
              borderRadius="50%"
              background="rgba(51, 180, 153, 0.671)"
              boxShadow="4px -40px 60px 5px rgb(40, 37, 203) inset"
              animation={`${rotateInUpLeft} 2s ease infinite`}
            />
          </VStack>
          <Box w={{ base: "100%", lg: "50%" }} py={8}>
            <AuthForm />
          </Box>
        </Stack>
      </Container>
    </Center>
  );
};

export default Auth;
