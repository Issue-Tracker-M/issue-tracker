import { Center, Spinner } from "@chakra-ui/react";
import React, { FC } from "react";

const Loading: FC = () => {
  return (
    <Center h="100%" w="100%">
      <Spinner size="xl" />
    </Center>
  );
};

export default Loading;
