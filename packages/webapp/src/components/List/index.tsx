import { Heading } from "@chakra-ui/react";
import VerticalList from "./VerticalList";
import React, { FC } from "react";
import { useCallback } from "react";
import { useEntity } from "../../hooks/useEntity";
import { useThunkDispatch } from "../../hooks/useThunkDispatch";
import TaskPreview from "../Board/TaskPreview";
import ListHeader from "./ListHeader";
import { useSelector } from "react-redux";
import { Task } from "../../store/workspace/types";

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
  const filterText = useSelector((state) => state.workspaceDisplay.filterText);
  const filteredTasks = useSelector((state) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!filterText) return list!.tasks;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return list!.tasks.filter((id) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const task = state.tasks.entities[id] as Task;
      return (
        task.title.includes(filterText) ||
        task.description?.includes(filterText)
      );
    });
  });
  if (!list) return <Heading>Couldn't find the given list entity!</Heading>;

  return (
    <VerticalList>
      <ListHeader listName={list.name} onNameSubmit={submitListName} />
      {filteredTasks.map((taskId) => (
        <TaskPreview taskId={taskId} stage={list.name} key={taskId} />
      ))}
    </VerticalList>
  );
};

export default React.memo(List);
