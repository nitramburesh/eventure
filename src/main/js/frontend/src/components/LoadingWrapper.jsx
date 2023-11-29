import { Center, Spinner } from "@chakra-ui/react";

function LoadingWrapper(props) {
  return props.isLoading ? (
    <Center
      h="full"
      w="full"
      position="absolute"
      backgroundColor="blackAlpha.700"
      top="0"
      zIndex="100"
    >
      <Spinner
        thickness="30px"
        speed="1s"
        emptyColor="gray.200"
        color="black.200"
        w="200px"
        h="200px"
      />
    </Center>
  ) : (
    props.children
  );
}

export default LoadingWrapper;
