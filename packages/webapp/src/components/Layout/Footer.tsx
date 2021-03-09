import { BoxProps, Box } from "@chakra-ui/react";
import React, { FC } from "react";

export const Footer: FC<BoxProps> = ({ children, ...rest }) => {
  return (
    <Box as="footer" bgColor="teal" minH="3rem" {...rest}>
      {children}
    </Box>
  );
};
