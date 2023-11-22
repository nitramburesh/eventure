import { Button } from "@chakra-ui/react";
import React from "react";

const ClickableTag = ({ onClick, tag, hoverStyles }) => {
  return (
    <Button
      h="30px"
      p="2"
      borderRadius="lg"
      colorScheme="teal"
      color="white"
      _hover={hoverStyles}
      onClick={onClick}
    >
      {`#${tag.toLowerCase()}`}
    </Button>
  );
};

export default ClickableTag;
