import {
  Box,
  chakra,
  Container,
  Link,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
function Footer(props) {
  const SocialButton = ({ children, label, href }) => {
    return (
      <chakra.button
        bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
        rounded={"full"}
        w={8}
        h={8}
        cursor={"pointer"}
        as={"a"}
        href={href}
        display={"inline-flex"}
        alignItems={"center"}
        justifyContent={"center"}
        transition={"background 0.3s ease"}
        _hover={{
          bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
        }}
      >
        <VisuallyHidden>{label}</VisuallyHidden>
        {children}
      </chakra.button>
    );
  };
  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
      position="absolute"
      left="0"
      bottom="0"
      right="0"
    >
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        spacing={4}
        justify={"center"}
        align={"center"}
      >
        <Stack direction={"row"} spacing={6}>
          <Link href={"/"}>Home</Link>
          <Link href={"/login"}>Log in</Link>
          <Link href={"/signup"}>Sign up</Link>
        </Stack>
      </Container>

      <Box
        borderTopWidth={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Container
          as={Stack}
          maxW={"6xl"}
          py={4}
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justify={{ base: "center", md: "space-between" }}
          align={{ base: "center", md: "center" }}
        >
          <Text>© 2023 - tento projekt je vytvořen v rámci předmětu PPRO.</Text>
          <Stack direction={"row"} spacing={6}>
            <SocialButton label={"Twitter"} href={"https://twitter.com/"}>
              <FontAwesomeIcon icon={faTwitter} />
            </SocialButton>
            <SocialButton label={"YouTube"} href={"https://youtube.com/"}>
              <FontAwesomeIcon icon={faYoutube} />
            </SocialButton>
            <SocialButton label={"Instagram"} href={"https://instagram.com/"}>
              <FontAwesomeIcon icon={faInstagram} />
            </SocialButton>
            <SocialButton label={"Facebook"} href={"https://facebook.com/"}>
              <FontAwesomeIcon icon={faFacebook} />
            </SocialButton>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

export default Footer;
