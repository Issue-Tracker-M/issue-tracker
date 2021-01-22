import {
  Avatar,
  Box,
  ButtonProps,
  ComponentWithAs,
  forwardRef,
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text
} from '@chakra-ui/react'
import React from 'react'
import { useSelector } from 'react-redux'
import { useThunkDispatch } from '../hooks/useThunkDispatch'
import { taskSelectors } from '../store/entities/tasks'
import { userSelectors } from '../store/entities/users'
import { workspaceSelectors } from '../store/entities/workspaces'
import { patchTask } from '../store/thunks'
import { UserStub } from '../store/user/types'
import { Task } from '../store/workspace/types'

const MemberPreview = ({ userId }: { userId: UserStub['_id'] }) => {
  const user = useSelector((state) => userSelectors.selectById(state, userId))
  return user ? (
    <Box display="flex" alignContent="center" alignItems="center">
      <Avatar name={user.first_name + ' ' + user.last_name} size="sm" />
      <Text pl="1em">{`${user.first_name} ${user.last_name}(${user.username})`}</Text>
    </Box>
  ) : null
}

/* 
Get all of the board user id's => options list
Get all of the task assigned user id's => default checked value
Submit on change
*/
interface IProps extends ButtonProps {
  taskId: Task['_id']
}

export const MemberSelect = forwardRef<IProps, 'button'>(
  ({ taskId, ...rest }, ref) => {
    const dispatch = useThunkDispatch()

    const boardMembers = useSelector((state) => {
      const { currentWorkspaceId } = state.workspaceDisplay
      if (!currentWorkspaceId) return []

      const currentWorkspace = workspaceSelectors.selectById(
        state,
        currentWorkspaceId
      )
      if (!currentWorkspace?.loaded) return []

      return currentWorkspace.users
    })

    const taskMembers = useSelector((state) => {
      const task = taskSelectors.selectById(state, taskId)
      if (!task?.loaded) return []
      return task.users
    })
    return (
      <Menu closeOnSelect={false} isLazy={true}>
        <MenuButton {...rest} ref={ref}>
          Add Member
        </MenuButton>
        <MenuList minWidth="240px">
          <MenuOptionGroup
            title="Workspace Members"
            // textTransform="uppercase"
            // fontWeight="500"
            // color="gray.500"
            type="checkbox"
            defaultValue={taskMembers}
            onChange={(value) => {
              dispatch(patchTask({ _id: taskId, users: value as string[] }))
            }}
          >
            {boardMembers.map((userId) => (
              <MenuItemOption key={userId} value={userId}>
                <MemberPreview userId={userId} />
              </MenuItemOption>
            ))}
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    )
  }
)

export default MemberSelect
