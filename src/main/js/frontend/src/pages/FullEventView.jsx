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
import { apiUrl } from "../atoms";
import {useRecoilValue} from "recoil";

function FullEventView(props) {
  const [event, setEvent] = useState({});
  const { id } = useParams();
  const baseApiUrl = useRecoilValue(apiUrl);


  useEffect(() => {
    try {
      axios
        .get(baseApiUrl + `events/${id}`)
        .then((res) => {
          setEvent(res.data);
          console.log(res.data)
        });
    } catch (error) {
      console.log(error);
    }
  }, []);
  const location = event.location?.city + ", " + event.location?.streetAddress
  return (
    <Center>
      <VStack width="80%" justifySelf="center" spacing="30px" mt="50px">
        <Image
          // src={event.image}
            src="https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          w="100%"
          h={{ base: "150px", md: " 300px" }}
          objectFit="cover"
        />
        <VStack width="80%" spacing="30px">
        <Heading>{event.title}</Heading>
        <Heading as={"h2"} size={"l"}>{location}</Heading>
        <Text textAlign="justify">{event.description}</Text>
        <HStack spacing={2} marginTop="30px">
          {event?.tags?.map((category) => {
            return (
              <Tag size={"md"} variant="solid" colorScheme="orange">
                {"#" + category}
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
            <Text fontWeight="medium">{event.username}</Text>
            <Text>—</Text>
            <Text>{new Date(event.date).toLocaleDateString()}</Text>
          </HStack>
        </Box>
        </VStack>
      </VStack>
    </Center>
  );
}

export default FullEventView;
