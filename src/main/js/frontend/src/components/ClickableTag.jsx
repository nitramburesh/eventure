import { Button } from "@chakra-ui/react";
import React from "react";

const ClickableTag = ({ onClick, tag }) => {
  return (
    <Button
      p={2}
      borderRadius="lg"
      bg="green.400"
      color="white"
      _hover={{
        bg: "red.400",
        textDecoration: "line-through",
      }}
      onClick={onClick}
    >
      {`#${tag.toLowerCase()}`}
    </Button>
  );
};

export default ClickableTag;
