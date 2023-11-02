import React, { useEffect, useState } from "react";
import {
  Heading,
  Text,
  HStack,
  Image,
  VStack,
  Tag,
  Center,
  Box,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axios from "axios";

function FullArticle(props) {
  const [article, setArticle] = useState({});
  const { id } = useParams();
  useEffect(() => {
    try {
      axios
        .get(`http://localhost:5000/api/posts/${id}`)
        .then((res) => setArticle(res.data));
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <Center>
      <VStack width="80%" justifySelf="center" spacing="30px" mt="50px">
        <Image
          src={article.photo}
          w="100%"
          h={{ base: "150px", md: " 300px" }}
          objectFit="cover"
        />
        <Heading>This is the article heading</Heading>
        <Text textAlign="justify">{article.description}</Text>
        <HStack spacing={2} marginTop="30px">
          {article?.categories?.map((category) => {
            return (
              <Tag size={"md"} variant="solid" colorScheme="orange">
                {category}
              </Tag>
            );
          })}
        </HStack>
        <Box justifySelf="left">
          <HStack marginTop="2" spacing="2" display="flex" alignItems="center">
            <Image
              borderRadius="full"
              boxSize="40px"
              src="https://100k-faces.glitch.me/random-image"
              alt-="avatar"
            />
            <Text fontWeight="medium">{article.username}</Text>
            <Text>—</Text>
            <Text>{new Date(article.createdAt).toLocaleDateString()}</Text>
          </HStack>
        </Box>
      </VStack>
    </Center>
  );
}

export default FullArticle;
