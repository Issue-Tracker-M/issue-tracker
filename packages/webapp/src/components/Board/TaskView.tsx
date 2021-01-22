import {
  AddIcon,
  AtSignIcon,
  HamburgerIcon,
  InfoIcon,
  TimeIcon,
  WarningTwoIcon
} from '@chakra-ui/icons'
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  Skeleton,
  Text,
  Textarea
} from '@chakra-ui/react'
import React, { FC, useEffect } from 'react'
import { useThunkDispatch } from '../../hooks/useThunkDispatch'
import { fetchTask, patchTask } from '../../store/thunks'
import { Stage, Task, TaskStub } from '../../store/workspace/types'
import MemberSelect from '../MemberSelect'
import MemberPreview from './MemberPreview'
import TaskDatePicker from './DatePicker'
import TaskViewItem from './TaskViewItem'
import CommentInput from './CommentInput'
import CommentView from './CommentView'
// Load with the initial data
// Fetch the rest of the task data if it hasn't been loaded yet
// Show something to the user while it's happening
// Show full task view once it's loaded.

interface IProps {
  task: TaskStub | Task
  stage: Stage
  isOpen: boolean
  onClose: (...args: any) => any
}

const TaskView: FC<IProps> = ({ task, isOpen, onClose, stage }) => {
  const dispatch = useThunkDispatch()

  useEffect(() => {
    let mounted = true
    // If we are trying to render this and the task is not loaded => load it

    if (!task.loaded) dispatch(fetchTask(task._id))
    return () => {
      mounted = false
    }
  }, [dispatch, stage, task._id, task.loaded])
  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size="lg"
      onEsc={onClose}
      // finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
        >
          <WarningTwoIcon color="red.500" fontSize="md" />
          <Editable
            paddingLeft="1rem"
            defaultValue={task.title}
            onSubmit={(value) => {
              if (value !== task.title)
                dispatch(patchTask({ _id: task._id, title: value }))
            }}
          >
            <EditablePreview />
            <EditableInput />
          </Editable>
        </DrawerHeader>
        <DrawerBody>
          {task.loaded ? (
            <>
              <TaskViewItem
                title="Members"
                icon={<AtSignIcon color="gray.500" />}
              >
                <Box display="flex">
                  <MemberPreview members={task.users} />
                  <MemberSelect
                    taskId={task._id}
                    as={IconButton}
                    icon={<AddIcon />}
                    borderRadius="50%"
                    size="sm"
                  />
                </Box>
                {/* <MemberSelect
                    taskId={task._id}
                    as={Button}
                    colorScheme="teal"
                    size="sm"
                    variant="outline"
                  /> */}
              </TaskViewItem>
              <TaskViewItem
                title="Description"
                icon={<InfoIcon color="gray.500" />}
              >
                <Editable
                  defaultValue={task.description || ''}
                  placeholder="Add a more detailed description..."
                  onSubmit={(value) => {
                    if (value !== task.description)
                      dispatch(patchTask({ _id: task._id, description: value }))
                  }}
                >
                  <EditablePreview
                    as={Text}
                    backgroundColor="gray.100"
                    padding=".5rem"
                    minH="100px"
                    width="100%"
                    wordBreak="normal"
                    overflowWrap="anywhere"
                  />
                  <EditableInput
                    as={Textarea}
                    padding=".5rem"
                    minH="100px"
                    width="100%"
                    onChange={(e) => {
                      const { target } = e
                      target.style.height = '1px'
                      target.style.height = target.scrollHeight + 1 + 'px'
                    }}
                    border="none"
                    transition="all 0.2s ease, height 0s"
                    wordBreak="normal"
                    overflowWrap="anywhere"
                  />
                </Editable>
              </TaskViewItem>
              <TaskViewItem
                title={'Due Date'}
                icon={<TimeIcon color="gray.500" />}
              >
                <TaskDatePicker task_id={task._id} />
              </TaskViewItem>
              <TaskViewItem
                title="Comments"
                icon={<HamburgerIcon color="gray.500" />}
              >
                <CommentInput taskId={task._id} />
              </TaskViewItem>
              {task.comments.map((id) => (
                <CommentView
                  commentId={(id as unknown) as string}
                  taskId={task._id}
                />
              ))}
            </>
          ) : (
            <Skeleton />
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default TaskView
