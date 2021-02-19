import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Collapse,
  Flex,
  Heading,
  Link,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { useCallback } from "react";
import { FC } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import { useThunkDispatch } from "../../hooks/useThunkDispatch";
import { workspaceSelectors } from "../../store/entities/workspaces";
import { toggleSideBar } from "../../store/workspace/workspaceSlice";
import { Logo } from "./Logo";
import { Sidebar } from "./Sidebar";

const WorkspacesNavs = () => {
  const workspaces = useSelector((state) =>
    workspaceSelectors.selectAll(state)
  );
  const { isOpen, onToggle } = useDisclosure();
  return (
    <>
      <Flex
        as={Button}
        w="100%"
        variant="ghost"
        justify="start"
        h="2rem"
        alignItems="center"
        alignContent="center"
        onClick={onToggle}
        color="gray.400"
        _hover={{ color: "gray.200" }}
        padding="0 1.5rem">
        <Text>Your workspaces</Text>
        <Center h="100%">
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Center>
      </Flex>
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
      <Flex
        as={Button}
        w="100%"
        minW="15rem"
        transition="background-color ease-in 0.1s"
        justify="start"
        alignItems="center"
        fontSize="sm"
        padding="0 1.5rem"
        h="2rem"
        _hover={{ bgColor: selected ? "gray.500" : "gray.700" }}
        bgColor={selected ? "gray.600" : "inherit"}>
        {content}
      </Flex>
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
      color="gray.200">
      <Logo fontSize="2xl" textAlign="center" p="3" />
      <VStack spacing="0">
        <NavItem
          to="/home"
          content={
            <>
              <AiOutlineHome /> Home
            </>
          }
        />
        <NavItem to="/w" content={"All workspaces"} />
        {workspaces.map((w) => (
          <NavItem key={w._id} to={`/w/${w._id}`} content={w.name} />
        ))}
        <WorkspacesNavs />
      </VStack>
    </Sidebar>
  );
};
