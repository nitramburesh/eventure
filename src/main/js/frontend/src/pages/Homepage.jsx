import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import Event from "../components/Event";
import { Flex, Center, Box, Heading, Divider, Button } from "@chakra-ui/react";
import axios from "axios";

export default function Homepage() {
  const [events, setEvents] = useState([]);
  const [hideButton, setHideButton] = useState(false);
  const showAllArticlesButton = () => {
    if (hideButton === false || events.length > 12) {
      return (
        <Button onClick={fetchAllEvents} mt="50px" variant="ghost">
          Show all articles
        </Button>
      );
    }
  };

  const fetchAllEvents = async () => {
    try {
      await axios.get("http://localhost:8080/api/v1/events/all", {withCredentials: true}).then((res) => {
        setEvents(res.data);
        setHideButton(true);
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    try {
      axios.get("http://localhost:8080/api/v1/events?amount=4", {withCredentials: true}).then((res) => {
        setEvents(res.data);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <Box height="100%">
      <Hero />
      <Center>
        <Heading as="h2" marginTop="5">
          Latest events
        </Heading>
      </Center>
      <Divider />
      <Flex
        wrap="wrap"
        gap={{ base: 0, md: "10px" }}
        justifyContent="space-around"
        p="5px"
      >
        {events.map((event) => (
          <Event props={event} key={event._id} />
        ))}
      </Flex>
      <Center>{showAllArticlesButton()}</Center>
    </Box>
  );
}
