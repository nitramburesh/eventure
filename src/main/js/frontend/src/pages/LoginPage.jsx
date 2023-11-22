import React, { useState } from "react";

import {
  FormControl,
  VStack,
  FormLabel,
  Input,
  Heading,
  Center,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userState } from "../atoms";
import { apiUrl } from "../atoms";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import {
  errorHeading,
  successHeading,
  normalHeading,
  handleEnterPress,
} from "../utils/Utils";
import useDelayedRedirect from "../utils/useRedirectToHomepage";

function LoginPage() {
  const baseApiUrl = useRecoilValue(apiUrl);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ isError: false, message: "" });
  const [success, setSuccess] = useState(false);
  const setUser = useSetRecoilState(userState);
  const { redirectWithDelay } = useDelayedRedirect();

  const handleLogin = async () => {
    const loginData = {
      username: username,
      password: password,
    };

    await axios
      .post(baseApiUrl + "login", loginData, { withCredentials: true })
      .then(({ data }) => {
        const loggedInUser = {
          id: data.id,
          username: data.username,
          profilePicture: data.profilePicture,
        };
        setUser(loggedInUser);
        localStorage.setItem("token", document.cookie);
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        redirectWithDelay("/");
        setSuccess(true);
      })
      .catch((error) =>
        setError({ isError: true, message: error.response.data }),
      );
  };
  const Heading = () => {
    if (success) {
      return successHeading("Success!", "Redirecting to homepage...");
    } else if (error.isError) {
      return errorHeading("Error!", error.message);
    } else {
      return normalHeading("Please log in.", "Insert your credentials.");
    }
  };

  return (
    <Center mt="100px">
      <VStack width="100%" maxWidth="500px" justifySelf="center" spacing="30px">
        <Heading />
        <FormControl isRequired>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            id="username"
            type="username"
            placeholder="Enter your username..."
            onChange={(event) => {
              setUsername(event.target.value);
              setError({ isError: false, message: "" });
            }}
            onKeyDown={handleEnterPress}
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
              setError({ isError: false, message: "" });
            }}
            onKeyDown={(event) => handleEnterPress(event, handleLogin)}
          />
        </FormControl>
        <Button
          colorScheme="teal"
          rounded="lg"
          onClick={handleLogin}
          isLoading={success}
        >
          Log in
        </Button>
      </VStack>
    </Center>
  );
}

export default LoginPage;
