import {
  Center,
  Grid,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Text,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Button,
} from "@chakra-ui/react";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { apiUrl, userState } from "../atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import Wrapper from "../components/Wrapper";
import { BsCheck, BsPencilFill } from "react-icons/bs";
import Event from "../components/Event";
import { useNavigate } from "react-router-dom";
import { handleLogout, handleUploadClick } from "../utils/Utils";
import { AiFillEdit } from "react-icons/ai";
import { LiaUserEditSolid } from "react-icons/lia";
import { IoAddCircleOutline } from "react-icons/io5";
import useDeleteUser from "../utils/useDeleteUser";

function UserPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState({ isError: false, message: "" });
  const [details, setDetails] = useState({
    profilePicture: "",
    username: "",
    likedEvents: [],
    attendedEvents: [],
  });
  const baseApiUrl = useRecoilValue(apiUrl);
  const inputFile = useRef(null);

  const [user, setUser] = useRecoilState(userState);
  const { id } = useRecoilValue(userState);
  const { handleDeleteUser } = useDeleteUser();
  useEffect(() => {
    axios
      .get(baseApiUrl + `users/details/${id}`)
      .then((response) => {
        setDetails(response.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [isEditing, details.profilePicture]);
  const handleEditUsername = () => {
    axios
      .patch(baseApiUrl + `users/edit/username/${id}`, {
        username: details?.username,
      })
      .then(() => setIsEditing(false))
      .catch((error) => {
        if (error.response.status === 409) {
          setError({ isError: true, message: "User already exists" });
        } else {
          setError({
            isError: true,
            message: "Error occured, please try again later...",
          });
        }
      });
  };
  const handleChangeProfilePicture = async (event) => {
    setIsImageUploading(true);
    const profilePicture = new FormData();
    profilePicture.append("profilePicture", event.target.files[0]);
    return await axios
      .patch(baseApiUrl + `users/edit/profilePicture/${id}`, profilePicture, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setDetails({ ...details, profilePicture: response.data });
        setUser({ ...user, profilePicture: response.data });
        localStorage.setItem("user", JSON.stringify(user));
        setIsImageUploading(false);
      })
      .catch(() => setIsImageUploading(false));
  };

  const EventsPanel = ({ events }) => {
    return (
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} w="full" gap="5">
        {events?.map((event) => {
          return <Event props={event} key={event.id} />;
        })}
      </Grid>
    );
  };

  return (
    <Wrapper isLoading={isLoading}>
      <VStack p="50px">
        <input
          type="file"
          id="file"
          accept="image/*"
          ref={inputFile}
          style={{ display: "none" }}
          onChange={handleChangeProfilePicture}
        />
        <Center position="relative">
          <Image
            borderRadius="full"
            boxSize="200px"
            src={details?.profilePicture + `?${Date.now()}`}
            alt="avatar"
            objectFit="cover"
          />
          {isEditing && (
            <Box
              w="full"
              h="full"
              backgroundColor="whiteAlpha.600"
              position="absolute"
              borderRadius="full"
              display="flex"
              justifyContent="center"
              alignItems="center"
              cursor="pointer"
              onClick={() => handleUploadClick(inputFile)}
            >
              <IoAddCircleOutline size="100px" />
            </Box>
          )}
        </Center>

        {isEditing ? (
          <VStack
            w={{ base: "50%", lg: "25%" }}
            pt="5"
            gap="5"
            position="relative"
          >
            <Input
              value={details.username}
              onChange={(event) => {
                setDetails({ ...details, username: event.target.value });
                setError({ isError: false, message: "" });
              }}
              isInvalid={error.isError}
              margin="0"
            />
            <HStack w="full">
              <Button
                w="full"
                onClick={() => setIsEditing(false)}
                isLoading={isImageUploading}
              >
                Cancel
              </Button>
              {error.isError && (
                <Text color="red.500" position="absolute" top="0" left="0">
                  {error.message}
                </Text>
              )}
              <Button
                w="full"
                onClick={() => handleEditUsername()}
                colorScheme="teal"
                isLoading={isImageUploading}
              >
                Save
              </Button>
            </HStack>
          </VStack>
        ) : (
          <VStack pt="5" gap="5">
            <Heading size="lg" lineHeight="40px">
              {details?.username}
            </Heading>
            <HStack>
              <Button
                colorScheme="red"
                onClick={() => handleDeleteUser(user, setUser)}
              >
                Delete user
              </Button>
              <Button colorScheme="teal" onClick={() => setIsEditing(true)}>
                Edit user
              </Button>
            </HStack>
          </VStack>
        )}

        <Tabs w="full" isFitted>
          <TabList>
            <Tab isDisabled={details?.likedEvents?.length === 0}>
              Liked events
            </Tab>
            <Tab isDisabled={details?.attendedEvents?.length === 0}>
              Attended events
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <EventsPanel events={details?.likedEvents} />
            </TabPanel>
            <TabPanel>
              <EventsPanel events={details?.attendedEvents} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Wrapper>
  );
}

export default UserPage;
