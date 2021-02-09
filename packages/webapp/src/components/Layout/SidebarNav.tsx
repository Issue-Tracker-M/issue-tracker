import { Link, VStack } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { FC } from "react";
import { useParams, Link as RouterLink, useRouteMatch } from "react-router-dom";
import { Sidebar } from "./Sidebar";

const NavItem: FC<{ to: string; content: ReactNode }> = ({ to, content }) => {
  const params = useParams<{ workspaceId: string }>();
  const match = useRouteMatch();
  console.log(params, match);
  return (
    <Link as={RouterLink} to={to} _hover={{ bgColor: "blue" }}>
      {content}
    </Link>
  );
};

export const SidebarNav: FC = () => {
  return (
    <Sidebar>
      <VStack spacing="4">
        <NavItem to="/home" content="Home" />
        <NavItem to="/w" content="All workspaces" />
      </VStack>
    </Sidebar>
  );
};
