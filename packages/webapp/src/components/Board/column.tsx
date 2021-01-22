import React, { FC } from 'react'
import { AddNewitem } from '../addNewItem'
import { Box, Text } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { useThunkDispatch } from '../../hooks/useThunkDispatch'
import { createTask } from '../../store/workspace/workspaceSlice'
import { Stage, Task } from '../../store/workspace/types'
import TaskPreview from './TaskPreview'
import { taskSelectors } from '../../store/entities/tasks'

interface ColumnProps {
  stage: Stage
  searchText: string
  list: Task['_id'][]
}

export interface TaskInput extends Pick<Task, 'workspace' | 'title'> {
  stage: Stage
}

const Column: FC<ColumnProps> = ({ stage, searchText, list }) => {
  const text = stage.replace('_', ' ')
  // Filtering task id's by task content
  const filteredTasks = useSelector((state) =>
    list.filter((taskId) =>
      JSON.stringify(taskSelectors.selectById(state, taskId)).match(
        new RegExp(searchText, 'gi')
      )
    )
  )
  const { currentWorkspaceId } = useSelector((state) => state.workspaceDisplay)

  const dispatch = useThunkDispatch()
  const createTaskFunction = (title: string) => {
    let taskPayload = {
      workspace: currentWorkspaceId!,
      stage,
      title
    }
    dispatch(createTask(taskPayload))
  }

  return (
    <Box
      padding={3}
      minWidth="32%"
      minHeight={4}
      display={{ md: 'flex' }}
      flexDirection={{ md: 'column' }}
      alignItems={{ md: 'center' }}
    >
      <Text mb={2} fontWeight="bold" fontSize="sm">
        {text}
      </Text>
      {filteredTasks.map((taskId) => (
        <TaskPreview taskId={taskId} stage={stage} key={taskId} />
      ))}
      {!searchText ? (
        <AddNewitem
          toggleButtonText="+ Add another task"
          onAdd={(title) => createTaskFunction(title)}
          dark
        />
      ) : null}
    </Box>
  )
}

export default Column
