import React, { useCallback } from "react";
import { Box, Center, Spinner } from "@chakra-ui/react";
import List from "../List";
import { useEntity } from "../../hooks/useEntity";
import { getCurrentWorkspace } from "../../store/display/displaySlice";
import useAsyncThunk from "../../hooks/useAsyncAction";
import Loading from "../Layout/Loading";

interface BoardContainerProps {
  workspaceId: string;
}

const BoardView = ({ workspaceId }: BoardContainerProps) => {
  const workspace = useEntity("workspaces", workspaceId);
  const condition = useCallback(() => !workspace?.loaded, [workspace]);
  const { loading, error } = useAsyncThunk(
    getCurrentWorkspace,
    workspaceId,
    condition
  );
  if (loading) return <Loading />;
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;
  return (
    <Box
      height="100%"
      display={{ md: "flex" }}
      flexDirection={{ md: "row" }}
      alignItems={{ md: "flex-start" }}
      overflow={{ md: "auto" }}>
      {workspace?.loaded ? (
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
