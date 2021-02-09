import React, { useEffect } from "react";
import { Box, Center, Spinner } from "@chakra-ui/react";
import List from "../List";
import { useEntity } from "../../hooks/useEntity";
import { useThunkDispatch } from "../../hooks/useThunkDispatch";
import { getCurrentWorkspace } from "../../store/workspace/workspaceSlice";

interface BoardContainerProps {
  text: string;
  currentWorkspaceId: string;
}

const BoardContainer = ({ text, currentWorkspaceId }: BoardContainerProps) => {
  const workspace = useEntity("workspaces", currentWorkspaceId);
  const dispatch = useThunkDispatch();
  useEffect(() => {
    let mounted = true;
    if (!workspace?.loaded) dispatch(getCurrentWorkspace(currentWorkspaceId));
    return () => {
      mounted = false;
    };
  }, [currentWorkspaceId, dispatch, workspace]);
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

export default React.memo(BoardContainer);
