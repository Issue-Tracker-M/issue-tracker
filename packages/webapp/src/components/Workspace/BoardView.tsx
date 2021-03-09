import React, { FC, useCallback } from "react";
import { Box, Center, HStack, Spinner } from "@chakra-ui/react";
import List from "../List";
import { useEntity } from "../../hooks/useEntity";
import { getCurrentWorkspace } from "../../store/display/displaySlice";
import useAsyncThunk from "../../hooks/useAsyncAction";
import Loading from "../Layout/Loading";

interface BoardContainerProps {
  workspaceId: string;
}

const BoardView: FC<BoardContainerProps> = ({ workspaceId }) => {
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
      maxHeight="100%"
      overflowX="auto"
      overflowY="hidden"
      p="2"
      position="absolute"
      whiteSpace="nowrap"
      top="0"
      right="0"
      bottom="0"
      left="0">
      {workspace?.loaded ? (
        workspace.lists.map((listId) => <List key={listId} listId={listId} />)
      ) : (
        <Loading />
      )}
    </Box>
  );
};

export default BoardView;
