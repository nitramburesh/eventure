import React, { useEffect, useRef, useState } from "react";

import "flatpickr/dist/themes/material_green.css";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRecoilValue } from "recoil";
import { userState } from "../atoms";
import {
  areInputsValid,
  axiosInstance,
  errorHeading,
  handleUploadClick,
  normalHeading,
  successHeading,
} from "../utils/Utils";
import Flatpickr from "react-flatpickr";
import "../flatpickr.css";
import ClickableTag from "../components/ClickableTag";
import { CiImageOff } from "react-icons/ci";
import useDelayedRedirect from "../utils/useRedirectToHomepage";

function CreateEvent() {
  const [isLoading, setIsLoading] = useState(false);
  const datepickerRef = useRef();
  const defaultInputValue = { value: "" };
  const user = useRecoilValue(userState);
  const [titleImage, setTitleImage] = useState("");
  const [venues, setVenues] = useState([]);
  const [event_, setEvent] = useState({
    title: defaultInputValue,
    price: defaultInputValue,
    venueId: defaultInputValue,
    description: defaultInputValue,
    eventDate: defaultInputValue,
    image: defaultInputValue,
  });
  const [tag, setTag] = useState("");
  const [addedTags, setAddedTags] = useState([]);
  const [preview, setPreview] = useState();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const inputFile = useRef(null);
  const { redirectWithDelay } = useDelayedRedirect();

  useEffect(() => {
    axiosInstance("venues/all").then((response) => setVenues(response.data));
    const setColor = (color) => {
      document.documentElement.style.setProperty("--border-color", color);
    };
    event_.eventDate.error ? setColor("#d34c46") : setColor("#e3e8ef");
  }, [event_.eventDate]);
  const updateEvent = (newObject) => {
    setEvent((event_) => ({ ...event_, ...newObject }));
    setError(false);
  };

  const handleFileUpload = (event) => {
    const selectedImage = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPreview(reader.result);
      }
    };
    setTitleImage(selectedImage);
    setIsImageSelected(true);
    updateEvent({ image: { value: selectedImage, error: false } });
  };

  const handleSubmit = async () => {
    const imageFormData = new FormData();
    imageFormData.append("file", titleImage);

    if (areInputsValid(event_, updateEvent)) {
      setIsLoading(true);
      await axiosInstance
        .post("events/image", imageFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          updateEvent({
            image: { value: response.data },
          });
          const data = {
            creatorId: user.id,
            title: event_.title.value,
            price: event_.price.value,
            venueId: event_.venueId.value,
            description: event_.description.value,
            tags: addedTags,
            createdDate: new Date().toISOString(),
            eventDate: event_.eventDate.value,
            image: response.data,
          };

          return axiosInstance
            .post("events", data)
            .then(() => {
              redirectWithDelay("/");
              setSuccess(true);
            })
            .catch(() => {
              setIsLoading(false);
              setError(true);
            });
        });
    }
  };

  const showHeading = () => {
    if (success) {
      return successHeading("Success!", "Redirection to homepage...");
    } else if (error) {
      return errorHeading("Error!", "Please, try again later...");
    } else {
      return normalHeading("Create event!");
    }
  };
  return (
    <Center>
      <Box
        display="flex"
        mt="30px"
        py={{ base: 5, md: 30 }}
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        boxShadow="2xl"
        rounded="xl"
        w="75%"
      >
        <Box w={"60%"} pt="30px">
          <VStack>
            {showHeading()}
            {isImageSelected ? (
              <Image src={preview} rounded="xl" />
            ) : (
              <Center
                width="full"
                height="200px"
                flexDir="column"
                bgColor="gray.50"
                boxShadow="base"
                borderRadius="lg"
                cursor="pointer"
                onClick={() => handleUploadClick(inputFile)}
              >
                <CiImageOff
                  size="100px"
                  color={event_.image.error ? "red" : "gray"}
                />
                <Text color={event_.image.error ? "red.500" : "gray.500"}>
                  Image not selected...
                </Text>
              </Center>
            )}
            <FormControl>
              <VStack gap="1" align="left">
                <FormLabel htmlFor="title">Title</FormLabel>
                <Input
                  isInvalid={event_.title.error}
                  placeholder="Your event name goes here!"
                  id="title"
                  type="text"
                  onChange={(event) => {
                    updateEvent({
                      title: { value: event.target.value, error: false },
                    });
                  }}
                />
                <FormHelperText>
                  Be descriptive when naming your event.
                </FormHelperText>
                <FormLabel htmlFor="venue">Venue</FormLabel>
                <Select
                  placeholder="Select option"
                  id="venue"
                  onChange={(event) =>
                    updateEvent({
                      venueId: { value: event.target.value, error: false },
                    })
                  }
                  isInvalid={event_.venueId.error}
                >
                  {venues?.map((venue) => (
                    <option
                      value={venue.id}
                      key={venue.id}
                    >{`${venue.name}, ${venue.city}, ${venue.address} ${venue.postalCode}`}</option>
                  ))}
                </Select>
                <FormLabel htmlFor="description">Description</FormLabel>
                <Textarea
                  isInvalid={event_.description.error}
                  id="description"
                  type="text"
                  height="300px"
                  onChange={(event) => {
                    updateEvent({
                      description: { value: event.target.value, error: false },
                    });
                  }}
                />

                <HStack>
                  <VStack>
                    <FormLabel htmlFor="price">Price</FormLabel>
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        color="gray.300"
                        fontSize="1.2em"
                        children="$"
                      />
                      <Input
                        isInvalid={event_.price.error}
                        placeholder="Price..."
                        type="number"
                        min="1"
                        id="price"
                        onChange={(event) => {
                          updateEvent({
                            price: { value: event.target.value, error: false },
                          });
                        }}
                      />
                    </InputGroup>
                  </VStack>

                  <VStack w="50%">
                    <FormLabel htmlFor="tags">Tags</FormLabel>
                    <HStack w="full">
                      <Input
                        type="text"
                        placeholder="Enter tags..."
                        value={tag}
                        id="tags"
                        onChange={(event) => {
                          setTag(event.target.value);
                        }}
                      />
                      <Button
                        onClick={() => {
                          if (
                            tag !== "" &&
                            !addedTags.includes(tag.toLowerCase())
                          ) {
                            setAddedTags([...addedTags, tag]);
                          }
                          setTag("");
                        }}
                      >
                        +
                      </Button>
                    </HStack>
                  </VStack>
                  <VStack w="full">
                    <FormLabel htmlFor="date">Date</FormLabel>
                    <HStack w="full">
                      <Flatpickr
                        value={event_.eventDate.value}
                        data-enable-time
                        onChange={([date]) => {
                          updateEvent({
                            eventDate: {
                              value: date.toISOString(),
                              error: false,
                            },
                          });
                        }}
                        options={{
                          altInput: true,
                          altFormat: "F j, Y at H:i",
                          dateFormat: "Z",
                        }}
                        placeholder="No date selected..."
                        ref={datepickerRef}
                      ></Flatpickr>
                      <Button
                        onClick={() => datepickerRef.current.flatpickr.open()}
                      >
                        +
                      </Button>
                    </HStack>
                  </VStack>
                </HStack>
                <HStack>
                  {addedTags.map((tag) => (
                    <ClickableTag
                      onClick={() => {
                        setAddedTags(
                          addedTags.filter(
                            (tagToDelete) => tag !== tagToDelete,
                          ),
                        );
                      }}
                      tag={tag}
                      key={tag}
                      hoverStyles={{
                        bg: "red.400",
                        textDecoration: "line-through",
                      }}
                    />
                  ))}
                </HStack>
              </VStack>
            </FormControl>
            <HStack>
              <input
                type="file"
                id="file"
                accept="image/*"
                ref={inputFile}
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
              <Button
                isLoading={isLoading}
                leftIcon={<FontAwesomeIcon icon={faImage} title="image" />}
                onClick={() => handleUploadClick(inputFile)}
              >
                Upload image
              </Button>
              <Button
                onClick={() => handleSubmit()}
                isLoading={isLoading}
                colorScheme="teal"
                cursor={success ? "not-allowed" : "pointer"}
              >
                Submit
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Box>
    </Center>
  );
}

export default CreateEvent;
