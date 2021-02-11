import React from "react";
import { Box, Center, Spinner } from "@chakra-ui/react";
import List from "../List";
import { useEntity } from "../../hooks/useEntity";
import { getCurrentWorkspace } from "../../store/workspace/workspaceSlice";
import useAsyncThunk from "../../hooks/useAsyncAction";
import { Workspace } from "../../store/workspace/types";

interface BoardContainerProps {
  workspaceId: string;
}

function isLoaded(entity: any): entity is Workspace {
  return !!entity.loaded;
}

const BoardView = ({ workspaceId }: BoardContainerProps) => {
  const workspace = useEntity("workspaces", workspaceId);
  isLoaded(workspace);
  const { loading, error } = useAsyncThunk(
    getCurrentWorkspace,
    workspaceId,
    () => isLoaded(workspace)
  );

  return (
    <Box
      height="100%"
      display={{ md: "flex" }}
      flexDirection={{ md: "row" }}
      alignItems={{ md: "flex-start" }}
      overflow={{ md: "auto" }}>
      {isLoaded(workspace) ? (
        workspace.lists.map((listId) => <List key={listId} listId={listId} />)
      ) : (
        <Center w="100%" h="100%">
          <Spinner size="xl" colorScheme="teal" thickness="3" />
        </Center>
      )}
    </Box>
  );
};

export default React.memo(BoardView);
