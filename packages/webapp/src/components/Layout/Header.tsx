import { Box, Heading } from "@chakra-ui/react";
import React, { FC, PropsWithChildren } from "react";

export const Header: FC<PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <Heading
      as="header"
      bgColor="teal"
      minH="3rem"
      textAlign="center"
      color="white">
      {children}
    </Heading>
  );
};
