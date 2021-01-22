import { Button, chakra, Textarea } from '@chakra-ui/react'
import React, { FC, useState } from 'react'
import { useThunkDispatch } from '../../hooks/useThunkDispatch'
import { addComment } from '../../store/thunks'
import { Task } from '../../store/workspace/types'

interface IProps<T = any> {
  taskId: Task['_id']
  initialContent?: string
  onSubmit: T
}

const CommentInput: FC<IProps> = ({
  taskId,
  initialContent = '',
  onSubmit
}) => {
  const [content, setContent] = useState(initialContent)
  const dispatch = useThunkDispatch()
  return (
    <chakra.form onSubmit={onSubmit}>
      <Textarea
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => {
          const { target } = e
          target.style.height = '1px'
          target.style.height = target.scrollHeight + 1 + 'px'
          setContent(target.value)
        }}
        transition="all 0.2s ease, height 0s"
        wordBreak="normal"
        overflowWrap="anywhere"
        resize="none"
      />
      <Button
        type="submit"
        colorScheme="teal"
        size="sm"
        mt=".25rem"
        onClick={() => {
          const r = content.match(/^s+$/)
          if (r && r[0] === content) return setContent('')
          dispatch(addComment({ taskId, content })).then(() => setContent(''))
        }}
      >
        Save
      </Button>
    </chakra.form>
  )
}

export default CommentInput
