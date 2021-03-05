import { PropsOf, Select } from "@chakra-ui/react";
import React, { FC } from "react";
import { useState } from "react";
import { useEntities, useEntity } from "../../hooks/useEntity";
import { useIsMounted } from "../../hooks/useIsMounted";
import { useThunkDispatch } from "../../hooks/useThunkDispatch";
import { Task } from "../../store/display/types";
import { patchTask } from "../../store/thunks";

interface IProps extends PropsOf<typeof Select> {
  task: Task;
}

export const ListSelect: FC<IProps> = ({ task, ...rest }) => {
  const [disabled, setDisabled] = useState(false);

  const dispatch = useThunkDispatch();
  const selectedList = useEntity("lists", task.list);
  const workspace = useEntity("workspaces", task.workspace);
  const workspaceLists = useEntities(
    "lists",
    workspace?.loaded && workspace.lists ? workspace.lists : []
  );
  const isMounted = useIsMounted();
  return (
    <>
      {selectedList && workspace && (
        <Select
          width="max-content"
          colorScheme="teal"
          defaultValue={selectedList._id}
          variant={disabled ? "outline" : "flushed"}
          disabled={disabled}
          onChange={(e) => {
            setDisabled(true);
            dispatch(
              patchTask({
                current: task,
                update: {
                  _id: task._id,
                  workspace: task.workspace,
                  list: e.target.value,
                },
              })
            ).finally(() => (isMounted.current ? setDisabled(false) : null));
          }}
          {...rest}>
          {workspaceLists.map(
            (list) =>
              list && (
                <option value={list._id} key={list._id}>
                  {list.name}
                </option>
              )
          )}
        </Select>
      )}
    </>
  );
};
