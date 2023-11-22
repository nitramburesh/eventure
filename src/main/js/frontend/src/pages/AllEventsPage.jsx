import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../atoms";
import { useRecoilValue } from "recoil";
import Event from "../components/Event";
import {
  Button,
  Center,
  Divider,
  Grid,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import ClickableTag from "../components/ClickableTag";
import { getSelectedTags } from "../utils/Utils";
import { AiFillDelete, AiOutlineSearch } from "react-icons/ai";
import { CgHashtag } from "react-icons/cg";
import useDeleteTag from "../utils/useDeleteTag";
import useAddTag from "../utils/useAddTag";
import useClearTags from "../utils/useClearTags";

function AllEventsPage(props) {
  const baseApiUrl = useRecoilValue(apiUrl);
  const [events, setEvents] = useState();
  const [search, setSearch] = useState({ title: "", tag: "" });
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedTags = getSelectedTags(params);
  const { handleDeleteTag } = useDeleteTag(selectedTags);
  const { handleAddTagFilter } = useAddTag();
  const { handleClearTags } = useClearTags(selectedTags);

  useEffect(() => {
    axios.get(baseApiUrl + "events/all").then((response) => {
      setEvents(response.data);
    });
  }, []);
  const NoTagsSelectedView = () => {
    return (
      <Text color="gray.500" fontSize="20px" flexGrow="1" textAlign="center">
        No tags are selected...
      </Text>
    );
  };
  const SelectedTagsView = () => {
    return (
      <>
        <HStack flexGrow="1" justifyContent="center" flexWrap="wrap">
          {[...selectedTags].map((tag) => (
            <ClickableTag
              onClick={() => handleDeleteTag(tag)}
              tag={tag}
              key={tag}
              hoverStyles={{
                bg: "red.400",
                textDecoration: "line-through",
              }}
            />
          ))}
        </HStack>
        <IconButton
          onClick={() => handleClearTags()}
          aria-label="clear all tags"
          icon={<AiFillDelete />}
          justifySelf="flex-end"
          colorScheme="red"
        />
      </>
    );
  };
  const SelectedTags = () => {
    return (
      <HStack w="50%">
        {selectedTags.size === 0 ? (
          <NoTagsSelectedView />
        ) : (
          <SelectedTagsView />
        )}
      </HStack>
    );
  };
  return (
    <Center p="10">
      <VStack w="full">
        <Heading size="lg">Search events</Heading>
        <InputGroup w="50%">
          <InputLeftAddon children={<AiOutlineSearch />} />
          <Input
            placeholder="Search events by title..."
            value={search.title}
            onChange={(event) =>
              setSearch({ ...search, title: event.target.value })
            }
          />
        </InputGroup>
        <InputGroup w="50%">
          <InputLeftAddon children={<CgHashtag />} />
          <Input
            placeholder="Search by tags..."
            value={search.tag}
            onChange={(event) =>
              setSearch({ ...search, tag: event.target.value })
            }
          />
          <InputRightElement>
            <Button
              borderLeftRadius="0"
              colorScheme="teal"
              onClick={() =>
                handleAddTagFilter(selectedTags, search, setSearch)
              }
            >
              +
            </Button>
          </InputRightElement>
        </InputGroup>
        <SelectedTags />
        <Divider pt="10" />
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="10" pt="10">
          {events
            ?.filter((event_) => {
              return [...selectedTags].length === 0
                ? true
                : [...selectedTags].some((tag) => event_.tags.includes(tag));
            })
            .filter((event_) =>
              event_.title.toLowerCase().includes(search.title.toLowerCase()),
            )
            .map((event_) => (
              <Event props={event_} key={event_.id} />
            ))}
        </Grid>
      </VStack>
    </Center>
  );
}

export default AllEventsPage;
