import { HStack, IconButton, Image, Text, VStack } from "@chakra-ui/react";
import { formatDateTime } from "../utils/Utils";
import { AiFillDelete } from "react-icons/ai";
import React from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { apiUrl } from "../atoms";

const Comment = ({ comment, index, user, event, setEvent }) => {
  const baseApiUrl = useRecoilValue(apiUrl);
  const handleDeleteComment = (commentId) => {
    axios
      .delete(baseApiUrl + `events/${event.id}/comments`, {
        data: {
          commentId,
        },
      })
      .then(() => {
        const filteredComments = event.comments.filter(
          ({ id }) => id !== commentId,
        );
        setEvent({ ...event, comments: filteredComments });
      });
  };
  return (
    <HStack
      p="3"
      borderRadius="md"
      w="full"
      align="flex-start"
      backgroundColor={index % 2 === 0 ? "blackAlpha.50" : "white"}
      position="relative"
      key={comment.id}
    >
      <Image
        borderRadius="full"
        boxSize="40px"
        src={comment.profilePicture}
        alt-="avatar"
      />
      <VStack alignItems="flex-start">
        <Text as="b">{comment.username} </Text>

        <Text>{comment.message}</Text>
        <Text color="grey">{formatDateTime(comment.date)}</Text>
      </VStack>
      {comment.userId === user.id && (
        <IconButton
          aria-label="delete"
          icon={<AiFillDelete />}
          colorScheme="red"
          position="absolute"
          right="0"
          bottom="0"
          h="full"
          borderRightRadius="md"
          borderLeftRadius="0"
          onClick={() => handleDeleteComment(comment.id)}
        />
      )}
    </HStack>
  );
};

export default Comment;
