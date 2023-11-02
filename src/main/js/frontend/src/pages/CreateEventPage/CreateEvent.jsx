import React, { useState, useRef, useEffect } from "react";
import {
  Center,
  Box,
  Textarea,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Button,
  InputLeftElement,
  VStack,
  HStack,
  Image,
  InputGroup,
} from "@chakra-ui/react";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState, apiUrl } from "../../atoms";
import {
  errorHeading,
  successHeading,
  normalHeading,
  handleUploadClick,
  redirectTo,
} from "../../utils/Utils";

function CreateEvent(props) {
  const defaultInputValue = { value: "" };
  const baseApiUrl = useRecoilValue(apiUrl);
  const [user, setUser] = useRecoilState(userState);
  const [titleImage, setTitleImage] = useState("");
  const [event, setEvent] = useState({
    name: defaultInputValue,
    price: defaultInputValue,
    city: defaultInputValue,
    postalCode: defaultInputValue,
    streetAddress: defaultInputValue,
    description: defaultInputValue,
  });
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
    const isValid = !errorList.includes(undefined) && !errorList.includes(true);
    return isValid;
  };
  const handleSubmit = async () => {
    const data = {
      creatorId: "placeholderID",
      name: event.name.value,
      price: event.price.value,
      location: {
        city: event.city.value,
        streetAddress: event.streetAddress.value,
        postalCode: event.postalCode.value,
      },
      description: event.description.value,
      tags: addedTags,
      date: new Date(),
    };

    if (areInputsValid()) {
      await axios
        .post(baseApiUrl + "events", data)
        .then(() => {
          redirectToHomepage();
          setSuccess(true);
        })
        .catch(() => setError(true));
      // .catch(setError(true))
      // .then(setSuccess(true));
    }
    // const token = localStorage.getItem("token");
    // const config = {
    //   headers: { Authorization: `Bearer ${token}` },
    // };

    // event.preventDefault();
    // if (title.length < 5 || description.length < 5) {
    //   setError(true);
    // } else {
    //   const newEvent = {
    //     username: user.username,
    //     title: title,
    //     description: description,
    //   };
    //   if (titleImage) {
    //     const data = new FormData();
    //     const filename = Date.now() + titleImage.name;
    //     data.append("name", filename);
    //     data.append("file", titleImage);
    //     newPost.photo = filename;
    //     try {
    //       await axios
    //         .post("http://localhost:5000/api/upload", newPost, config)
    //         .then((res) => console.log("image saved"));
    //     } catch (error) {
    //       setError(true);
    //     }
    //   }
    //   try {
    //     await axios
    //       .post("http://localhost:5000/api/posts", newPost, config)
    //       .then(setSuccess(true), redirectToHomepage());
    //   } catch (error) {
    //     setError(true);
    //   }
    // }
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
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  isInvalid={event.name.error}
                  placeholder="Your event name goes here!"
                  id="name"
                  type="text"
                  onChange={(event) => {
                    updateEvent({
                      name: { value: event.target.value, error: false },
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
                        placeholder="Enter price..."
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
                  <VStack w="full">
                    <FormLabel htmlFor="tags">Tags</FormLabel>
                    <HStack w="full">
                      <Input
                        type="text"
                        placeholder="Enter tags and add them with button..."
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
                </HStack>
                <HStack>
                  {addedTags.map((tag) => (
                    <Button
                      p={2}
                      borderRadius="lg"
                      bg="green.400"
                      color="white"
                      _hover={{
                        bg: "red.400",
                        textDecoration: "line-through",
                      }}
                      key={tag}
                      onClick={() => {
                        setAddedTags(
                          addedTags.filter((tagToDelete) => tag !== tagToDelete)
                        );
                      }}
                    >
                      {`#${tag.toLowerCase()}`}
                    </Button>
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
