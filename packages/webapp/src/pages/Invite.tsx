import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Container,
  Heading,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { AppLayout } from "../components/Layout/AppLayout";
import { Header } from "../components/Layout/Header";
import useAsyncThunk from "../hooks/useAsyncAction";
import { refreshAuthToken } from "../store/authSlice";

export const Invite: FC = () => {
  const history = useHistory();
  const { invite_token } = useParams<{ invite_token: string }>();
  const loggedIn = useSelector((state) => !!state.auth.token);
  useAsyncThunk(refreshAuthToken, undefined, () => !loggedIn);
  /* 
  // 2. If unable - ask to either login or signup
  // 3. if able - ask if user wants to join the workspace
  // 4. Yes - add the user to the workspace
  // 5. No - redirect to home
  // 6. Remove the token on server side.
  */

  if (loggedIn)
    return (
      <AppLayout>
        <VStack alignItems="center">
          <Header />
          <Box>
            <Heading>X is inviting you to Y, would you like to join?</Heading>
            <Center w="100%">
              <ButtonGroup size="lg" spacing="6">
                <Button colorScheme="teal">Yes</Button>
                <Button colorScheme="red" onClick={() => history.push("/home")}>
                  No
                </Button>
              </ButtonGroup>
            </Center>
          </Box>
        </VStack>
      </AppLayout>
    );

  return (
    <VStack spacing="2">
      <pre>{JSON.stringify(history, null, 2)}</pre>
    </VStack>
  );
};
