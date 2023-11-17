import {
    Center,
    Grid,
    Heading,
    HStack,
    IconButton,
    Image,
    Input,
    Text,
    VStack,
    Tabs, TabList, TabPanels, Tab, TabPanel
} from "@chakra-ui/react";

import React, {useEffect, useState} from "react";
import axios from "axios";
import {apiUrl, userState} from "../atoms";
import {useRecoilValue} from "recoil";
import Wrapper from "../components/Wrapper";
import {BsCheck, BsPencilFill} from "react-icons/bs";
import Event from "../components/Event";
import {useNavigate} from "react-router-dom";


function UserPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [error, setError] = useState({isError: false,message:"" })
    const [details, setDetails] = useState()
    const baseApiUrl = useRecoilValue(apiUrl)
    const navigate = useNavigate()
    const {id} = useRecoilValue(userState)
    useEffect(() => {
        axios.get(baseApiUrl + `users/details/${id}`).then((response) => {
            setDetails(response.data)
            setIsLoading(false)
        }).catch(() => setIsLoading(false))
    }, [isEditing]);
    const handleChangeUsername = () => {
        axios.patch(baseApiUrl + `users/edit/${id}`, {username: details?.username}).then(()=> setIsEditing(false) ).catch(
            error => {
                if(error.response.status === 409){
                    setError({isError: true, message:"User already exists"})
                }else{
                    setError({isError: true, message: "Error occured, please try again later..."})
                }
            }
        )
    }

    const EventsPanel = ({events}) => {
        return(
            <Grid templateColumns={{base: "1fr", lg: "1fr 1fr"}} w="full" gap="5">
                {events?.map(event => {
                    return <Event props={event} key={event.id}/>
                })}
            </Grid>
        )
    }
    return (
        <Wrapper isLoading={isLoading}>
            <VStack p="50px">
                <Image
                    borderRadius="full"
                    boxSize="200px"
                    src="https://100k-faces.glitch.me/random-image"
                    alt-="avatar"
                />
                <HStack alignItems="center" p="10" position="relative">
                    {isEditing ? <>

                                <Input value={details?.username}
                                       onChange={(event) => {
                                           setDetails({...details, username: event.target.value})
                                           setError({isError: false, message: ""})
                                       }}
                                       isInvalid={error.isError}
                                />
                                {error.isError && <Text color="red.500" position="absolute" bottom="4">{error.message}</Text>}
                            <IconButton aria-label="edit username"
                                        icon={<BsCheck/>} variant="outline"
                                        colorScheme="teal"
                                        borderRadius="full"
                                        onClick={() => handleChangeUsername()}/>
                        </> :
                        <>
                            <Heading>{details?.username}</Heading>
                            <IconButton aria-label="edit username"
                                        icon={<BsPencilFill/>} variant="ghost"
                                        borderRadius="full"
                                        onClick={() => setIsEditing(true)}/>
                        </>
                    }

                </HStack>
                <Tabs w="full" isFitted>
                    <TabList>
                        <Tab isDisabled={details?.likedEvents?.length === 0}>Liked events</Tab>
                        <Tab isDisabled={details?.attendedEvents?.length === 0}>Attended events</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel >
                            <EventsPanel events={details?.likedEvents}/>
                        </TabPanel>
                        <TabPanel >
                            <EventsPanel events={details?.attendedEvents}/>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </VStack>
        </Wrapper>
    )
}

export default UserPage
