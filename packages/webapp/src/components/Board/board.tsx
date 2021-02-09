import React, { FC, useState } from "react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Flex,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import BoardContainer from "./boardContainer";
import { useParams } from "react-router-dom";
import { useEntity } from "../../hooks/useEntity";

const Board: FC = () => {
  const [text, setText] = useState("");
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const workspace = useEntity("workspaces", workspaceId);
  return (
    <Box
      paddingTop={5}
      display="flex"
      flexDirection="column"
      h={{ md: "100vh" }}>
      <Box
        paddingLeft={5}
        display="flex"
        alignItems="center"
        justifyContent="space-between">
        <Flex>
          <AiOutlineUsergroupAdd />
          <span style={{ paddingLeft: "10px" }}>{workspace?.name}</span>
        </Flex>
        <InputGroup w="20rem" mr={2} size="sm">
          <InputLeftElement children={<Search2Icon />} />
          <Input
            rounded={2}
            placeholder="search"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setText(e.target.value)
            }
          />
        </InputGroup>
        <Box
          backgroundColor="#5678"
          mr={8}
          border="1px solid #E0E0E2"
          p={1.5}
          borderRadius="50%">
          UA
        </Box>
      </Box>
      <Tabs defaultIndex={0} height="100%">
        <TabList borderBottom="1px solid #E0E0E2">
          <Tab ml={8} fontSize={12}>
            Board
          </Tab>
          <Tab fontSize={12} data-testid="trello_view">
            List
          </Tab>
          <Tab fontSize={12}>Activity</Tab>
          <Tab fontSize={12}>Archived Tasks</Tab>
        </TabList>

        <TabPanels p={5} height="100%">
          <TabPanel height="100%">
            {workspaceId ? (
              <BoardContainer text={text} currentWorkspaceId={workspaceId} />
            ) : (
              <Skeleton />
            )}
          </TabPanel>
          <TabPanel>
            <p>Activity History...</p>
          </TabPanel>
          <TabPanel>
            <p>Archived Tasks!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Board;
