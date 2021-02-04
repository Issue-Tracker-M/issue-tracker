import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
  VStack,
  Button,
  Divider,
  HStack,
  Link,
  Center,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";

const DrawerNav = () => {
  const { isOpen, onToggle } = useDisclosure(); /* Control panel opening */
  return (
    <>
      <motion.div
        animate={{
          height: "100vh",
          width: isOpen ? "300px" : "0",
        }}
        style={{ overflow: "hidden" }}
        initial={{ width: "0px" }}>
        <HStack
          color="black"
          bg="white"
          rounded="md"
          h="100vh"
          w="100%"
          justify="space-between"
          align="flex-start"
          overflowY="auto">
          <VStack w="100%">
            <Center direction="row" justify="space-between" width="inherit  ">
              <Heading>Logo</Heading>
              <IconButton
                aria-label="Close sidebar"
                onClick={onToggle}
                onFocus={() => (isOpen ? null : onToggle())}
                icon={<CloseIcon />}
              />
            </Center>
            <Link as={RouterLink} to="/home">
              Content
            </Link>
          </VStack>
          <Divider orientation="vertical" />
        </HStack>
      </motion.div>
      {!isOpen && (
        <IconButton
          position="absolute"
          top="1rem"
          left="1rem"
          aria-label="Open Nav menu"
          icon={<HamburgerIcon />}
          onClick={onToggle}
        />
      )}
    </>
  );
};

const Home = () => {
  return (
    <Box display="flex" flexDir="row">
      <DrawerNav />
      <Heading width="100%">CONTENT</Heading>
    </Box>
  );
};

export default Home;
