import { Heading, Text } from "@chakra-ui/react";

export const errorHeading = (heading, description) => (
  <>
    <Heading
      textAlign={"center"}
      fontSize={{ base: "2xl", sm: "4xl" }}
      color="red.500"
    >
      {heading}
    </Heading>
    <Text color="red.400">{description}</Text>
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
