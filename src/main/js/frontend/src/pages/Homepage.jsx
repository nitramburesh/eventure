import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import Event from "../components/Event";
import { Box, Button, Center, Divider, Grid, Heading } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const [events, setEvents] = useState([]);
  const [hideButton, setHideButton] = useState(false);
  const navigate = useNavigate();
  const ShowAllArticlesButton = () => {
    if (hideButton === false && events.length > 3) {
      return (
        <Button
          onClick={() => navigate("/allEvents")}
          mt="50px"
          variant="outline"
          colorScheme="teal"
        >
          See all articles
        </Button>
      );
    } else {
      return <></>;
    }
  };

  useEffect(() => {
    try {
      axios.get("http://localhost:8080/api/v1/events?amount=4").then((res) => {
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
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="5" p="5">
        {events.map((event) => (
          <Event props={event} key={event.id} />
        ))}
      </Grid>
      <Center>
        <ShowAllArticlesButton />
      </Center>
    </Box>
  );
}
