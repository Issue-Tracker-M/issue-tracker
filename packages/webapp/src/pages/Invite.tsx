import {
  Button,
  ButtonGroup,
  Center,
  Heading,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { getInviteData } from "@issue-tracker/api";
import axios from "axios";
import React, { FC } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { AppLayout } from "../components/Layout/AppLayout";
import { Header } from "../components/Layout/Header";
import Loading from "../components/Layout/Loading";
import useAsyncThunk from "../hooks/useAsyncAction";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { refreshAuthToken } from "../store/authSlice";
import { fetchInvitationData } from "../store/thunks";
import PageNotFound from "./PageNotFound";

const AskToAuth: FC<{ invitationData: getInviteData }> = ({
  invitationData,
}) => {
  const location = useLocation();
  return (
    <>
      <Heading textAlign="center">
        You need to
        {invitationData.user_id ? " be logged in" : " register an account"} to
        join this workspace.
      </Heading>
      <Center>
        <ButtonGroup size="lg" spacing="6">
          {invitationData.user_id ? (
            <Link to={{ pathname: "/login", state: { referrer: location } }}>
              <Button colorScheme="twitter">Log in</Button>
            </Link>
          ) : (
            <Link to={{ pathname: "/signup", state: { referrer: location } }}>
              <Button colorScheme="teal">Sign up</Button>
            </Link>
          )}
        </ButtonGroup>
      </Center>
    </>
  );
};

export const Invite: FC = () => {
  const history = useHistory();
  const { invite_token } = useParams<{ invite_token: string }>();

  const { loggedIn, invitationData } = useSelector((state) => ({
    loggedIn: !!state.auth.token,
    invitationData: state.auth.invitation,
  }));
  const user = useCurrentUser();

  const { loading: authenticating, error: authError } = useAsyncThunk(
    refreshAuthToken,
    undefined,
    () => !loggedIn
  );

  const { loading: loadingInvite, error: inviteError } = useAsyncThunk(
    fetchInvitationData,
    invite_token,
    () => !invitationData
  );

  const toast = useToast();
  /* 
  // 2. If unable - ask to either login or signup
  // 3. if able - ask if user wants to join the workspace
  // 4. Yes - add the user to the workspace
  // 5. No - redirect to home
  // 6. Remove the token on server side.
  */

  return (
    <AppLayout>
      <VStack alignItems="center">
        <Header />
        <VStack spacing="8">
          {authenticating || loadingInvite ? (
            <Loading />
          ) : authError && invitationData ? (
            <AskToAuth invitationData={invitationData} />
          ) : inviteError ||
            !invitationData ||
            user?.email !== invitationData.email ? (
            <PageNotFound />
          ) : (
            <>
              <Heading>
                {`${invitationData.invited_by.fullName} is inviting you to 
                ${invitationData.invited_to.name}, would you like to join?`}
              </Heading>
              <Center w="100%">
                <ButtonGroup size="lg" spacing="6">
                  <Button
                    colorScheme="teal"
                    onClick={() => {
                      axios
                        .post(`/auth/invite/${invite_token}`, {
                          acceptInvite: true,
                        })
                        .then(() =>
                          history.push(`/w/${invitationData.invited_to._id}`)
                        )
                        .catch((err) => {
                          console.log(err);
                          toast({
                            title: "Couldn't accept the invite",
                            description:
                              "Something went wrong, please try again later.",
                            status: "error",
                            duration: 9000,
                            isClosable: true,
                          });
                        });
                    }}>
                    Yes
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() => {
                      axios
                        .post(`/auth/invite/${invite_token}`, {
                          acceptInvite: false,
                        })
                        .then(() => history.push(`/home`));
                    }}>
                    No
                  </Button>
                </ButtonGroup>
              </Center>
            </>
          )}
        </VStack>
      </VStack>
    </AppLayout>
  );
};
