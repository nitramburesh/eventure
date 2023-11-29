import {
  Button,
  Heading,
  HStack,
  Image,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { formatDate, formatDateTime, formatVenue } from "../utils/Utils";
import React from "react";
import {
  BsPencilFill,
  BsPersonCheckFill,
  BsPersonFillAdd,
} from "react-icons/bs";
import { AiFillDelete, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import ClickableTag from "./ClickableTag";
import useTagNavigation from "../utils/useTagNagivate";

function EventDetails(props) {
  const { handleSelectedTag } = useTagNavigation();
  const attendButtonStyles = props.isAttending
    ? {
        bgColor: "green.500",
        color: "white",
        borderColor: "green.500",
        icon: <BsPersonCheckFill />,
      }
    : {
        bgColor: "white",
        color: "black",
        borderColor: "black",
        icon: <BsPersonFillAdd />,
      };
  const likedButtonStyles = props.isLiked
    ? {
        bgColor: "red.500",
        color: "white",
        borderColor: "red.500",
        icon: <AiFillHeart />,
      }
    : {
        bgColor: "white",
        color: "black",
        borderColor: "black",
        icon: <AiOutlineHeart />,
      };
  return (
    <>
      <Heading>{props.event.title}</Heading>
      <Text fontSize="20px" color="gray.700">
        {formatVenue(props.venue)}
      </Text>
      <Text fontSize="20px" color="gray.700">
        {formatDateTime(props.event.eventDate)}
      </Text>
      <Text textAlign="justify" w="80%">
        {props.event.description}
      </Text>
      <HStack spacing={2} marginTop="30px" w="80%" justifyContent="center">
        {props.event?.tags?.map((tag) => {
          return (
            <ClickableTag
              tag={tag}
              key={tag}
              onClick={() => handleSelectedTag(tag)}
              hoverStyles={{ bgColor: "green.800" }}
            />
          );
        })}
      </HStack>
      <HStack>
        <Button
          onClick={props.handleLikedEvent}
          backgroundColor={likedButtonStyles.bgColor}
          color={likedButtonStyles.color}
          borderColor={likedButtonStyles.borderColor}
          borderWidth="2px"
          _hover={{ backgroundColor: "red.300" }}
          display="flex"
          gap="2"
          py="2"
          leftIcon={likedButtonStyles.icon}
        >
          {props.event.likes}
        </Button>
        <Button
          onClick={props.handleAttendedEvent}
          backgroundColor={attendButtonStyles.bgColor}
          color={attendButtonStyles.color}
          borderColor={attendButtonStyles.borderColor}
          borderWidth="2px"
          _hover={{ backgroundColor: "green.300" }}
          display="flex"
          gap="2"
          py="2"
          leftIcon={attendButtonStyles.icon}
        >
          {props.event?.attendees?.length}
        </Button>
      </HStack>
      <VStack justifySelf="left" display="flex" gap="5">
        <HStack marginTop="2" spacing="2" display="flex" alignItems="center">
          <Image
            borderRadius="full"
            boxSize="40px"
            src={props.event.creator?.profilePicture}
            alt-="avatar"
          />
          <Text fontWeight="medium">{props.event.creator?.username}</Text>
          <Text>—</Text>
          <Text>{formatDate(props.event.createdDate)}</Text>
        </HStack>
        {props.isAuthor && (
          <HStack>
            <Button
              onClick={props.setIsEditing}
              colorScheme="yellow"
              variant="outline"
              borderWidth="2px"
              display="flex"
              gap="2"
              py="2"
              w="full"
              leftIcon={<BsPencilFill />}
            >
              EDIT EVENT
            </Button>
            <Button
              onClick={props.handleDeleteEvent}
              colorScheme="red"
              display="flex"
              gap="2"
              py="2"
              w="full"
              leftIcon={<AiFillDelete />}
            >
              DELETE EVENT
            </Button>
          </HStack>
        )}
      </VStack>
    </>
  );
}

export default EventDetails;
