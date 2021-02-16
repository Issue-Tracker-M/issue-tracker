import { Search2Icon } from "@chakra-ui/icons";
import {
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React, { FC } from "react";
import { useParams } from "react-router-dom";
import { useEntity } from "../../hooks/useEntity";
import PageNotFound from "../../pages/PageNotFound";
import BoardView from "./BoardView";

const ListView = () => <div>LIST</div>;

const Workspace: FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const workspace = useEntity("workspaces", workspaceId);
  if (!workspace) return <PageNotFound />;
  return (
    <Flex h="100%" flexDir="column">
      <Flex flex="0 0 auto">
        <Heading>{workspace.name}</Heading>
        <InputGroup w="20rem" mr={2} size="sm">
          <InputLeftElement children={<Search2Icon />} />
          <Input
            rounded={2}
            placeholder="search"
            onChange={(e) => console.log(e.target.value)}
          />
        </InputGroup>
      </Flex>
      <Tabs flex="1 1 auto">
        <TabList>
          <Tab>Board</Tab>
          <Tab>List</Tab>
          <Tab>Archive</Tab>
        </TabList>
        <TabPanels h="100%">
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
