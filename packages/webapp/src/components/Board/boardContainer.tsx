import React from 'react'
import { Alert, AlertTitle, Box } from '@chakra-ui/react'
import Column from './column'
import { Stage } from '../../store/workspace/types'
import { useSelector } from 'react-redux'
import { workspaceSelectors } from '../../store/entities/workspaces'

interface BoardContainerProps {
  text: string
  currentWorkspaceId: string
}

const BoardContainer = ({ text, currentWorkspaceId }: BoardContainerProps) => {
  const workspace = useSelector((state) => {
    return workspaceSelectors.selectById(state, currentWorkspaceId)
  })
  return (
    <Box
      height={{ md: '83vh' }}
      display={{ md: 'flex' }}
      flexDirection={{ md: 'row' }}
      alignItems={{ md: 'flex-start' }}
      justifyContent={{ md: 'space-between' }}
      overflow={{ md: 'auto' }}
      minWidth="100%"
      backgroundColor="#f6f8f9"
    >
      {workspace?.loaded ? (
        Object.values(Stage).map((key: Stage) => (
          <Column
            searchText={text}
            stage={key}
            key={key.toString()}
            list={workspace[key]}
          />
        ))
      ) : (
        <Alert>
          <AlertTitle>Something went wrong!</AlertTitle>
        </Alert>
      )}
    </Box>
  )
}

export default React.memo(BoardContainer)
