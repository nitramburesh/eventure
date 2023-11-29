import React from "react";
import {
  Box,
  Heading,
  HStack,
  Image,
  Link,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  formatDateTime,
  formatVenue,
  sliceArticleDescription,
} from "../utils/Utils";
import ClickableTag from "./ClickableTag";
import useTagNavigation from "../utils/useTagNagivate";
import EventAuthor from "./EventAuthor";

function Event({ props }) {
  const { handleSelectedTag } = useTagNavigation();
  const BlogTags = ({ marginTop, tags }) => {
    return (
      <HStack spacing={2} marginTop={marginTop}>
        {tags.map((tag) => {
          return (
            <ClickableTag
              onClick={() => handleSelectedTag(tag)}
              tag={tag}
              key={tag}
              hoverStyles={{
                bg: "green.800",
              }}
            />
          );
        })}
      </HStack>
    );
  };

  return (
    <Box width="100%" bgColor="gray.100" borderRadius="lg" boxShadow="md">
      <Wrap spacing="30px">
        <WrapItem>
          <Box w="100%">
            <Box borderTopRadius="lg" overflow="hidden">
              <Link
                textDecoration="none"
                _hover={{ textDecoration: "none" }}
                href={`/event/${props.id}`}
              >
                <Image
                  transform="scale(1.0)"
                  src={props.image}
                  alt="cover photo"
                  objectFit="contain"
                  width="100%"
                  transition="0.3s ease-in-out"
                  _hover={{
                    transform: "scale(1.05)",
                  }}
                />
              </Link>
            </Box>
            <Box px="5" pb="5">
              <BlogTags tags={props.tags} marginTop="3" />
              <Heading fontSize="xl" marginTop="2" gap="5" display="flex">
                <Link
                  textDecoration="none"
                  _hover={{ textDecoration: "none" }}
                  href={`/event/${props.id}`}
                >
                  {props.title}
                </Link>
              </Heading>
              <Text color="gray.700">{formatDateTime(props.eventDate)}</Text>
              <Text color="gray.500">{formatVenue(props.venue)}</Text>
              <Text as="p" fontSize="md" marginTop="2">
                {sliceArticleDescription(props.description)}
              </Text>
              <EventAuthor
                name={props.creator?.username}
                profilePicture={props.creator?.profilePicture}
                date={new Date(props.createdDate)}
              />
            </Box>
          </Box>
        </WrapItem>
      </Wrap>
    </Box>
  );
}

export default Event;
