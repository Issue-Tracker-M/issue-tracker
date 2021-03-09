import { Center, Flex, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Logo } from "./Logo";

export const FormLayout: FC = ({ children }) => {
  return (
    <Flex flexDir="column" h="100vh" w="100vw">
      <Header flex="0 0 auto">
        <Center h="100%">
          <Logo size="lg" />
        </Center>
      </Header>
      <Center flex="1 1 auto">{children}</Center>
      <Footer flex="0 0 auto">
        <Center h="100%">
          <Text color="white" textAlign="center" fontSize="lg">
            ©2021
          </Text>
        </Center>
      </Footer>
    </Flex>
  );
};
