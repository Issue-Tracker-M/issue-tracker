import {
  Avatar,
  Box,
  ButtonProps,
  forwardRef,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useEntity } from "../hooks/useEntity";
import { useThunkDispatch } from "../hooks/useThunkDispatch";
import { patchTask } from "../store/thunks";
import { Task } from "../store/workspace/types";

const MemberPreview = ({ userId }: { userId: string }) => {
  const user = useEntity("users", userId);
  return user ? (
    <Box display="flex" alignContent="center" alignItems="center">
      <Avatar name={user.first_name + " " + user.last_name} size="sm" />
      <Text pl="1em">{`${user.first_name} ${user.last_name}`}</Text>
    </Box>
  ) : null;
};

/* 
Get all of the board user id's => options list
Get all of the task assigned user id's => default checked value
Submit on change
*/
interface IProps extends ButtonProps {
  taskId: Task["_id"];
}

export const MemberSelect = forwardRef<IProps, "button">(
  ({ taskId, ...rest }, ref) => {
    const dispatch = useThunkDispatch();

    const task = useEntity("tasks", taskId) as Task;
    const workspace = useEntity("workspaces", task?.workspace || "");
    const boardMembers = workspace?.loaded ? workspace.users : [];

    return (
      <Menu closeOnSelect={false} isLazy={true}>
        <MenuButton {...rest} ref={ref}>
          Add Member
        </MenuButton>
        <MenuList minWidth="240px">
          <MenuOptionGroup
            title="Workspace Members"
            type="checkbox"
            defaultValue={task?.loaded ? task.users : []}
            onChange={(value) => {
              dispatch(
                patchTask({
                  _id: taskId,
                  workspace: task?.workspace,
                  users: value as string[],
                })
              );
            }}>
            {boardMembers.map((userId) => (
              <MenuItemOption key={userId} value={userId}>
                <MemberPreview userId={userId} />
              </MenuItemOption>
            ))}
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    );
  }
);

export default MemberSelect;
