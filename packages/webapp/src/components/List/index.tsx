import {
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  Heading,
  Text,
} from "@chakra-ui/react";
import VerticalList from "@issue-tracker/components";
import React, { FC } from "react";
import { useEntity } from "../../hooks/useEntity";
import { useThunkDispatch } from "../../hooks/useThunkDispatch";
import TaskPreview from "../Board/TaskPreview";

export const List: FC<{ listId: string }> = ({ listId }) => {
  const list = useEntity("lists", listId);
  const dispatch = useThunkDispatch();
  if (!list) return <Heading>Couldn't find the given list entity!</Heading>;
  return (
    <VerticalList>
      <Box>
        <Editable
          defaultValue={list.name}
          h="10"
          padding=".375rem .5rem .125rem"
          onSubmit={(value) => {
            if (value !== list.name)
              dispatch({ type: "CHANGE LIST", payload: { name: value } });
          }}
          fontSize="sm"
          fontWeight="600">
          <EditablePreview as="p" display="block" />
          <EditableInput backgroundColor="white" />
        </Editable>
        {list.tasks.map((taskId) => (
          <TaskPreview taskId={taskId} stage={list.name} key={taskId} />
        ))}
      </Box>
    </VerticalList>
  );
};

export default React.memo(List);
