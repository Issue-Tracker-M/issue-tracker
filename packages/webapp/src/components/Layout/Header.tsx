import { BoxProps, Heading } from "@chakra-ui/react";
import React, { FC } from "react";

export const Header: FC<BoxProps> = ({ children, ...rest }) => {
  return (
    <Heading
      as="header"
      bgColor="teal"
      minH="3rem"
      textAlign="center"
      color="white"
      {...rest}>
      {children}
    </Heading>
  );
};
