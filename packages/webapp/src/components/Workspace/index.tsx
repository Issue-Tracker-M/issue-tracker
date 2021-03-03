import {
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import React, { FC, useCallback } from "react";
import { useParams } from "react-router-dom";
import useAsyncThunk from "../../hooks/useAsyncAction";
import { useEntity } from "../../hooks/useEntity";
import PageNotFound from "../../pages/PageNotFound";
import { getCurrentWorkspace } from "../../store/display/displaySlice";
import MemberPreview from "../Board/MemberPreview";
import Loading from "../Layout/Loading";
import BoardView from "./BoardView";
import FilterInput from "./FilterInput";
import InviteMember from "./InviteMember";

const ListView = () => <div>LIST</div>;

const Workspace: FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const workspace = useEntity("workspaces", workspaceId);
  const runIfNotLoaded = useCallback(() => !workspace, [workspace]);
  const { loading, error } = useAsyncThunk(
    getCurrentWorkspace,
    workspaceId,
    runIfNotLoaded
  );
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;
  if (loading) return <Loading />;
  if (!workspace) return <PageNotFound />;
  return (
    <Flex h="100%" flexDir="column">
      <Wrap ml={["0", "3.5rem"]} pt="4" pb="1" spacing="2">
        <WrapItem>
          <Heading mr={["0", "1rem"]} fontSize="2xl">
            {workspace.name}
          </Heading>
        </WrapItem>
        <WrapItem>
          <FilterInput />
        </WrapItem>
        <WrapItem>
          <MemberPreview members={workspace.loaded ? workspace.users : []} />
        </WrapItem>
        <WrapItem>
          <InviteMember workspaceId={workspaceId} />
        </WrapItem>
      </Wrap>
      <Tabs flex="1 1 auto" display="flex" flexDir="column">
        <TabList flex="0 0 auto">
          <Tab>Board</Tab>
          <Tab>List</Tab>
          <Tab>Archive</Tab>
        </TabList>
        <TabPanels flex="1 1 auto">
          <TabPanel h="100%">
            <BoardView workspaceId={workspaceId} />
          </TabPanel>
          <TabPanel h="100%">
            <ListView />
          </TabPanel>
          <TabPanel h="100%">
            {/* <BoardView workspaceId={workspaceId} /> */}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default Workspace;
