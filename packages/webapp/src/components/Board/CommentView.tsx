import {
  Avatar,
  Box,
  Button,
  Heading,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Text,
  Textarea
} from '@chakra-ui/react'
import React, { FC, useState } from 'react'
import { useSelector } from 'react-redux'
import { useThunkDispatch } from '../../hooks/useThunkDispatch'
import { commentSelectors } from '../../store/entities/comments'
import { userSelectors } from '../../store/entities/users'
import { deleteComment } from '../../store/thunks'
import { User, UserStub } from '../../store/user/types'
import { Comment, Task } from '../../store/workspace/types'
import CommentInput from './CommentInput'

interface IProps {
  commentId: Comment['_id']
  taskId: Task['_id']
}

const CommentView: FC<IProps> = ({ commentId, taskId }) => {
  const dispatch = useThunkDispatch()

  const [commentData, authorData] = useSelector((state) => {
    const c = commentSelectors.selectById(state, commentId)
    if (!c) return [undefined, undefined]
    const a = userSelectors.selectById(state, c.author)
    return [c, a] as [Comment, User | UserStub | undefined]
  })

  const [isEditing, setIsEditing] = useState(false)
  if (!commentData || !authorData)
    return (
      <Heading>
        You shouldn't be seeing this, please contact your coding professional.
      </Heading>
    )

  return (
    <Box as="article" display="flex" alignItems="flex-start">
      <Avatar
        size="xs"
        name={authorData.first_name + ' ' + authorData.last_name}
        title={authorData.first_name + ' ' + authorData.last_name}
      />
      <Box pl=".5rem">
        <Text
          textTransform="capitalize"
          fontWeight="600"
          fontSize="sm"
          display="inline-block"
        >
          {authorData.first_name + ' ' + authorData.last_name}
        </Text>
        <Text
          display="inline-block"
          as="span"
          fontSize="xs"
          fontWeight="600"
          color="gray.600"
          pl=".5rem"
        >
          {new Date((commentData as any).createdAt).toLocaleString()}
        </Text>
        {isEditing ? (
          <>
            <CommentInput
              taskId={taskId}
              initialContent={commentData.content}
            />
          </>
        ) : (
          <>
            <Text
              backgroundColor="gray.100"
              borderRadius=".5rem"
              width="max-content"
              padding=".5rem"
            >
              {commentData.content}
            </Text>
            <Button
              variant="link"
              size="xs"
              color="gray.500"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Popover>
              <PopoverTrigger>
                <Button ml=".5rem" variant="link" size="xs" color="gray.500">
                  Delete
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Delete comment?</PopoverHeader>
                <PopoverBody>
                  Are you sure you want to delete this comment?
                </PopoverBody>
                <PopoverFooter>
                  <Button
                    colorScheme="red"
                    width="100%"
                    onClick={() =>
                      dispatch(deleteComment({ taskId, commentId }))
                    }
                  >
                    Delete
                  </Button>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
          </>
        )}
      </Box>
    </Box>
  )
}

export default CommentView
