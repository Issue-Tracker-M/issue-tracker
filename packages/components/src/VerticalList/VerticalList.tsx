import { Box, theme } from "@chakra-ui/react";
import React, { FC, PropsWithChildren } from "react";

/**
 * Fixed width container for lists of tasks
 */
const VerticalList: FC<PropsWithChildren<any>> = ({ children }) => {
  console.log(theme);
  return (
    <Box width="17rem" margin="0 .25rem" h="100%" color="black">
      <Box backgroundColor="gray.100" rounded="md">
        <Box
          display="flex"
          flexDir="column"
          maxH="100%"
          position="relative"
          as="ul"
          margin="0 .25rem"
          padding="0 .25rem">
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(VerticalList);
