import React from "react";
import { Alert, AlertTitle, Box } from "@chakra-ui/react";
import Column from "./column";
import { useSelector } from "react-redux";
import { workspaceSelectors } from "../../store/entities/workspaces";
import List from "../List";

interface BoardContainerProps {
  text: string;
  currentWorkspaceId: string;
}

const BoardContainer = ({ text, currentWorkspaceId }: BoardContainerProps) => {
  const workspace = useSelector((state) => {
    return workspaceSelectors.selectById(state, currentWorkspaceId);
  });
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
        <Alert>
          <AlertTitle>Something went wrong!</AlertTitle>
        </Alert>
      )}
    </Box>
  );
};

export default React.memo(BoardContainer);
