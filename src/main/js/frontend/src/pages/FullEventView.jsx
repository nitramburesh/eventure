import React, { useEffect, useState } from "react";
import {
  Button,
  Center,
  Divider,
  Heading,
  Image,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl, userState } from "../atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { valuesAreEmpty } from "../utils/Utils";
import Wrapper from "../components/Wrapper";
import EventDetails from "../components/EventDetails";
import EventEdit from "../components/EventEdit";
import Comment from "../components/Comment";

function FullEventView(props) {
  const [event, setEvent] = useState({});
  const [isAttending, setIsAttending] = useState(false);
  const [comment, setComment] = useState({
    value: "",
    error: { isError: false, message: "" },
  });
  const { id } = useParams();
  const baseApiUrl = useRecoilValue(apiUrl);
  const [user, setUser] = useRecoilState(userState);
  const [isLiked, setIsLiked] = useState(false);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [isEventLoading, setIsEventLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isAuthor = event.creator?.id === user?.id;

  const setCommentError = (message) => {
    setComment({
      error: { isError: true, message: message },
      value: comment.value,
    });
  };

  useEffect(async () => {
    setIsEventLoading(true);
    try {
      const eventResponse = await axios.get(baseApiUrl + `events/${id}`, {
        params: { userId: user.id },
      });
      setEvent(eventResponse.data);
      setIsLiked(eventResponse.data.isLiked);
      setIsAttending(eventResponse.data.isAttending);
      setIsEventLoading(false);
    } catch (error) {
      setIsEventLoading(false);
    }
  }, [isEditing]);

  const handleLikedEvent = () => {
    setIsLiked(!isLiked);
    const updatedEvent = isLiked
      ? { ...event, likes: --event.likes }
      : { ...event, likes: ++event.likes };

    setEvent(updatedEvent);
    axios
      .patch(
        baseApiUrl + `events/${id}/likes`,
        {
          userId: user.id,
          likes: event.likes,
        },
        { withCredentials: false },
      )
      .then((response) => {
        setUser({ ...user, likedEvents: response.data });
      });
  };
  const handleAttendedEvent = () => {
    const updatedEvent = isAttending
      ? {
          ...event,
          attendees: event.attendees.filter((attendee) => attendee !== user.id),
        }
      : { ...event, attendees: [...event.attendees, user.id] };
    setEvent(updatedEvent);
    axios
      .patch(baseApiUrl + `events/${id}/attendees`, {
        userId: user.id,
        isAttending: !isAttending,
      })
      .then(({ data }) => {
        setIsAttending(data.isAttending);
        setUser({ ...user, attendedEvents: data.attendedEvents });
      });
  };
  const handlePostComment = () => {
    setIsCommentLoading(true);
    if (!valuesAreEmpty([comment.value.trim()])) {
      axios
        .post(baseApiUrl + `events/${id}/comments`, {
          comment: {
            userId: user.id,
            message: comment.value,
            date: Date.now(),
          },
        })
        .then((response) => {
          const postedComment = response.data;
          setComment({ value: "", error: { isError: false, message: "" } });
          setEvent({ ...event, comments: [...event.comments, postedComment] });
          setIsCommentLoading(false);
        })
        .catch(() => {
          setIsCommentLoading(false);
          setCommentError("Request failed.");
        });
    } else {
      setIsCommentLoading(false);
      setCommentError("Value cannot be empty.");
    }
  };

  return (
    <Wrapper isLoading={isEventLoading}>
      <Center>
        <VStack width="80%" justifySelf="center" spacing="30px" mt="50px">
          <Image
            src={event.image}
            w="100%"
            h={{ base: "150px", md: " 300px" }}
            objectFit="cover"
          />
          <VStack width="full" spacing="30px">
            {isEditing ? (
              <EventEdit
                event={event}
                setIsNotEditing={() => setIsEditing(false)}
                isEventLoading={isEventLoading}
                setIsEventLoading={setIsEventLoading}
              />
            ) : (
              <>
                <EventDetails
                  event={event}
                  isLiked={isLiked}
                  isAttending={isAttending}
                  isAuthor={isAuthor}
                  handleLikedEvent={() => handleLikedEvent()}
                  handleAttendedEvent={() => handleAttendedEvent()}
                  setIsEditing={() => setIsEditing(true)}
                />
                <Divider />
                <VStack w="80%" gap="5">
                  <Heading size="md">Comments</Heading>

                  {event.comments?.length === 0 ? (
                    <Text color="gray.500">
                      It looks empty out here, let the author know how you feel
                      and leave a comment!
                    </Text>
                  ) : (
                    event?.comments?.map((comment, index) => (
                      <Comment
                        comment={comment}
                        index={index}
                        user={user}
                        event={event}
                        setEvent={setEvent}
                      />
                    ))
                  )}

                  <VStack w="full" position="relative">
                    <Textarea
                      value={comment.value}
                      onInput={(event) => {
                        setComment({
                          value: event.target.value,
                          error: { isError: false, message: "" },
                        });
                      }}
                      isInvalid={comment.error.isError}
                    />

                    {comment.error && (
                      <Text position="absolute" bottom="0" color="red.500">
                        {comment.error.message}
                      </Text>
                    )}
                  </VStack>
                  <Button
                    isLoading={isCommentLoading}
                    onClick={() => handlePostComment()}
                    variant="solid"
                    colorScheme="teal"
                  >
                    Submit
                  </Button>
                </VStack>
              </>
            )}
          </VStack>
        </VStack>
      </Center>
    </Wrapper>
  );
}

export default FullEventView;
