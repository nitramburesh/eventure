import {
  Button,
  Center,
  Divider,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Flatpickr from "react-flatpickr";
import "../flatpickr.css";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance, formatVenue } from "../utils/Utils";

function EventEdit(props) {
  const [event_, setEvent] = useState(props.event);
  const [tag, setTag] = useState("");
  const { id } = useParams();
  const handleEditEvent = () => {
    props.setIsEventLoading(true);
    axiosInstance
      .patch(`events/${id}/edit`, {
        title: event_.title,
        venueId: event_.venueId,
        description: event_.description,
        eventDate: event_.eventDate,
        tags: event_.tags,
      })
      .then(() => {
        props.setIsNotEditing();
        props.setIsEventLoading(false);
      })
      .catch(() => props.setIsEventLoading(false));
  };
  return (
    <>
      <VStack w="full" alignItems="left" gap="5">
        <VStack alignItems="left">
          <Heading as="h2" size="md">
            Title
          </Heading>
          <Input
            value={event_.title}
            onChange={(event) =>
              setEvent({ ...event_, title: event.target.value })
            }
          />
        </VStack>
        <VStack alignItems="left">
          <Heading as="h2" size="md">
            Venue
          </Heading>
          <Select
            onChange={(event) =>
              setEvent({ ...event_, venueId: event.target.value })
            }
          >
            {event_?.venues?.map((venue) => (
              <option value={venue.id} key={venue.id}>
                {formatVenue(venue)}
              </option>
            ))}
          </Select>
        </VStack>
        <VStack alignItems="left">
          <Heading as="h2" size="md">
            Date
          </Heading>
          <Flatpickr
            value={event_.eventDate}
            data-enable-time
            onChange={([date]) => {
              setEvent({ ...event_, eventDate: date.toISOString() });
            }}
            options={{
              altInput: true,
              altFormat: "F j, Y at H:i",
              dateFormat: "Z",
            }}
            placeholder="No date selected..."
          />
        </VStack>
        <VStack alignItems="left">
          <Heading as="h2" size="md">
            Description
          </Heading>
          <Textarea
            value={event_.description}
            onChange={(event) =>
              setEvent({ ...event_, description: event.target.value })
            }
            h="300px"
          />
        </VStack>
        <VStack alignItems="left">
          <Heading as="h2" size="md">
            Tags
          </Heading>
          <HStack w="full">
            <Input
              type="text"
              placeholder="Enter tags..."
              value={tag}
              id="tags"
              onChange={(event) => {
                setTag(event.target.value);
              }}
            />
            <Button
              onClick={() => {
                if (tag !== "" && !event_.tags.includes(tag.toLowerCase())) {
                  setEvent({ ...event_, tags: [...event_.tags, tag] });
                }
                setTag("");
              }}
            >
              +
            </Button>
          </HStack>
          <HStack>
            {event_.tags?.map((tag) => (
              <Button
                p={2}
                borderRadius="lg"
                bg="green.400"
                color="white"
                _hover={{
                  bg: "red.400",
                  textDecoration: "line-through",
                }}
                key={event_.tag}
                onClick={() => {
                  setEvent({
                    ...event_,
                    tags: event_.tags.filter(
                      (tagToDelete) => tag !== tagToDelete,
                    ),
                  });
                }}
              >
                {`#${tag.toLowerCase()}`}
              </Button>
            ))}
          </HStack>
        </VStack>
        <Divider />
        <Center w="full">
          <HStack w="50%">
            <Button
              w="full"
              colorScheme="red"
              variant="outline"
              onClick={props.setIsNotEditing}
            >
              CANCEL
            </Button>
            <Button
              w="full"
              colorScheme="teal"
              onClick={() => handleEditEvent()}
            >
              SAVE
            </Button>
          </HStack>
        </Center>
      </VStack>
    </>
  );
}

export default EventEdit;
