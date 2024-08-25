import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { ChangeEventHandler, FocusEventHandler, useState } from "react";
import { useAuth } from "src/hooks/useAuth";
import { IAuthFormValues } from "src/types/auth";
import { AUTH_SIGN_IN_FORM, AUTH_SIGN_UP_FORM } from "src/utils/constants/auth";
import { COLORS } from "src/utils/theme/colors";
import { string, object, ref } from "yup";

interface ICustomFormControl {
  name: string;
  label: string;
  handleChange: ChangeEventHandler<HTMLInputElement>;
  values: IAuthFormValues;
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  handleBlur: FocusEventHandler<HTMLInputElement>;
}

const CustomFormControl = ({
  name,
  label,
  handleChange,
  errors,
  values,
  touched,
  handleBlur,
}: ICustomFormControl) => {
  return (
    <FormControl isInvalid={!!errors[name] && !!touched[name]}>
      <FormLabel fontSize="14px">{label}</FormLabel>
      <Input
        colorScheme="green"
        _focusVisible={{
          borderColor: COLORS.primary,
          borderWidth: 2,
        }}
        fontSize="14px"
        name={name}
        type={
          name === "email"
            ? "email"
            : name === "password" || name === "confirm_password"
            ? "password"
            : "text"
        }
        placeholder={label}
        value={values[name]}
        onChange={handleChange}
        onBlur={handleBlur}
        borderRadius="full"
      />
      <FormErrorMessage fontSize="12px">{errors[name]}</FormErrorMessage>
    </FormControl>
  );
};

const AuthForm = () => {
  const { authenticateUser } = useAuth();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const authSchema = {
    email: string()
      .email("Invalid Email address")
      .required("Email Address is required"),
    password: string()
      .min(6, "Password should be a minimum of 6 characters")
      .required("Password is required"),
  };
  const signInSchema = object().shape(authSchema);
  const signUpSchema = object().shape({
    ...authSchema,
    first_name: string().required("First Name is required"),
    last_name: string().required("Last Name is required"),
    confirm_password: string()
      .oneOf([ref("password"), ""], "Passwords do not match")
      .required("Password is required"),
  });
  const { values, touched, errors, handleSubmit, handleChange, handleBlur } =
    useFormik({
      initialValues: isSignUp
        ? {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            confirm_password: "",
          }
        : {
            email: "",
            password: "",
          },
      validationSchema: isSignUp ? signUpSchema : signInSchema,
      onSubmit: async ({ first_name, last_name, password, email }) => {
        try {
          setIsLoading(true);
          if (isSignUp) {
            await authenticateUser({
              first_name,
              last_name,
              password,
              email,
              userType: "new",
            });
          } else {
            await authenticateUser({
              password,
              email,
              userType: "existing",
            });
          }
        } catch (error) {
          console.error("Authentication failed:", error);
        } finally {
          setIsLoading(false);
        }
      },
      enableReinitialize: true,
    });
  const AUTH_FORM = isSignUp ? AUTH_SIGN_UP_FORM : AUTH_SIGN_IN_FORM;

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <Box
      margin="auto"
      p={8}
      borderRadius="md"
      bg="white"
      backdropFilter="blur(10px)"
      boxShadow="lg"
      w="80%"
    >
      <Heading
        fontSize="22px"
        textAlign="center"
        mb={6}
        color={COLORS.primary}
        fontWeight={800}
      >
        {isSignUp ? "Create Account!" : "Welcome Back!"}
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          {AUTH_FORM.map(({ name, label }) => (
            <CustomFormControl
              key={name}
              name={name}
              label={label}
              handleChange={handleChange}
              values={values}
              errors={errors}
              touched={touched}
              handleBlur={handleBlur}
            />
          ))}
          <Button
            type="submit"
            colorScheme="green"
            bgColor={COLORS.primary}
            width="full"
            borderRadius="full"
            onClick={() => handleSubmit()}
            isLoading={isLoading}
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>

          <Text mt={4} textAlign="center" fontSize={13}>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <Button
              variant="link"
              colorScheme="green"
              onClick={toggleAuthMode}
              fontSize={13}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </Button>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default AuthForm;
