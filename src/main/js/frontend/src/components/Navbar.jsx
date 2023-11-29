import React, { useRef } from "react";

import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  IconButton,
  Image,
  Text,
  useDisclosure,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useRecoilState } from "recoil";
import { userState } from "../atoms";
import { handleLogout } from "../utils/Utils";

function Navbar() {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [user, setUser] = useRecoilState(userState);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  const LoggedInLinks = () => {
    return (
      <>
        <Link to="/createEvent" onClick={onClose}>
          NEW EVENT
        </Link>
        <Link
          to="/"
          onClick={() => {
            handleLogout(setUser).then(() => onClose());
          }}
        >
          LOG OUT
        </Link>
      </>
    );
  };
  const ProfilePicture = () => {
    return (
      <Link to="/userDetails">
        <Image
          rounded="full"
          width="40px"
          height="40px"
          objectFit="cover"
          src={user.profilePicture + `?${Date.now()}`}
        />
      </Link>
    );
  };
  const mobileLinks = (
    <>
      <Box display="flex" flex="1" justifyContent="right" mr="20px">
        <IconButton
          aria-label="Open menu"
          variant="solid"
          colorScheme="teal"
          onClick={onOpen}
          icon={<FontAwesomeIcon icon={faBars} />}
        >
          OPEN MENU
        </IconButton>
      </Box>
      <Drawer
        placement="top"
        size="30%"
        onClose={onClose}
        isOpen={isOpen}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay bgColor="white" />
        <DrawerContent>
          <DrawerHeader
            borderBottomWidth="1px"
            alignSelf="center"
            p="20px"
            fontSize="20px"
          >
            Menu
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing="6">
              <Link to="/" onClick={onClose}>
                {" "}
                HOME
              </Link>
              <Link to="/allEvents" onClick={onClose}>
                {" "}
                ALL EVENTS
              </Link>
              {user ? (
                <LoggedInLinks />
              ) : (
                <>
                  <Link to="/signup" onClick={onClose}>
                    SIGN UP
                  </Link>
                  <Link to="/login" onClick={onClose}>
                    LOG IN
                  </Link>
                </>
              )}
              <IconButton
                aria-label="close menu"
                onClick={onClose}
                variant="ghost"
                icon={<FontAwesomeIcon icon={faXmark} />}
              >
                CLOSE
              </IconButton>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );

  const desktopLinks = (
    <Box
      display="flex"
      justifyContent="space-around"
      flex="1"
      alignItems="center"
    >
      <Link to="/">HOME</Link>
      <Link to="/allEvents">ALL EVENTS</Link>
      {user ? (
        <>
          <LoggedInLinks />
          <ProfilePicture />
        </>
      ) : (
        <>
          <Link to="/signup">SIGN UP</Link>
          <Link to="/login">LOG IN</Link>
        </>
      )}
    </Box>
  );

  return (
    <Box
      bgColor="beige"
      display="flex"
      justifyContent="space-around"
      alignItems="center"
      position="sticky"
      minHeight={isMobile ? "80px" : "85px"}
    >
      <Box flex="1">
        <Heading pl="20px" color={"green.400"}>
          Event
          <Text as={"span"} color={"black"}>
            ure
          </Text>
        </Heading>
      </Box>
      {isMobile ? mobileLinks : desktopLinks}
    </Box>
  );
}

export default Navbar;
