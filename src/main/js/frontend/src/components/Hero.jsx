import React from "react";
import { Box, Heading, Container, Text, Button, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../atoms";
function Hero(props) {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const handleRedirectToCreateEvent = () => {
    user ? navigate("/createEvent") : navigate("/login");
  };

  return (
    <Container maxW={"3xl"}>
      <Stack
        as={Box}
        textAlign={"center"}
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 36 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
        >
          The ultimate <br />
          <Text as={"span"} color={"green.400"}>
            event hub.
          </Text>
        </Heading>
        <Text color={"gray.500"}>
          This is your ultimate chance to create and attend
          <strong> AMAZING EVENTS!</strong>
          <br />
          Create or attend events as you please, this is your chance to be
          creative and meet new people.
        </Text>
        <Stack
          direction={"column"}
          align={"center"}
          alignSelf={"center"}
          position={"relative"}
        >
          <Button
            colorScheme={"green"}
            bg={"green.400"}
            rounded={"full"}
            _hover={{
              bg: "green.500",
            }}
            fontSize={{ base: 12, md: 16 }}
            padding={{ base: 3, md: 5 }}
            onClick={() => handleRedirectToCreateEvent()}
          >
            Create your event!
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}

export default Hero;
