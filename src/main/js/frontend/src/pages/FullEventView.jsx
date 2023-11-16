import React, {useEffect, useState} from "react";
import {
    Heading,
    Text,
    HStack,
    Image,
    VStack,
    Tag,
    Center,
    Box, IconButton, Button, Textarea, Wrap, Container, Divider, FormControl, FormErrorMessage,
} from "@chakra-ui/react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {apiUrl, userState} from "../atoms";
import {useRecoilState, useRecoilValue} from "recoil";
import {formatDate, formatDateTime, valuesAreEmpty} from "../utils/Utils";
import {AiFillHeart, AiOutlineHeart, AiFillDelete} from 'react-icons/ai'
import {BsPersonCheckFill, BsPersonFillAdd} from 'react-icons/bs'
import Wrapper from "../components/Wrapper";


function FullEventView(props) {
    const [event, setEvent] = useState({});
    const [isAttending, setIsAttending] = useState(false)
    const [comment, setComment] = useState({value: "", error: {isError: false, message: ""}})
    const {id} = useParams();
    const baseApiUrl = useRecoilValue(apiUrl);
    const [user, setUser] = useRecoilState(userState)
    const [isLiked, setIsLiked] = useState(false)
    const [isCommentLoading, setIsCommentLoading] = useState(false)
    const [isEventLoading, setIsEventLoading] = useState(false)
    const setCommentError = (message) => {
        setComment({error: {isError: true, message: message}, value: comment.value})
    }
    const attendButtonStyles =
        isAttending ?
            {
                bgColor: "green.500",
                color: "white",
                borderColor: "green.500",
                icon: <BsPersonCheckFill/>
            } : {bgColor: "white", color: "black", borderColor: "black", icon: <BsPersonFillAdd/>}
    const likedButtonStyles =
        isLiked ?
            {bgColor: "red.500", color: "white", borderColor: "red.500", icon: <AiFillHeart/>} : {
                bgColor: "white",
                color: "black",
                borderColor: "black",
                icon: <AiOutlineHeart/>
            }
    const location = event.location?.city + ", " + event.location?.streetAddress + ", " + event.location?.postalCode
    useEffect(async () => {
        setIsEventLoading(true)
        try {
            const userResponse = await axios
                .get(baseApiUrl + `users/6543d1a9dd11214cd4a36486`)
            setUser({...user, likedEvents: userResponse.data})
            const eventResponse = await axios
                .get(baseApiUrl + `events/${id}`, {params: {userId: user.id}})
            setEvent(eventResponse.data);
            setIsLiked(eventResponse.data.isLiked)
            setIsAttending(eventResponse.data.isAttending)
            setIsEventLoading(false)
        } catch (error) {
            setIsEventLoading(false)
            console.log(error);
        }
    }, []);

    const handleLikedEvent = () => {

        setIsLiked(!isLiked)
        const updatedEvent = isLiked ? {...event, likes: --event.likes} : {...event, likes: ++event.likes}

        setEvent(updatedEvent)
        axios.patch(baseApiUrl + `events/${id}/likes`, {
            userId: user.id,
            likes: event.likes
        }, {withCredentials: false}).then(response => {
            setUser({...user, likedEvents: response.data})
        })

    }
    const handleAttendedEvent = () => {
        const updatedEvent = isAttending ? {
            ...event,
            attendees: event.attendees.filter(attendee => attendee !== user.id)
        } : {...event, attendees: [...event.attendees, user.id]}
        setEvent(updatedEvent)
        axios.patch(baseApiUrl + `events/${id}/attendees`, {
            userId: user.id,
            isAttending: !isAttending
        }).then(({data}) => {
            setIsAttending(data.isAttending)
            setUser({...user, attendedEvents: data.attendedEvents})
            // setEvent({...event, attendees: response.data})
        })
    }
    const handlePostComment = () => {
        setIsCommentLoading(true)
        if (!valuesAreEmpty([comment.value.trim()])) {
            const newComment = {
                userId: user.id,
                username: user.username,
                message: comment.value,
                date: Date.now()
            }
            axios.post(baseApiUrl + `events/${id}/comments`, {
                comment: {
                    userId: user.id,
                    message: comment.value,
                    date: Date.now()
                }
            }).then((response) => {
                const postedComment = response.data
                setComment({value: "", error: {isError: false, message: ""}})
                setEvent({...event, comments: [...event.comments, postedComment]})
                setIsCommentLoading(false)
            }).catch(() => {
                setIsCommentLoading(false)
                setCommentError("Request failed.")
            })
        } else {
            setIsCommentLoading(false)
            setCommentError("Value cannot be empty.")
        }
    }
    const handleDeleteComment = (commentId) => {

        axios.delete(baseApiUrl + `events/${id}/comments`, {
            data: {
                commentId
            }
        }).then(() => {
            const filteredComments =
                event.comments.filter(({id}) => id !== commentId)
            setEvent({...event, comments: filteredComments})
        })
    }
    const commentView = (comment, index) => {

        return (
            <HStack p="3" borderRadius="md" w="full" align="flex-start"
                    backgroundColor={(index % 2 === 0) ? "blackAlpha.50" : "white"}
                    position="relative"
                    key={comment.id}
            >
                <Image
                    borderRadius="full"
                    boxSize="40px"
                    src="https://100k-faces.glitch.me/random-image"
                    alt-="avatar"
                />
                <VStack alignItems="flex-start">

                    <Text as="b">{comment.username} </Text>

                    <Text>
                        {comment.message}
                    </Text>
                    <Text color="grey">{formatDateTime(comment.date)}</Text>
                </VStack>
                {comment.userId === user.id &&
                    <IconButton aria-label="delete" icon={<AiFillDelete/>} colorScheme="red" position="absolute"
                                right="0" bottom="0" h="full" borderRightRadius="md" borderLeftRadius="0"
                                onClick={() => handleDeleteComment(comment.id)}
                    />}
            </HStack>
        )
    }
    return (
        <Wrapper isLoading={isEventLoading}>
            <Center>
                <VStack width="80%" justifySelf="center" spacing="30px" mt="50px">
                    <Image
                        // src={event.image}
                        src="https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        w="100%"
                        h={{base: "150px", md: " 300px"}}
                        objectFit="cover"
                    />
                    <VStack width="80%" spacing="30px">
                        <Heading>{event.title}</Heading>
                        <Heading as={"h2"} size={"l"}>{location}</Heading>
                        <Tag backgroundColor="green.200">{formatDateTime(event.eventDate)}</Tag>
                        <Text textAlign="justify">{event.description}</Text>
                        <HStack spacing={2} marginTop="30px">
                            {event?.tags?.map((category) => {
                                return (
                                    <Tag size={"md"} variant="solid" colorScheme="orange" key={category}>
                                        {"#" + category}
                                    </Tag>
                                );
                            })}
                        </HStack>
                        <HStack>
                            <Button onClick={() => handleLikedEvent()} backgroundColor={likedButtonStyles.bgColor}
                                    color={likedButtonStyles.color} borderColor={likedButtonStyles.borderColor}
                                    borderWidth="2px" _hover={{backgroundColor: "red.300"}} display="flex" gap="2"
                                    py='2'
                                    leftIcon={likedButtonStyles.icon}>{event.likes}</Button>
                            <Button onClick={() => handleAttendedEvent()} backgroundColor={attendButtonStyles.bgColor}
                                    color={attendButtonStyles.color} borderColor={attendButtonStyles.borderColor}
                                    borderWidth="2px" _hover={{backgroundColor: "green.300"}} display="flex" gap="2"
                                    py='2'
                                    leftIcon={attendButtonStyles.icon}>{event?.attendees?.length}</Button>
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
                                <Text>{formatDate(event.createdDate)}</Text>
                            </HStack>
                        </Box>
                        <Divider/>
                        <VStack w="80%" gap="5">
                            <Heading size="md">Comments</Heading>

                            {event?.comments?.map((comment, index) => commentView(comment, index))}

                            <VStack w="full" position="relative">
                                <Textarea value={comment.value} onInput={(event) => {
                                    setComment({value: event.target.value, error: {isError: false, message: ""}})
                                }}
                                          isInvalid={comment.error.isError}
                                />

                                {comment.error &&
                                    <Text position="absolute" bottom="0"
                                          color="red.500"> {comment.error.message}</Text>}
                            </VStack>
                            <Button isLoading={isCommentLoading} onClick={() => handlePostComment()} variant="solid"
                                    colorScheme="teal">Submit</Button>
                        </VStack>

                    </VStack>
                </VStack>
            </Center>
        </Wrapper>
    );
}

export default FullEventView;
