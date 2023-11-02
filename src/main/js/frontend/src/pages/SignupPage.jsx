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
import { apiUrl } from "../atoms";
import { useRecoilValue } from "recoil";
import { redirectTo } from "../utils/Utils";
import { useNavigate } from "react-router-dom";
import {
  errorHeading,
  successHeading,
  normalHeading,
  handleUploadClick,
} from "../utils/Utils";

function SignupPage(props) {
  const baseApiUrl = useRecoilValue(apiUrl);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const redirectToHomepage = () => {
    return setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  const handleSignup = async () => {
    const newUser = {
      username: username,
      password: password,
    };
    try {
      await axios
        .post(baseApiUrl + "register", newUser)
        .then(() => redirectToHomepage());
    } catch (error) {
      setError(true);
    }
  };
  const heading = error ? (
    errorHeading("Error!", "User with this name already exists.")
  ) : (
    <Heading> Please sign up.</Heading>
  );

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
              setError(false);
            }}
          />
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password..."
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormControl>
        <Button colorScheme="teal" rounded="full" onClick={handleSignup}>
          Sign up
        </Button>
      </VStack>
    </Center>
  );
}

export default SignupPage;
