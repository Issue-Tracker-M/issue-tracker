import { Box, PropsOf, useColorMode, VStack } from "@chakra-ui/react";
import React, { FC } from "react";

/**
 * Fixed width container for lists of tasks
 */
const VerticalList: FC<PropsOf<typeof VStack>> = ({ children, ...rest }) => {
  const { colorMode } = useColorMode();
  const colorProps =
    colorMode === "light" ? { bgColor: "gray.100" } : { bgColor: "gray.700" };
  return (
    <Box h="100%" display="inline-block">
      <Box
        rounded="md"
        minWidth="17rem"
        boxShadow="lg"
        {...colorProps}
        maxH="100%"
        display="flex"
        margin="0 .25rem"
        justify="space-between"
        padding=".375rem .25rem"
        flexDir="column"
        {...rest}>
        {children}
      </Box>
    </Box>
  );
};

export default VerticalList;
