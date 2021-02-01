import React, { FC } from "react";
import { AddNewitem } from "../addNewItem";
import { Box, Heading, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useThunkDispatch } from "../../hooks/useThunkDispatch";
import { createTask } from "../../store/workspace/workspaceSlice";
import { List, Task } from "../../store/workspace/types";
import TaskPreview from "./TaskPreview";
import { taskSelectors } from "../../store/entities/tasks";
import { listSelectors } from "../../store/entities/lists";

interface ColumnProps {
  listId: List["_id"];
  searchText: string;
}

export type TaskInput = Pick<Task, "workspace" | "title" | "list">;

const Column: FC<ColumnProps> = ({ searchText, listId }) => {
  const list = useSelector((state) => listSelectors.selectById(state, listId));
  if (!list) return null;
  const { currentWorkspaceId } = useSelector((state) => state.workspaceDisplay);
  if (!currentWorkspaceId)
    return <Heading color="red">Select a workspace</Heading>;

  // Filtering task id's by task content
  const filteredTasks = useSelector((state) =>
    list.tasks.filter((taskId) => {
      console.log(taskId);
      const t = taskSelectors.selectById(state, taskId);
      return JSON.stringify(t ? t : "").match(new RegExp(searchText, "gi"));
    })
  );

  const dispatch = useThunkDispatch();
  const createTaskFunction = (title: string) => {
    const taskPayload = {
      workspace: currentWorkspaceId,
      list: listId,
      title,
    };
    dispatch(createTask(taskPayload));
  };

  return (
    <Box
      padding={3}
      minWidth="32%"
      minHeight={4}
      display={{ md: "flex" }}
      flexDirection={{ md: "column" }}
      alignItems={{ md: "center" }}>
      <Text mb={2} fontWeight="bold" fontSize="sm" textTransform="capitalize">
        {list.name}
      </Text>
      {filteredTasks.map((taskId) => (
        <TaskPreview taskId={taskId} stage={list.name} key={taskId} />
      ))}
      {!searchText ? (
        <AddNewitem
          toggleButtonText="+ Add another task"
          onAdd={(title) => createTaskFunction(title)}
          dark
        />
      ) : null}
    </Box>
  );
};

export default Column;
