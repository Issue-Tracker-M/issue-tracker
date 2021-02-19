import { Center, Heading, Wrap } from "@chakra-ui/react";
import React from "react";
import { FC } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppLayout } from "../components/Layout/AppLayout";
import { useEntity } from "../hooks/useEntity";
import PageNotFound from "./PageNotFound";

export const Workspaces: FC = () => {
  const curUserId = useSelector((state) => state.auth.currentUserId);
  const currentUser = useEntity("users", curUserId!);
  return (
    <AppLayout>
      <Heading textAlign="center">Workspaces</Heading>
      {currentUser && currentUser.loaded ? (
        currentUser.workspaces.length ? (
          <Wrap height="100%" width="100%">
            {currentUser.workspaces.map((id) => (
              <Link to={`/w/${id}`} key={id}>
                {id}
              </Link>
            ))}
          </Wrap>
        ) : (
          <PageNotFound />
        )
      ) : (
        <Center>
          Looks like you are not a part of any workspace yet, create a new one?
        </Center>
      )}
    </AppLayout>
  );
};
