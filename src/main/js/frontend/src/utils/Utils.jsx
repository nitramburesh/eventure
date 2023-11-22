import { Heading, Text } from "@chakra-ui/react";
import axios from "axios";

export const errorHeading = (heading, description) => (
  <>
    <Heading
      textAlign={"center"}
      fontSize={{ base: "2xl", sm: "4xl" }}
      color="red.500"
    >
      {heading}
    </Heading>
    <Text color="red.400" fontSize={{ base: "lg", sm: "xl" }}>
      {description}
    </Text>
  </>
);

export const normalHeading = (heading, description) => (
  <>
    <Heading textAlign={"center"} fontSize={{ base: "2xl", sm: "4xl" }}>
      {heading}
    </Heading>
    <Text fontSize={{ base: "lg", sm: "xl" }} color={"gray.500"}>
      {description}
    </Text>
  </>
);

export const successHeading = (heading, description) => (
  <>
    <Heading
      textAlign={"center"}
      fontSize={{ base: "2xl", sm: "4xl" }}
      color="green.500"
    >
      {heading}
    </Heading>
    <Text fontSize={{ base: "lg", sm: "xl" }} color={"green.300"}>
      {description}
    </Text>
  </>
);

export const handleUploadClick = (inputFile) => {
  inputFile.current.click();
};

export const valuesAreEmpty = (values) => {
  return values.includes("");
};
export const formatDateTime = (date) => {
  const dateObject = new Date(date);
  const year = dateObject.getFullYear();
  const month = dateObject.toLocaleString("default", { month: "numeric" });
  const day = dateObject.getDay();
  const hours = dateObject.getHours().toString().padStart(2, "0");
  const minutes = dateObject.getMinutes().toString().padStart(2, "0");
  return `${day}.${month}.${year} at ${hours}:${minutes}`;
};
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};
export const getSelectedTags = (params) => {
  return new Set(params.size === 0 ? [] : params.get("tags")?.split("_"));
};

export const handleLogout = async (baseApiUrl, setUser) => {
  await axios.post(baseApiUrl + "logout");
  await localStorage.clear();
  await setUser(null);
};

export const handleEnterPress = (event, callback) => {
  console.log("called");
  if (event.keyCode === 13) {
    return callback();
  }
};

export const formatLocation = (location) => {
  return (
    location?.city +
    ", " +
    location?.streetAddress +
    ", " +
    location?.postalCode
  );
};
export const sliceArticleDescription = (description) => {
  if (description.length > 350) {
    return description.slice(0, 350) + "...";
  } else {
    return description;
  }
};

export const areInputsValid = (event, updateEvent) => {
  validateInputs(event, updateEvent);
  const objectList = Object.values(event);
  const errorList = objectList.map((object) => object.error);
  return !errorList.includes(undefined) && !errorList.includes(true);
};
const validateInputs = (event, updateEvent) => {
  const arrayFromObject = Object.entries(event);
  arrayFromObject.forEach((sublist) => {
    const inputObject = sublist[1];
    const inputKey = sublist[0];
    if (inputObject.value === "") {
      updateEvent({ [inputKey]: { value: "", error: true } });
    }
  });
};
