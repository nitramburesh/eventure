import React from "react";
import {
  Box,
  Heading,
  HStack,
  Image,
  Link,
  Tag,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { formatDateTime } from "../utils/Utils";
import { useLocation, useNavigate } from "react-router-dom";

function Event({ props }) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedTags = new Set(
    params.size === 0 ? [] : params.get("tags")?.split("_"),
  );
  const handleSelectedTag = (tag) => {
    selectedTags.add(tag);
    const query = Array.from(selectedTags).join("_");
    navigate(`/allEvents?tags=${query}`);
  };
  const BlogTags = ({ marginTop, tags }) => {
    return (
      <HStack spacing={2} marginTop={marginTop}>
        {tags.map((tag) => {
          return (
            <Tag
              size={"md"}
              variant="solid"
              colorScheme="orange"
              key={tag}
              _hover={{ cursor: "pointer" }}
              onClick={() => handleSelectedTag(tag)}
            >
              {tag}
            </Tag>
          );
        })}
      </HStack>
    );
  };

  const BlogAuthor = (props) => {
    return (
      <HStack marginTop="2" spacing="2" display="flex" alignItems="center">
        <Image
          borderRadius="full"
          boxSize="40px"
          src="https://100k-faces.glitch.me/random-image"
          alt={`Avatar of ${props.name}`}
        />
        <Text fontWeight="medium">{props.name}</Text>
        <Text>—</Text>
        <Text>{props.date.toLocaleDateString()}</Text>
      </HStack>
    );
  };

  const sliceArticleDescription = (description) => {
    if (description.length > 350) {
      return description.slice(0, 350) + "...";
    } else {
      return description;
    }
  };

  return (
    <Box width="100%">
      <Wrap spacing="30px" marginTop="5">
        <WrapItem>
          <Box w="100%">
            <Box borderRadius="lg" overflow="hidden">
              <Link
                textDecoration="none"
                _hover={{ textDecoration: "none" }}
                href={`/event/${props.id}`}
              >
                <Image
                  transform="scale(1.0)"
                  src={
                    "https://images.unsplash.com/photo-1698778874316-84d21debbc61?auto=format&fit=crop&q=80&w=3570&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
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
            <Text color="gray.500">{formatDateTime(props.eventDate)}</Text>
            <Text as="p" fontSize="md" marginTop="2">
              {sliceArticleDescription(props.description)}
            </Text>
            <BlogAuthor
              name={props.username}
              date={new Date(props.createdDate)}
            />
          </Box>
        </WrapItem>
      </Wrap>
    </Box>
  );
}

export default Event;
