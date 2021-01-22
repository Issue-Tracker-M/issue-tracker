import { CloseIcon } from '@chakra-ui/icons'
import {
  Badge,
  Button,
  Checkbox,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Tooltip
} from '@chakra-ui/react'
import React, { FC } from 'react'
import DatePicker from 'react-datepicker'
import { useSelector } from 'react-redux'
import { useThunkDispatch } from '../../hooks/useThunkDispatch'
import { taskSelectors } from '../../store/entities/tasks'
import { patchTask } from '../../store/thunks'
import { Task } from '../../store/workspace/types'

interface IProps {
  task_id: Task['_id']
}

const CustomDateInput: FC<any> = React.forwardRef(
  ({ due_date, onComplete, complete, ...rest }, ref) => {
    return (
      <InputGroup>
        <InputLeftAddon>
          <Tooltip label="Mark task Done" shouldWrapChildren>
            <Checkbox
              size="lg"
              defaultIsChecked={complete}
              onChange={onComplete}
            />
          </Tooltip>
        </InputLeftAddon>
        <Input {...rest} ref={ref} />
        {complete ? (
          <InputRightAddon>
            <Badge variant="solid" colorScheme="green">
              Done
            </Badge>
          </InputRightAddon>
        ) : new Date() > new Date(due_date) ? (
          <InputRightAddon>
            <Badge variant="solid" colorScheme="yellow">
              Overdue
            </Badge>
          </InputRightAddon>
        ) : null}
      </InputGroup>
    )
  }
)

const TaskDatePicker: FC<IProps> = ({ task_id }) => {
  const task = useSelector((state) => taskSelectors.selectById(state, task_id))
  const dispatch = useThunkDispatch()

  if (!task?.loaded) return <Heading>Something went wrong!</Heading>

  return task.due_date ? (
    <>
      <DatePicker
        onChange={(date: Date) => {
          dispatch(patchTask({ _id: task._id, due_date: date }))
        }}
        selected={new Date(task.due_date)}
        showTimeSelect
        customInput={
          <CustomDateInput
            due_date={task.due_date}
            onComplete={(e: any) => {
              dispatch(patchTask({ _id: task._id, complete: e.target.checked }))
            }}
            complete={task.complete}
          />
        }
        dateFormat="MMMM d, yyyy h:mm aa"
      />

      <IconButton
        aria-label="Remove due date"
        onClick={(e) => {
          dispatch(
            patchTask({ _id: task._id, due_date: null, complete: false })
          )
        }}
        icon={<CloseIcon color="gray.500" />}
        // borderRadius="50%"
        size="sm"
        variant="ghost"
      />
    </>
  ) : (
    <Button
      onClick={(e) => {
        dispatch(patchTask({ _id: task._id, due_date: new Date() }))
      }}
    >
      Add due date
    </Button>
  )
}
export default TaskDatePicker
