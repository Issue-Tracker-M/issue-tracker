import { Box, Text, theme } from "@chakra-ui/react";
import React, { FC } from "react";

const VerticalList: FC = ({ children }) => {
  console.log(theme);
  return (
    <Box
      backgroundColor="gray.200"
      width="17rem"
      margin=".25rem"
      color="red"
      borderRadius={3}>
      {new Array(10).fill("Boppity bop").map((text, i) => (
        <Text key={i}>{text}</Text>
      ))}
      {children}
    </Box>
  );
};

export default React.memo(VerticalList);
