import { Center, Heading, Link, Wrap, WrapItem } from "@chakra-ui/react";
import React from "react";
import { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import { AppLayout } from "../components/Layout/AppLayout";
import { NewWorkspaceModal } from "../components/NewWorkspaceModal";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useEntity } from "../hooks/useEntity";

const WorkspaceCard: FC<{ id: string }> = ({ id }) => {
  const workspace = useEntity("workspaces", id);
  if (!workspace)
    return <Heading color="red.500">Something went wrong!</Heading>;
  return (
    <Center
      bgColor="teal.500"
      h="6rem"
      w="10rem"
      rounded="md"
      transition="background-color .1s ease-in-out"
      textAlign="center"
      _hover={{ bgColor: "teal.600" }}>
      <Heading fontSize="xl" color="white">
        {workspace.name}
      </Heading>
    </Center>
  );
};

export const Workspaces: FC = () => {
  const currentUser = useCurrentUser()!;
  return (
    <AppLayout>
      <Heading textAlign="center" margin="4">
        Workspaces
      </Heading>
      {currentUser.workspaces.length ? (
        <Wrap padding="1rem" justify="center">
          {currentUser.workspaces.map((id) => (
            <WrapItem key={id}>
              <Link
                as={RouterLink}
                to={`/w/${id}`}
                key={id}
                margin="1rem"
                rounded="md">
                <WorkspaceCard id={id} key={id} />
              </Link>
            </WrapItem>
          ))}
        </Wrap>
      ) : (
        <Center padding="2rem">
          Looks like you are not a part of any workspace yet, create a new one?
        </Center>
      )}
      <Center>
        <NewWorkspaceModal />
      </Center>
    </AppLayout>
  );
};
