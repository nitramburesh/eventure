import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import Event from "../components/Event";
import { Box, Button, Center, Divider, Grid, Heading } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingWrapper from "../components/LoadingWrapper";
import { axiosInstance } from "../utils/Utils";

export default function Homepage() {
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const ShowAllArticlesButton = () => {
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
  };

  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get("events?amount=6")
      .then((res) => {
        setEvents(res.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <LoadingWrapper isLoading={isLoading}>
      <Box height="100%">
        <Hero />
        <Center>
          <Heading as="h2" marginTop="5">
            Latest events
          </Heading>
        </Center>
        <Divider />
        <Grid
          templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" }}
          gap="5"
          p="5"
        >
          {events.map((event) => (
            <Event props={event} key={event.id} />
          ))}
        </Grid>
        <Center>
          <ShowAllArticlesButton />
        </Center>
      </Box>
    </LoadingWrapper>
  );
}
