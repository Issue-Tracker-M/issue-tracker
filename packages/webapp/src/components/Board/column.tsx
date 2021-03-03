import React, { FC } from "react";
import { AddNewitem } from "../addNewItem";
import { Heading, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useThunkDispatch } from "../../hooks/useThunkDispatch";
import { createTask } from "../../store/display/displaySlice";
import { List, Task } from "../../store/display/types";
import TaskPreview from "./TaskPreview";
import { taskSelectors } from "../../store/entities/tasks";
import VerticalList from "@issue-tracker/components";
import { useEntity } from "../../hooks/useEntity";
import { useParams } from "react-router-dom";

interface ColumnProps {
  listId: List["_id"];
  searchText: string;
}

export type TaskInput = Pick<Task, "workspace" | "title" | "list">;

const Column: FC<ColumnProps> = ({ searchText, listId }) => {
  const dispatch = useThunkDispatch();
  const list = useEntity("lists", listId);
  const { workspaceId } = useParams<{ workspaceId: string }>();

  // Filtering task id's by task content
  const filteredTasks = useSelector((state) =>
    list!.tasks.filter((taskId) => {
      console.log(taskId);
      const t = taskSelectors.selectById(state, taskId);
      return JSON.stringify(t ? t : "").match(new RegExp(searchText, "gi"));
    })
  );

  if (!list) return null;
  if (!workspaceId) return <Heading color="red">Select a workspace</Heading>;
  const createTaskFunction = (title: string) => {
    const taskPayload = {
      workspace: workspaceId,
      list: listId,
      title,
    };
    dispatch(createTask(taskPayload));
  };

  return (
    <VerticalList>
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
    </VerticalList>
  );
};

export default Column;
