import { Box, Text, useDisclosure } from '@chakra-ui/react'
import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { taskSelectors } from '../../store/entities/tasks'
import { Stage, Task } from '../../store/workspace/types'
import TaskView from './TaskView'

interface TaskPreviewProps {
  taskId: Task['_id']
  stage: Stage
}

const TaskPreview: FC<TaskPreviewProps> = ({ taskId, stage }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const task = useSelector((state) => taskSelectors.selectById(state, taskId))
  if (!task) throw new Error('Task not found in the entities')
  return (
    <Box
      padding={2}
      cursor="pointer"
      mb={5}
      borderRadius={5}
      backgroundColor="#fff"
      minWidth="100%"
      boxShadow="#091e4240 0px 1px 0px 0px"
      onClick={onOpen}
    >
      <Text mb={2} fontSize="sm">
        {task.title}
      </Text>
      {isOpen && (
        <TaskView task={task} isOpen={isOpen} onClose={onClose} stage={stage} />
      )}
    </Box>
  )
}

export default TaskPreview
