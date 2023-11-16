import {
    Button,
    Center,
    Divider,
    FormLabel,
    Heading,
    HStack,
    Input,
    Tag,
    Text,
    Textarea,
    VStack
} from "@chakra-ui/react";
import React, {useState} from "react";
import Flatpickr from "react-flatpickr";
import '../flatpickr.css'
import axios from "axios";
import {apiUrl} from "../atoms";
import {useRecoilValue} from "recoil";
import {useNavigate, useParams} from "react-router-dom";

function EventEdit(props) {
    const [event_, setEvent] = useState(props.event)
    const [tag, setTag] = useState("")
    const baseApiUrl = useRecoilValue(apiUrl);
    const {id} = useParams()
    const navigate = useNavigate();
    const handleEditEvent = () => {
        props.setIsEventLoading(true)
        axios.patch(baseApiUrl + `events/${id}/edit`, {
            title: event_.title,
            location: event_.location,
            description: event_.description,
            eventDate: event_.eventDate,
            tags: event_.tags
        })
            .then(() => {
                props.setIsNotEditing()
                props.setIsEventLoading(false)
            })
            .catch(() => props.setIsEventLoading(false))
    }
    return (
        <>
            <VStack w="full" alignItems="left" gap="5">
                <VStack alignItems="left">
                    <Heading as="h2" size="md">Title</Heading>
                    <Input value={event_.title} onChange={(event) => setEvent({...event_, title: event.target.value})}/>
                </VStack>
                <VStack alignItems="left">
                    <Heading as="h2" size="md">Location</Heading>
                    <HStack w="full">
                        <VStack w="30%" alignItems="left">
                            <FormLabel htmlFor="city">City</FormLabel>
                            <Input
                                value={event_.location.city}
                                placeholder="Enter city..."
                                id="city"
                                onChange={(event) => {
                                    setEvent({...event_, location: {...event_.location, city: event.target.value}})
                                }}
                            />
                        </VStack>
                        <VStack w="50%" alignItems="left">
                            <FormLabel htmlFor="street">Street address</FormLabel>

                            <Input
                                value={event_.location.streetAddress}
                                placeholder="Enter street..."
                                id="street"
                                onChange={(event) => {
                                    setEvent({
                                        ...event_,
                                        location: {...event_.location, streetAddress: event.target.value}
                                    })
                                }}
                            />
                        </VStack>
                        <VStack w="20%" alignItems="left">
                            <FormLabel htmlFor="postalCode">Postal code</FormLabel>
                            <Input
                                value={event_.location.postalCode}
                                type="number"
                                placeholder="Postal code..."
                                id="postalCode"
                                onChange={(event) => {
                                    setEvent({
                                        ...event_,
                                        location: {...event_.location, postalCode: event.target.value}
                                    })
                                }}
                            />
                        </VStack>
                    </HStack>
                </VStack>
                <VStack alignItems="left">
                    <Heading as="h2" size="md">Date</Heading>
                    <Flatpickr
                        value={event_.eventDate}
                        data-enable-time
                        onChange={([date]) => {
                            setEvent({...event_, eventDate: date.toISOString()});
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
                    <Heading as="h2" size="md">Description</Heading>
                    <Textarea value={event_.description}
                              onChange={(event) => setEvent({...event_, description: event.target.value})} h="300px"/>
                </VStack>
                <VStack alignItems="left">
                    <Heading as="h2" size="md">Tags</Heading>
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
                                if (
                                    tag !== "" &&
                                    !event_.tags.includes(tag.toLowerCase())
                                ) {
                                    setEvent({...event_, tags: [...event_.tags, tag]});
                                }
                                setTag("");
                            }}
                        >
                            +
                        </Button>
                    </HStack>
                    <HStack>
                        {event_.tags.map((tag) => (
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
                                    setEvent(
                                        {...event_, tags: event_.tags.filter((tagToDelete) => tag !== tagToDelete)}
                                    );
                                }}
                            >
                                {`#${tag.toLowerCase()}`}
                            </Button>))}
                    </HStack>
                </VStack>
                <Divider/>
                <Center w="full">
                    <HStack w="50%">
                        <Button w="full" colorScheme="red" variant="outline"
                                onClick={props.setIsNotEditing}>CANCEL</Button>
                        <Button w="full" colorScheme="teal" onClick={() => handleEditEvent()}>SAVE</Button>
                    </HStack>
                </Center>
            </VStack>
        </>
    )
}

export default EventEdit