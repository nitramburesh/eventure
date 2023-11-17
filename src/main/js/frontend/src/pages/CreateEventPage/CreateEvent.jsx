import React, { useRef, useState } from "react";

import "flatpickr/dist/themes/material_green.css";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { apiUrl, userState } from "../../atoms";
import {
  errorHeading,
  handleUploadClick,
  normalHeading,
  successHeading,
} from "../../utils/Utils";
import Flatpickr from "react-flatpickr";
import "../../flatpickr.css";
import ClickableTag from "../../components/ClickableTag";

function CreateEvent(props) {
  const datepickerRef = useRef();
  const defaultInputValue = { value: "" };
  const baseApiUrl = useRecoilValue(apiUrl);
  const [user, setUser] = useRecoilState(userState);
  const [titleImage, setTitleImage] = useState("");
  const [event, setEvent] = useState({
    title: defaultInputValue,
    price: defaultInputValue,
    city: defaultInputValue,
    postalCode: defaultInputValue,
    streetAddress: defaultInputValue,
    description: defaultInputValue,
    eventDate: defaultInputValue,
  });
  const [date, setDate] = useState();
  const [tag, setTag] = useState("");
  const [addedTags, setAddedTags] = useState([]);
  const [preview, setPreview] = useState();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const [isImageSelected, setIsImageSelected] = useState(false);
  const inputFile = useRef(null);
  const navigate = useNavigate();

  const updateEvent = (newObject) => {
    setEvent((event) => ({ ...event, ...newObject }));
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
  };

  const redirectToHomepage = () => {
    return setTimeout(() => {
      navigate("/");
    }, 2000);
  };
  const validateInputs = () => {
    const arrayFromObject = Object.entries(event);
    arrayFromObject.forEach((sublist) => {
      const inputObject = sublist[1];
      const inputKey = sublist[0];
      if (inputObject.value === "") {
        updateEvent({ [inputKey]: { value: "", error: true } });
      }
    });
  };
  const areInputsValid = () => {
    validateInputs();
    const objectList = Object.values(event);
    const errorList = objectList.map((object) => object.error);
    return !errorList.includes(undefined) && !errorList.includes(true);
  };
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("image", titleImage);
    const data = {
      creatorId: user.id,
      title: event.title.value,
      price: event.price.value,
      location: {
        city: event.city.value,
        streetAddress: event.streetAddress.value,
        postalCode: event.postalCode.value,
      },
      description: event.description.value,
      tags: addedTags,
      createdDate: new Date().toISOString(),
      eventDate: event.eventDate.value,
      image: formData,
    };
    console.log(data);
    if (areInputsValid()) {
      await axios
        .post(baseApiUrl + "events", data)
        .then(() => {
          redirectToHomepage();
          setSuccess(true);
        })
        .catch(() => setError(true));
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
          <VStack spacing="30px">
            {showHeading()}
            {isImageSelected && <Image src={preview} rounded="xl" />}
            <FormControl>
              <VStack gap="1" align="left">
                <FormLabel htmlFor="title">Title</FormLabel>
                <Input
                  isInvalid={event.title.error}
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

                <HStack w="full">
                  <VStack w="30%" alignItems="left">
                    <FormLabel htmlFor="city">City</FormLabel>
                    <Input
                      isInvalid={event.city.error}
                      placeholder="Enter city..."
                      id="city"
                      onChange={(event) => {
                        updateEvent({
                          city: { value: event.target.value, error: false },
                        });
                      }}
                    />
                  </VStack>
                  <VStack w="50%" alignItems="left">
                    <FormLabel htmlFor="street">Street address</FormLabel>

                    <Input
                      isInvalid={event.streetAddress.error}
                      placeholder="Enter street..."
                      id="street"
                      onChange={(event) => {
                        updateEvent({
                          streetAddress: {
                            value: event.target.value,
                            error: false,
                          },
                        });
                      }}
                    />
                  </VStack>
                  <VStack w="20%" alignItems="left">
                    <FormLabel htmlFor="postalCode">Postal code</FormLabel>
                    <Input
                      isInvalid={event.postalCode.error}
                      type="number"
                      placeholder="Postal code..."
                      id="postalCode"
                      onChange={(event) => {
                        updateEvent({
                          postalCode: {
                            value: event.target.value,
                            error: false,
                          },
                        });
                      }}
                    />
                  </VStack>
                </HStack>

                <FormLabel htmlFor="description">Description</FormLabel>
                <Textarea
                  isInvalid={event.description.error}
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
                        isInvalid={event.price.error}
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
                        value={date}
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
                leftIcon={<FontAwesomeIcon icon={faImage} title="image" />}
                onClick={() => handleUploadClick(inputFile)}
              >
                Upload image
              </Button>
              <Button
                onClick={() => handleSubmit()}
                isLoading={success}
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
