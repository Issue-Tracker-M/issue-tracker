import {
  ChevronDownIcon,
  ChevronUpIcon,
  MoonIcon,
  SunIcon,
} from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Center,
  Collapse,
  HStack,
  Icon,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  PropsOf,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import React, { useCallback, FC } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { BsCardList, BsCircle } from "react-icons/bs";
import { useSelector } from "react-redux";
import {
  Link as RouterLink,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
import { useThunkDispatch } from "../../hooks/useThunkDispatch";
import { workspaceSelectors } from "../../store/entities/workspaces";
import {
  toggleSideBar,
  toggleWorkspaceList,
} from "../../store/display/displaySlice";
import { Logo } from "./Logo";
import { Sidebar } from "./Sidebar";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { logOutUser } from "../../store/authSlice";

const WorkspacesLinks = () => {
  const workspaces = useSelector((state) =>
    workspaceSelectors.selectAll(state)
  );
  const { isWorkspaceListOpen } = useSelector(
    (state) => state.workspaceDisplay
  );
  const dispatch = useThunkDispatch();
  return (
    <>
      <Button
        variant="unstyled"
        w="100%"
        display="flex"
        justifyContent="start"
        alignItems="center"
        alignContent="center"
        onClick={() => dispatch(toggleWorkspaceList())}
        bgColor="inherit"
        _hover={{ bgColor: isWorkspaceListOpen ? "gray.500" : "gray.700" }}
        rounded="none"
        h="2rem"
        fontSize="xs"
        rightIcon={
          isWorkspaceListOpen ? <ChevronUpIcon /> : <ChevronDownIcon />
        }
        padding="0 1.5rem">
        Go to workspace
      </Button>
      <Collapse in={isWorkspaceListOpen} animateOpacity>
        <VStack spacing="0" pt="1" pb="1">
          {workspaces.map((w) => (
            <NavItem
              key={w._id}
              to={`/w/${w._id}`}
              padding="0 1.5rem 0 2.5rem"
              leftIcon={
                <Icon boxSize="3">
                  <BsCircle />
                </Icon>
              }>
              {w.name}
            </NavItem>
          ))}
        </VStack>
      </Collapse>
    </>
  );
};

interface NavItemProps extends PropsOf<typeof Button> {
  to: string;
}

const NavItem: FC<NavItemProps> = ({ to, ...rest }) => {
  const match = useRouteMatch();
  const selected = match.url === to;
  return (
    <Button
      to={to}
      variant="unstyled"
      display="flex"
      w="100%"
      as={RouterLink}
      minW="15rem"
      justifyContent="flex-start"
      alignItems="center"
      transition="background-color ease-in 0.1s"
      fontSize="sm"
      borderBottomColor="gray.700"
      borderBottomWidth="thin"
      padding="0 1.5rem"
      rounded="none"
      h="2rem"
      _hover={{ bgColor: selected ? "gray.500" : "gray.700" }}
      bgColor={selected ? "gray.600" : "inherit"}
      {...rest}
    />
  );
};

const Profile: FC = () => {
  const user = useCurrentUser();
  const dispatch = useThunkDispatch();
  const history = useHistory();
  return (
    <HStack pr="8" pb="1">
      <ToggleColorMode />
      <Center>{user && <Avatar name={user.fullName} size="xs" />}</Center>;
      <Popover isLazy id="logout">
        <PopoverTrigger>
          <Button variant="link" colorScheme="teal" size="xs">
            Log out
          </Button>
        </PopoverTrigger>
        <PopoverContent color="InfoText">
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader fontWeight="600">
            Would you like to log out?
          </PopoverHeader>
          <PopoverBody>
            <Button
              w="100%"
              colorScheme="teal"
              variant="outline"
              onClick={() => {
                dispatch(logOutUser()).finally(() => {
                  history.push("/login");
                });
              }}>
              Log out
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </HStack>
  );
};

export const SidebarNav: FC = () => {
  const { isSidebarOpen } = useSelector((state) => state.workspaceDisplay);
  const dispatch = useThunkDispatch();
  const isAuthenticated = useSelector((state) => state.auth.token);
  const toggle = useCallback(() => dispatch(toggleSideBar()), [dispatch]);
  return (
    <Sidebar
      isOpen={isSidebarOpen}
      onOpen={toggle}
      onClose={toggle}
      backgroundColor="gray.800"
      color="gray.200">
      <Logo fontSize="2xl" textAlign="center" p="3" />
      <VStack spacing="0">
        {isAuthenticated ? (
          <>
            <Profile />
            <NavItem to="/home" leftIcon={<AiOutlineHome />}>
              Home
            </NavItem>
            <NavItem to="/w" leftIcon={<BsCardList />}>
              Your workspaces
            </NavItem>
            <WorkspacesLinks />
          </>
        ) : (
          <>
            <NavItem to="/login">Login</NavItem>
            <NavItem to="/signup">Sign up</NavItem>
          </>
        )}
      </VStack>
    </Sidebar>
  );
};

function ToggleColorMode() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      size="sm"
      aria-label="Toggle color mode"
      variant="ghost"
      icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      color="gray.400"
      onClick={toggleColorMode}>
      Toggle {colorMode === "light" ? "Dark" : "Light"}
    </IconButton>
  );
}
