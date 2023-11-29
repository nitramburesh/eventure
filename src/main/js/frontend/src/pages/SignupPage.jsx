import React, { useState } from "react";

import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import {
  axiosInstance,
  errorHeading,
  handleEnterPress,
  normalHeading,
  valuesAreEmpty,
} from "../utils/Utils";
import useRedirectToHomepage from "../utils/useRedirectToHomepage";

function SignupPage(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { redirectWithDelay } = useRedirectToHomepage();

  const handleSignup = async () => {
    setIsLoading(true);
    const newUser = {
      username: username,
      password: password,
    };
    if (valuesAreEmpty([username, password])) {
      setIsLoading(false);
      setError("Values cannot be empty");
    } else {
      try {
        await axiosInstance.post("register", newUser).then(() => {
          redirectWithDelay("/login");
        });
      } catch (error) {
        setIsLoading(false);
        setError("User with this name already exists.");
      }
    }
  };
  const heading = error
    ? errorHeading("Error!", error)
    : normalHeading("Sign up", "Enter your credentials.");

  return (
    <Center mt="100px">
      <VStack minWidth="500px" justifySelf="center" spacing="30px">
        {heading}
        <FormControl isRequired>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username..."
            onChange={(event) => {
              setUsername(event.target.value);
              setError("");
            }}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password..."
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            onKeyDown={(event) => handleEnterPress(event, handleSignup)}
          />
        </FormControl>
        <Button
          colorScheme="teal"
          rounded="lg"
          onClick={handleSignup}
          isLoading={isLoading}
        >
          Sign up
        </Button>
      </VStack>
    </Center>
  );
}

export default SignupPage;
