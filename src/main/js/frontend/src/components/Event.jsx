import React from "react";
import {
  Heading,
  Box,
  Image,
  Divider,
  Link,
  Text,
  Wrap,
  WrapItem,
  Center,
  HStack,
  Tag,
} from "@chakra-ui/react";

function Event({ props }) {
  const BlogTags = ({ marginTop, tags }) => {
    return (
      <HStack spacing={2} marginTop={marginTop}>
        {tags.map((tag) => {
          return (
            <Tag size={"md"} variant="solid" colorScheme="orange" key={tag}>
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
    <Box width={{ base: "100%", lg: "45%" }}>
      <Wrap spacing="30px" marginTop="5">
        <WrapItem>
          <Box w="100%">
            <Box borderRadius="lg" overflow="hidden">
              <Link
                textDecoration="none"
                _hover={{ textDecoration: "none" }}
                href={`/fullArticle/${props._id}`}
              >
                <Image
                  transform="scale(1.0)"
                  src={
                    props.photo === ""
                      ? "https://images.unsplash.com/photo-1648737153811-69a6d8c528bf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80"
                      : props.photo
                  }
                  alt="cover photo"
                  objectFit="contain"
                  width="100%"
                  transition="0.3s ease-in-out"
                  _hover={{
                    transform: "scale(1.2)",
                  }}
                />
              </Link>
            </Box>
            <BlogTags tags={props.tags} marginTop="3" />
            <Heading fontSize="xl" marginTop="2">
              <Link
                textDecoration="none"
                _hover={{ textDecoration: "none" }}
                href="/fullArticle"
              >
                {props.title}
              </Link>
            </Heading>
            <Text as="p" fontSize="md" marginTop="2">
              {sliceArticleDescription(props.description)}
            </Text>
            <BlogAuthor
              name={props.username}
              date={new Date(props.createdAt)}
            />
          </Box>
        </WrapItem>
      </Wrap>
    </Box>
  );
}

export default Event;
