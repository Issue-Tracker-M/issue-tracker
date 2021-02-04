import { Heading } from "@chakra-ui/react";
import VerticalList from "@issue-tracker/components";
import React, { FC } from "react";
import { useCallback } from "react";
import { useEntity } from "../../hooks/useEntity";
import { useThunkDispatch } from "../../hooks/useThunkDispatch";
import TaskPreview from "../Board/TaskPreview";
import ListHeader from "./ListHeader";

export const List: FC<{ listId: string }> = ({ listId }) => {
  const list = useEntity("lists", listId);
  const dispatch = useThunkDispatch();
  const submitListName = useCallback(
    (value) => {
      if (value === list?.name) return;
      dispatch({ type: "CHANGE_LIST" });
    },
    [dispatch, list?.name]
  );
  if (!list) return <Heading>Couldn't find the given list entity!</Heading>;
  return (
    <VerticalList>
      <ListHeader listName={list.name} onNameSubmit={submitListName} />
      {list.tasks.map((taskId) => (
        <TaskPreview taskId={taskId} stage={list.name} key={taskId} />
      ))}
    </VerticalList>
  );
};

export default React.memo(List);
