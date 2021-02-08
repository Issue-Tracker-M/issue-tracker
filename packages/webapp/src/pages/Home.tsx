import { Center, Heading } from "@chakra-ui/react";
import React, { FC } from "react";
import { AppLayout } from "../components/Layout/AppLayout";

const Home: FC = () => {
  return (
    <AppLayout>
      <Center height="100%" width="100%">
        <Heading>Welcome to issue tracker! 🚀</Heading>
      </Center>
    </AppLayout>
  );
};

export default Home;
