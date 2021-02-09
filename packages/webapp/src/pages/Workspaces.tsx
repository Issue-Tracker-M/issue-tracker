import { Heading, Wrap } from "@chakra-ui/react";
import React from "react";
import { FC } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppLayout } from "../components/Layout/AppLayout";
import PageNotFound from "./PageNotFound";

export const Workspaces: FC = () => {
  const workspaces = useSelector((state) => state.user.workspaces);
  if (!workspaces.length) return <PageNotFound />;
  return (
    <AppLayout>
      <Heading textAlign="center">Workspaces</Heading>
      <Wrap height="100%" width="100%">
        {workspaces.map((id) => (
          <Link to={`/w/${id}`} key={id}>
            {id}
          </Link>
        ))}
      </Wrap>
    </AppLayout>
  );
};
