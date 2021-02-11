import {
  Box,
  Center,
  Collapse,
  Link,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { useCallback } from "react";
import { FC } from "react";
import { useSelector } from "react-redux";
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import { useThunkDispatch } from "../../hooks/useThunkDispatch";
import { workspaceSelectors } from "../../store/entities/workspaces";
import { toggleSideBar } from "../../store/workspace/workspaceSlice";
import { Sidebar } from "./Sidebar";

const WorkspacesNavs = () => {
  const workspaces = useSelector((state) =>
    workspaceSelectors.selectAll(state)
  );
  const { isOpen, onToggle } = useDisclosure();
  return (
    <>
      <Center w="100%" minW="12rem" h="2rem" onClick={onToggle}>
        Your workspaces
      </Center>
      <Collapse in={isOpen} animateOpacity>
        {workspaces.map((w) => (
          <NavItem key={w._id} to={`/w/${w._id}`} content={w.name} />
        ))}
      </Collapse>
    </>
  );
};

const NavItem: FC<{ to: string; content: ReactNode }> = ({ to, content }) => {
  const match = useRouteMatch();
  const selected = match.url === to;
  return (
    <Link as={RouterLink} to={to}>
      <Box
        w="100%"
        minW="12rem"
        transition="background-color ease-in 0.1s"
        h="2rem"
        _hover={{ bgColor: selected ? "gray.500" : "gray.700" }}
        bgColor={selected ? "gray.600" : "inherit"}>
        {content}
      </Box>
    </Link>
  );
};

export const SidebarNav: FC = () => {
  const isSidebarOpen = useSelector(
    (state) => state.workspaceDisplay.isSidebarOpen
  );
  const dispatch = useThunkDispatch();
  const toggle = useCallback(() => dispatch(toggleSideBar()), [dispatch]);
  const workspaces = useSelector((state) =>
    workspaceSelectors.selectAll(state)
  );
  return (
    <Sidebar
      isOpen={isSidebarOpen}
      onOpen={toggle}
      onClose={toggle}
      backgroundColor="gray.800"
      color="gray.100">
      <VStack spacing="0">
        <NavItem to="/home" content="Home" />
        <NavItem to="/w" content={"All workspaces"} />
        {workspaces.map((w) => (
          <NavItem key={w._id} to={`/w/${w._id}`} content={w.name} />
        ))}
        <WorkspacesNavs />
      </VStack>
    </Sidebar>
  );
};
